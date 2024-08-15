#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

JOLT_DIR="${SCRIPT_DIR}/jolt"
LUA_JOLT_DIR="${SCRIPT_DIR}/lua_jolt"
PROCESS_DIR="${SCRIPT_DIR}/aos/process"
LIBS_DIR="${PROCESS_DIR}/libs"

AO_IMAGE="aomerge:latest"

# EMXX_CFLAGS=" -s EXPORT_ALL=1 -s EXPORT_ES6=1 -Wno-unused-command-line-argument -Wno-experimental /lua-5.3.4/src/liblua.a -I/lua-5.3.4/src"
EMXX_CFLAGS="/lua-5.3.4/src/liblua.a -I/lua-5.3.4/src -I/jolt/ -I/jolt/Jolt -s SUPPORT_LONGJMP=1"

# Clone jolt if it doesn't exist
rm -rf ${JOLT_DIR}
if [ ! -d "${JOLT_DIR}" ]; then \
	git clone https://github.com/jrouwe/JoltPhysics.git ${JOLT_DIR}; \
	cp ${SCRIPT_DIR}/inject/CMakeLists.txt ${JOLT_DIR}/CMakeLists.txt; \
fi
cd ..

# Build jolt into a static library with emscripten
docker run -v ${JOLT_DIR}:/jolt --platform linux/amd64 ${AO_IMAGE}  sh -c \
		"cd /jolt && emcmake cmake -S . -B ."

docker run -v ${JOLT_DIR}:/jolt --platform linux/amd64  ${AO_IMAGE} sh -c \
		"cd /jolt && cmake --build ." 

# Fix permissions
sudo chmod -R 777 ${JOLT_DIR}


# Build lua jolt into a static library with emscripten
rm -rf ${LUA_JOLT_DIR}/build
docker run -v ${LUA_JOLT_DIR}:/lua_jolt -v ${JOLT_DIR}:/jolt --platform linux/amd64 ${AO_IMAGE}  sh -c \
		"cd /lua_jolt && mkdir build && cd build && emcmake cmake -DCMAKE_CXX_FLAGS='${EMXX_CFLAGS}' -S .. -B ."

docker run -v ${LUA_JOLT_DIR}:/lua_jolt -v ${JOLT_DIR}:/jolt --platform linux/amd64  ${AO_IMAGE} sh -c \
		"cd /lua_jolt/build && cmake --build ." 

# docker run -v ${LUA_JOLT_DIR}:/lua_jolt ${AO_IMAGE} sh -c \
# 		"cd /lua_jolt/build && emar rcs lJolt2.a lJolt.a"


# Fix permissions
sudo chmod -R 777 ${LUA_JOLT_DIR}


# # Build ljolt into a library with emscripten
# docker run -v ${LUA_JOLT_DIR}:/lua_jolt -v ${JOLT_DIR}:/jolt ${AO_IMAGE} sh -c \
# 		"cd /lua_jolt && emcc -s -c l_jolt.c -o l_jolt.o -I/usr/include/**/* /lua-5.3.4/src/liblua.a -I/lua-5.3.4/src -I/jolt/ /jolt/libJolt.a -I/jolt/Jolt && emar rcs l_jolt.a l_jolt.o && rm l_jolt.o"

# Fix permissions


# # Copy jolt to the libs directory
rm -rf ${LIBS_DIR}
mkdir -p $LIBS_DIR
cp ${JOLT_DIR}/libJolt.a $LIBS_DIR/libJolt.a
cp ${LUA_JOLT_DIR}/build/lJolt.a $LIBS_DIR/lJolt.a


# Copy config.yml to the process directory
cp ${SCRIPT_DIR}/config.yml ${PROCESS_DIR}/config.yml

# Build the process module
cd ${PROCESS_DIR} 
docker run -e DEBUG=1 --platform linux/amd64 -v ./:/src ${AO_IMAGE} ao-build-module

# # Copy the process module to the tests directory
cp ${PROCESS_DIR}/process.wasm ${SCRIPT_DIR}/tests/process.wasm
cp ${PROCESS_DIR}/process.js ${SCRIPT_DIR}/tests/process.js