#ifndef AOP_CONSTRAINT_H
#define AOP_CONSTRAINT_H

#include "../../Core/Core.h"
#include "../../Core/Layers.h"

#include "Jolt/Physics/Body/Body.h"
#include "Jolt/Physics/Constraints/Constraint.h"


namespace AOP
{

    class AConstraint
    {
    public:
        uint32 mID;

        Constraint *mConstraint = nullptr;
        Body *mBody1 = nullptr;
        Body *mBody2 = nullptr;
        EConstraintSpace mSpace = EConstraintSpace::WorldSpace;
        EConstraintSubType mType = EConstraintSubType::Fixed;

    public:

        virtual void Initialize() = 0;
        virtual json GetData() = 0;

        AConstraint(const char *params);
        
        virtual ~AConstraint();

    };
}
#endif