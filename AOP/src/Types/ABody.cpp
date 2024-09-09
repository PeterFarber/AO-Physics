
#include "ABody.h"

#include "Jolt/Physics/Collision/Shape/BoxShape.h"
#include "Jolt/Physics/Collision/Shape/SphereShape.h"
#include "Jolt/Physics/Collision/Shape/CapsuleShape.h"
#include "Jolt/Physics/Collision/Shape/CylinderShape.h"
#include "Jolt/Physics/Collision/Shape/DecoratedShape.h"
#include "Jolt/Physics/Collision/Shape/RotatedTranslatedShape.h"
#include "Jolt/Physics/Collision/RayCast.h"
#include "Jolt/Physics/Collision/CastResult.h"
#include "Jolt/Physics/Collision/ShapeCast.h"
#include "Jolt/Physics/Collision/CollisionCollectorImpl.h"

#include "../AWorld.h"
#include "../Helpers.h"

namespace AOP
{

    ABody::ABody(const char *params)
    {
        json j = json::parse(params);
        delete &params;

        if (j.contains("data")){
            mData = j.at("data").get<std::string>();
        }
        if (j.contains("shape"))
            mShape = Helpers::GetShapeSubType(j.at("shape").get<std::string>());

        if (j.contains("position"))
            mPosition = Vec3(j.at("position").at(0).get<double>(), j.at("position").at(1).get<double>(), j.at("position").at(2).get<double>());

        if (j.contains("center"))
            mCenter = Vec3(j.at("center").at(0).get<double>(), j.at("center").at(1).get<double>(), j.at("center").at(2).get<double>());
        
        if (j.contains("rotation"))
            mRotation = Quat(j.at("rotation").at(0).get<double>(), j.at("rotation").at(1).get<double>(), j.at("rotation").at(2).get<double>(), j.at("rotation").at(3).get<double>());
        if (j.contains("linearVelocity"))
            mLinearVelocity = Vec3(j.at("linearVelocity").at(0).get<double>(), j.at("linearVelocity").at(1).get<double>(), j.at("linearVelocity").at(2).get<double>());
        if (j.contains("angularVelocity"))
            mAngularVelocity = Vec3(j.at("angularVelocity").at(0).get<double>(), j.at("angularVelocity").at(1).get<double>(), j.at("angularVelocity").at(2).get<double>());

        if (j.contains("motionType"))
            mMotionType = Helpers::GetMotionType(j.at("motionType").get<std::string>());
        if (j.contains("motionQuality"))
            mMotionQuality = Helpers::GetMotionQuality(j.at("motionQuality").get<std::string>());

        if (j.contains("layer"))
            mLayer = Helpers::GetLayer(j.at("layer").get<std::string>().c_str());

        if (j.contains("activate"))
            mActivation = Helpers::GetActivation(j.at("activate").get<bool>());

        if (j.contains("enhancedInternalEdgeRemoval"))
            mEnhancedInternalEdgeRemoval = j.at("enhancedInternalEdgeRemoval").get<bool>();
        if (j.contains("allowSleeping"))
            mAllowSleeping = j.at("allowSleeping").get<bool>();
        if (j.contains("friction"))
            mFriction = j.at("friction").get<float>();
        if (j.contains("restitution"))
            mRestitution = j.at("restitution").get<float>();
        if (j.contains("linearDamping"))
            mLinearDamping = j.at("linearDamping").get<float>();
        if (j.contains("angularDamping"))
            mAngularDamping = j.at("angularDamping").get<float>();
        if (j.contains("maxLinearVelocity"))
            mMaxLinearVelocity = j.at("maxLinearVelocity").get<float>();
        if (j.contains("maxAngularVelocity"))
            mMaxAngularVelocity = j.at("maxAngularVelocity").get<float>();
        if (j.contains("gravityFactor"))
            mGravityFactor = j.at("gravityFactor").get<float>();

        if (j.contains("size"))
            mSize = Vec3(j.at("size").at(0).get<double>(), j.at("size").at(1).get<double>(), j.at("size").at(2).get<double>());
        if (j.contains("radius"))
            mRadius = j.at("radius").get<double>();
        if (j.contains("height"))
            mHeight = j.at("height").get<double>();

        Initialize();
    }

