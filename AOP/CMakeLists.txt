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

	src/Managers/AConstraintManager.cpp

	src/Types/Constraints/AConstraint.cpp
	src/Types/Constraints/AConeConstraint.cpp
	src/Types/Constraints/ADistanceConstraint.cpp
	src/Types/Constraints/AFixedConstraint.cpp
	src/Types/Constraints/AGearConstraint.cpp
	src/Types/Constraints/AHingeConstraint.cpp
	src/Types/Constraints/APointConstraint.cpp
	src/Types/Constraints/APulleyConstraint.cpp
	src/Types/Constraints/ASliderConstraint.cpp
	

	# src/Managers/ABodyManager.cpp
	# src/Managers/AConstraintManager.cpp
)


# Create Jolt lib
add_library(aop ${AOP_SRC_FILES})

target_compile_definitions(aop PRIVATE JPH_ENABLE_ASSERTS)
target_compile_definitions(aop PRIVATE JPH_CROSS_PLATFORM_DETERMINISTIC)
target_compile_definitions(aop PRIVATE JPH_OBJECT_LAYER_BITS=16)
target_compile_definitions(aop PRIVATE JPH_OBJECT_STREAM)


set_target_properties(aop PROPERTIES
	CXX_STANDARD 17
	CXX_STANDARD_REQUIRED ON
	CXX_EXTENSIONS OFF
)
