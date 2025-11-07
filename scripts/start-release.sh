#!/usr/bin/env bash

# Author: @ralfhandl

# Run this script from the root of the repo. It is designed to be run manually in the main branch.

if [[ ! $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Usage: $0 <nextVersion>"
  echo "Example: $0 1.1.1"
  exit 1
fi

nextVersion=$1
minor=$(echo $nextVersion | cut -d. -f1,2)
nextPatch=$(echo $nextVersion | cut -d. -f3)

# Find last published spec version for this minor version
lastSpec=$(ls -1 versions/*.md | grep -E "/$minor\.[0-9].md" | tail -1)

if [ -z "$lastSpec" ]; then
  # Find last published spec version
  lastSpec=$(ls -1 versions/*.md | grep -E "/.+\.[0-9].md" | tail -1)
  releaseType="Release"
else
  lastPatch=$(basename "$lastSpec" ".md" | cut --delimiter=. --fields=3)
  releaseType="Patch release"
fi

if [ -z "$lastSpec" ]; then
  echo "Could not find any published specification version"
  exit 1
fi

lastVersion=$(basename "$lastSpec" ".md")
echo === Initialize src/oas.md for $nextVersion from $lastVersion

# Create PR branch from development branch
branch=$(git branch --show-current)
prBranch="start-$nextVersion"
if ! git checkout -b "$prBranch"; then
  echo "=== Failed: PR branch $prBranch already exists locally, please delete it and try again"
  exit 1  
fi

# create dev version of spec from last published spec
temp=$(mktemp)

# bump version headline, add line to history table
historyTableHeader="\n| Version | Date | Notes |\n| ---- | ---- | ---- |\n"
sed -z -e "s/\n## Version $lastVersion\n/\n## Version $nextVersion\n/" \
    -z -e "s/$historyTableHeader/$historyTableHeader| $nextVersion | TBD | $releaseType of the Overlay Specification $nextVersion |\n/" \
    "$lastSpec" > versions/$nextVersion-dev.md

git add versions/$nextVersion-dev.md
git commit -m "initialize $nextVersion from $lastVersion"

echo === Initialized versions/$nextVersion-dev.md 

# when starting a new major or minor version
if [ "$nextPatch" == "0" ]; then
  lastMinor=$(echo "$lastVersion" | cut -d . -f 1,2)

  echo === Initialize schemas for new version $minor
  cp -r "schemas/v$lastMinor" "schemas/v$minor-dev"

  minorRegex=$(echo "$minor" | sed 's/\./\\\\\\./')
  lastMinorRegex=$(echo "$lastMinor" | sed 's/\./\\\\\\./')

  for file in schemas/v$minor-dev/*.yaml; do
    sed -e "s/$lastMinor/$minor/g" \
        -e "s/\^$lastMinorRegex\\\./\^$minorRegex\\\./g" \
        "$file" > "$temp"
    mv -f "$temp" "$file"
  done

  for file in schemas/v$minor-dev/*.md; do
    sed -e "s/$lastMinor/$minor/g" \
        "$file" > "$temp"
    mv -f "$temp" "$file"
  done

  echo === Initialize tests for new version $minor
  cp -r "tests/v$lastMinor" "tests/v$minor-dev"

  for file in tests/v$minor-dev/{pass,fail}/*.yaml; do
    sed -e "s/$lastMinor/$minor/g" "$file" > "$temp"
    mv -f "$temp" "$file"
  done

  git add schemas/v$minor-dev tests/v$minor-dev
  git commit -m "adjust schemas, test script, and test data"

  echo === Adjusted schemas and tests
fi

# Clean up
git switch "$branch"
echo === Done
