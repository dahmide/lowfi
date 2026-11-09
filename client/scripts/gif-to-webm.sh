#!/bin/bash
#
# gif-to-webm.sh
#
# Batch-converts all .gif files in a folder to .webm (VP9, alpha-preserving).
#
# Usage:
#   ./gif-to-webm.sh <input-folder> [output-folder]
#
# Examples:
#   ./gif-to-webm.sh ./assets/scenes
#   ./gif-to-webm.sh ./assets/scenes ./assets/scenes/webm
#
# Requires ffmpeg installed and on PATH.

set -e

INPUT_DIR="$1"
OUTPUT_DIR="${2:-$INPUT_DIR}"

if [ -z "$INPUT_DIR" ]; then
  echo "Usage: $0 <input-folder> [output-folder]"
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "Error: ffmpeg is not installed or not on PATH."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob
gif_files=("$INPUT_DIR"/*.gif)

if [ ${#gif_files[@]} -eq 0 ]; then
  echo "No .gif files found in $INPUT_DIR"
  exit 0
fi

echo "Converting ${#gif_files[@]} file(s) from $INPUT_DIR -> $OUTPUT_DIR"
echo ""

for gif in "${gif_files[@]}"; do
  filename=$(basename "$gif" .gif)
  output="$OUTPUT_DIR/$filename.webm"

  echo "→ $filename.gif"

  ffmpeg -y -i "$gif" \
    -c:v libvpx-vp9 \
    -pix_fmt yuva420p \
    -crf 30 \
    -b:v 0 \
    -loglevel error \
    "$output"

  echo "  done: $output"
done

echo ""
echo "All conversions complete."