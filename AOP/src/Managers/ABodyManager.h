

#ifndef AOP_BODY_MANAGER_H
#define AOP_BODY_MANAGER_H

#include "../Core/Core.h"

#include "../Types/ABody.h"

namespace AOP
{

    class ABodyManager
    {
    private:
        std::map<uint, ABody*> mBodies;

    public:
        ABodyManager();
        ~ABodyManager();

        uint32 CreateBody(const char *params);
    };

}
#endif
