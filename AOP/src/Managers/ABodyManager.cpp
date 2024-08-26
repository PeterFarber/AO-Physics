#include "ABodyManager.h"

#include "../AWorld.h"

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
    
    void ABodyManager::SetLinearVelocity(uint32 bodyID, Vec3 velocity)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            body->SetLinearVelocity(velocity);
        }
    }

    void ABodyManager::SetAngularVelocity(uint32 bodyID, Vec3 velocity)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            body->SetAngularVelocity(velocity);
        }
    }

    void ABodyManager::AddForce(uint32 bodyID, Vec3 force)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            body->AddForce(force);
        }
    }

    void ABodyManager::AddTorque(uint32 bodyID, Vec3 torque)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            body->AddTorque(torque);
        }
    }

    void ABodyManager::AddImpulse(uint32 bodyID, Vec3 impulse)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            body->AddImpulse(impulse);
        }
    }

    void ABodyManager::AddLinearVelocity(uint32 bodyID, Vec3 velocity)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            body->AddLinearVelocity(velocity);
        }
    }

    void ABodyManager::AddAngularVelocity(uint32 bodyID, Vec3 velocity)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            body->AddAngularVelocity(velocity);
        }
    }

    json ABodyManager::CastRay(uint32 bodyID, Vec3 direction)
    {
        if (mBodies.find(bodyID) != mBodies.end())
        {
            ABody *body = mBodies[bodyID];
            return body->CastRay(direction);
        }
        return nullptr;
    }


}