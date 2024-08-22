#ifndef AOP_WORLD_CREATOR_H
#define AOP_WORLD_CREATOR_H

#include "../Core/Core.h"
#include "../WorldState.h"
#include "../Params.h"

namespace AOP
{

    namespace WorldCreator
    {

        static void CreateWorld(WorldParams params)
        {
            AOP::WorldState::GetInstance()->Init(params);
        }

        static void DestroyWorld()
        {
            AOP::WorldState::GetInstance()->Destroy();
        }

        static void UpdateWorld(double deltaTime)
        {
            // // Optional step: Before starting the physics simulation you can optimize the broad phase. This improves collision detection performance (it's pointless here because we only have 2 bodies).
            // // You should definitely not call this every frame or when e.g. streaming in a new level section as it is an expensive operation.
            // // Instead insert all new objects in batches instead of 1 at a time to keep the broad phase efficient.
            AOP::WorldState::GetInstance()->physics_system->OptimizeBroadPhase();

            // If you take larger steps than 1 / 60th of a second you need to do multiple collision steps in order to keep the simulation stable. Do 1 collision step per 1 / 60th of a second (round up).
            const int cCollisionSteps = 1;

            AOP::WorldState::GetInstance()->physics_system->Update(deltaTime, cCollisionSteps, AOP::WorldState::GetInstance()->temp_allocator, AOP::WorldState::GetInstance()->job_system);
        }

        static json GetWorldState()
        {
            json world_state_json;

            world_state_json["bodies"] = json::array();
            BodyIDVector bodies;
            AOP::WorldState::GetInstance()->physics_system->GetBodies(bodies);
            for (BodyID body_id : bodies)
            {

                const char *shape_type = Helpers::GetShapeType(AOP::WorldState::GetInstance()->body_interface->GetShape(body_id)->GetSubType());
                const char *motion_type = Helpers::GetMotionType(AOP::WorldState::GetInstance()->body_interface->GetMotionType(body_id));

                RVec3 position = AOP::WorldState::GetInstance()->body_interface->GetCenterOfMassPosition(body_id);
                Vec3 size = AOP::WorldState::GetInstance()->body_interface->GetShape(body_id)->GetLocalBounds().GetSize();
                Quat rotation = AOP::WorldState::GetInstance()->body_interface->GetRotation(body_id);
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

            // Get all contraints
            world_state_json["constraints"] = json::array();

            Constraints constraints = AOP::WorldState::GetInstance()->physics_system->GetConstraints();

            for (Constraint *constraint : constraints)
            {

                // Get Contrain Settings
                ConstraintSettings *constraint_settings = constraint->GetConstraintSettings();

                switch (constraint->GetSubType())
                {
                case EConstraintSubType::Pulley:
                {
                    PulleyConstraint *pulley_constraint = static_cast<PulleyConstraint *>(constraint);
                    Body *body1 = pulley_constraint->GetBody1();
                    Body *body2 = pulley_constraint->GetBody2();
                    world_state_json["constraints"].push_back({{"type", "pulley"},
                                                               {"body1", body1->GetID().GetIndexAndSequenceNumber()},
                                                               {"body2", body2->GetID().GetIndexAndSequenceNumber()}});
                    break;
                }
                case EConstraintSubType::Fixed:
                {
                    FixedConstraint *fixed_constraint = static_cast<FixedConstraint *>(constraint);
                    Body *body1 = fixed_constraint->GetBody1();
                    Body *body2 = fixed_constraint->GetBody2();
                    world_state_json["constraints"].push_back({{"type", "fixed"},
                                                               {"body1", body1->GetID().GetIndexAndSequenceNumber()},
                                                               {"body2", body2->GetID().GetIndexAndSequenceNumber()}});
                    break;
                }
                case EConstraintSubType::Distance:
                {
                    DistanceConstraint *distance_constraint = static_cast<DistanceConstraint *>(constraint);
                    Body *body1 = distance_constraint->GetBody1();
                    Body *body2 = distance_constraint->GetBody2();
                    world_state_json["constraints"].push_back({{"type", "distance"},
                                                               {"body1", body1->GetID().GetIndexAndSequenceNumber()},
                                                               {"body2", body2->GetID().GetIndexAndSequenceNumber()}});
                    break;
                }

                default:
                    break;
                }
            }

            return world_state_json;
        }

        static void SetLinearVelocity(ModParams params)
        {
            BodyID body_id_obj(params.GetBodyID());
            AOP::WorldState::GetInstance()->body_interface->SetLinearVelocity(body_id_obj, params.GetVelocity());
        }

    };

}

#endif