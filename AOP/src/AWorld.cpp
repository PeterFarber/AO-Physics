#include "AWorld.h"
#include "Jolt/RegisterTypes.h"
#include "Jolt/Physics/Constraints/DistanceConstraint.h"
#include "Jolt/Physics/Constraints/FixedConstraint.h"
#include "Jolt/Physics/Constraints/PointConstraint.h"   
#include "Jolt/Physics/Constraints/PulleyConstraint.h"
#include "Jolt/Physics/Collision/Shape/DecoratedShape.h"


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
        std::cout << buffer << std::endl;
    }

#ifdef JPH_ENABLE_ASSERTS

    // Callback for asserts, connect this to your own assert handler if you have one
    static bool AssertFailedImpl(const char *inExpression, const char *inMessage, const char *inFile, uint inLine)
    {
        // Print to the TTY
        std::cout << inFile << ":" << inLine << ": (" << inExpression << ") " << (inMessage != nullptr ? inMessage : "") << std::endl;

        // Breakpoint
        return true;
    };
#endif // JPH_ENABLE_ASSERTS

    AWorld *AWorld::sInstance = nullptr;

    /**
     * Static methods should be defined outside the class.
     */
    AWorld *AWorld::GetInstance()
    {
        /**
         * This is a safer way to create an instance. instance = new Singleton is
         * dangeruous in case two instance threads wants to access at the same time
         */
        if (sInstance == nullptr)
        {
            sInstance = new AWorld();
        }
        return sInstance;
    }

    void AWorld::Create(WorldParams params)
    {

        if (is_initialized)
            return;

        mBodyManager = new ABodyManager();
        mCharacterManager = new ACharacterManager();
        mConstraintManager = new AConstraintManager();

        RegisterDefaultAllocator();
        Trace = TraceImpl;
        JPH_IF_ENABLE_ASSERTS(AssertFailed = AssertFailedImpl;)
        Factory::sInstance = new Factory();
        RegisterTypes();

        this->mTempAllocator = new TempAllocatorImpl(10 * 1024 * 1024);

        // job_system = new JobSystemThreadPool(cMaxPhysicsJobs, cMaxPhysicsBarriers, thread::hardware_concurrency() - 1);
        mJobSystem = new JobSystemSingleThreaded(cMaxPhysicsJobs);

        mPhysicsSystem = new PhysicsSystem();
        mPhysicsSystem->Init(params.GetMaxBodies(), params.GetNumBodyMutexes(), params.GetMaxBodyPairs(), params.GetMaxContactConstraints(), mBroadPhaseLayerInterface, mObjectVsBroadPhaseLayerFilter, mObjectVsObjectLayerFilter);

        mBodyActivationListener = new MyBodyActivationListener();
        mContactListener = new MyContactListener();
        mPhysicsSystem->SetBodyActivationListener(mBodyActivationListener);
        mPhysicsSystem->SetContactListener(mContactListener);

        mPhysicsSystem->SetGravity(params.GetGravity());

        PhysicsSettings ps = mPhysicsSystem->GetPhysicsSettings();
        ps.mAllowSleeping = params.GetAllowSleeping();
        ps.mTimeBeforeSleep = params.GetTimeBeforeSleep();
        mPhysicsSystem->SetPhysicsSettings(ps);

        mBodyInterface = &mPhysicsSystem->GetBodyInterface();

        this->is_initialized = true;
    }

    void AWorld::Update()
    {
        float delta_time = 1.0f / mUpdateFrequency;
        // Call Pre Simulation on all characters

        // // Optional step: Before starting the physics simulation you can optimize the broad phase. This improves collision detection performance (it's pointless here because we only have 2 bodies).
        // // You should definitely not call this every frame or when e.g. streaming in a new level section as it is an expensive operation.
        // // Instead insert all new objects in batches instead of 1 at a time to keep the broad phase efficient.
        mPhysicsSystem->OptimizeBroadPhase();

        // If you take larger steps than 1 / 60th of a second you need to do multiple collision steps in order to keep the simulation stable. Do 1 collision step per 1 / 60th of a second (round up).
        const int cCollisionSteps = 1;

        mPhysicsSystem->Update(delta_time, cCollisionSteps, mTempAllocator, mJobSystem);

        // Call Post Simulation on all characters
        mCharacterManager->PostSimulation(delta_time);
    }

    json AWorld::GetWorldState()
    {
        json world_state_json;

        world_state_json["bodies"] = json::array();
        BodyIDVector bodies;
        mPhysicsSystem->GetBodies(bodies);
        for (BodyID body_id : bodies)
        {
            Body *body = Helpers::GetBody(mPhysicsSystem, body_id);
            EShapeSubType sub_shape_type = body->GetShape()->GetSubType();
            if (sub_shape_type == EShapeSubType::RotatedTranslated)
            {
                sub_shape_type = static_cast<const DecoratedShape *>(body->GetShape())->GetInnerShape()->GetSubType();
            }

            const char *shape_type = Helpers::GetShapeType(sub_shape_type);
            const char *motion_type = Helpers::GetMotionType(body->GetMotionType());

            RVec3 position = body->GetCenterOfMassPosition();
            Vec3 size = body->GetShape()->GetLocalBounds().GetSize();
            Quat rotation = body->GetRotation();
            double radius = size.GetX() * 0.5f;
            double height = size.GetY();

            world_state_json["bodies"].push_back({{"id", body_id.GetIndexAndSequenceNumber()},
                                                  {"position", {position.GetX(), position.GetY(), position.GetZ()}},
                                                  {"rotation", {rotation.GetX(), rotation.GetY(), rotation.GetZ(), rotation.GetW()}},
                                                  {"size", {size.GetX(), size.GetY(), size.GetZ()}},
                                                  {"radius", radius},
                                                  {"height", height},
                                                  {"motion_type", motion_type},
                                                  {"shape", shape_type}});
        }

        // Get all contraints
        world_state_json["constraints"] = json::array();

        Constraints constraints = mPhysicsSystem->GetConstraints();

        for (Constraint *constraint : constraints)
        {

            // Get Contrain Settings
            ConstraintSettings *constraint_settings = constraint->GetConstraintSettings();

            switch (constraint->GetSubType())
            {
            case EConstraintSubType::Pulley:
            {
                PulleyConstraint *pulley_constraint = static_cast<PulleyConstraint *>(constraint);
                Body *body1 = pulley_constraint->GetBody1();
                Body *body2 = pulley_constraint->GetBody2();
                world_state_json["constraints"].push_back({{"type", "pulley"},
                                                           {"body1", body1->GetID().GetIndexAndSequenceNumber()},
                                                           {"body2", body2->GetID().GetIndexAndSequenceNumber()}});
                break;
            }
            case EConstraintSubType::Fixed:
            {
                FixedConstraint *fixed_constraint = static_cast<FixedConstraint *>(constraint);
                Body *body1 = fixed_constraint->GetBody1();
                Body *body2 = fixed_constraint->GetBody2();
                world_state_json["constraints"].push_back({{"type", "fixed"},
                                                           {"body1", body1->GetID().GetIndexAndSequenceNumber()},
                                                           {"body2", body2->GetID().GetIndexAndSequenceNumber()}});
                break;
            }
            case EConstraintSubType::Distance:
            {
                DistanceConstraint *distance_constraint = static_cast<DistanceConstraint *>(constraint);
                Body *body1 = distance_constraint->GetBody1();
                Body *body2 = distance_constraint->GetBody2();
                world_state_json["constraints"].push_back({{"type", "distance"},
                                                           {"body1", body1->GetID().GetIndexAndSequenceNumber()},
                                                           {"body2", body2->GetID().GetIndexAndSequenceNumber()}});
                break;
            }

            default:
                break;
            }
        }

        return world_state_json;
    }

    void AWorld::SetLinearVelocity(ModParams params)
    {
        BodyID body_id_obj(params.GetBodyID());
        mBodyInterface->SetLinearVelocity(body_id_obj, params.GetVelocity());
    }

    void AWorld::Destroy()
    {
        if (!is_initialized)
            return;

        BodyIDVector bodies;
        mPhysicsSystem->GetBodies(bodies);

        for (BodyID body_id : bodies)
        {
            // Remove the body from the physics system
            mBodyInterface->RemoveBody(body_id);
            // Destroy the body. After this the body ID is no longer valid.
            mBodyInterface->DestroyBody(body_id);
        }
        UnregisterTypes();

        delete mBodyManager;
        delete mCharacterManager;
        delete mConstraintManager;

        delete mBodyActivationListener;
        delete mContactListener;
        delete mPhysicsSystem;
        delete mJobSystem;
        delete mTempAllocator;

        // Destroy the factory
        delete Factory::sInstance;
        Factory::sInstance = nullptr;

        is_initialized = false;
    }
}