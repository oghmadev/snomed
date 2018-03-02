#!/usr/bin/env bash

function includes {
  local array="$1[@]"
  local seeking=${2}
  local in=1

  for element in ${!array}; do
    if [[ ${element} == ${seeking} ]]; then
      in=0
      break
    fi
  done

  return ${in}
}

BIN_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
FEATURE_FILE_PATH="$( echo ${BIN_PATH%bin*}data/features.toggles )"
IFS=',' read -r -a FEATURE_LIST <<< "$( jq -j 'keys[] as $k | "\($k),"' ${FEATURE_FILE_PATH} | sed 's/.$//' )"

if [ -z "$1" ]; then
  echo "No feature name specified" && exit 0
else
  !(includes FEATURE_LIST "$1") && echo "${1} is not a valid feature name" && exit 0
fi

if [ -z "$2" ]; then
  echo "No toggle value specified" && exit 0
else
  VALUES=(true false)

  !(includes VALUES "$2") && echo "${2} is not a valid toggle value" && exit 0
fi

FEATURE_TOGGLES="$( jq ".${1} = ${2}" ${FEATURE_FILE_PATH} )"

echo ${FEATURE_TOGGLES} > ${FEATURE_FILE_PATH}

curl -X GET http://localhost:9000/api/v0.0.1/features/source
