#ifndef LUA_JOLT_STATE_H
#define LUA_JOLT_STATE_H

#include "Core.h"

class JoltState
{
private:
    const uint cMaxBodies = 1024;
    const uint cNumBodyMutexes = 0;
    const uint cMaxBodyPairs = 1024;
    const uint cMaxContactConstraints = 1024;

public:
    bool is_initialized = false;
    std::vector<BodyID> bodies;

    TempAllocatorImpl *temp_allocator;
    JobSystemThreadPool *job_system;
    BPLayerInterfaceImpl broad_phase_layer_interface;
    ObjectVsBroadPhaseLayerFilterImpl object_vs_broadphase_layer_filter;
    ObjectLayerPairFilterImpl object_vs_object_layer_filter;
    PhysicsSystem *physics_system;
    BodyInterface *body_interface;
    MyBodyActivationListener *body_activation_listener;
    MyContactListener *contact_listener;

    void Init()
    {
        if(is_initialized) return;
        bodies = std::vector<BodyID>();

        RegisterDefaultAllocator();
        Trace = TraceImpl;
        JPH_IF_ENABLE_ASSERTS(AssertFailed = AssertFailedImpl;)
        Factory::sInstance = new Factory();
        RegisterTypes();

        this->temp_allocator = new TempAllocatorImpl(10 * 1024 * 1024);

        job_system = new JobSystemThreadPool(cMaxPhysicsJobs, cMaxPhysicsBarriers, thread::hardware_concurrency() - 1);

        physics_system = new PhysicsSystem();
        physics_system->Init(cMaxBodies, cNumBodyMutexes, cMaxBodyPairs, cMaxContactConstraints, broad_phase_layer_interface, object_vs_broadphase_layer_filter, object_vs_object_layer_filter);

        body_activation_listener = new MyBodyActivationListener();
        contact_listener = new MyContactListener();
        physics_system->SetBodyActivationListener(body_activation_listener);
        physics_system->SetContactListener(contact_listener);

        body_interface = &physics_system->GetBodyInterface();

        this->is_initialized = true;
    }
};

#endif // LUA_JOLT_STATE_H