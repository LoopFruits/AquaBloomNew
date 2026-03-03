#!/bin/bash
# ─────────────────────────────────────────────────
# AquaBloom Font Downloader
# Run this from the AquaBloom project root:
#   chmod +x scripts/download_fonts.sh && ./scripts/download_fonts.sh
# ─────────────────────────────────────────────────

FONT_DIR="assets/fonts"
mkdir -p "$FONT_DIR"

echo "🌸 AquaBloom Font Downloader"
echo ""

# Cormorant Garamond from GitHub (Google Fonts mirror)
BASE_CG="https://github.com/google/fonts/raw/main/ofl/cormorantgaramond"
CG_FONTS=(
  "CormorantGaramond-Light.ttf:Cormorant-Light.ttf"
  "CormorantGaramond-Regular.ttf:Cormorant-Regular.ttf"
  "CormorantGaramond-Medium.ttf:Cormorant-Medium.ttf"
  "CormorantGaramond-SemiBold.ttf:Cormorant-SemiBold.ttf"
)

echo "📥 Downloading Cormorant Garamond..."
for entry in "${CG_FONTS[@]}"; do
  SRC="${entry%%:*}"
  DST="${entry##*:}"
  echo "   → $DST"
  curl -sL "$BASE_CG/$SRC" -o "$FONT_DIR/$DST"
done

# Nunito from GitHub (Google Fonts mirror — static TTFs)
BASE_NU="https://github.com/google/fonts/raw/main/ofl/nunito/static"
NU_FONTS=(
  "Nunito-Light.ttf:Nunito-Light.ttf"
  "Nunito-Regular.ttf:Nunito-Regular.ttf"
  "Nunito-Medium.ttf:Nunito-Medium.ttf"
  "Nunito-SemiBold.ttf:Nunito-SemiBold.ttf"
  "Nunito-Bold.ttf:Nunito-Bold.ttf"
)

echo ""
echo "📥 Downloading Nunito..."
for entry in "${NU_FONTS[@]}"; do
  SRC="${entry%%:*}"
  DST="${entry##*:}"
  echo "   → $DST"
  curl -sL "$BASE_NU/$SRC" -o "$FONT_DIR/$DST"
done

echo ""

# Verify downloads
EXPECTED=9
FOUND=$(ls -1 "$FONT_DIR"/*.ttf 2>/dev/null | wc -l | tr -d ' ')

if [ "$FOUND" -eq "$EXPECTED" ]; then
  echo "✅ All $EXPECTED fonts downloaded successfully!"
  echo ""
  ls -la "$FONT_DIR"/*.ttf
else
  echo "⚠️  Expected $EXPECTED fonts but found $FOUND."
  echo "   Some downloads may have failed. Check your internet connection and try again."
  echo ""
  echo "   Manual download links:"
  echo "   • Cormorant Garamond: https://fonts.google.com/specimen/Cormorant+Garamond"
  echo "   • Nunito: https://fonts.google.com/specimen/Nunito"
  echo "   Download, extract, and place the .ttf files in $FONT_DIR/"
fi

echo ""
echo "🌸 Done! You can now run: npx expo start"
