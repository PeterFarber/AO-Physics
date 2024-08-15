cmake_minimum_required(VERSION 3.20 FATAL_ERROR)

project(LUA_JOLT CXX)
set(CMAKE_STATIC_LIBRARY_PREFIX "")

# Source files
set(LUA_JOLT_SRC_FILES
	l_jolt.cpp
)


# Create Jolt lib
add_library(lJolt ${LUA_JOLT_SRC_FILES})

set_target_properties(lJolt PROPERTIES
	CXX_STANDARD 17
	CXX_STANDARD_REQUIRED ON
	CXX_EXTENSIONS OFF
)
