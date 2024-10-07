#ifndef AOP_SLIDER_CONSTRAINT_H
#define AOP_SLIDER_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"

namespace AOP
{

    class ASliderConstraint : public AConstraint
    {
    public:
        bool mAutoDetectPoint = false;

        RVec3 mPoint1 = RVec3::sZero();
        Vec3 mSliderAxis1 = Vec3::sAxisX();
        Vec3 mNormalAxis1 = Vec3::sAxisY();

        RVec3 mPoint2 = RVec3::sZero();
        Vec3 mSliderAxis2 = Vec3::sAxisX();
        Vec3 mNormalAxis2 = Vec3::sAxisY();

        float mLimitsMin = -FLT_MAX;
        float mLimitsMax = FLT_MAX;

        SpringSettings mLimitsSpringSettings;

        float mMaxFrictionForce = 0.0f;

        MotorSettings mMotorSettings;

    public:
        ASliderConstraint(json * params);
        void Initialize();
        json GetData();
    };

}
#endif