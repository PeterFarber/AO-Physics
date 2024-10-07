#ifndef AOP_DISTANCE_CONSTRAINT_H
#define AOP_DISTANCE_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"


namespace AOP
{

    class ADistanceConstraint : public AConstraint
    {
    public:

        Vec3 mPoint1 = Vec3::sZero();
        Vec3 mPoint2 = Vec3::sZero();
        float mMinDistance = -1.0f;
        float mMaxDistance = -1.0f;

        SpringSettings mLimitsSpringSettings;
        

    public:
        ADistanceConstraint(json * params);
        void Initialize();
        json GetData();
    };

}
#endif