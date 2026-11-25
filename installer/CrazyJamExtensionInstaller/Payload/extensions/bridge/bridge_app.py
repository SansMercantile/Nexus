"""
CrazyJam Bridge — localhost companion app for FL Studio (and later Cubase/Pro Tools).

Runs on the producer's machine at http://127.0.0.1:8787 and brokers three pillars
between the DAW's Piano Roll script and the CrazyJam cloud backend:

  1. AI co-producer  — POST /api/co-producer/generate  -> chords/melody/bass/drums
  2. Visuals/teasers — POST /api/bridge/teaser, /api/bridge/cover-art (proxied to cloud)
  3. Promotion       — POST /api/bridge/promote       (proxied to cloud /api/promotion)

The FL Studio Piano Roll script talks ONLY to this bridge (no credentials in the
script). The bridge holds the CrazyJam login token and forwards to the real backend,
so the same GPU models / credits power both the DAW and the web studio.

Run standalone:
    python -m uvicorn bridge.bridge_app:app --host 127.0.0.1 --port 8787
"""
import logging
import os
import tempfile
from typing import Any, Optional

import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from bridge import audio_to_midi, humanize, mix_master

logger = logging.getLogger("crazyjam.bridge")
logging.basicConfig(level=logging.INFO)

# --- Where the real CrazyJam backend lives ----------------------------------
# Local dev default; override with CRAZYJAM_API for production (your ALB / Vercel).
CLOUD_API = os.environ.get("CRAZYJAM_API", "http://127.0.0.1:8000")
# The user's CrazyJam login token (JWT). Loaded from env or a local token file so
# the FL script never needs credentials. Set CRAZYJAM_TOKEN, or drop the token in
# bridge/.token next to this file.
TOKEN = os.environ.get("CRAZYJAM_TOKEN")
_token_file = os.path.join(os.path.dirname(__file__), ".token")
if not TOKEN and os.path.exists(_token_file):
    with open(_token_file, encoding="utf-8") as f:
        TOKEN = f.read().strip()

app = FastAPI(title="CrazyJam Bridge", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # localhost-only anyway
    allow_methods=["*"],
    allow_headers=["*"],
)


def _auth_headers() -> dict:
    if not TOKEN:
        raise HTTPException(
            status_code=401,
            detail="No CrazyJam token configured. Set CRAZYJAM_TOKEN or drop your token in bridge/.token.",
        )
    return {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}


async def _cloud_post(path: str, payload: dict) -> dict:
    async with httpx.AsyncClient(timeout=240.0) as client:
        resp = await client.post(f"{CLOUD_API}{path}", json=payload, headers=_auth_headers())
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()


# ===========================================================================
# Pillar 1 — AI co-producer
# ===========================================================================

class Parts(BaseModel):
    chords: bool = True
    melody: bool = True
    bass: bool = True
    drums: bool = False


class CoProducerRequest(BaseModel):
    prompt: str
    genre: str = "Afrobeats"
    scale: str = "A Minor"
    tempo: int = 104
    bars: int = 1
    parts: Parts = Parts()


# Blueprint tool schema for structured output (chords/melody/bass/drums).
_BLUEPRINT_TOOL = {
    "toolSpec": {
        "name": "emit_co_producer",
        "description": "Return a structured composition blueprint for a DAW piano roll.",
        "inputSchema": {
            "json": {
                "type": "object",
                "properties": {
                    "summary": {"type": "string"},
                    "chords": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "step": {"type": "integer"},
                                "length": {"type": "integer"},
                                "notes": {"type": "array", "items": {"type": "string"}},
                            },
                            "required": ["step", "length", "notes"],
                        },
                    },
                    "melody": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "step": {"type": "integer"},
                                "length": {"type": "integer"},
                                "note": {"type": "string"},
                            },
                            "required": ["step", "length", "note"],
                        },
                    },
                    "bass": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "step": {"type": "integer"},
                                "length": {"type": "integer"},
                                "note": {"type": "string"},
                            },
                            "required": ["step", "length", "note"],
                        },
                    },
                    "drums": {"type": "object"},
                },
                "required": ["summary", "chords", "melody", "bass", "drums"],
            }
        },
    }
}


