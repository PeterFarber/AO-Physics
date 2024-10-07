
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

    ABody::ABody(json * params)
    {


        if(params->contains("customID")){
            mCustomID = params->at("customID").get<int>();
        }

        if (params->contains("data")){
            mData = json::parse(params->at("data").get<std::string>());
        }
        if (params->contains("shape"))
            mShape = Helpers::GetShapeSubType(params->at("shape").get<std::string>());

        if (params->contains("position"))
            mPosition = Vec3(params->at("position").at(0).get<double>(), params->at("position").at(1).get<double>(), params->at("position").at(2).get<double>());

        if (params->contains("center"))
            mCenter = Vec3(params->at("center").at(0).get<double>(), params->at("center").at(1).get<double>(), params->at("center").at(2).get<double>());
        
        if (params->contains("rotation"))
            mRotation = Quat(params->at("rotation").at(0).get<double>(), params->at("rotation").at(1).get<double>(), params->at("rotation").at(2).get<double>(), params->at("rotation").at(3).get<double>());
        if (params->contains("linearVelocity"))
            mLinearVelocity = Vec3(params->at("linearVelocity").at(0).get<double>(), params->at("linearVelocity").at(1).get<double>(), params->at("linearVelocity").at(2).get<double>());
        if (params->contains("angularVelocity"))
            mAngularVelocity = Vec3(params->at("angularVelocity").at(0).get<double>(), params->at("angularVelocity").at(1).get<double>(), params->at("angularVelocity").at(2).get<double>());

        if (params->contains("motionType"))
            mMotionType = Helpers::GetMotionType(params->at("motionType").get<std::string>());
        if (params->contains("motionQuality"))
            mMotionQuality = Helpers::GetMotionQuality(params->at("motionQuality").get<std::string>());

        if (params->contains("layer"))
            mLayer = Helpers::GetLayer(params->at("layer").get<std::string>().c_str());

        if (params->contains("activate"))
            mActivation = Helpers::GetActivation(params->at("activate").get<bool>());

        if (params->contains("enhancedInternalEdgeRemoval"))
            mEnhancedInternalEdgeRemoval = params->at("enhancedInternalEdgeRemoval").get<bool>();
        if (params->contains("allowSleeping"))
            mAllowSleeping = params->at("allowSleeping").get<bool>();
        if (params->contains("friction"))
            mFriction = params->at("friction").get<float>();
        if (params->contains("restitution"))
            mRestitution = params->at("restitution").get<float>();
        if (params->contains("linearDamping"))
            mLinearDamping = params->at("linearDamping").get<float>();
        if (params->contains("angularDamping"))
            mAngularDamping = params->at("angularDamping").get<float>();
        if (params->contains("maxLinearVelocity"))
            mMaxLinearVelocity = params->at("maxLinearVelocity").get<float>();
        if (params->contains("maxAngularVelocity"))
            mMaxAngularVelocity = params->at("maxAngularVelocity").get<float>();
        if (params->contains("gravityFactor"))
            mGravityFactor = params->at("gravityFactor").get<float>();

        if (params->contains("size"))
            mSize = Vec3(params->at("size").at(0).get<double>(), params->at("size").at(1).get<double>(), params->at("size").at(2).get<double>());
        if (params->contains("radius"))
            mRadius = params->at("radius").get<double>();
        if (params->contains("height"))
            mHeight = params->at("height").get<double>();

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

    void ABody::SetData(json *params)
    {
        mData = *params;
    }

    json ABody::GetData()
    {
        return mData;
    }

    json ABody::GetBodyData()
    {
        json j = Helpers::GetBodyData(AWorld::GetInstance()->mPhysicsSystem, BodyID(mID));
        j["data"] = mData;
        return j;
    }

    ABody::~ABody()
    {
        BodyID body_id_obj(mID);
        AWorld::GetInstance()->mBodyInterface->RemoveBody(body_id_obj);
        AWorld::GetInstance()->mBodyInterface->DestroyBody(body_id_obj);
    }

} // namespace AOP