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
        void CreateWorld(WorldParams params);
        void DestroyWorld();
        void UpdateWorld(double deltaTime);
        json GetWorldState();

        uint32 CreateFloor(BodyParams params);

        uint32 CreateSphere(BodyParams params);
        uint32 CreateBox(BodyParams params);
        uint32 CreateCapsule(BodyParams params);
        uint32 CreateCylinder(BodyParams params);

        void SetLinearVelocity(ModParams);
        void AddContraint(ModParams params);
    };

    static World world;
}

#endif