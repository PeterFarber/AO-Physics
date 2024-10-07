#ifndef AOP_HINGE_CONSTRAINT_H
#define AOP_HINGE_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"


namespace AOP
{

    class AHingeConstraint : public AConstraint
    {
    public:
        Vec3 mPoint1 = Vec3::sZero();
        Vec3 mHingeAxis1 = Vec3::sAxisY();
        Vec3 mNormalAxis1 = Vec3::sAxisX();

        Vec3 mPoint2 = Vec3::sZero();
        Vec3 mHingeAxis2 = Vec3::sAxisY();
        Vec3 mNormalAxis2 = Vec3::sAxisX();

        float mLimitsMin = -JPH_PI;
        float mLimitsMax = JPH_PI;

        SpringSettings mLimitsSpringSettings;

        float mMaxFrictionTorque = 0.0f;

        MotorSettings mMotorSettings;
        EMotorState mMotorState = EMotorState::Off;
        float mTargetAngularVelocity = 0.0f;
        float mTargetAngle = 0.0f;

    public:
        AHingeConstraint(json * params);
        void Initialize();
        json GetData();
    };

}
#endif