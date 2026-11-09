#!/bin/bash
#
# mp4-to-webm.sh
#
# Batch-converts all .mp4 files in a folder to .webm (VP9 + Opus).
#
# Usage:
#   ./mp4-to-webm.sh <input-folder> [output-folder]
#
# Examples:
#   ./mp4-to-webm.sh ./assets/videos
#   ./mp4-to-webm.sh ./assets/videos ./assets/videos/webm
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
mp4_files=("$INPUT_DIR"/*.mp4)

if [ ${#mp4_files[@]} -eq 0 ]; then
  echo "No .mp4 files found in $INPUT_DIR"
  exit 0
fi

echo "Converting ${#mp4_files[@]} file(s) from $INPUT_DIR -> $OUTPUT_DIR"
echo ""

for mp4 in "${mp4_files[@]}"; do
  filename=$(basename "$mp4" .mp4)
  output="$OUTPUT_DIR/$filename.webm"

  echo "→ $filename.mp4"

  ffmpeg -y -i "$mp4" \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -c:a libopus \
    -loglevel error \
    "$output"

  echo "  done: $output"
done

echo ""
echo "All conversions complete."