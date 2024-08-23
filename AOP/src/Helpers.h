#ifndef AOP_HELPERS_H
#define AOP_HELPERS_H

#include "Core/Core.h"
#include "Core/Layers.h"

#include "Jolt/Physics/Collision/Shape/Shape.h"
#include "Jolt/Physics/PhysicsSystem.h"
#include "Jolt/Physics/Body/BodyCreationSettings.h"


namespace Helpers
{
    static EMotionType GetMotionType(std::string motion)
    {
        if (motion == "Dynamic")
        {
            return EMotionType::Dynamic;
        }
        else if (motion == "Static")
        {
            return EMotionType::Static;
        }
        else if (motion == "Kinematic")
        {
            return EMotionType::Kinematic;
        }
        else
        {
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

    static Body * GetBody(PhysicsSystem *physicsSystem, BodyID body_id)
    {
        printf("GetBody\n");
        printf("BodyID: %d\n", body_id.GetIndexAndSequenceNumber());
        Body *body = nullptr;
        BodyLockWrite body_lock(physicsSystem->GetBodyLockInterface(), body_id);
        if(body_lock.Succeeded())
        {
            body = &body_lock.GetBody();
            body_lock.ReleaseLock();
        }

        delete &body_lock;
        return body;
    }

    static EConstraintSubType GetConstraintSubType(std::string type)
    {
        if(type == "Fixed")
        {
            return EConstraintSubType::Fixed;
        }
        else if(type == "Point")
        {
            return EConstraintSubType::Point;
        }
        else if(type == "Hinge")
        {
            return EConstraintSubType::Hinge;
        }
        else if(type == "Slider")
        {
            return EConstraintSubType::Slider;
        }
        else if(type == "Distance")
        {
            return EConstraintSubType::Distance;
        }
        else if(type == "Cone")
        {
            return EConstraintSubType::Cone;
        }
        else if(type == "SwingTwist")
        {
            return EConstraintSubType::SwingTwist;
        }
        else if(type == "SixDOF")
        {
            return EConstraintSubType::SixDOF;
        }
        else if(type == "Path")
        {
            return EConstraintSubType::Path;
        }
        else if(type == "Vehicle")
        {
            return EConstraintSubType::Vehicle;
        }
        else if(type == "RackAndPinion")
        {
            return EConstraintSubType::RackAndPinion;
        }
        else if(type == "Gear")
        {
            return EConstraintSubType::Gear;
        }
        else if(type == "Pulley")
        {
            return EConstraintSubType::Pulley;
        }
        else
        {
            return EConstraintSubType::Fixed;
        }
    }

    static EConstraintSpace GetConstraintSpace(std::string space)
    {
        if(space == "WorldSpace")
        {
            return EConstraintSpace::WorldSpace;
        }
        else
        {
            return EConstraintSpace::LocalToBodyCOM;
        }
    }

    static EActivation GetActivation(bool activate)
    {
        if(activate)
        {
            return EActivation::Activate;
        }
        else
        {
            return EActivation::DontActivate;
        }
    }

    static EShapeSubType GetShapeSubType(std::string type)
    {
        if(type == "Sphere")
        {
            return EShapeSubType::Sphere;
        }
        else if(type == "Box")
        {
            return EShapeSubType::Box;
        }
        else if(type == "Triangle")
        {
            return EShapeSubType::Triangle;
        }
        else if(type == "Capsule")
        {
            return EShapeSubType::Capsule;
        }
        else if(type == "TaperedCapsule")
        {
            return EShapeSubType::TaperedCapsule;
        }
        else if(type == "Cylinder")
        {
            return EShapeSubType::Cylinder;
        }
        else if(type == "ConvexHull")
        {
            return EShapeSubType::ConvexHull;
        }
        else
        {
            return EShapeSubType::Box;
        }
    }
}

#endif