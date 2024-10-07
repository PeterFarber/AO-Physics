#ifndef AOP_GEAR_CONSTRAINT_H
#define AOP_GEAR_CONSTRAINT_H

#include "AConstraint.h"

#include "../../Core/Core.h"

#include "Jolt/Physics/Constraints/MotorSettings.h"
#include "Jolt/Physics/Constraints/SpringSettings.h"


namespace AOP
{

    class AGearConstraint : public AConstraint
    {
    public:

        float mNumTeeth1 = 1;
        float mNumTeeth2 = 1;

        Vec3 mHingeAxis1 = Vec3::sAxisX();
        Vec3 mHingeAxis2 = Vec3::sAxisX();

        float mRatio = 1.0f;


    public:
        AGearConstraint(json * params);
        void Initialize();
        json GetData();
    };

}
#endif