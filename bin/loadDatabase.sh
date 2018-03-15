#!/usr/bin/env bash

POSTGRES_DB=${POSTGRES_DB:-snomed-dev}
POSTGRES_USER=${POSTGRES_USER:-snomed-dev}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-test}
SNOMED_DB_NETWORK=${SNOMED_DB_NETWORK:-snomed_default}
SNOMED_DB_CONTAINER_ID=$(docker ps -f name=snomed_database -q)

if [[ -z "$SNOMED_DB_CONTAINER_ID" ]]; then
  echo "SNOMED DB not running. Start it first before running this script"
  exit 1
fi

docker run -it --rm -w /init -v "${PWD}/init:/init" --network "$SNOMED_DB_NETWORK" -e PGHOST=snomed-db -e PGPORT=5432 -e PGDATABASE=${POSTGRES_DB} -e PGUSER=${POSTGRES_USER} -e PGPASSWORD=${POSTGRES_PASSWORD} postgres ./bootstrap.sh
