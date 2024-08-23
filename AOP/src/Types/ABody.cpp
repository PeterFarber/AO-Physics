
#include "ABody.h"

#include "Jolt/Physics/Collision/Shape/BoxShape.h"
#include "Jolt/Physics/Collision/Shape/SphereShape.h"
#include "Jolt/Physics/Collision/Shape/CapsuleShape.h"
#include "Jolt/Physics/Collision/Shape/CylinderShape.h"
#include "Jolt/Physics/Collision/Shape/DecoratedShape.h"

#include "../AWorld.h"
#include "../Helpers.h"

namespace AOP
{

        ABody::ABody(const char *params)
        {
            json j = json::parse(params);

            if (j.contains("shape"))
                mShape = Helpers::GetShapeSubType(j.at("shape").get<std::string>());

            if (j.contains("position"))
                mPosition = Vec3(j.at("position").at(0).get<double>(), j.at("position").at(1).get<double>(), j.at("position").at(2).get<double>());
            if (j.contains("rotation"))
                mRotation = Quat(j.at("rotation").at(0).get<double>(), j.at("rotation").at(1).get<double>(), j.at("rotation").at(2).get<double>(), j.at("rotation").at(3).get<double>());
            if (j.contains("linearVelocity"))
                mLinearVelocity = Vec3(j.at("linearVelocity").at(0).get<double>(), j.at("linearVelocity").at(1).get<double>(), j.at("linearVelocity").at(2).get<double>());
            if (j.contains("angularVelocity"))
                mAngularVelocity = Vec3(j.at("angularVelocity").at(0).get<double>(), j.at("angularVelocity").at(1).get<double>(), j.at("angularVelocity").at(2).get<double>());

            if (j.contains("motionType"))
                mMotionType = Helpers::GetMotionType(j.at("motionType").get<std::string>());
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
                Vec3 size = mSize * 0.5f;

            // switch (mShape)
            // {
            // case EShapeSubType::Sphere:
            //     body_settings = BodyCreationSettings(new SphereShape(mRadius), mPosition, mRotation, mMotionType, mLayer);
            //     break;
            // case EShapeSubType::Box:
            //     body_settings = BodyCreationSettings(new BoxShape(size), mPosition, mRotation, mMotionType, mLayer);
            //     break;
            // case EShapeSubType::Capsule:
            //     body_settings = BodyCreationSettings(new CapsuleShape((mHeight * 0.5f) - (mRadius), mRadius), mPosition, mRotation, mMotionType, mLayer);
            //     break;
            // case EShapeSubType::Cylinder:
            //     body_settings = BodyCreationSettings(new CylinderShape((mHeight * 0.5f), mRadius), mPosition, mRotation, mMotionType, mLayer);
            //     break;
            // default:
            //     body_settings = BodyCreationSettings(new SphereShape(mRadius), mPosition, mRotation, mMotionType, mLayer);
            //     break;

            // }   

            switch (mShape)
            {
            case EShapeSubType::Sphere:
                body_settings = BodyCreationSettings(new SphereShape(mRadius), mPosition, mRotation, mMotionType, mLayer);
                break;
            case EShapeSubType::Box:
                body_settings = BodyCreationSettings(new BoxShape(size), mPosition, mRotation, mMotionType, mLayer);
                break;
            case EShapeSubType::Capsule:
                body_settings = BodyCreationSettings(new CapsuleShape((mHeight * 0.5f) - (mRadius), mRadius), mPosition, mRotation, mMotionType, mLayer);
                break;
            case EShapeSubType::Cylinder:
                body_settings = BodyCreationSettings(new CylinderShape((mHeight * 0.5f), mRadius), mPosition, mRotation, mMotionType, mLayer);
                break;
            default:
                body_settings = BodyCreationSettings(new SphereShape(mRadius), mPosition, mRotation, mMotionType, mLayer);
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
        

            mID = AWorld::GetInstance()->mBodyInterface->CreateAndAddBody(body_settings, mActivation).GetIndexAndSequenceNumber();

        }

}