#!/usr/bin/env python3
"""Baja HTML y screenshots de Stitch por REST sin volcar el contenido a contexto.

Uso:
  python3 download_assets.py <projectId> <outDir> fileId:salida.png fileId:salida.html ...

La API key se lee de STITCH_API_KEY en ~/.hermes/.env y nunca se imprime.
"""
import base64
import json
import os
import subprocess
import sys

ENV = os.path.expanduser("~/.hermes/.env")


def load_key():
    with open(ENV) as fh:
        for line in fh:
            if line.startswith("STITCH_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("STITCH_API_KEY no encontrado en " + ENV)


def main():
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    project, out = sys.argv[1], sys.argv[2]
    key = load_key()
    os.makedirs(out, exist_ok=True)
    for arg in sys.argv[3:]:
        fid, _, name = arg.partition(":")
        fid = fid.rsplit("/", 1)[-1]
        url = f"https://stitch.googleapis.com/v1/projects/{project}/files/{fid}:download"
        raw = subprocess.run(
            ["curl", "-s", "-H", f"X-Goog-Api-Key: {key}", url],
            capture_output=True, check=True,
        ).stdout
        data = json.loads(raw)
        payload = data.get("dataString") or data.get("image") or data.get("html") or ""
        if not payload:
            raise SystemExit(f"sin datos para {name}: {raw[:200]!r}")
        if name.endswith((".png", ".jpg", ".jpeg", ".webp")):
            blob = base64.b64decode(payload)
            with open(os.path.join(out, name), "wb") as fh:
                fh.write(blob)
            print(f"{name}: {len(blob)} bytes")
        else:
            text = payload
            if payload and not payload.lstrip().startswith("<"):
                text = base64.b64decode(payload).decode("utf-8")
            with open(os.path.join(out, name), "w", encoding="utf-8") as fh:
                fh.write(text)
            print(f"{name}: {len(text)} chars")


if __name__ == "__main__":
    main()
