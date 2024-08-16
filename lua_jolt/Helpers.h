#ifndef LUA_JOLT_HELPERS_H
#define LUA_JOLT_HELPERS_H
#include "Core.h"

namespace Helpers
{
    static EMotionType GetMotionType(const char *motion)
    {
        switch (motion[0])
        {
        case 'D':
            return EMotionType::Dynamic;
            break;
        case 'S':
            return EMotionType::Static;
            break;
        case 'K':
            return EMotionType::Kinematic;
            break;
        default:
            return EMotionType::Dynamic;
        }
    }

    static JPH::ObjectLayer GetLayer(const char *layer)
    {
        if (strcmp(layer, "NON_MOVING") == 0)
        {
            return Layers::NON_MOVING;
        }
        else if (strcmp(layer, "MOVING") == 0)
        {
            return Layers::MOVING;
        }
        else
        {
            return Layers::NUM_LAYERS;
        }

    }

    static const char *GetShapeType(EShapeSubType type)
    {
        switch (type)
        {
        case EShapeSubType::Sphere:
            return "Sphere";
            break;
        case EShapeSubType::Box:
            return "Box";
            break;
        case EShapeSubType::Triangle:
            return "Triangle";
            break;
        case EShapeSubType::Capsule:
            return "Capsule";
            break;
        case EShapeSubType::TaperedCapsule:
            return "TaperedCapsule";
            break;
        case EShapeSubType::Cylinder:
            return "Cylinder";
            break;
        case EShapeSubType::ConvexHull:
            return "ConvexHull";
            break;
        default:
            return "Unknown";
            break;
        }
    }

    static const char *GetMotionType(EMotionType type)
    {
        switch (type)
        {
        case EMotionType::Dynamic:
            return "Dynamic";
            break;
        case EMotionType::Static:
            return "Static";
            break;
        case EMotionType::Kinematic:
            return "Kinematic";
            break;
        default:
            return "Unknown";
            break;
        }
    }
}

#endif