#!/bin/bash
# Installs the newest image from ~/Downloads as the site logo.
# Usage:  ./install-logo.sh            (grabs newest PNG in ~/Downloads)
#         ./install-logo.sh path.png   (uses the file you name)
set -euo pipefail
cd "$(dirname "$0")"

SRC="${1:-$(ls -t ~/Downloads/*.png ~/Downloads/*.PNG 2>/dev/null | head -1 || true)}"
if [ -z "$SRC" ] || [ ! -f "$SRC" ]; then
  echo "No image found. Download the logo to ~/Downloads, or pass a path:"
  echo "  ./install-logo.sh ~/Desktop/logo.png"
  exit 1
fi

echo "Source: $SRC"
mkdir -p public/logos
cp "$SRC" public/logos/sai-logo-raw.png
python3 scripts/trim-logo.py public/logos/sai-logo-raw.png public/logos/sai-logo.png
echo "Installed -> public/logos/sai-logo.png"
