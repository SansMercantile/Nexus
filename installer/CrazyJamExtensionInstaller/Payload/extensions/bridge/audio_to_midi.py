"""
Audio-to-MIDI service for the CrazyJam Bridge.

Two transcription paths:
  - melodic  : basic-pitch (Spotify AMT) for mono/polyphonic pitched audio
  - drums    : librosa onset detection + spectral-band classification -> GM drum notes

Optional stem separation via Demucs so a full song can be split first
(drums stem -> drum transcription; bass/vocal stem -> melodic transcription).

Output is always a piano-roll-ready structure the FL script can lay down:
  { "bpm": float, "notes": [...], "drums": {lane: [steps]}, "summary": str }
"""
from __future__ import annotations

import io
import logging
import os
import tempfile
from typing import Any

logger = logging.getLogger("crazyjam.bridge.a2m")

# Lazily imported heavy deps so the bridge boots even if they're not installed yet.
_librosa = None
_np = None


def _np_():
    global _np
    if _np is None:
        import numpy as np
        _np = np
    return _np


def _librosa_():
    global _librosa
    if _librosa is None:
        import librosa
        _librosa = librosa
    return _librosa


def _transcribe_melodic_librosa(audio_path: str) -> list[dict[str, Any]]:
    """Monophonic/predominant-pitch transcription via librosa pYIN + onset detection.
    Returns [(start_s, end_s, midi_note, velocity)]. Works without basic-pitch."""
    np = _np_()
    librosa = _librosa_()
    y, sr = librosa.load(audio_path, sr=22050, mono=True)
    f0, voiced_flag, _ = librosa.pyin(
        y, fmin=librosa.note_to_hz("C2"), fmax=librosa.note_to_hz("C7"),
        sr=sr, frame_length=2048, hop_length=512,
    )
    onsets = librosa.onset.onset_detect(y=y, sr=sr, units="time", backtrack=True)
    # segment by onsets; pitch = median f0 within each segment
    events: list[tuple[float, float, int, float]] = []
    times = librosa.frames_to_time(np.arange(len(f0)), sr=sr, hop_length=512)
    bounds = list(onsets) + [times[-1]]
    for i in range(len(bounds) - 1):
        s, e = bounds[i], bounds[i + 1]
        seg = (times >= s) & (times < e)
        if not seg.any():
            continue
        f0_seg = f0[seg]
        voiced = f0_seg[~np.isnan(f0_seg)]
        if len(voiced) == 0:
            continue
        f0_med = float(np.median(voiced))
        midi = int(round(69 + 12 * np.log2(f0_med / 440.0)))
        midi = max(0, min(127, midi))
        amp = float(np.mean(librosa.feature.rms(y=y[int(s * sr):int(e * sr)]))) if e > s else 0.8
        events.append((float(s), float(e), midi, min(1.0, amp * 10)))
    return events


def _detect_bpm(y, sr) -> float:
    librosa = _librosa_()
    try:
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        return float(round(tempo))
    except Exception:
        return 120.0


def _transcribe_melodic(audio_path: str) -> dict[str, Any]:
    """Melodic transcription (librosa pYIN path) -> {bpm, notes:[{note,step,length,velocity}]}."""
    np = _np_()
    librosa = _librosa_()
    note_events = _transcribe_melodic_librosa(audio_path)
    y, sr = librosa.load(audio_path, sr=22050, mono=True)
    bpm = _detect_bpm(y, sr)
    spb = 60.0 / bpm  # seconds per beat; 16 steps per bar of 4/4 -> step = 1/4 beat

    notes = []
    for start_s, end_s, midi_note, amp in note_events:
        step = round((start_s / spb) * 4)          # 4 steps per beat (16/bar)
        length = max(1, round(((end_s - start_s) / spb) * 4))
        vel = max(0.1, min(1.0, float(amp)))
        notes.append({"note": int(midi_note), "step": int(step), "length": int(length), "velocity": vel})
    notes.sort(key=lambda n: n["step"])
    return {"bpm": bpm, "notes": notes}


def _transcribe_drums(audio_path: str) -> dict[str, Any]:
    """Onset detection + crude spectral-band classification -> GM drum lanes."""
    librosa = _librosa_()
    np = _np_()

    y, sr = librosa.load(audio_path, sr=22050, mono=True)
    bpm = _detect_bpm(y, sr)
    spb = 60.0 / bpm

    onset_frames = librosa.onset.onset_detect(y=y, sr=sr, backtrack=True, units="time")
    stft = np.abs(librosa.stft(y))
    freqs = librosa.fft_frequencies(sr=sr)

    def band_energy(frame_idx, lo, hi):
        band = (freqs >= lo) & (freqs < hi)
        return float(stft[band, frame_idx].sum()) if band.any() else 0.0

    lanes: dict[str, list[int]] = {"kick": [], "snare": [], "hihat": [], "perc": []}
    for t in onset_frames:
        step = round((t / spb) * 4)
        frame = librosa.time_to_frames(t, sr=sr)
        lo = band_energy(frame, 20, 150)
        mid = band_energy(frame, 150, 2000)
        hi = band_energy(frame, 5000, 10000)
        total = lo + mid + hi + 1e-9
        if lo / total > 0.5:
            lanes["kick"].append(step)
        elif hi / total > 0.4:
            lanes["hihat"].append(step)
        elif mid / total > 0.4:
            lanes["snare"].append(step)
        else:
            lanes["perc"].append(step)
    # dedupe steps per lane
    for k in lanes:
        lanes[k] = sorted(set(lanes[k]))
    return {"bpm": bpm, "drums": lanes}


