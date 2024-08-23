#ifndef AOP_CONSTRAINT_H
#define AOP_CONSTRAINT_H

#include "../Core/Core.h"
#include "../Core/Layers.h"

#include "Jolt/Physics/Body/Body.h"
#include "Jolt/Physics/Constraints/Constraint.h"

namespace AOP
{

    class AConstraint
    {
    public:
        uint32 mID;
        Constraint *constraint = nullptr;
        Body *mBody1;
        Body *mBody2;

        EConstraintSubType mType = EConstraintSubType::Fixed;
        EConstraintSpace mSpace = EConstraintSpace::WorldSpace;
        bool mAutoDetectPoint = false;

        Vec3 mPoint1 = Vec3::sZero();
        Vec3 mAxisX1 = Vec3::sAxisX();
        Vec3 mAxisY1 = Vec3::sAxisY();
        Vec3 mTwistAxis1 = Vec3::sAxisX();

        Vec3 mHingeAxis1 = Vec3::sAxisY();
        Vec3 mNormalAxis1 = Vec3::sAxisX();

        Vec3 mPoint2 = Vec3::sZero();
        Vec3 mAxisX2 = Vec3::sAxisX();
        Vec3 mAxisY2 = Vec3::sAxisY();
        Vec3 mTwistAxis2 = Vec3::sAxisX();

        Vec3 mHingeAxis2 = Vec3::sAxisY();
        Vec3 mNormalAxis2 = Vec3::sAxisX();

        Vec3 mBodyPoint1 = Vec3::sZero();
        Vec3 mFixedPoint1 = Vec3::sZero();

        Vec3 mBodyPoint2 = Vec3::sZero();
        Vec3 mFixedPoint2 = Vec3::sZero();

        float mRatio = 1.0f;
        float mMinLength = 0.0f;
        float mMaxLength = -1.0f;
        float mMinDistance = -1.0f;
        float mMaxDistance = -1.0f;
        float mLimitsMin = -JPH_PI;
        float mLimitsMax = JPH_PI;
        float mMaxFrictionTorque = 0.0f;
        float mHalfConeAngle = 0.0f;

    public:
        AConstraint(const char *params);
        void Initialize();
    };

}
#endif