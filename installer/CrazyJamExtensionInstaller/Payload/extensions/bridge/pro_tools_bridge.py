"""
Pro Tools Bridge — HUI/Mackie Control surface driver for the CrazyJam Bridge.

Pro Tools doesn't have a scripting API for notes/plugins, but it DOES speak the
HUI (Mackie Control Universal) protocol over MIDI for mixer/transport control,
and MIDI Learn for instruments. This module runs a virtual HUI surface that the
CrazyJam Bridge talks to over a virtual MIDI port, so Pro Tools sees it as a
hardware controller.

Requires: a virtual MIDI port (loopMIDI on Windows, IAC Driver on macOS).
The bridge opens the port, Pro Tools is configured to use it as a HUI controller.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger("crazyjam.bridge.protools")

# HUI/Mackie Control Universal MIDI mapping (subset)
HUI_MAP = {
    # Channel faders (pitch bend on channels 1-8)
    "fader": lambda ch, val: [0xE0 + ch, val & 0x7F, (val >> 7) & 0x7F],
    # Channel pans (CC 10 on channels 1-8)
    "pan": lambda ch, val: [0xB0 + ch, 10, val & 0x7F],
    # Mute (CC 16 on channels 1-8)
    "mute": lambda ch, val: [0xB0 + ch, 16, val & 0x7F],
    # Solo (CC 17 on channels 1-8)
    "solo": lambda ch, val: [0xB0 + ch, 17, val & 0x7F],
    # Select (CC 18 on channels 1-8)
    "select": lambda ch, val: [0xB0 + ch, 18, val & 0x7F],
    # Transport (CC 20-23 on channel 0)
    "transport_play": lambda: [0xB0, 20, 127],
    "transport_stop": lambda: [0xB0, 21, 127],
    "transport_record": lambda: [0xB0, 22, 127],
    "transport_ff": lambda: [0xB0, 23, 127],
    "transport_rew": lambda: [0xB0, 24, 127],
}


class ProToolsBridge:
    """Virtual HUI surface for Pro Tools control."""

    def __init__(self, port_name: str = "CrazyJam Bridge"):
        self.port_name = port_name
        self._midi_out = None
        self._connected = False

    def connect(self) -> bool:
        """Open the virtual MIDI port for HUI communication."""
        try:
            import rtmidi
            self._midi_out = rtmidi.MidiOut()
            ports = self._midi_out.get_ports()
            for i, name in enumerate(ports):
                if self.port_name.lower() in name.lower():
                    self._midi_out.open_port(i)
                    self._connected = True
                    logger.info("Pro Tools bridge connected to MIDI port: %s", name)
                    return True
            logger.warning("MIDI port '%s' not found; available: %s", self.port_name, ports)
            return False
        except ImportError:
            logger.warning("rtmidi not installed; Pro Tools bridge running in stub mode")
            return False
        except Exception as e:
            logger.error("Pro Tools bridge connect failed: %s", e)
            return False

    def disconnect(self):
        if self._midi_out:
            try:
                self._midi_out.close_port()
            except Exception:
                pass
        self._connected = False

    def _send(self, msg: list[int]) -> None:
        if self._connected and self._midi_out:
            self._midi_out.send_message(msg)

    # --- Mixer control --------------------------------------------------------

    def set_fader(self, channel: int, value: float) -> None:
        """Set a channel fader (0..1 normalized -> 14-bit pitch bend)."""
        val = int(max(0.0, min(1.0, value)) * 16383)
        self._send(HUI_MAP["fader"](channel, val))

    def set_pan(self, channel: int, value: float) -> None:
        """Set a channel pan (-1..1 -> 0..127 CC)."""
        val = int((max(-1.0, min(1.0, value)) + 1.0) * 63.5)
        self._send(HUI_MAP["pan"](channel, val))

    def set_mute(self, channel: int, muted: bool) -> None:
        self._send(HUI_MAP["mute"](channel, 127 if muted else 0))

    def set_solo(self, channel: int, solo: bool) -> None:
        self._send(HUI_MAP["solo"](channel, 127 if solo else 0))

    def set_select(self, channel: int, selected: bool) -> None:
        self._send(HUI_MAP["select"](channel, 127 if selected else 0))

    # --- Transport --------------------------------------------------------------

    def transport_play(self):
        self._send(HUI_MAP["transport_play"]())

    def transport_stop(self):
        self._send(HUI_MAP["transport_stop"]())

    def transport_record(self):
        self._send(HUI_MAP["transport_record"]())

    def transport_ff(self):
        self._send(HUI_MAP["transport_ff"]())

    def transport_rew(self):
        self._send(HUI_MAP["transport_rew"]())

    def apply_mix_moves(self, moves: list[dict[str, Any]]) -> int:
        """Apply a structured mixer move list via HUI (faders/pans/mutes/solos)."""
        applied = 0
        for mv in moves:
            action = mv.get("action")
            channel = mv.get("track", 0)
            value = mv.get("value")
            try:
                if action == "volume":
                    self.set_fader(channel, float(value))
                elif action == "pan":
                    self.set_pan(channel, float(value))
                elif action == "mute":
                    self.set_mute(channel, bool(value))
                elif action == "solo":
                    self.set_solo(channel, bool(value))
                applied += 1
            except Exception as e:
                logger.warning("pro-tools apply skip %s: %s", action, e)
        return applied


# Singleton for the bridge app to use.
_pro_tools_bridge = ProToolsBridge()


def get_pro_tools_bridge() -> ProToolsBridge:
    return _pro_tools_bridge

    # --- Mix/master apply (maps the bridge's move list to HUI) ----------------

    def apply_mix_moves(self, moves: list[dict[str, Any]]) -> int:
        """Apply a structured mix move list to Pro Tools via HUI.
        moves: [{track, action, value}] where action in
        volume|pan|mute|solo|select|transport_play|transport_stop|eq_*"""
        applied = 0
        for mv in moves:
            track = mv.get("track", 0)
            action = mv.get("action")
            value = mv.get("value")
            try:
                if action == "volume":
                    self.set_fader(track, float(value))
                elif action == "pan":
                    self.set_pan(track, float(value))
                elif action == "mute":
                    self.set_mute(track, bool(value))
                elif action == "solo":
                    self.set_solo(track, bool(value))
                elif action == "select":
                    self.set_select(track, bool(value))
                elif action == "transport_play":
                    self.transport_play()
                elif action == "transport_stop":
                    self.transport_stop()
                # EQ moves are plugin-specific; HUI can't set plugin EQ directly.
                # The controller script maps CC20/CC21 to the focused plugin's
                # Quick Controls via MIDI Learn instead.
                applied += 1
            except Exception as e:
                logger.warning("Pro Tools apply skip %s: %s", action, e)
        return applied


# Singleton the bridge uses.
_pt_bridge = ProToolsBridge()


def get_pro_tools_bridge() -> ProToolsBridge:
    return _pt_bridge
