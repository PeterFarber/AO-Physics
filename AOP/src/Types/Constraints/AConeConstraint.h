#ifndef AOP_CONE_CONSTRAINT_H
#define AOP_CONE_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"


namespace AOP
{

    class AConeConstraint : public AConstraint
    {
    public:

        Vec3 mPoint1 = Vec3::sZero();
        Vec3 mTwistAxis1 = Vec3::sAxisY();
    
        Vec3 mPoint2 = Vec3::sZero();
        Vec3 mTwistAxis2 = Vec3::sAxisY();

        float mHalfConeAngle = 0.0f;

    public:
        AConeConstraint(json * params);
        void Initialize();
        json GetData();
        
    };

}
#endif