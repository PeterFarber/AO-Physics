#include "AConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"



namespace AOP
{

        AConstraint::AConstraint(const char *params)
        {
            json j = json::parse(params);

            if (j.contains("type"))
                mType = Helpers::GetConstraintSubType(j.at("type").get<std::string>());
            if (j.contains("body1ID"))
                mBody1 = Helpers::GetBody(AWorld::GetInstance()->mPhysicsSystem, BodyID(j.at("body1ID").get<uint32_t>()));
            if (j.contains("body2ID"))
                mBody2 = Helpers::GetBody(AWorld::GetInstance()->mPhysicsSystem, BodyID(j.at("body2ID").get<uint32_t>()));

            if (j.contains("space"))
                mSpace = Helpers::GetConstraintSpace(j.at("space").get<std::string>());
        }


}