@app.post("/api/co-producer/generate")
async def co_producer_generate(req: CoProducerRequest) -> dict[str, Any]:
    """Generate chords/melody/bass/drums via the CrazyJam cloud blueprint model
    and return a piano-roll-ready structure the FL script can lay down."""
    import bedrock_client

    parts_desc = ", ".join(k for k, v in req.parts.model_dump().items() if v)
    system = (
        "You are CrazyJam's AI co-producer inside a DAW. You output ONLY structured "
        "JSON via the emit_co_producer tool. Steps are 16th-note positions within a "
        "4/4 bar (0-15 per bar). Notes are named like 'A4', 'C#3', 'F2'. "
        "Chords are arrays of simultaneous note names. Write musical, idiomatic parts "
        "for the requested genre. Keep it within the requested number of bars "
        "(steps = bars*16). Match the requested scale."
    )
    user = (
        f"Prompt: {req.prompt}\nGenre: {req.genre}\nScale: {req.scale}\n"
        f"Tempo: {req.tempo} BPM\nBars: {req.bars}\nParts to write: {parts_desc}.\n"
        "Drums: object mapping lane names (kick/snare/hihat/perc) to arrays of step numbers, "
        "or empty object if drums not requested."
    )

    try:
        data = bedrock_client.generate_structured(system, user, _BLUEPRINT_TOOL, max_tokens=4000)
    except Exception as e:
        logger.warning("co_producer generation failed: %s", e)
        return {"success": False, "errorMessage": str(e), "data": None}

    return {"success": True, "errorMessage": None, "data": data}


# ===========================================================================
# Pillar 2 — Visuals / teasers (proxied to cloud video-director)
# ===========================================================================

class TeaserRequest(BaseModel):
    trackTitle: str
    lyricLine: str
    faceImageBase64: str
    faceImageContentType: str = "image/jpeg"
    voiceId: str = "Matthew"


@app.post("/api/bridge/teaser")
async def bridge_teaser(req: TeaserRequest) -> dict[str, Any]:
    """Generate a 15s lip-synced teaser via the cloud quick-teaser endpoint."""
    return await _cloud_post("/api/video-director/quick-teaser", req.model_dump())


class CoverArtRequest(BaseModel):
    prompt: str


@app.post("/api/bridge/cover-art")
async def bridge_cover_art(req: CoverArtRequest) -> dict[str, Any]:
    """Generate cover art via the cloud album-art AI endpoint."""
    return await _cloud_post("/api/album-art/generate-ai", {"prompt": req.prompt})


# ===========================================================================
# Pillar 3 — Promotion (proxied to cloud promotion hub)
# ===========================================================================

class PromoteRequest(BaseModel):
    releaseId: str
    tier: str = "starter"
    trackTitle: Optional[str] = None
    notes: Optional[str] = None


@app.post("/api/bridge/promote")
async def bridge_promote(req: PromoteRequest) -> dict[str, Any]:
    """Launch a playlist campaign via the cloud promotion hub."""
    return await _cloud_post("/api/promotion/campaigns", req.model_dump())


