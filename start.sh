#!/usr/bin/env bash

function set_env {
  export USER_ID=$(id -u)
  export GROUP_ID=$(id -g)
}

function check_network {
  echo "Checking if network backend exists..."
  local BACKEND_NETWORK_ID=$(docker network ls -f name=backend -q)

  if [[ -z "$BACKEND_NETWORK_ID" ]]; then
    echo "Network not found! Network will be created..."
    docker network create backend
  else
    echo "Network already exists! Skipping creation."
  fi
}

function update {
  set_env
  echo "Building docker image..."
  docker-compose build
  echo "Updating node dependencies..."
  docker run --rm --user "${USER_ID}:${GROUP_ID}" -v "${PWD}:/usr/app/snomed" snomed_app npm install
}

function print_usage {
  echo "Usage: $0 [-i] [-u] [-s]"
  echo "  -i Do initial configuration"
  echo "  -u Update node image and dependencies"
  echo "  -s Start application"
  echo "  -d Stop application and delete containers"
}

if [[ $# -eq 0 ]]; then
  print_usage
  exit 1
fi

while getopts "iusdh" OPT; do
  case "$OPT" in
    i) check_network; update;;
    u) update;;
    s) set_env; docker-compose up;;
    d) set_env; docker-compose down;;
    h) print_usage; exit 0;;
  esac
done
