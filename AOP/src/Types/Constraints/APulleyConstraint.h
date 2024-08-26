#ifndef AOP_PULLEY_CONSTRAINT_H
#define AOP_PULLEY_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"


namespace AOP
{

    class APulleyConstraint : public AConstraint
    {
    public:

        Vec3 mBodyPoint1 = Vec3::sZero();
        Vec3 mFixedPoint1 = Vec3::sZero();
        Vec3 mBodyPoint2 = Vec3::sZero();
        Vec3 mFixedPoint2 = Vec3::sZero();

        float mRatio = 1.0f;

        float mMinLength = 0.0f;
        float mMaxLength = 0.0f;  

    public:
        APulleyConstraint(const char *params);
        void Initialize();
        json GetData();
    };

}
#endif