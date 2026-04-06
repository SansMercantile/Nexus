import sys
from typing import Any, Dict

import requests

GEMMA_HOST = 'http://localhost:11434'
MODEL = 'mpeti'
MODEL_ALIASES = {
    'mpeti': 'gemma:2b',
    'mpeti:2b': 'gemma:2b',
    'gemma': 'gemma:2b',
    'gemma4': 'gemma:2b',
    'gemma4:2b': 'gemma:2b',
    'gemma:2b': 'gemma:2b',
}


def resolve_model(model: str) -> str:
    return MODEL_ALIASES.get(model.lower(), model)


def ask_gemma(prompt: str, model: str = MODEL) -> Dict[str, Any]:
    actual_model = resolve_model(model)
    response = requests.post(
        f'{GEMMA_HOST}/api/generate',
        json={'model': actual_model, 'prompt': prompt, 'max_tokens': 256, 'temperature': 0.7},
        timeout=60,
    )
    response.raise_for_status()
    return response.json()


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python scripts/gemma_local.py "Your prompt here"')
        sys.exit(1)

    prompt = ' '.join(sys.argv[1:])
    output = ask_gemma(prompt)
    print(output)
