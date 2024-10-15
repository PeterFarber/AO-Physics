#!/bin/bash

# =====================================
# Setup Paths and Variables
# =====================================
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
JOLT_DIR="${SCRIPT_DIR}/jolt"
AOP_DIR="${SCRIPT_DIR}/AOP"
PROCESS_DIR="${SCRIPT_DIR}/aos/process"
DIST_DIR="${SCRIPT_DIR}/dist"
LIBS_DIR="${DIST_DIR}/libs"
PROCESS_LIBS_DIR="${PROCESS_DIR}/libs"
TESTS_DIR="${SCRIPT_DIR}/tests"
TESTS_LOADER_DIR="${SCRIPT_DIR}/tests-loader"
INJECT_DIR="${SCRIPT_DIR}/inject"
CONFIG_FILE="${SCRIPT_DIR}/config.yml"

# Docker image and compiler flags
AO_IMAGE="p3rmaw3b/ao:0.1.3"
EMXX_CFLAGS="-I/lua-5.3.4-32/src -I/jolt/ -I/jolt/Jolt"

# File names
JOLT_REPO_URL="https://github.com/jrouwe/JoltPhysics.git"
JOLT_CMAKELIST="${INJECT_DIR}/CMakeLists.txt"
JOLT_LIB="libJolt.a"
AOP_LIB="libaop.a"
PROCESS_WASM="process.wasm"
PROCESS_JS="process.js"

# =====================================
# Clone Jolt Repository and Setup
# =====================================
# Clean and clone the Jolt repository
rm -rf "${JOLT_DIR}"
if [ ! -d "${JOLT_DIR}" ]; then
    git clone "${JOLT_REPO_URL}" "${JOLT_DIR}"
    cp "${JOLT_CMAKELIST}" "${JOLT_DIR}/CMakeLists.txt"
fi

# =====================================
# Build Jolt as a Static Library with Emscripten
# =====================================
docker run -v "${JOLT_DIR}:/jolt" --platform linux/amd64 "${AO_IMAGE}" sh -c \
    "cd /jolt && emcmake cmake -S . -B . && cmake --build . --parallel"
sudo chmod -R 777 "${JOLT_DIR}"  # Fix permissions

# =====================================
# Build Lua Jolt as a Static Library with Emscripten
# =====================================
# Clean AOP build directory
rm -rf "${AOP_DIR}/build"

# Build AOP
docker run -v "${AOP_DIR}:/AOP" -v "${JOLT_DIR}:/jolt" --platform linux/amd64 "${AO_IMAGE}" sh -c \
    "cd /AOP && mkdir build && cd build && emcmake cmake -DCMAKE_CXX_FLAGS='${EMXX_CFLAGS}' -S .. -B . && cmake --build . --parallel"
sudo chmod -R 777 "${AOP_DIR}"  # Fix permissions

# =====================================
# Prepare Dist Directory and Copy Libraries
# =====================================
# Clear and prepare dist and libs directories
rm -rf "${DIST_DIR}"
mkdir -p "${LIBS_DIR}"

# Copy libraries and Lua files
cp "${JOLT_DIR}/${JOLT_LIB}" "${LIBS_DIR}/${JOLT_LIB}"
cp "${AOP_DIR}/build/${AOP_LIB}" "${LIBS_DIR}/${AOP_LIB}"
cp -r "${AOP_DIR}/Lua/." "${DIST_DIR}/"
cp -r "${LIBS_DIR}" "${PROCESS_DIR}"

# Copy configuration and Lua files to process directory
cp "${CONFIG_FILE}" "${PROCESS_DIR}/config.yml"
cp -r "${AOP_DIR}/Lua/." "${PROCESS_DIR}/"

# =====================================
# Build the Process Module with Docker
# =====================================
cd "${PROCESS_DIR}"
docker run -e DEBUG=1 --platform linux/amd64 -v ./:/src "${AO_IMAGE}" ao-build-module

# =====================================
# Copy Process Module Output to Tests Directories
# =====================================
# Only copy if the tests directories exist
if [ -d "${TESTS_DIR}" ]; then
    cp "${PROCESS_DIR}/${PROCESS_WASM}" "${TESTS_DIR}/${PROCESS_WASM}"
    cp "${PROCESS_DIR}/${PROCESS_JS}" "${TESTS_DIR}/${PROCESS_JS}"
fi

if [ -d "${TESTS_LOADER_DIR}" ]; then
    cp "${PROCESS_DIR}/${PROCESS_WASM}" "${TESTS_LOADER_DIR}/${PROCESS_WASM}"
fi
