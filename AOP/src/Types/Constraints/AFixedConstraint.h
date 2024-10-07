#ifndef AOP_FIXED_CONSTRAINT_H
#define AOP_FIXED_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"


namespace AOP
{

    class AFixedConstraint : public AConstraint
    {
    public:

        bool mAutoDetectPoint = false;

        Vec3 mPoint1 = Vec3::sZero();
        Vec3 mAxisX1 = Vec3::sAxisY();
        Vec3 mAxisY1 = Vec3::sAxisX();

        Vec3 mPoint2 = Vec3::sZero();
        Vec3 mAxisX2 = Vec3::sAxisY();
        Vec3 mAxisY2 = Vec3::sAxisX();

    public:
        AFixedConstraint(json * params);
        void Initialize();
        json GetData();
    };

}
#endif