def _separate_stems(audio_path: str) -> dict[str, str]:
    """Demucs 4-stem separation -> {drums, bass, vocals, other} file paths.
    Optional; only used if the caller wants full-song transcription."""
    try:
        import demucs.separate  # noqa: F401
    except Exception:
        raise RuntimeError("Demucs not installed in the bridge env")
    out_dir = tempfile.mkdtemp(prefix="crazyjam_stems_")
    import subprocess, sys
    subprocess.run(
        [sys.executable, "-m", "demucs.separate", "-o", out_dir, audio_path],
        check=True, capture_output=True,
    )
    # demucs writes <out_dir>/htdemucs/<trackname>/{drums,bass,vocals,other}.wav
    base = os.path.splitext(os.path.basename(audio_path))[0]
    stem_dir = os.path.join(out_dir, "htdemucs", base)
    return {
        "drums": os.path.join(stem_dir, "drums.wav"),
        "bass": os.path.join(stem_dir, "bass.wav"),
        "vocals": os.path.join(stem_dir, "vocals.wav"),
        "other": os.path.join(stem_dir, "other.wav"),
    }


def midi_file_to_roll(midi_path: str) -> dict[str, Any]:
    """Parse a .mid file into the piano-roll structure (notes + drums by GM map)."""
    import pretty_midi
    pm = pretty_midi.PrettyMIDI(midi_path)
    # use the file's own tempo if present, else estimate from note density
    tempos = pm.get_tempo_changes()
    bpm = float(tempos[1][0]) if len(tempos[1]) else 120.0
    spb = 60.0 / bpm
    DRUMS = {36: "kick", 38: "snare", 40: "snare", 42: "hihat", 46: "hihat", 39: "perc", 45: "logdrum", 70: "shaker"}
    notes: list[dict[str, Any]] = []
    drums: dict[str, list[int]] = {"kick": [], "snare": [], "hihat": [], "perc": [], "clap": [], "shaker": [], "logdrum": []}
    for inst in pm.instruments:
        for n in inst.notes:
            step = round((n.start / spb) * 4)
            length = max(1, round(((n.end - n.start) / spb) * 4))
            if inst.is_drum or n.pitch in DRUMS:
                lane = DRUMS.get(n.pitch, "perc")
                drums[lane].append(step)
            else:
                notes.append({
                    "note": int(n.pitch), "step": int(step), "length": int(length),
                    "velocity": round(n.velocity / 127.0, 3),
                })
    notes.sort(key=lambda x: x["step"])
    for k in drums:
        drums[k] = sorted(set(drums[k]))
    return {
        "success": True, "bpm": bpm, "notes": notes, "drums": drums,
        "summary": f"MIDI file: {len(notes)} notes, {sum(len(v) for v in drums.values())} drum hits @ {round(bpm)} BPM",
    }


def audio_to_midi(audio_path: str, mode: str = "auto", separate: bool = False) -> dict[str, Any]:
    """Top-level entry. mode: 'melodic' | 'drums' | 'auto'. separate: run Demucs first
    for full-song input (drums stem + melodic stem)."""
    if separate:
        stems = _separate_stems(audio_path)
        drums = _transcribe_drums(stems["drums"])
        melodic = _transcribe_melodic(stems["other"] if os.path.exists(stems["other"]) else stems["bass"])
        return {
            "success": True,
            "bpm": drums["bpm"] or melodic["bpm"],
            "drums": drums["drums"],
            "notes": melodic["notes"],
            "summary": f"Full-song transcription (separated): {len(melodic['notes'])} notes, "
                       f"{sum(len(v) for v in drums['drums'].values())} drum hits @ {round(drums['bpm'])} BPM",
        }

    if mode == "melodic":
        res = _transcribe_melodic(audio_path)
        return {"success": True, **res, "summary": f"{len(res['notes'])} melodic notes @ {round(res['bpm'])} BPM"}
    if mode == "drums":
        res = _transcribe_drums(audio_path)
        return {"success": True, **res, "summary": f"{sum(len(v) for v in res['drums'].values())} drum hits @ {round(res['bpm'])} BPM"}

    # auto: try melodic first, drums if very few pitched notes found
    mel = _transcribe_melodic(audio_path)
    if len(mel["notes"]) >= 8:
        return {"success": True, **mel, "summary": f"{len(mel['notes'])} melodic notes @ {round(mel['bpm'])} BPM"}
    dr = _transcribe_drums(audio_path)
    return {"success": True, **dr, "summary": f"{sum(len(v) for v in dr['drums'].values())} drum hits @ {round(dr['bpm'])} BPM"}
