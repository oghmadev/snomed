#!/usr/bin/env bash

TEMP_PATH="/tmp/relationship"
DATA_PATH="./bin/data/snomed"

echo "creating ${TEMP_PATH}.txt"

cp "${DATA_PATH}/sct2_Relationship_Snapshot_INT_20180131.txt" "${TEMP_PATH}.txt"
sed '1d' "${DATA_PATH}/sct2_Relationship_SpanishExtensionSnapshot_INT_20171031.txt" >> "${TEMP_PATH}.txt"

echo "parsing ${TEMP_PATH}.txt to JSON"

node --max-old-space-size=6144 ./bin/transitiveClosure.js "${TEMP_PATH}.txt" "${TEMP_PATH}.json"

echo "JSON parse complete. Parsing to TSV."

jq --raw-output '("subtypeId	supertypeId"), (.[] | [.subtypeId, .supertypeId] | @tsv)' "${TEMP_PATH}.json" | sed 's/\"//g' > "${DATA_PATH}/sct2_TransitiveClosureSnapshot_INT_20171031.txt"

echo "TSV parse complete. Deleting temp files"

rm "${TEMP_PATH}.txt" "${TEMP_PATH}.json"
