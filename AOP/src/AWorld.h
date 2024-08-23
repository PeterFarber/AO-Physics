#ifndef AOP_WORLD_H
#define AOP_WORLD_H

#include "Core/Core.h"
#include "Core/Layers.h"
#include "Core/BodyActivationListener.h"
#include "Core/ContactListener.h"

#include "Managers/ABodyManager.h"
#include "Managers/ACharacterManager.h"
#include "Managers/AConstraintManager.h"

#include "Params.h"

#include "Jolt/Core/JobSystemSingleThreaded.h"

#include "../vendors/json.hpp"
using nlohmann::json;

namespace AOP
{

    class AWorld
    {
    protected:
        AWorld(){}; // Constructor is protected to prevent instantiation
        // Singleton instance
        static AWorld *sInstance;
        bool is_initialized = false;

    public:
        /**
         * Singletons should not be cloneable.
         */
        AWorld(AWorld &other) = delete;
        /**
         * Singletons should not be assignable.
         */
        void operator=(const AWorld &) = delete;

        /**
         * This is the static method that controls the access to the singleton
         * instance. On the first run, it creates a singleton object and places it
         * into the static field. On subsequent runs, it returns the client existing
         * object stored in the static field.
         */
        static AWorld *GetInstance();



    public:
        float mUpdateFrequency = 60.0f;

        ABodyManager *mBodyManager;
        ACharacterManager *mCharacterManager;
        AConstraintManager *mConstraintManager;


        TempAllocatorImpl *mTempAllocator;
        JobSystemSingleThreaded *mJobSystem;

        BPLayerInterfaceImpl mBroadPhaseLayerInterface;
        ObjectVsBroadPhaseLayerFilterImpl mObjectVsBroadPhaseLayerFilter;
        ObjectLayerPairFilterImpl mObjectVsObjectLayerFilter;

        PhysicsSystem *mPhysicsSystem;

        BodyInterface *mBodyInterface;

        MyBodyActivationListener *mBodyActivationListener;
        MyContactListener *mContactListener;

    public:
        void Create(WorldParams params);
        void Update();
        json GetWorldState();
        void SetLinearVelocity(ModParams params);
        void Destroy();
    };
}

#endif