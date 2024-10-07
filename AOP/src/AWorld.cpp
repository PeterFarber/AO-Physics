#include "AWorld.h"
#include "Jolt/RegisterTypes.h"
#include "Jolt/Physics/Constraints/DistanceConstraint.h"
#include "Jolt/Physics/Constraints/FixedConstraint.h"
#include "Jolt/Physics/Constraints/PointConstraint.h"
#include "Jolt/Physics/Constraints/PulleyConstraint.h"
#include "Jolt/Physics/Collision/Shape/DecoratedShape.h"
#include "Jolt/Physics/Collision/Shape/CapsuleShape.h"

#include "Types/Constraints/AConeConstraint.h"
#include "Types/Constraints/ADistanceConstraint.h"
#include "Types/Constraints/AFixedConstraint.h"
#include "Types/Constraints/AGearConstraint.h"
#include "Types/Constraints/AHingeConstraint.h"
#include "Types/Constraints/APointConstraint.h"
#include "Types/Constraints/APulleyConstraint.h"
#include "Types/Constraints/ASliderConstraint.h"

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

    void AWorld::ParseParams(json *params)
    {

        if (params->contains("gravity"))
            mGravity = Vec3(params->at("gravity").at(0).get<double>(), params->at("gravity").at(1).get<double>(), params->at("gravity").at(2).get<double>());
        if (params->contains("timeBeforeSleep"))
            mTimeBeforeSleep = params->at("timeBeforeSleep").get<float>();
        if (params->contains("allowSleeping"))
            mAllowSleeping = params->at("allowSleeping").get<bool>();
        if (params->contains("maxBodies"))
            mMaxBodies = params->at("maxBodies").get<uint>();
        if (params->contains("numBodyMutexes"))
            mNumBodyMutexes = params->at("numBodyMutexes").get<uint>();
        if (params->contains("maxBodyPairs"))
            mMaxBodyPairs = params->at("maxBodyPairs").get<uint>();
        if (params->contains("maxContactConstraints"))
            mMaxContactConstraints = params->at("maxContactConstraints").get<uint>();
    }

    void AWorld::Create(json *params)
    {

        if (is_initialized)
            return;

        ParseParams(params);

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
        mPhysicsSystem->Init(mMaxBodies, mNumBodyMutexes, mMaxBodyPairs, mMaxContactConstraints, mBroadPhaseLayerInterface, mObjectVsBroadPhaseLayerFilter, mObjectVsObjectLayerFilter);

        mBodyActivationListener = new MyBodyActivationListener();
        mContactListener = new MyContactListener();
        mPhysicsSystem->SetBodyActivationListener(mBodyActivationListener);
        mPhysicsSystem->SetContactListener(mContactListener);

        mPhysicsSystem->SetGravity(mGravity);

        PhysicsSettings ps = mPhysicsSystem->GetPhysicsSettings();
        ps.mAllowSleeping = mAllowSleeping;
        ps.mTimeBeforeSleep = mTimeBeforeSleep;
        mPhysicsSystem->SetPhysicsSettings(ps);

        mBodyInterface = &mPhysicsSystem->GetBodyInterface();

        this->is_initialized = true;
    }

    void AWorld::LoadWorldState(json *params)
    {

        // Load Bodies
        if (params->contains("bodies"))
        {
            for (auto &body : (*params)["bodies"])
            {
                if (body.contains("data"))
                {
                    // Instead of dumping the whole data into a string, process it more efficiently if possible
                    // Avoiding the conversion if it's unnecessary
                    if (!body["data"].is_string())
                    {
                        body["data"] = body["data"].dump(); // This may still consume memory, optimize if possible.
                    }
                }

                // Directly pass the reference to avoid unnecessary copying
                mBodyManager->AddBody(&body);
            }
        }

        // Load Constraints
        if (params->contains("constraints"))
        {
            for (auto &constraint : (*params)["constraints"])
            {
                // Get Body1 and Body2 by customID, map to proper ID
                if (constraint.contains("body1ID"))
                {
                    uint body1ID = constraint.at("body1ID").get<uint>();
                    constraint["body1ID"] = mBodyManager->GetBodyByCustomID(body1ID)->mBody->GetID().GetIndexAndSequenceNumber();
                }
                if (constraint.contains("body2ID"))
                {
                    uint body2ID = constraint.at("body2ID").get<uint>();
                    constraint["body2ID"] = mBodyManager->GetBodyByCustomID(body2ID)->mBody->GetID().GetIndexAndSequenceNumber();
                }

                // Directly pass the reference to avoid unnecessary copying
                mConstraintManager->AddConstraint(&constraint);
            }
        }
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

        std::map<uint, AOP::ABody *> bodies = mBodyManager->GetBodies();
        for (auto const &body : bodies)
        {
            json body_data = body.second->GetBodyData();
            world_state_json["bodies"].push_back(body_data);
        }

        std::map<uint, AOP::ACharacter *> characters = mCharacterManager->GetCharacters();
        for (auto const &character : characters)
        {
            json character_data = character.second->GetCharacterData();
            world_state_json["characters"].push_back(character_data);
        }

        // BodyIDVector bodies;
        // mPhysicsSystem->GetBodies(bodies);
        // for (BodyID body_id : bodies)
        // {
        //     Body *body = Helpers::GetBody(mPhysicsSystem, body_id);
        //     EShapeSubType sub_shape_type = body->GetShape()->GetSubType();

        //     RVec3 position = body->GetCenterOfMassPosition();
        //     Vec3 size = body->GetShape()->GetLocalBounds().GetSize();
        //     Quat rotation = body->GetRotation();
        //     double radius = body->GetShape()->GetInnerRadius();
        //     double height = size.GetY();

        //     if (sub_shape_type == EShapeSubType::RotatedTranslated)
        //     {
        //         const DecoratedShape * decoratedShape = static_cast<const DecoratedShape *>(body->GetShape());

        //         sub_shape_type = decoratedShape->GetInnerShape()->GetSubType();
        //         // height = decoratedShape->GetLocalBounds().GetSize().GetY();
        //         // radius = decoratedShape->GetInnerRadius();
        //         // if(character->mCrouching){
        //         //     height = character->mHeightCrouching;
        //         //     radius = character->mRadiusCrouching;
        //         // }else{
        //         //     height = character->mHeightStanding;
        //         //     radius = character->mRadiusStanding;
        //         // }
        //     }

        //     const char *shape_type = Helpers::GetShapeType(sub_shape_type);
        //     const char *motion_type = Helpers::GetMotionType(body->GetMotionType());

        //     json body_data = AWorld::GetInstance()->mBodyManager->GetData(body_id.GetIndexAndSequenceNumber());
        //     world_state_json["bodies"].push_back({{"id", body_id.GetIndexAndSequenceNumber()},
        //                                           {"position", {position.GetX(), position.GetY(), position.GetZ()}},
        //                                           {"rotation", {rotation.GetX(), rotation.GetY(), rotation.GetZ(), rotation.GetW()}},
        //                                           {"size", {size.GetX(), size.GetY(), size.GetZ()}},
        //                                           {"radius", radius},
        //                                           {"height", height},
        //                                           {"motion_type", motion_type},
        //                                           {"shape", shape_type},
        //                                           {"data", body_data.dump().c_str()}
        //                                           });
        // }

        // // Get all contraints
        // world_state_json["constraints"] = json::array();

        // Constraints constraints = mPhysicsSystem->GetConstraints();
        // for (Constraint *constraint : constraints)
        // {

        //     // Get Contrain Settings
        //     ConstraintSettings *constraint_settings = constraint->GetConstraintSettings();
        //     const uint id = reinterpret_cast<uint32>(constraint);
        //     AConstraint *aConstraint = mConstraintManager->GetConstraint(id);
        //     json data = aConstraint->GetData();
        //     data["space"] = aConstraint->mSpace;
        //     world_state_json["constraints"].push_back(data);
        // }

        return world_state_json;
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