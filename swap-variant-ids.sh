#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# swap-variant-ids.sh
# Run this once you have real Lemon Squeezy variant IDs from the dashboard.
#
# Usage:
#   chmod +x swap-variant-ids.sh
#   ./swap-variant-ids.sh <BASIC_ID> <PRO_ID> <ELITE_ID>
#
# Example:
#   ./swap-variant-ids.sh abc123 def456 ghi789
# ─────────────────────────────────────────────────────────────────────────────

set -e

BASIC_ID="$1"
PRO_ID="$2"
ELITE_ID="$3"

if [ -z "$BASIC_ID" ] || [ -z "$PRO_ID" ] || [ -z "$ELITE_ID" ]; then
  echo "Usage: $0 <BASIC_VARIANT_ID> <PRO_VARIANT_ID> <ELITE_VARIANT_ID>"
  echo ""
  echo "Find variant IDs in the Lemon Squeezy dashboard:"
  echo "  Products → click a product → Variants tab → copy the ID from the URL"
  echo "  Or get them from the 'Share' button checkout URL (the part after /buy/)"
  exit 1
fi

FILES=("index.html" "store.html")

echo "Swapping placeholder IDs..."
echo "  BASIC  → $BASIC_ID"
echo "  PRO    → $PRO_ID"
echo "  ELITE  → $ELITE_ID"
echo ""

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    sed -i \
      -e "s|PRODUCT_ID_BASIC|${BASIC_ID}|g" \
      -e "s|PRODUCT_ID_PRO|${PRO_ID}|g" \
      -e "s|PRODUCT_ID_ELITE|${ELITE_ID}|g" \
      "$FILE"
    echo "  ✓ Updated $FILE"
  else
    echo "  ! Skipped $FILE (not found)"
  fi
done

echo ""
echo "Verifying — remaining placeholders:"
grep -n "PRODUCT_ID" index.html store.html 2>/dev/null || echo "  None — all IDs wired up!"

echo ""
echo "Next: git add index.html store.html && git commit -m 'Wire up real Lemon Squeezy variant IDs' && git push"
