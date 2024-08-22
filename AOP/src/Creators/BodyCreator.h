#ifndef AOP_BODY_CREATOR_H
#define AOP_BODY_CREATOR_H

#include "../Core/Core.h"
#include "../Params.h"

namespace AOP
{
    namespace BodyCreator
    {
        static uint32 CreateFloor(BodyParams params)
        {
            Vec3 size = params.GetSize();
            size *= 0.5f;

            BoxShapeSettings box_shape_settings(size);
            box_shape_settings.SetEmbedded(); // A ref counted object on the stack (base class RefTarget) should be marked as such to prevent it from being freed when its reference count goes to 0.

            ShapeSettings::ShapeResult box_shape_result = box_shape_settings.Create();
            ShapeRefC box_shape = box_shape_result.Get(); // We don't expect an error here, but you can check floor_shape_result for HasError() / GetError()

            BodyCreationSettings body_settings(box_shape, params.GetPosition(), params.GetRotation(), EMotionType::Static, Layers::NON_MOVING);

            // Create the actual rigid body
            Body *body = AOP::WorldState::GetInstance()->body_interface->CreateBody(body_settings); // Note that if we run out of bodies this can return nullptr
            BodyID body_id = body->GetID();

            // Add it to the world
            AOP::WorldState::GetInstance()->body_interface->AddBody(body_id, EActivation::DontActivate);

            return body_id.GetIndexAndSequenceNumber();
        }

        static uint32 CreateSphere(BodyParams params)
        {
            BodyCreationSettings body_settings(new SphereShape(params.GetRadius()), params.GetPosition(), params.GetRotation(), params.GetMotionType(), params.GetLayer());
            body_settings.mEnhancedInternalEdgeRemoval = params.GetEnhancedInternalEdgeRemoval();
            body_settings.mAllowSleeping = params.GetAllowSleeping();

            body_settings.mFriction = params.GetFriction();
            body_settings.mRestitution = params.GetRestitution();
            body_settings.mLinearDamping = params.GetLinearDamping();
            body_settings.mAngularDamping = params.GetAngularDamping();
            body_settings.mMaxLinearVelocity = params.GetMaxLinearVelocity();
            body_settings.mMaxAngularVelocity = params.GetMaxAngularVelocity();
            body_settings.mGravityFactor = params.GetGravityFactor();

            BodyID body_id = AOP::WorldState::GetInstance()->body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

            return body_id.GetIndexAndSequenceNumber();
        }

        static uint32 CreateBox(BodyParams params)
        {
            Vec3 size = params.GetSize() * 0.5f;
            BodyCreationSettings body_settings(new BoxShape(size), params.GetPosition(), params.GetRotation(), params.GetMotionType(), params.GetLayer());

            body_settings.mEnhancedInternalEdgeRemoval = params.GetEnhancedInternalEdgeRemoval();
            body_settings.mAllowSleeping = params.GetAllowSleeping();

            body_settings.mFriction = params.GetFriction();
            body_settings.mRestitution = params.GetRestitution();
            body_settings.mLinearDamping = params.GetLinearDamping();
            body_settings.mAngularDamping = params.GetAngularDamping();
            body_settings.mMaxLinearVelocity = params.GetMaxLinearVelocity();
            body_settings.mMaxAngularVelocity = params.GetMaxAngularVelocity();
            body_settings.mGravityFactor = params.GetGravityFactor();
            BodyID body_id = AOP::WorldState::GetInstance()->body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

            return body_id.GetIndexAndSequenceNumber();
        }

        static uint32 CreateCapsule(BodyParams params)
        {
            float height = params.GetHeight();
            float radius = params.GetRadius();
            BodyCreationSettings body_settings(new CapsuleShape((height * 0.5f) - (radius), radius), params.GetPosition(), params.GetRotation(), params.GetMotionType(), params.GetLayer());

            body_settings.mEnhancedInternalEdgeRemoval = params.GetEnhancedInternalEdgeRemoval();
            body_settings.mAllowSleeping = params.GetAllowSleeping();

            body_settings.mFriction = params.GetFriction();
            body_settings.mRestitution = params.GetRestitution();
            body_settings.mLinearDamping = params.GetLinearDamping();
            body_settings.mAngularDamping = params.GetAngularDamping();
            body_settings.mMaxLinearVelocity = params.GetMaxLinearVelocity();
            body_settings.mMaxAngularVelocity = params.GetMaxAngularVelocity();
            body_settings.mGravityFactor = params.GetGravityFactor();
            BodyID body_id = AOP::WorldState::GetInstance()->body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

            return body_id.GetIndexAndSequenceNumber();
        }

        // Create Cylinder Shape
        static uint32 CreateCylinder(BodyParams params)
        {
            float height = params.GetHeight();
            float radius = params.GetRadius();
            BodyCreationSettings body_settings(new CylinderShape((height * 0.5f), radius), params.GetPosition(), params.GetRotation(), params.GetMotionType(), params.GetLayer());

            body_settings.mEnhancedInternalEdgeRemoval = params.GetEnhancedInternalEdgeRemoval();
            body_settings.mAllowSleeping = params.GetAllowSleeping();

            body_settings.mFriction = params.GetFriction();
            body_settings.mRestitution = params.GetRestitution();
            body_settings.mLinearDamping = params.GetLinearDamping();
            body_settings.mAngularDamping = params.GetAngularDamping();
            body_settings.mMaxLinearVelocity = params.GetMaxLinearVelocity();
            body_settings.mMaxAngularVelocity = params.GetMaxAngularVelocity();
            body_settings.mGravityFactor = params.GetGravityFactor();
            BodyID body_id = AOP::WorldState::GetInstance()->body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

            return body_id.GetIndexAndSequenceNumber();
        }

    };
}

#endif