#include "WorldState.h"

namespace AOP
{

    WorldState *WorldState::sInstance = nullptr;
    
    /**
     * Static methods should be defined outside the class.
     */
    WorldState *WorldState::GetInstance()
    {
        /**
         * This is a safer way to create an instance. instance = new Singleton is
         * dangeruous in case two instance threads wants to access at the same time
         */
        if (sInstance == nullptr)
        {
            sInstance = new WorldState();
        }
        return sInstance;
    }

    void WorldState::Init(WorldParams params)
    {

        if (is_initialized)
            return;

        RegisterDefaultAllocator();
        Trace = TraceImpl;
        JPH_IF_ENABLE_ASSERTS(AssertFailed = AssertFailedImpl;)
        Factory::sInstance = new Factory();
        RegisterTypes();

        this->temp_allocator = new TempAllocatorImpl(10 * 1024 * 1024);

        // job_system = new JobSystemThreadPool(cMaxPhysicsJobs, cMaxPhysicsBarriers, thread::hardware_concurrency() - 1);
        job_system = new JobSystemSingleThreaded(cMaxPhysicsJobs);

        physics_system = new PhysicsSystem();
        physics_system->Init(params.GetMaxBodies(), params.GetNumBodyMutexes(), params.GetMaxBodyPairs(), params.GetMaxContactConstraints(), broad_phase_layer_interface, object_vs_broadphase_layer_filter, object_vs_object_layer_filter);

        body_activation_listener = new MyBodyActivationListener();
        contact_listener = new MyContactListener();
        physics_system->SetBodyActivationListener(body_activation_listener);
        physics_system->SetContactListener(contact_listener);

        physics_system->SetGravity(params.GetGravity());

        PhysicsSettings ps = physics_system->GetPhysicsSettings();
        ps.mAllowSleeping = params.GetAllowSleeping();
        ps.mTimeBeforeSleep = params.GetTimeBeforeSleep();
        physics_system->SetPhysicsSettings(ps);

        body_interface = &physics_system->GetBodyInterface();

        this->is_initialized = true;
    }

    void WorldState::Destroy()
    {
        if (!is_initialized)
            return;

        BodyIDVector bodies;
        physics_system->GetBodies(bodies);

        for (BodyID body_id : bodies)
        {
            printf("Removing body %d\n", body_id.GetIndexAndSequenceNumber());
            // Remove the body from the physics system
            body_interface->RemoveBody(body_id);
            printf("Destroying body %d\n", body_id.GetIndexAndSequenceNumber());

            // Destroy the body. After this the body ID is no longer valid.
            body_interface->DestroyBody(body_id);
        }
        UnregisterTypes();

        delete body_activation_listener;
        delete contact_listener;
        delete physics_system;
        delete job_system;
        delete temp_allocator;

        // Destroy the factory
        delete Factory::sInstance;
        Factory::sInstance = nullptr;

        is_initialized = false;
    }

}