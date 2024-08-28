#include "AConstraintManager.h"
#include "../Helpers.h"

#include "../Types/Constraints/AConeConstraint.h"
#include "../Types/Constraints/ADistanceConstraint.h"
#include "../Types/Constraints/AFixedConstraint.h"
#include "../Types/Constraints/AGearConstraint.h"
#include "../Types/Constraints/AHingeConstraint.h"
#include "../Types/Constraints/APointConstraint.h"
#include "../Types/Constraints/APulleyConstraint.h"
#include "../Types/Constraints/ASliderConstraint.h"

#include "../AWorld.h"

namespace AOP
{

    AConstraintManager::AConstraintManager()
    {
    }

    AConstraintManager::~AConstraintManager()
    {
    }

    uint32 AConstraintManager::AddConstraint(const char *params)
    {
        json j = json::parse(params);
        EConstraintSubType type;
        if (j.contains("type"))
            type = Helpers::GetConstraintSubType(j.at("type").get<std::string>());
        else
        {
            printf("Constraint type not found\n");
            return -1;
        }
        switch (type)
        {
        case EConstraintSubType::Cone:
        {
            AConeConstraint *constraint = new AConeConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }
        case EConstraintSubType::Distance:
        {
            ADistanceConstraint *constraint = new ADistanceConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }
        case EConstraintSubType::Fixed:
        {
            AFixedConstraint *constraint = new AFixedConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }
        case EConstraintSubType::Gear:
        {
            AGearConstraint *constraint = new AGearConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }
        case EConstraintSubType::Hinge:
        {
            AHingeConstraint *constraint = new AHingeConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }
        case EConstraintSubType::Point:
        {
            APointConstraint *constraint = new APointConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }
        case EConstraintSubType::Pulley:
        {
            APulleyConstraint *constraint = new APulleyConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }
        case EConstraintSubType::Slider:
        {
            printf("Slider Constraint\n");
            ASliderConstraint *constraint = new ASliderConstraint(params);
            mConstraints[constraint->mID] = constraint;
            return constraint->mID;
        }

        default:
        {
            printf("Constraint type not implemented\n");
            return -1;
        }
        }
        return -1;
    }

    void AConstraintManager::RemoveConstraint(uint32 constraintID)
    {
        if (mConstraints.find(constraintID) != mConstraints.end())
        {
            delete mConstraints[constraintID];
            mConstraints.erase(constraintID);
        }
    }

}