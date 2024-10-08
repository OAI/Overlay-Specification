#!/bin/bash

# Author: @ralfhandl (inspired by the work of @MikeRalphson)

# run this script from the root of the repo. It is designed to be run by a GitHub workflow.
# It contains bashisms

mkdir -p deploy/overlay
mkdir -p deploy/js

cd scripts/md2html
mkdir -p history
cp ../../EDITORS.md history/EDITORS_v1.0.0.md

# temporarily copy installed version of respec into build directory
cp -p ../../node_modules/respec/builds/respec-w3c.* ../../deploy/js/

latest=1.0.0
latestCopied=none
for filename in ../../versions/*.md ; do
  version=$(basename "$filename" .md)
  tempfile=../../deploy/overlay/v$version-tmp.html
  echo -e "\n=== v$version ==="
  node md2html.js --maintainers ./history/EDITORS_v$version.md ${filename} > $tempfile
  npx respec --use-local --src $tempfile --out ../../deploy/overlay/v$version.html
  rm $tempfile
  if [ $version = $latest ]; then
    if [[ ${version} != *"rc"* ]];then
      # version is not a Release Candidate
      cp -p ../../deploy/overlay/v$version.html ../../deploy/overlay/latest.html
      latestCopied=v$version
    fi
  fi
done
echo Latest tag is $latest, copied $latestCopied to latest.html

# clean up build directory
rm ../../deploy/js/respec-w3c.*
