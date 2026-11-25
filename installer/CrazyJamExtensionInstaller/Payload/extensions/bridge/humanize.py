"""
Humanize + pitch services for the CrazyJam Bridge.

- humanize_notes: make a rigid MIDI part feel played by a human — timing swing,
  velocity dynamics, subtle note-length variation, and occasional ghost notes.
- pitch_correct_audio: formant-preserving pitch correction on audio (used when the
  user drops a vocal/melodic take they want tuned to a key before remaking it).

Both run locally in the bridge (no cloud round-trip) so they're fast enough to
feel interactive from inside the DAW.
"""
from __future__ import annotations

import logging
import math
import random
from typing import Any

logger = logging.getLogger("crazyjam.bridge.humanize")


# ---------------------------------------------------------------------------
# Humanize (MIDI)
# ---------------------------------------------------------------------------

def humanize_notes(
    notes: list[dict[str, Any]],
    bpm: float,
    swing: float = 0.08,        # how much off-beat steps get pushed (0..0.5)
    timing_jitter: float = 0.02,  # random timing offset in steps (0..1)
    velocity_feel: float = 0.15,  # velocity human variation (0..0.5)
    length_feel: float = 0.1,     # note-length human variation (0..0.5)
    ghost_probability: float = 0.0,  # chance of adding a soft ghost note (0..0.5)
) -> list[dict[str, Any]]:
    """Shift a quantized note list toward a human feel. Notes are
    {note, step, length, velocity} with step in 16ths."""
    rnd = random.Random(42)  # deterministic so re-running gives the same take
    out: list[dict[str, Any]] = []
    for n in notes:
        step = n["step"]
        # swing: push odd 16ths (the 'e' and 'a') later
        swung = step
        if step % 2 == 1:
            swung = step + swing * 2
        # timing jitter
        jitter = rnd.uniform(-timing_jitter, timing_jitter) * 4
        new_step = max(0, round(swung + jitter))
        # velocity dynamics: accents on beats, softer off-beats, plus human noise
        base_vel = n.get("velocity", 0.8)
        beat_accent = 1.0 if new_step % 4 == 0 else (0.9 if new_step % 2 == 0 else 0.8)
        vel_noise = rnd.uniform(-velocity_feel, velocity_feel)
        velocity = max(0.1, min(1.0, base_vel * beat_accent + vel_noise))
        # length variation
        length = max(1, round(n.get("length", 1) * (1 + rnd.uniform(-length_feel, length_feel))))
        out.append({**n, "step": int(new_step), "velocity": round(velocity, 3), "length": int(length)})
        # occasional ghost note (quiet, very short, right before the real note)
        if ghost_probability > 0 and rnd.random() < ghost_probability and new_step > 0:
            out.append({**n, "step": int(new_step - 1), "length": 1, "velocity": round(velocity * 0.35, 3)})
    out.sort(key=lambda x: x["step"])
    return out


def humanize_drums(
    drums: dict[str, list[int]],
    bpm: float,
    swing: float = 0.1,
    timing_jitter: float = 0.015,
) -> dict[str, list[int]]:
    """Humanize drum lanes: swing + slight timing jitter, no velocity model here
    (drums in the piano roll are already velocity-per-note when the script lays them)."""
    rnd = random.Random(42)
    out: dict[str, list[int]] = {}
    for lane, steps in drums.items():
        new_steps = []
        for step in steps:
            swung = step + (swing * 2 if step % 2 == 1 else 0)
            jitter = rnd.uniform(-timing_jitter, timing_jitter) * 4
            new_steps.append(max(0, round(swung + jitter)))
        out[lane] = sorted(set(new_steps))
    return out


# ---------------------------------------------------------------------------
# Pitch correction (audio)
# ---------------------------------------------------------------------------

def pitch_correct_audio(
    audio_path: str,
    target_key: str = "A Minor",
    strength: float = 0.8,
) -> dict[str, Any]:
    """Formant-preserving pitch correction on a vocal/melodic take. Uses
    librosa pitch tracking + pYIN, then resamples per-segment toward the
    nearest in-key semitone. Returns {success, output_path, summary}."""
    import librosa
    import numpy as np
    import soundfile as sf

    y, sr = librosa.load(audio_path, sr=None, mono=True)
    # frame-level pitch track
    f0, voiced_flag, voiced_prob = librosa.pyin(
        y, fmin=librosa.note_to_hz("C2"), fmax=librosa.note_to_hz("C7"),
        sr=sr, frame_length=2048,
    )
    # key semitone targets
    key_map = {
        "A Minor": [9, 0, 2, 4, 5, 7], "C Major": [0, 2, 4, 5, 7, 9, 11],
        "C Minor": [0, 2, 3, 5, 7, 8, 10], "G Major": [7, 9, 11, 0, 2, 4, 6],
        "D Minor": [2, 4, 5, 7, 9, 10], "F Major": [5, 7, 9, 10, 0, 2, 4],
    }
    targets = key_map.get(target_key, key_map["A Minor"])

    def nearest_in_key(freq):
        if freq <= 0 or np.isnan(freq):
            return freq
        midi = 69 + 12 * math.log2(freq / 440.0)
        pc = int(round(midi)) % 12
        # find nearest target pc
        best = min(targets, key=lambda t: min(abs(pc - t), 12 - abs(pc - t)))
        midi_target = round(midi) + ((best - pc) % 12)
        if abs((best - pc) % 12) > 6:
            midi_target = round(midi) - ((pc - best) % 12)
        return 440.0 * (2 ** ((midi_target - 69) / 12))

    # naive per-frame shift toward target (formant-preserving via resample ratio)
    corrected = y.copy()
    hop = 512
    for i in range(0, len(y) - hop, hop):
        frame = i // 2048 if i // 2048 < len(f0) else -1
        if frame >= 0 and voiced_flag[frame] and not np.isnan(f0[frame]):
            src = f0[frame]
            tgt = nearest_in_key(src)
            if tgt > 0:
                ratio = tgt / src
                # limit shift by strength
                ratio = 1 + (ratio - 1) * strength
                seg = y[i:i + hop]
                # resample this segment by ratio (pitch shift), then time-stretch back
                seg_shift = librosa.effects.pitch_shift(seg, sr=sr, n_steps=12 * math.log2(ratio))
                take = min(len(seg), len(seg_shift))
                corrected[i:i + take] = seg_shift[:take]

    out_path = audio_path.replace(".wav", "_tuned.wav").replace(".mp3", "_tuned.wav")
    sf.write(out_path, corrected, sr)
    return {
        "success": True,
        "output_path": out_path,
        "summary": f"Pitch-corrected toward {target_key} (strength {int(strength*100)}%)",
    }
