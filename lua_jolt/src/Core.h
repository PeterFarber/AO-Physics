#ifndef AOP_CORE_H
#define AOP_CORE_H

#include "Jolt.h"
#include "Jolt/RegisterTypes.h"
#include "Jolt/Core/Factory.h"
#include "Jolt/Core/TempAllocator.h"
#include "Jolt/Core/JobSystemThreadPool.h"
#include "Jolt/Core/JobSystemSingleThreaded.h"
#include "Jolt/Physics/PhysicsSettings.h"
#include "Jolt/Physics/PhysicsSystem.h"
#include "Jolt/Physics/Collision/Shape/BoxShape.h"
#include "Jolt/Physics/Collision/Shape/SphereShape.h"
#include "Jolt/Physics/Collision/Shape/CapsuleShape.h"
#include "Jolt/Physics/Collision/Shape/CylinderShape.h"
#include "Jolt/Physics/Body/BodyCreationSettings.h"
#include "Jolt/Physics/Body/BodyActivationListener.h"
#include <iostream>

#include "../vendors/json.hpp"

using json = nlohmann::json;

using namespace JPH;
using namespace JPH::literals;
using namespace std;

#define JPH_DOUBLE_PRECISION 1


// Disable common warnings triggered by Jolt, you can use JPH_SUPPRESS_WARNING_PUSH / JPH_SUPPRESS_WARNING_POP to store and restore the warning state
// JPH_SUPPRESS_WARNINGS




#endif // LUA_JOLT_CORE_H