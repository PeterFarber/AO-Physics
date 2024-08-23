cmake_minimum_required(VERSION 3.20 FATAL_ERROR)

project(AOP CXX)

# Source files
set(AOP_SRC_FILES

	aop.cpp

	src/AWorld.cpp
	
	src/Types/ABody.cpp
	src/Managers/ABodyManager.cpp

	src/Types/ACharacter.cpp
	src/Managers/ACharacterManager.cpp


	src/Types/AConstraint.cpp
	src/Managers/AConstraintManager.cpp

	# src/Managers/ABodyManager.cpp
	# src/Managers/AConstraintManager.cpp
)


# Create Jolt lib
add_library(AOP ${AOP_SRC_FILES})

target_compile_definitions(AOP PRIVATE JPH_ENABLE_ASSERTS)
target_compile_definitions(AOP PRIVATE JPH_CROSS_PLATFORM_DETERMINISTIC)
target_compile_definitions(AOP PRIVATE JPH_OBJECT_LAYER_BITS=16)
target_compile_definitions(AOP PRIVATE JPH_OBJECT_STREAM)


set_target_properties(AOP PROPERTIES
	CXX_STANDARD 17
	CXX_STANDARD_REQUIRED ON
	CXX_EXTENSIONS OFF
)