    void ABody::Initialize()
    {
        BodyCreationSettings body_settings;
        Vec3 size;

        switch (mShape)
        {
        case EShapeSubType::Sphere:
            // Use RotatedTranslatedShape to set the position of the sphere
            body_settings = BodyCreationSettings(new RotatedTranslatedShapeSettings(mCenter, Quat::sIdentity(), new SphereShape(mRadius)), mPosition, mRotation, mMotionType, mLayer);
            // body_settings = BodyCreationSettings(new SphereShape(mRadius), mPosition, mRotation, mMotionType, mLayer);
            break;
        case EShapeSubType::Box:
            size = mSize * 0.5f;
            body_settings = BodyCreationSettings(new RotatedTranslatedShapeSettings(mCenter, Quat::sIdentity(), new BoxShape(size)), mPosition, mRotation, mMotionType, mLayer);
            // body_settings = BodyCreationSettings(new BoxShape(size), mPosition, mRotation, mMotionType, mLayer);
            break;
        case EShapeSubType::Capsule:
            body_settings = BodyCreationSettings(new RotatedTranslatedShapeSettings(mCenter, Quat::sIdentity(), new CapsuleShape((mHeight * 0.5f), mRadius)), mPosition, mRotation, mMotionType, mLayer);
            // body_settings = BodyCreationSettings(new CapsuleShape((mHeight * 0.5f), mRadius), mPosition, mRotation, mMotionType, mLayer);
            break;
        case EShapeSubType::Cylinder:
            body_settings = BodyCreationSettings(new RotatedTranslatedShapeSettings(mCenter, Quat::sIdentity(), new CylinderShape(0.5f * mHeight + mRadius, mRadius)), mPosition, mRotation, mMotionType, mLayer);
            // body_settings = BodyCreationSettings(new CylinderShape(0.5f * mHeight + mRadius, mRadius), mPosition, mRotation, mMotionType, mLayer);
            break;
        default:
            body_settings = BodyCreationSettings(new RotatedTranslatedShapeSettings(mCenter, Quat::sIdentity(), new SphereShape(mRadius)), mPosition, mRotation, mMotionType, mLayer);
            // body_settings = BodyCreationSettings(new SphereShape(mRadius), mPosition, mRotation, mMotionType, mLayer);
            break;
        }
        body_settings.mEnhancedInternalEdgeRemoval = mEnhancedInternalEdgeRemoval;
        body_settings.mAllowSleeping = mAllowSleeping;
        body_settings.mFriction = mFriction;
        body_settings.mRestitution = mRestitution;
        body_settings.mLinearDamping = mLinearDamping;
        body_settings.mAngularDamping = mAngularDamping;
        body_settings.mMaxLinearVelocity = mMaxLinearVelocity;
        body_settings.mMaxAngularVelocity = mMaxAngularVelocity;
        body_settings.mGravityFactor = mGravityFactor;
        body_settings.mMotionQuality = mMotionQuality;
        body_settings.mLinearVelocity = mLinearVelocity;
        body_settings.mAngularVelocity = mAngularVelocity;

        BodyID bodyID = AWorld::GetInstance()->mBodyInterface->CreateAndAddBody(body_settings, mActivation);
        mBody = Helpers::GetBody(AWorld::GetInstance()->mPhysicsSystem, bodyID); 
        mID = bodyID.GetIndexAndSequenceNumber();
    }

    void ABody::SetLinearVelocity(Vec3 velocity)
    {
        BodyID body_id_obj(mID);
        // body->SetLinearVelocity(velocity);
        AWorld::GetInstance()->mBodyInterface->SetLinearVelocity(body_id_obj, velocity);
    }

    void ABody::SetAngularVelocity(Vec3 velocity)
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->SetAngularVelocity(body_id_obj, velocity);
    }

    void ABody::AddForce(Vec3 force)
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->AddForce(body_id_obj, force);
    }

    void ABody::AddTorque(Vec3 torque)
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->AddTorque(body_id_obj, torque);
    }

    void ABody::AddImpulse(Vec3 impulse)
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->AddImpulse(body_id_obj, impulse);
    }

    void ABody::AddLinearVelocity(Vec3 velocity)
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->AddLinearVelocity(body_id_obj, velocity);
    }

    void ABody::AddAngularVelocity(Vec3 velocity)
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->AddLinearAndAngularVelocity(body_id_obj, Vec3::sZero(), velocity);
    }

    json ABody::CastRay(Vec3 direction)
    {

        json j;
        j["hit"] = false;
        j["hitPoint"] = {0.0, 0.0, 0.0};
        j["hitBodyID"] = -1;

        BodyID body_id_obj(mID);
    
        const Vec3 position = AWorld::GetInstance()->mBodyInterface->GetPosition(body_id_obj);

	    RRayCast ray { position, direction * 100.0f };
        RayCastSettings ray_settings;
	    ClosestHitCollisionCollector<CastRayCollector> collector;
        IgnoreSingleBodyFilter body_filter(body_id_obj);
        AWorld::GetInstance()->mPhysicsSystem->GetNarrowPhaseQuery().CastRay(ray,ray_settings, collector, {}, {}, body_filter);
        if(collector.HadHit()){
            j["hit"] = true;
            Vec3 hitPoint = ray.GetPointOnRay(collector.mHit.mFraction);
            j["hitPoint"] = {hitPoint.GetX(), hitPoint.GetY(), hitPoint.GetZ()};
            j["hitBodyID"] = collector.mHit.mBodyID.GetIndexAndSequenceNumber();
        }
        return j;
    }

    void ABody::SetData(const char *params)
    {
        mData = json::parse(params);
    }

    json ABody::GetData()
    {
        return mData;
    }

    json ABody::GetBodyData()
    {
        json j = Helpers::GetBodyData(AWorld::GetInstance()->mPhysicsSystem, BodyID(mID));
        j["data"] = mData.dump().c_str(); 
        return j;
    }

    ABody::~ABody()
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->RemoveBody(body_id_obj);
        AWorld::GetInstance()->mBodyInterface->DestroyBody(body_id_obj);
    }

} // namespace AOP