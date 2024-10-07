#ifndef AOP_POINT_CONSTRAINT_H
#define AOP_POINT_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"


namespace AOP
{

    class APointConstraint : public AConstraint
    {
    public:

        Vec3 mPoint1 = Vec3::sZero();
        Vec3 mPoint2 = Vec3::sZero();

    public:
        APointConstraint(json * params);
        void Initialize();
        json GetData();
    };

}
#endif