#ifndef AOP_WORLD_STATE_H
#define AOP_WORLD_STATE_H

#include "./Core/Core.h"
#include "./Core/BodyActivationListener.h"
#include "./Core/ContactListener.h"
#include "./Core/Layers.h"
#include "Params.h"

namespace AOP
{
    static void TraceImpl(const char *inFMT, ...)
    {
        // Format the message
        va_list list;
        va_start(list, inFMT);
        char buffer[1024];
        vsnprintf(buffer, sizeof(buffer), inFMT, list);
        va_end(list);

        // Print to the TTY
        cout << buffer << endl;
    }

#ifdef JPH_ENABLE_ASSERTS

    // Callback for asserts, connect this to your own assert handler if you have one
    static bool AssertFailedImpl(const char *inExpression, const char *inMessage, const char *inFile, uint inLine)
    {
        // Print to the TTY
        cout << inFile << ":" << inLine << ": (" << inExpression << ") " << (inMessage != nullptr ? inMessage : "") << endl;

        // Breakpoint
        return true;
    };
#endif // JPH_ENABLE_ASSERTS

    class WorldState
    {
    protected:
        WorldState(){}; // Constructor is protected to prevent instantiation
        // Singleton instance
        static WorldState *sInstance;

    public:
        /**
         * Singletons should not be cloneable.
         */
        WorldState(WorldState &other) = delete;
        /**
         * Singletons should not be assignable.
         */
        void operator=(const WorldState &) = delete;

        /**
         * This is the static method that controls the access to the singleton
         * instance. On the first run, it creates a singleton object and places it
         * into the static field. On subsequent runs, it returns the client existing
         * object stored in the static field.
         */
        static WorldState *GetInstance();

    private:
        bool is_initialized = false;

        const uint cMaxBodies = 1024;
        const uint cNumBodyMutexes = 0;
        const uint cMaxBodyPairs = 1024;
        const uint cMaxContactConstraints = 1024;

    public:
        TempAllocatorImpl *temp_allocator;
        // JobSystemThreadPool *job_system;
        JobSystemSingleThreaded *job_system;

        BPLayerInterfaceImpl broad_phase_layer_interface;
        ObjectVsBroadPhaseLayerFilterImpl object_vs_broadphase_layer_filter;
        ObjectLayerPairFilterImpl object_vs_object_layer_filter;

        PhysicsSystem *physics_system;

        BodyInterface *body_interface;

        MyBodyActivationListener *body_activation_listener;
        MyContactListener *contact_listener;

    public:
        void Init(WorldParams params);
        void Destroy();
    };
}

#endif