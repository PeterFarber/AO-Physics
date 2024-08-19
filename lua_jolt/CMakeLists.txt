cmake_minimum_required(VERSION 3.20 FATAL_ERROR)

project(LUA_JOLT CXX)
set(CMAKE_STATIC_LIBRARY_PREFIX "")



# Source files
set(LUA_JOLT_SRC_FILES
	l_jolt.cpp
	src/WorldState.cpp
	src/World.cpp
)


# Create Jolt lib
add_library(lJolt ${LUA_JOLT_SRC_FILES})

target_compile_definitions(lJolt PRIVATE JPH_ENABLE_ASSERTS)
target_compile_definitions(lJolt PRIVATE JPH_CROSS_PLATFORM_DETERMINISTIC)
target_compile_definitions(lJolt PRIVATE JPH_OBJECT_LAYER_BITS=16)
target_compile_definitions(lJolt PRIVATE JPH_OBJECT_STREAM)


set_target_properties(lJolt PROPERTIES
	CXX_STANDARD 17
	CXX_STANDARD_REQUIRED ON
	CXX_EXTENSIONS OFF
)
