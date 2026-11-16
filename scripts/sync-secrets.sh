#!/usr/bin/env bash
# Uploads secrets from one sectioned file to GitHub, one section per GitHub Environment.
#
#   scripts/sync-secrets.sh [file] [section ...]
#
#   file     defaults to secrets.env (gitignored; copy secrets.env.example)
#   section  optional filter, e.g. `scripts/sync-secrets.sh secrets.env qa` only uploads [qa]
#   DRY_RUN=1 prints what would be uploaded (names only) without calling GitHub
#
# File format:
#   [shared]  -> repository-level secrets (fallback for every environment)
#   [qa]      -> secrets of the GitHub Environment "qa" (created if missing)
#   KEY=value lines, no quotes, no spaces around "=". Lines starting with # and empty values are skipped.
#
# Requires the GitHub CLI (`gh auth login`) with admin rights on the repo.
set -euo pipefail

FILE="${1:-secrets.env}"
shift || true
ONLY=("$@")

[ -f "$FILE" ] || { echo "File not found: $FILE (copy secrets.env.example to secrets.env)" >&2; exit 1; }
if [ -z "${DRY_RUN:-}" ]; then
  command -v gh >/dev/null || { echo "GitHub CLI (gh) is required: https://cli.github.com" >&2; exit 1; }
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Split the file into one temp file per section
section=""
while IFS= read -r line || [ -n "$line" ]; do
  line="${line%$'\r'}"
  case "$line" in
    '' | '#'*) continue ;;
    '['*']')
      section="${line#[}"
      section="${section%]}"
      [[ "$section" =~ ^[A-Za-z0-9_-]+$ ]] || { echo "Invalid section name: [$section]" >&2; exit 1; }
      : > "$tmp/$section"
      continue
      ;;
  esac
  [ -n "$section" ] || { echo "Variable found before the first [section] header" >&2; exit 1; }
  [[ "$line" == *=?* ]] || continue # skip lines with an empty value
  printf '%s\n' "$line" >> "$tmp/$section"
done < "$FILE"

for f in "$tmp"/*; do
  [ -e "$f" ] || { echo "No sections found in $FILE" >&2; exit 1; }
  name="$(basename "$f")"
  if [ ${#ONLY[@]} -gt 0 ] && [[ ! " ${ONLY[*]} " == *" $name "* ]]; then continue; fi

  target="environment '$name'"
  [ "$name" = "shared" ] && target="repository (shared)"
  count="$(wc -l < "$f" | tr -d ' ')"
  echo "-> $target: $count secret(s): $(cut -d= -f1 "$f" | paste -sd, -)"

  [ -n "${DRY_RUN:-}" ] && continue
  if [ "$name" = "shared" ]; then
    gh secret set -f "$f"
  else
    gh api --method PUT "repos/{owner}/{repo}/environments/$name" --silent
    gh secret set -f "$f" --env "$name"
  fi
done
