"""
Mix + Master AI service for the CrazyJam Bridge.

Two modes:
  - analyze: read the current mix (stems or the stereo master) and return a
    human-readable move list (EQ / compression / level / stereo / limiter) the
    producer can apply in FL Studio.
  - render: run an automated mix/master chain in the bridge and return a
    mastered stereo file.

Uses the existing CrazyJam cloud models for the analysis brain (Bedrock) and
local DSP for the render path.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger("crazyjam.bridge.mixmaster")


def analyze_mix(audio_path: str, genre: str = "Afrobeats", goal: str = "modern streaming master") -> dict[str, Any]:
    """Analyze a mix and return concrete move suggestions. Uses the Bedrock
    model to reason about the spectral/dynamic profile we compute locally."""
    import librosa
    import numpy as np

    y, sr = librosa.load(audio_path, sr=None, mono=False)
    if y.ndim > 1:
        y_mono = np.mean(y, axis=0)
    else:
        y_mono = y

    # local measurements
    rms = float(np.sqrt(np.mean(y_mono ** 2)))
    peak = float(np.max(np.abs(y_mono)))
    crest = peak / (rms + 1e-9)
    centroid = float(np.mean(librosa.feature.spectral_centroid(y=y_mono, sr=sr)))
    rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=y_mono, sr=sr)))
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y_mono)))
    tempo = float(round(librosa.beat.beat_track(y=y_mono, sr=sr)[0]))

    profile = {
        "rms_dbfs": round(20 * np.log10(rms + 1e-9), 1),
        "peak_dbfs": round(20 * np.log10(peak + 1e-9), 1),
        "crest_db": round(20 * np.log10(crest + 1e-9), 1),
        "spectral_centroid_hz": round(centroid),
        "spectral_rolloff_hz": round(rolloff),
        "zero_crossing_rate": round(zcr, 4),
        "tempo_bpm": tempo,
    }

    import bedrock_client
    system = (
        "You are CrazyJam's mix/master engineer. Given a measured audio profile and "
        "a genre + goal, return a SHORT, concrete, ordered move list for FL Studio: "
        "per-band EQ moves (freq, gain, Q), compression settings (ratio, attack, release, "
        "threshold), level balance moves, stereo/width moves, and a limiter ceiling. "
        "Be specific with numbers. Output plain text, one move per line, no preamble."
    )
    user = (
        f"Measured profile: {profile}\nGenre: {genre}\nGoal: {goal}\n"
        "Return the move list."
    )
    try:
        text = bedrock_client.generate_text(system, user, max_tokens=800)
    except Exception as e:
        logger.warning("mix analyze model call failed: %s", e)
        text = f"(model unavailable) Profile: {profile}"

    return {"success": True, "profile": profile, "suggestions": text}


def mix_moves_from_analysis(profile: dict[str, Any], genre: str = "Afrobeats") -> list[dict[str, Any]]:
    """Turn a measured mix profile into a structured mixer move list the FL
    controller applies. Heuristic + genre-aware; no model call needed."""
    moves: list[dict[str, Any]] = []
    crest = profile.get("crest_db", 12)
    centroid = profile.get("spectral_centroid_hz", 2000)
    rms = profile.get("rms_dbfs", -18)

    # level balance: if the mix is hot, pull master back; if quiet, push it
    master_vol = 0.92 if rms < -18 else (0.85 if rms > -12 else 0.88)
    moves.append({"track": 0, "action": "volume", "value": master_vol})

    # low-end: control mud based on genre (Afrobeats/Amapiano want tighter lows)
    low_gain = -2 if genre.lower() in ("afrobeats", "amapiano", "house") else -1
    moves.append({"track": 1, "action": "eq_low_freq", "value": 120})
    moves.append({"track": 1, "action": "eq_low_gain", "value": low_gain})

    # presence: lift the top if the mix is dark
    high_gain = 2 if centroid < 1800 else (1 if centroid < 2500 else 0)
    moves.append({"track": 1, "action": "eq_high_gain", "value": high_gain})

    # dynamics: if crest is high (very dynamic), suggest a touch of glue
    if crest > 15:
        moves.append({"track": 0, "action": "eq_mid_gain", "value": -0.5})
    # stereo width for melodic content
    moves.append({"track": 2, "action": "stereo_sep", "value": 0.2})
    moves.append({"track": 3, "action": "stereo_sep", "value": 0.2})

    # master EQ polish: low-shelf control + air lift
    moves.append({"track": 0, "action": "eq_low_freq", "value": 100})
    moves.append({"track": 0, "action": "eq_low_gain", "value": -1})
    moves.append({"track": 0, "action": "eq_high_freq", "value": 10000})
    moves.append({"track": 0, "action": "eq_high_gain", "value": 1})

    return moves


def render_master(audio_path: str, genre: str = "Afrobeats", target_lufs: float = -14.0) -> dict[str, Any]:
    """Automated master chain: high-pass, gentle bus compression, soft-clip
    limiter, and loudness normalization to target LUFS. Returns the mastered file."""
    import librosa
    import numpy as np
    import soundfile as sf

    y, sr = librosa.load(audio_path, sr=None, mono=False)
    if y.ndim == 1:
        y = np.stack([y, y])

    # 1. high-pass 30Hz to clear sub rumble
    from scipy.signal import butter, sosfilt
    sos = butter(2, 30, btype="highpass", fs=sr, output="sos")
    y_hp = sosfilt(sos, y, axis=1)

    # 2. gentle bus compression (soft-knee, 2:1 above threshold)
    def compress(x, thresh_db=-18.0, ratio=2.0, attack=0.005, release=0.05):
        thresh = 10 ** (thresh_db / 20)
        out = np.copy(x)
        for ch in range(x.shape[0]):
            env = np.convolve(np.abs(x[ch]), np.ones(int(sr * attack)) / int(sr * attack), mode="same")
            over = env > thresh
            gain = np.ones_like(env)
            gain[over] = (thresh + (env[over] - thresh) / ratio) / (env[over] + 1e-9)
            # smooth gain
            gain = np.convolve(gain, np.ones(int(sr * release)) / int(sr * release), mode="same")
            out[ch] = x[ch] * gain
        return out

    y_comp = compress(y_hp)

    # 3. loudness normalization (approximate LUFS via RMS)
    rms = np.sqrt(np.mean(y_comp ** 2))
    # rough LUFS estimate: RMS dBFS - 0.691 (K-weighting approximation)
    lufs = 20 * np.log10(rms + 1e-9) - 0.691
    gain_db = target_lufs - lufs
    y_norm = y_comp * (10 ** (gain_db / 20))

    # 4. soft-clip limiter to catch peaks
    def soft_clip(x, ceiling=0.98):
        return np.tanh(x / ceiling) * ceiling

    y_out = soft_clip(y_norm)

    out_path = audio_path.replace(".wav", "_master.wav").replace(".mp3", "_master.wav")
    sf.write(out_path, y_out.T, sr)
    return {
        "success": True,
        "output_path": out_path,
        "summary": f"Mastered to ~{target_lufs} LUFS (genre: {genre})",
    }
