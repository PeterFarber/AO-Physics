#include "World.h"
#include "Helpers.h"

namespace AOP
{

    void World::CreateWorld()
    {
        world_state.Init();
        cout << "World created" << endl;
    }

    void World::DestroyWorld()
    {
        world_state.Destroy();
        cout << "World destroyed" << endl;
    }

    void World::UpdateWorld(int steps, double deltaTime)
    {
        // // Optional step: Before starting the physics simulation you can optimize the broad phase. This improves collision detection performance (it's pointless here because we only have 2 bodies).
        // // You should definitely not call this every frame or when e.g. streaming in a new level section as it is an expensive operation.
        // // Instead insert all new objects in batches instead of 1 at a time to keep the broad phase efficient.
        world_state.physics_system->OptimizeBroadPhase();

        while (steps > 0)
        {

            // If you take larger steps than 1 / 60th of a second you need to do multiple collision steps in order to keep the simulation stable. Do 1 collision step per 1 / 60th of a second (round up).
            const int cCollisionSteps = 1;

            world_state.physics_system->Update(deltaTime, cCollisionSteps, world_state.temp_allocator, world_state.job_system);

            steps--;
        }
        cout << "World updated" << endl;
    }

    json World::GetWorldState()
    {
        json world_state_json;

        world_state_json["bodies"] = json::array();
        BodyIDVector bodies;
        world_state.physics_system->GetBodies(bodies);
        for (BodyID body_id : bodies)
        {

            const char *shape_type = Helpers::GetShapeType(world_state.body_interface->GetShape(body_id)->GetSubType());
            const char *motion_type = Helpers::GetMotionType(world_state.body_interface->GetMotionType(body_id));

            RVec3 position = world_state.body_interface->GetCenterOfMassPosition(body_id);
            Vec3 size = world_state.body_interface->GetShape(body_id)->GetLocalBounds().GetSize();
            Quat rotation = world_state.body_interface->GetRotation(body_id);
            double radius = size.GetX() * 0.5f;
            double height = size.GetY();

            world_state_json["bodies"].push_back({{"id", body_id.GetIndexAndSequenceNumber()},
                                                  {"position", {position.GetX(), position.GetY(), position.GetZ()}},
                                                  {"rotation", {rotation.GetX(), rotation.GetY(), rotation.GetZ(), rotation.GetW()}},
                                                  {"size", {size.GetX(), size.GetY(), size.GetZ()}},
                                                  {"radius", radius},
                                                  {"height", height},
                                                  {"motion_type", motion_type},
                                                  {"shape", shape_type}});
        }

        return world_state_json;
    }

    
    uint32 World::CreateFloor(BoxParams params)
    {
        Vec3 size = params.GetSize();
        size *= 0.5f;

        BoxShapeSettings box_shape_settings(size);
        box_shape_settings.SetEmbedded(); // A ref counted object on the stack (base class RefTarget) should be marked as such to prevent it from being freed when its reference count goes to 0.

        ShapeSettings::ShapeResult box_shape_result = box_shape_settings.Create();
        ShapeRefC box_shape = box_shape_result.Get(); // We don't expect an error here, but you can check floor_shape_result for HasError() / GetError()

        BodyCreationSettings body_settings(box_shape, params.GetPosition(), Quat::sIdentity(), EMotionType::Static, Layers::NON_MOVING);

        // Create the actual rigid body
        Body *body = world_state.body_interface->CreateBody(body_settings); // Note that if we run out of bodies this can return nullptr
        BodyID body_id = body->GetID();

        // Add it to the world
        world_state.body_interface->AddBody(body_id, EActivation::DontActivate);

        return body_id.GetIndexAndSequenceNumber();
    }


    uint32 World::CreateSphere(SphereParams params)
    {
        BodyCreationSettings body_settings(new SphereShape(params.GetRadius()), params.GetPosition(), Quat::sIdentity(), params.GetMotionType(), params.GetLayer());
        // sphere_settings.mMotionQuality = EMotionQuality::LinearCast;
        // sphere_settings.mEnhancedInternalEdgeRemoval = true;
        // sphere_settings.mAllowSleeping = false;

        BodyID body_id = world_state.body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

        return body_id.GetIndexAndSequenceNumber();
    }

    uint32 World::CreateBox(BoxParams params)
    {
        Vec3 size = params.GetSize() * 0.5f;
        BodyCreationSettings body_settings(new BoxShape(size), params.GetPosition(), Quat::sIdentity(), params.GetMotionType(), params.GetLayer());
        // box_settings.mMotionQuality = EMotionQuality::LinearCast;
        // box_settings.mEnhancedInternalEdgeRemoval = true;
        // box_settings.mAllowSleeping = false;

        BodyID body_id = world_state.body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

        return body_id.GetIndexAndSequenceNumber();
    }

    uint32 World::CreateCapsule(CapsuleParams params)
    {
        float height = params.GetHeight();
        float radius = params.GetRadius();
        BodyCreationSettings body_settings(new CapsuleShape((height * 0.5f) - (radius), radius), params.GetPosition(), Quat::sIdentity(), params.GetMotionType(), params.GetLayer());
        // capsule_settings.mMotionQuality = EMotionQuality::LinearCast;
        // capsule_settings.mEnhancedInternalEdgeRemoval = true;
        // capsule_settings.mAllowSleeping = false;

        BodyID body_id = world_state.body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

        return body_id.GetIndexAndSequenceNumber();
    }

    // Create Cylinder Shape
    uint32 World::CreateCylinder(CylinderParams params)
    {
        float height = params.GetHeight();
        float radius = params.GetRadius();
        BodyCreationSettings body_settings(new CylinderShape(height, radius), params.GetPosition(), Quat::sIdentity(), params.GetMotionType(), params.GetLayer());
        // cylinder_settings.mMotionQuality = EMotionQuality::LinearCast;
        // cylinder_settings.mEnhancedInternalEdgeRemoval = true;
        // cylinder_settings.mAllowSleeping = false;

        BodyID body_id = world_state.body_interface->CreateAndAddBody(body_settings, EActivation::Activate);

        return body_id.GetIndexAndSequenceNumber();
    }


    // void World::ScaleBody(ModParams params)
    // {
    //     BodyID body_id_obj(params.GetBodyID());
    // }

    void World::SetLinearVelocity(ModParams params)
    {
        BodyID body_id_obj(params.GetBodyID());
        world_state.body_interface->SetLinearVelocity(body_id_obj, params.GetVelocity());
    }

}