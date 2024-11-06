#!/bin/bash

set -e

IMAGE_NAME="35.232.89.185/root/projectt"
if docker images | grep -q "$IMAGE_NAME"; then
    echo "Test 1: Docker image '$IMAGE_NAME' exists."
else
    echo "Test 1: Docker image '$IMAGE_NAME' not found!"
    exit 1
fi

CONTAINER_NAME="proj11"
if docker ps | grep -q "$CONTAINER_NAME"; then
    echo "Test 2: Docker container '$CONTAINER_NAME' is running."
else
    echo "Test 2: Docker container '$CONTAINER_NAME' is not running!"
    exit 1
fi

PORT=3000
if curl -s http://localhost:$PORT > /dev/null; then
    echo "Test 3: Application is running and responding on port $PORT."
else
    echo "Test 3: Application is not responding on port $PORT!"
    exit 1
fi

echo "All tests passed successfully!"
