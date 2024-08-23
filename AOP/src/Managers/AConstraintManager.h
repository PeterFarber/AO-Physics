

#ifndef AOP_CONSTRAINT_MANAGER_H
#define AOP_CONSTRAINT_MANAGER_H

#include "../Core/Core.h"
#include "../Types/AConstraint.h"

namespace AOP
{

    class AConstraintManager
    {
    private:
        std::map<uint, AConstraint *> mConstraints;

    public:
        AConstraintManager();
        ~AConstraintManager();

        uint32 AddConstraint(const char *params);

    };

}
#endif
