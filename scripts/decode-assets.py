#!/usr/bin/env python3
"""Decode text-encoded binary assets into icons/, fonts/, images/, and og-image.png."""
import base64
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src_root = root / "encoded-assets"
if not src_root.exists():
    print("No encoded-assets/ directory found.", file=sys.stderr)
    sys.exit(1)

count = 0
for src in sorted(src_root.rglob("*.b64")):
    rel = Path(str(src.relative_to(src_root))[:-4])  # strip .b64
    dest = root / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(base64.b64decode(src.read_text()))
    count += 1
    print("wrote", dest.relative_to(root))
print(f"decoded {count} files")
