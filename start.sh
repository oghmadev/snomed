#!/usr/bin/env bash

function set_env {
  export USER_ID=$(id -u)
  export GROUP_ID=$(id -g)
  export ROOT_CONTEXT=${PWD}
}

function check_network {
  echo "Checking if shared network exists..."
  local BACKEND_NETWORK_ID=$(docker network ls -f name=tuatha-de-danann -q)

  if [[ -z "$BACKEND_NETWORK_ID" ]]; then
    echo "Network not found! Network will be created..."
    docker network create tuatha-de-danann
  else
    echo "Network already exists! Skipping creation."
  fi
}

function update {
  set_env
  echo "Building docker image..."
  docker-compose -f docker/development/docker-compose.yml build
  echo "Updating node dependencies..."
  docker run --rm --user "${USER_ID}:${GROUP_ID}" -v "${ROOT_CONTEXT}:/usr/app/snomed" snomed_api:development npm install
}

function build {
  set_env
  docker run --rm --user "${USER_ID}:${GROUP_ID}" -v "${ROOT_CONTEXT}:/usr/app/snomed" snomed_api:development gulp build
}

function print_usage {
  echo "Usage: $0 [-i] [-b] [-u] [-s] [-d]"
  echo "  -i Do initial configuration"
  echo "  -b Build the project"
  echo "  -u Update node image and dependencies"
  echo "  -s Start application"
  echo "  -d Stop application and delete containers"
}

if [[ $# -eq 0 ]]; then
  print_usage
  exit 1
fi

while getopts "ibusdh" OPT; do
  case "$OPT" in
    i) check_network; update;;
    b) build;;
    u) update;;
    s) set_env; docker-compose -f docker/development/docker-compose.yml up;;
    d) set_env; docker-compose -f docker/development/docker-compose.yml down;;
    h) print_usage; exit 0;;
  esac
done
