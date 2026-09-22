"""Extract the Brigit agent inventory into JSON for the Nexus site.

Walks constellation/brigit multi_agent departments + top-level agents,
parsing each *_agent.py for its class name and module docstring. Output is
written to the Nexus lib/ directory (checked in; re-run when agents change).

Usage: python scripts/extract-brigit-agents.py
"""
import ast
import json
import sys
from pathlib import Path

BRIGIT = Path(r"C:\Users\kpasc\source\repos\constellation\brigit")
OUT = Path(r"C:\Users\kpasc\source\repos\sansmercantile-nexus\lib\brigit-agents.json")

CAPABILITY_HINTS = {
    "support": ["customer_support", "communication"],
    "coordinator": ["coordination", "communication"],
    "manager": ["decision_making", "coordination"],
    "monitor": ["monitoring"],
    "analy": ["data_analysis", "research"],
    "research": ["research"],
    "content": ["content_creation"],
    "writer": ["content_creation"],
    "editor": ["content_creation"],
    "communicat": ["communication"],
    "outreach": ["communication"],
    "automat": ["automation"],
    "schedul": ["automation"],
    "secur": ["monitoring"],
    "compliance": ["monitoring", "decision_making"],
    "hr": ["coordination"],
    "recruit": ["coordination"],
    "onboard": ["coordination"],
    "market": ["research", "data_analysis"],
    "financ": ["data_analysis", "decision_making"],
    "legal": ["decision_making", "research"],
    "report": ["data_analysis"],
    "alert": ["monitoring", "communication"],
}


def prettify(name: str) -> str:
    return name.replace("_", " ").title()


def capabilities_for(filename: str) -> list:
    lowered = filename.lower()
    found: list = []
    for hint, caps in CAPABILITY_HINTS.items():
        if hint in lowered:
            for cap in caps:
                if cap not in found:
                    found.append(cap)
    return found or ["automation"]


def parse_agent(path: Path) -> dict | None:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8", errors="replace"))
    except (SyntaxError, ValueError):
        return None
    docstring = ast.get_docstring(tree) or ""
    classes = [n.name for n in ast.walk(tree) if isinstance(n, ast.ClassDef)]
    if not classes:
        return None
    # Prefer the *Agent class over dataclasses/helpers.
    agent_class = next(
        (c for c in classes if c.lower().endswith("agent")),
        classes[0],
    )
    return {
        "class_name": agent_class,
        "summary": " ".join(docstring.split())[:280],
    }


def main() -> int:
    roots = [BRIGIT / "multi_agent", BRIGIT / "agents"]
    departments: dict = {}
    total = 0
    for root in roots:
        if not root.is_dir():
            continue
        for path in sorted(root.rglob("*_agent.py")):
            info = parse_agent(path)
            if not info:
                continue
            rel = path.relative_to(root)
            dept_id = rel.parent.as_posix().replace("/", "_") or "general"
            if root.name == "agents":
                dept_id = "general"
            dept = departments.setdefault(
                dept_id,
                {"id": dept_id, "name": prettify(dept_id), "agents": []},
            )
            agent_id = f"{dept_id}.{path.stem}"
            dept["agents"].append(
                {
                    "id": agent_id,
                    "name": prettify(path.stem.replace("_agent", "").replace("_", " ")).strip() or prettify(path.stem),
                    "class_name": info["class_name"],
                    "module": path.relative_to(BRIGIT).as_posix(),
                    "summary": info["summary"],
                    "capabilities": capabilities_for(path.stem),
                }
            )
            total += 1

    payload = {
        "generated": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "departments": sorted(departments.values(), key=lambda d: d["id"]),
    }
    OUT.write_text(json.dumps(payload, indent=1), encoding="utf-8")
    print(f"departments={len(payload['departments'])} agents={total} -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
