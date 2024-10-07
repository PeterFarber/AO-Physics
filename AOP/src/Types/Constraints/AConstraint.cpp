#include "AConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"



namespace AOP
{

        AConstraint::AConstraint(json * params)
        {

            if (params->contains("type"))
                mType = Helpers::GetConstraintSubType(params->at("type").get<std::string>());
            if (params->contains("body1ID"))
                mBody1 = Helpers::GetBody(AWorld::GetInstance()->mPhysicsSystem, BodyID(params->at("body1ID").get<uint32_t>()));
            if (params->contains("body2ID"))
                mBody2 = Helpers::GetBody(AWorld::GetInstance()->mPhysicsSystem, BodyID(params->at("body2ID").get<uint32_t>()));

            if (params->contains("space"))
                mSpace = Helpers::GetConstraintSpace(params->at("space").get<std::string>());
        }

        AConstraint::~AConstraint()
        {
            AWorld::GetInstance()->mPhysicsSystem->RemoveConstraint(mConstraint);
            delete mConstraint;
        }

}