#!/usr/bin/env bash

# Create extensions
psql -f sql/create_extensions.sql

# Create indexes
psql -f sql/create_indexes.sql

# Load database from data files
for data_file in /init/data/sct2_Concept*.txt; do
  psql -c "COPY \"Concept\" (\"id\", \"effectiveTime\", \"active\", \"moduleId\", \"definitionStatusId\") FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER E'\t');" < $data_file
done

for data_file in /init/data/sct2_Description*.txt; do
  psql -c "COPY \"Description\" (\"id\", \"effectiveTime\", \"active\", \"moduleId\", \"conceptId\", \"languageCode\", \"typeId\", \"term\", \"caseSignificanceId\") FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER E'\t');" < $data_file
done

for data_file in /init/data/sct2_Relationship*.txt; do
  psql -c "COPY \"Relationship\" (\"id\", \"effectiveTime\", \"active\", \"moduleId\", \"sourceId\", \"destinationId\", \"relationshipGroup\", \"typeId\", \"characteristicTypeId\", \"modifierId\") FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER E'\t');" < $data_file
done

for data_file in /init/data/sct2_TransitiveClosure*.txt; do
  psql -c "COPY \"TransitiveClosure\" (\"subtypeId\", \"supertypeId\") FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER E'\t');" < $data_file
done

