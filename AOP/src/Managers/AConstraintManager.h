

#ifndef AOP_CONSTRAINT_MANAGER_H
#define AOP_CONSTRAINT_MANAGER_H

#include "../Core/Core.h"
#include "../Types/Constraints/AConstraint.h"

namespace AOP
{

    class AConstraintManager
    {
    private:
        std::map<uint32, AConstraint *> mConstraints;

    public:
        AConstraintManager();
        ~AConstraintManager();

        uint32 AddConstraint(json * params);

        void RemoveConstraint(uint32 constraintID);

        std::map<uint32, AConstraint *> GetConstraints() { return mConstraints; }
        AConstraint *GetConstraint(uint32 id) { return mConstraints[id]; }

    };

}
#endif
