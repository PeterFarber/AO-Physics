#ifndef AOP_WORLD_H
#define AOP_WORLD_H

#include "Core.h"
#include "WorldState.h"
#include "Params.h"


namespace AOP
{

    class World
    {
    private:
        WorldState world_state;

    public:
        void CreateWorld();
        void DestroyWorld();
        void UpdateWorld(int steps, double deltaTime);
        json GetWorldState();

        uint32 CreateFloor(BoxParams params);

        uint32 CreateSphere(SphereParams params);
        uint32 CreateBox(BoxParams params);
        uint32 CreateCapsule(CapsuleParams params);
        uint32 CreateCylinder(CylinderParams params);

        void SetLinearVelocity(ModParams);
    };

    static World world;
}

#endif