@app.get("/api/bridge/catalog")
async def bridge_catalog() -> Any:
    """List the user's promotion catalog (their releases) so the DAW can pick one."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.get(f"{CLOUD_API}/api/promotion/catalog", headers=_auth_headers())
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "crazyjam-bridge", "cloud": CLOUD_API, "authed": bool(TOKEN)}


# ===========================================================================
# Pillar 4 — Drag & drop: audio→MIDI, remake, humanize, pitch, mix/master
# ===========================================================================

def _save_upload(file: UploadFile, content: bytes) -> str:
    suffix = os.path.splitext(file.filename or "upload.wav")[1] or ".wav"
    fd, path = tempfile.mkstemp(suffix=suffix, prefix="crazyjam_drop_")
    with os.fdopen(fd, "wb") as f:
        f.write(content)
    return path


class AudioToMidiRequest(BaseModel):
    mode: str = "auto"       # 'melodic' | 'drums' | 'auto'
    separate: bool = False   # run Demucs first for full-song input


@app.post("/api/bridge/audio-to-midi")
async def bridge_audio_to_midi(file: UploadFile = File(...), mode: str = "auto", separate: bool = False) -> dict[str, Any]:
    """Convert a dropped audio file (beat / melody / full song) to piano-roll-ready MIDI."""
    try:
        content = await file.read()
        path = _save_upload(file, content)
        result = audio_to_midi.audio_to_midi(path, mode=mode, separate=separate)
        return result
    except Exception as e:
        logger.warning("audio-to-midi failed: %s", e)
        return {"success": False, "errorMessage": str(e)}


class RemakeRequest(BaseModel):
    genre: str = "Afrobeats"
    scale: str = "A Minor"
    mode: str = "auto"
    separate: bool = False
    humanize: bool = True


@app.post("/api/bridge/remake")
async def bridge_remake(file: UploadFile = File(...), genre: str = "Afrobeats", scale: str = "A Minor",
                        mode: str = "auto", separate: bool = False, humanize_it: bool = True) -> dict[str, Any]:
    """Drop any beat/instrument (audio) -> transcribe to MIDI -> humanize -> return a
    piano-roll-ready remake, plus an instrument-match hint for the FL script."""
    try:
        content = await file.read()
        path = _save_upload(file, content)
        # 1. transcribe
        t = audio_to_midi.audio_to_midi(path, mode=mode, separate=separate)
        if not t.get("success"):
            return t
        bpm = t.get("bpm", 120)
        # 2. humanize (optional)
        if humanize_it:
            if t.get("notes"):
                t["notes"] = humanize.humanize_notes(t["notes"], bpm)
            if t.get("drums"):
                t["drums"] = humanize.humanize_drums(t["drums"], bpm)
        # 3. instrument-match hint (simple spectral heuristic -> FL plugin suggestion)
        hint = _suggest_instrument(path)
        t["instrument_hint"] = hint
        t["remade"] = True
        return t
    except Exception as e:
        logger.warning("remake failed: %s", e)
        return {"success": False, "errorMessage": str(e)}


def _suggest_instrument(audio_path: str) -> dict[str, Any]:
    """Rough spectral heuristic -> suggest an FL-native instrument/preset family."""
    import librosa
    import numpy as np
    try:
        y, sr = librosa.load(audio_path, sr=None, mono=True)
        centroid = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
        rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)))
        onset_strength = float(np.mean(librosa.onset.onset_strength(y=y, sr=sr)))
        if onset_strength > 2.0 and centroid < 2000:
            family, preset = "Drums / Percussion", "FPC or Slicex (drum kit)"
        elif centroid < 800:
            family, preset = "Bass", "Harmor / 3xOsc sub bass"
        elif centroid < 2500 and rolloff < 6000:
            family, preset = "Keys / Pad", "Harmor / FLEX warm keys or pad"
        elif centroid > 3000:
            family, preset = "Lead / Pluck", "Sakura / Sytrus pluck lead"
        else:
            family, preset = "Synth", "Sytrus / 3xOsc general synth"
        return {"family": family, "suggested_preset": preset, "centroid_hz": round(centroid), "onset_strength": round(onset_strength, 2)}
    except Exception:
        return {"family": "Unknown", "suggested_preset": "FLEX / Harmor default"}


@app.post("/api/bridge/remake-midi")
async def bridge_remake_midi(file: UploadFile = File(...), genre: str = "Afrobeats", scale: str = "A Minor",
                             humanize_it: bool = True) -> dict[str, Any]:
    """Drop a .mid file -> parse it -> humanize -> return a piano-roll-ready remake."""
    try:
        content = await file.read()
        path = _save_upload(file, content)
        t = audio_to_midi.midi_file_to_roll(path)
        if not t.get("success"):
            return t
        if humanize_it:
            if t.get("notes"):
                t["notes"] = humanize.humanize_notes(t["notes"], t.get("bpm", 120))
            if t.get("drums"):
                t["drums"] = humanize.humanize_drums(t["drums"], t.get("bpm", 120))
        t["remade"] = True
        return t
    except Exception as e:
        logger.warning("remake-midi failed: %s", e)
        return {"success": False, "errorMessage": str(e)}


class HumanizeRequest(BaseModel):
    notes: list[dict[str, Any]] = []
    drums: dict[str, list[int]] = {}
    bpm: float = 120.0
    swing: float = 0.08
    timing_jitter: float = 0.02
    velocity_feel: float = 0.15
    ghost_probability: float = 0.0


@app.post("/api/bridge/humanize")
async def bridge_humanize(req: HumanizeRequest) -> dict[str, Any]:
    """Humanize a MIDI part (notes and/or drum lanes) to feel played by a human."""
    try:
        result: dict[str, Any] = {"success": True}
        if req.notes:
            result["notes"] = humanize.humanize_notes(
                req.notes, req.bpm, swing=req.swing, timing_jitter=req.timing_jitter,
                velocity_feel=req.velocity_feel, ghost_probability=req.ghost_probability,
            )
        if req.drums:
            result["drums"] = humanize.humanize_drums(req.drums, req.bpm, swing=req.swing)
        return result
    except Exception as e:
        logger.warning("humanize failed: %s", e)
        return {"success": False, "errorMessage": str(e)}


class PitchRequest(BaseModel):
    target_key: str = "A Minor"
    strength: float = 0.8


@app.post("/api/bridge/pitch-correct")
async def bridge_pitch_correct(file: UploadFile = File(...), target_key: str = "A Minor", strength: float = 0.8) -> dict[str, Any]:
    """Auto pitch-correct a vocal/melodic take toward a key (formant-preserving)."""
    try:
        content = await file.read()
        path = _save_upload(file, content)
        result = humanize.pitch_correct_audio(path, target_key=target_key, strength=strength)
        return result
    except Exception as e:
        logger.warning("pitch-correct failed: %s", e)
        return {"success": False, "errorMessage": str(e)}


class MixMasterRequest(BaseModel):
    genre: str = "Afrobeats"
    goal: str = "modern streaming master"
    render: bool = False
    target_lufs: float = -14.0


class ApplyMasterRequest(BaseModel):
    track_count: int = 16
    genre: str = "Afrobeats"


@app.post("/api/bridge/mix-master/apply")
async def bridge_mix_apply(req: dict) -> dict[str, Any]:
    """Return a structured mixer move list the FL controller script applies.
    If a 'profile' + 'genre' are supplied, moves are computed from the actual mix;
    otherwise sensible defaults are returned."""
    profile = req.get("profile")
    genre = req.get("genre", "Afrobeats")
    if profile:
        moves = mix_master.mix_moves_from_analysis(profile, genre)
    else:
        moves = _default_mix_moves()
    return {"success": True, "moves": moves, "from_analysis": bool(profile)}


@app.post("/api/bridge/mix-master/apply-master")
async def bridge_mix_apply_master(req: dict) -> dict[str, Any]:
    """Return master-channel moves (limiter-style ceiling via master volume/EQ)."""
    moves = _default_master_moves()
    return {"success": True, "moves": moves}


@app.post("/api/bridge/ping")
async def bridge_ping(req: dict) -> dict[str, Any]:
    return {"success": True, "pong": True}


def _default_mix_moves() -> list[dict[str, Any]]:
    """Sensible default mix moves for a typical FL session (tracks 1-8 + master).
    track 0 = Master in FL. Values are conservative starting points."""
    return [
        {"track": 1, "action": "volume", "value": 0.78},
        {"track": 1, "action": "eq_low_freq", "value": 120},
        {"track": 1, "action": "eq_low_gain", "value": -2},
        {"track": 1, "action": "eq_high_gain", "value": 1},
        {"track": 2, "action": "volume", "value": 0.72},
        {"track": 2, "action": "pan", "value": -0.1},
        {"track": 2, "action": "eq_mid_freq", "value": 800},
        {"track": 3, "action": "volume", "value": 0.72},
        {"track": 3, "action": "pan", "value": 0.1},
        {"track": 3, "action": "eq_high_freq", "value": 8000},
        {"track": 0, "action": "eq_low_gain", "value": -1},
        {"track": 0, "action": "volume", "value": 0.92},
    ]


def _default_master_moves() -> list[dict[str, Any]]:
    """Master-channel polish: gentle low-shelf cut, high-shelf lift, slight level."""
    return [
        {"track": 0, "action": "eq_low_freq", "value": 100},
        {"track": 0, "action": "eq_low_gain", "value": -1.5},
        {"track": 0, "action": "eq_high_freq", "value": 10000},
        {"track": 0, "action": "eq_high_gain", "value": 1.5},
        {"track": 0, "action": "volume", "value": 0.92},
    ]


@app.post("/api/bridge/cubase-co-producer")
async def bridge_cubase_co_producer(req: CoProducerRequest) -> dict[str, Any]:
    """Generate chords/melody/bass/drums and return them as a Cubase-importable
    MIDI file (standard .mid) plus the piano-roll structure for reference."""
    import bedrock_client
    from io import BytesIO

    parts_desc = ", ".join(k for k, v in req.parts.model_dump().items() if v)
    system = (
        "You are CrazyJam's AI co-producer. Output ONLY structured JSON via emit_co_producer. "
        "Steps are 16th-note positions in a 4/4 bar. Notes are named like 'A4', 'C#3'. "
        "Chords are arrays of simultaneous note names."
    )
    user = (
        f"Prompt: {req.prompt}\nGenre: {req.genre}\nScale: {req.scale}\n"
        f"Tempo: {req.tempo} BPM\nBars: {req.bars}\nParts to write: {parts_desc}."
    )

    try:
        data = bedrock_client.generate_structured(system, user, _BLUEPRINT_TOOL, max_tokens=4000)
    except Exception as e:
        logger.warning("cubase co_producer generation failed: %s", e)
        return {"success": False, "errorMessage": str(e), "data": None}

    # Build a Cubase-importable MIDI file from the blueprint
    try:
        import pretty_midi
        pm = pretty_midi.PrettyMIDI(initial_tempo=req.tempo)
        # chords -> one instrument track
        if data.get("chords"):
            inst = pretty_midi.Instrument(program=0)
            for chord in data["chords"]:
                step = chord.get("step", 0)
                length = chord.get("length", 4)
                for n in chord.get("notes", []):
                    pm_note = pretty_midi.Note(
                        velocity=80, pitch=_note_to_midi(n),
                        start=step * (60.0 / req.tempo / 4),
                        end=(step + length) * (60.0 / req.tempo / 4),
                    )
                    inst.notes.append(pm_note)
            pm.instruments.append(inst)
        # bass
        if data.get("bass"):
            inst = pretty_midi.Instrument(program=32)
            for n in data["bass"]:
                pm_note = pretty_midi.Note(
                    velocity=90, pitch=_note_to_midi(n.get("note", "A2")),
                    start=n.get("step", 0) * (60.0 / req.tempo / 4),
                    end=(n.get("step", 0) + n.get("length", 2)) * (60.0 / req.tempo / 4),
                )
                inst.notes.append(pm_note)
            pm.instruments.append(inst)
        # melody
        if data.get("melody"):
            inst = pretty_midi.Instrument(program=0)
            for n in data["melody"]:
                pm_note = pretty_midi.Note(
                    velocity=80, pitch=_note_to_midi(n.get("note", "A4")),
                    start=n.get("step", 0) * (60.0 / req.tempo / 4),
                    end=(n.get("step", 0) + n.get("length", 1)) * (60.0 / req.tempo / 4),
                )
                inst.notes.append(pm_note)
            pm.instruments.append(inst)
        # drums
        if data.get("drums"):
            inst = pretty_midi.Instrument(program=0, is_drum=True)
            DRUMS = {"kick": 36, "snare": 38, "hihat": 42, "perc": 39, "clap": 39, "shaker": 70, "logdrum": 45}
            for lane_name, hits in data["drums"].items():
                drum_num = DRUMS.get(lane_name.lower(), 38)
                for step in hits:
                    pm_note = pretty_midi.Note(
                        velocity=90, pitch=drum_num,
                        start=step * (60.0 / req.tempo / 4),
                        end=(step + 1) * (60.0 / req.tempo / 4),
                    )
                    inst.notes.append(pm_note)
            pm.instruments.append(inst)

        buf = BytesIO()
        pm.write(buf)
        midi_b64 = __import__("base64").b64encode(buf.getvalue()).decode()
        data["midi_base64"] = midi_b64
        data["success"] = True
        return {"success": True, "errorMessage": None, "data": data}
    except Exception as e:
        logger.warning("cubase midi build failed: %s", e)
        return {"success": False, "errorMessage": str(e), "data": None}


def _note_to_midi(name: str) -> int:
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    if not name:
        return 60
    i = 0
    pitch = ""
    while i < len(name) and not name[i].isdigit() and name[i] != "-":
        pitch += name[i]
        i += 1
    try:
        octave = int(name[i:])
    except Exception:
        octave = 4
    flats = {"Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#"}
    pitch = flats.get(pitch, pitch)
    if pitch not in names:
        return 60
    return 12 * (octave + 1) + names.index(pitch)


@app.post("/api/bridge/pro-tools/apply")
async def bridge_pro_tools_apply(req: dict) -> dict[str, Any]:
    """Apply mix/master moves to Pro Tools via the HUI surface."""
    from bridge.pro_tools_bridge import get_pro_tools_bridge
    bridge = get_pro_tools_bridge()
    if not bridge._connected:
        bridge.connect()
    moves = req.get("moves", [])
    applied = bridge.apply_mix_moves(moves)
    return {"success": True, "applied": applied}


@app.post("/api/bridge/pro-tools/co-producer")
async def bridge_pro_tools_co_producer(req: CoProducerRequest) -> dict[str, Any]:
    """Generate chords/melody/bass/drums for Pro Tools (same as Cubase)."""
    return await bridge_cubase_co_producer(req)


@app.post("/api/bridge/mix-master")
async def bridge_mix_master(file: UploadFile = File(...), genre: str = "Afrobeats",
                            goal: str = "modern streaming master", render: bool = False,
                            target_lufs: float = -14.0) -> dict[str, Any]:
    """Analyze the current mix and suggest moves, or render a mastered stereo file."""
    try:
        content = await file.read()
        path = _save_upload(file, content)
        if render:
            return mix_master.render_master(path, genre=genre, target_lufs=target_lufs)
        return mix_master.analyze_mix(path, genre=genre, goal=goal)
    except Exception as e:
        logger.warning("mix-master failed: %s", e)
        return {"success": False, "errorMessage": str(e)}
