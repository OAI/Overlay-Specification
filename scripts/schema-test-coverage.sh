#!/usr/bin/env bash

# Author: @ralfhandl

# Run this script from the root of the repo

echo
echo "Schema Test Coverage"
echo

rc=0

for schemaDir in schemas/v* ; do
  version=$(basename "$schemaDir")
  echo $version

  node scripts/schema-test-coverage.mjs $schemaDir/schema.yaml tests/$version/pass || rc=1

  echo
done

exit $rc
