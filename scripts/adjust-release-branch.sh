#!/usr/bin/env bash

# Author: @ralfhandl

# Run this script from the root of the repo. It is designed to be run manually in a release branch.

branch=$(git branch --show-current)
today=$(date +%Y-%m-%d)

if [[ ! $branch =~ ^v[0-9]+\.[0-9]+\.[0-9]+-rel$ ]]; then
  echo "This script is intended to be run from a release branch, e.g. v1.1.0-rel"
  exit 1
fi

vVersion=$(basename "$branch" "-rel")
version=${vVersion:1}
echo Prepare release of $version

# create snapshot of current editors
cp EDITORS.md versions/$version-editors.md

# "move" dev version of spec to release version - git will treat this as a rename
# Replace release date placeholder with current date - should only appear in the history table
sed "s/| TBD |/| $today |/g" versions/$version-dev.md > versions/$version.md
# show what changed in the spec - should only be the history table line for the current release
diff -Z versions/$version-dev.md versions/$version.md
# remove dev version of spec
rm versions/$version-dev.md

# rename schemas dev folder and tests folder if present
vMinor=$(echo $vVersion | cut -d. -f1,2)
if [ -d "schemas/$vMinor-dev" ]; then
  mv "schemas/$vMinor-dev" "schemas/$vMinor"
fi
if [ -d "tests/$vMinor-dev" ]; then
  mv "tests/$vMinor-dev" "tests/$vMinor"
fi
