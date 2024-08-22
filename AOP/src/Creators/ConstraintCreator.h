#ifndef AOP_CONSTRAINT_CREATOR_H
#define AOP_CONSTRAINT_CREATOR_H

#include "../Core/Core.h"
#include "../Params.h"

namespace AOP
{
    namespace ConstraintCreator
    {

        static void AddContraint(ConstraintParams params)
        {

            Body *body1 = Helpers::GetBody(AOP::WorldState::GetInstance()->physics_system, params.GetBody1ID());
            Body *body2 = Helpers::GetBody(AOP::WorldState::GetInstance()->physics_system, params.GetBody2ID());

            if (body1 == nullptr || body2 == nullptr)
            {
                return;
            }

            // Declare and initialize constraint_settings with a default value
            TwoBodyConstraintSettings *constraint_settings = nullptr;

            // Vec3 body1_position = AOP::WorldState::GetInstance()->body_interface->GetCenterOfMassPosition(body1->GetID());
            // Vec3 body2_position = AOP::WorldState::GetInstance()->body_interface->GetCenterOfMassPosition(body2->GetID());

            printf("Constraint Type: %d\n", params.GetType());
            // Create a constraint based on the type
            switch (params.GetType())
            {
            case EConstraintSubType::Pulley:
            {
                PulleyConstraintSettings pulley_constraint_settings;
                pulley_constraint_settings.mBodyPoint1 = params.GetBodyPoint1();
                pulley_constraint_settings.mBodyPoint2 = params.GetBodyPoint2();
                pulley_constraint_settings.mFixedPoint1 = params.GetFixedPoint1();
                pulley_constraint_settings.mFixedPoint2 = params.GetFixedPoint2();
                pulley_constraint_settings.mRatio = params.GetRatio();
                pulley_constraint_settings.mMinLength = params.GetMinLength();
                pulley_constraint_settings.mMaxLength = params.GetMaxLength();

                constraint_settings = &pulley_constraint_settings;
                break;
            }
            case EConstraintSubType::Fixed:
            {
                FixedConstraintSettings fixed_constraint_settings;
                fixed_constraint_settings.mAutoDetectPoint = params.GetAutoDetectPoint();
                fixed_constraint_settings.mPoint1 = params.GetPoint1();
                fixed_constraint_settings.mAxisX1 = params.GetAxisX1();
                fixed_constraint_settings.mAxisY1 = params.GetAxisY1();
                fixed_constraint_settings.mPoint2 = params.GetPoint2();
                fixed_constraint_settings.mAxisX2 = params.GetAxisX2();
                fixed_constraint_settings.mAxisY2 = params.GetAxisY2();

                constraint_settings = &fixed_constraint_settings;
                break;
            }
            case EConstraintSubType::Point:
            {
                PointConstraintSettings point_constraint_settings;
                point_constraint_settings.mPoint1 = params.GetPoint1();
                point_constraint_settings.mPoint2 = params.GetPoint2();
                constraint_settings = &point_constraint_settings;
                break;
            }
            case EConstraintSubType::Distance:
            {
                DistanceConstraintSettings distance_constraint_settings;
                distance_constraint_settings.mPoint1 = params.GetPoint1();
                distance_constraint_settings.mPoint2 = params.GetPoint2();
                distance_constraint_settings.mMinDistance = params.GetMinDistance();
                distance_constraint_settings.mMaxDistance = params.GetMaxDistance();
                constraint_settings = &distance_constraint_settings;
                break;
            }
            default:
                break;
            }

            if (constraint_settings != nullptr)
            {
                AOP::WorldState::GetInstance()->physics_system->AddConstraint(constraint_settings->Create(*body1, *body2));
            }

            // Create the constraint
        }

    };
}

#endif