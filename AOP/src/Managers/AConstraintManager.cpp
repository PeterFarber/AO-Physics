#include "AConstraintManager.h"

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
        AConstraint *constraint = new AConstraint(params);
        mConstraints[constraint->mID] = constraint;
        return constraint->mID;
    }
}