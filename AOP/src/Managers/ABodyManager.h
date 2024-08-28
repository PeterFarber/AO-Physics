

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

        uint32 AddBody(const char *params);
        void SetLinearVelocity(uint32 bodyID, Vec3 velocity);
        void SetAngularVelocity(uint32 bodyID, Vec3 velocity);
        void AddForce(uint32 bodyID, Vec3 force);
        void AddTorque(uint32 bodyID, Vec3 torque);
        void AddImpulse(uint32 bodyID, Vec3 impulse);
        void AddLinearVelocity(uint32 bodyID, Vec3 velocity);
        void AddAngularVelocity(uint32 bodyID, Vec3 velocity);
        json CastRay(uint32 bodyID, Vec3 direction);
        void RemoveBody(uint32 bodyID);
        void SetData(uint32 bodyID, const char *params);
        json GetData(uint32 bodyID);
    };
}
#endif
