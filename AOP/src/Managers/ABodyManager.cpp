#include "ABodyManager.h"

namespace AOP
{
    ABodyManager::ABodyManager()
    {
    }

    ABodyManager::~ABodyManager()
    {
    }

    uint32 ABodyManager::CreateBody(const char *params)
    {
        ABody *body = new ABody(params);
        mBodies[body->mID] = body;
        return body->mID;
    }

}