#ifndef AOP_PARAMS_H
#define AOP_PARAMS_H

#include "Core.h"
#include "Helpers.h"

class WorldParams
{
private:
    Vec3 mGravity = Vec3(0, -9.81f, 0);
    float mTimeBeforeSleep = 0.5f;
    bool mAllowSleeping = true;
    uint mMaxBodies = 1024;
    uint mNumBodyMutexes = 0;
    uint mMaxBodyPairs = 1024;
    uint mMaxContactConstraints = 1024;

public:
    WorldParams(const char *params)
    {
        json j = json::parse(params);

        if (j.contains("gravity"))
            mGravity = Vec3(j.at("gravity").at(0).get<double>(), j.at("gravity").at(1).get<double>(), j.at("gravity").at(2).get<double>());
        if (j.contains("timeBeforeSleep"))
            mTimeBeforeSleep = j.at("timeBeforeSleep").get<float>();
        if (j.contains("allowSleeping"))
            mAllowSleeping = j.at("allowSleeping").get<bool>();
        if (j.contains("maxBodies"))
            mMaxBodies = j.at("maxBodies").get<uint>();
        if (j.contains("numBodyMutexes"))
            mNumBodyMutexes = j.at("numBodyMutexes").get<uint>();
        if (j.contains("maxBodyPairs"))
            mMaxBodyPairs = j.at("maxBodyPairs").get<uint>();
        if (j.contains("maxContactConstraints"))
            mMaxContactConstraints = j.at("maxContactConstraints").get<uint>();
    }

    Vec3 GetGravity() { return mGravity; }
    float GetTimeBeforeSleep() { return mTimeBeforeSleep; }
    bool GetAllowSleeping() { return mAllowSleeping; }
    uint GetMaxBodies() { return mMaxBodies; }
    uint GetNumBodyMutexes() { return mNumBodyMutexes; }
    uint GetMaxBodyPairs() { return mMaxBodyPairs; }
    uint GetMaxContactConstraints() { return mMaxContactConstraints; }
};

class BodyParams
{
protected:
    Vec3 mPosition = Vec3::sZero();
    Quat mRotation = Quat::sIdentity();
    Vec3 mLinearVelocity = Vec3::sZero();
    Vec3 mAngularVelocity = Vec3::sZero();

    EMotionType mMotionType = EMotionType::Dynamic;
    ObjectLayer mLayer = Helpers::GetLayer("MOVING");

    bool mEnhancedInternalEdgeRemoval = false;
    bool mAllowSleeping = true;
    float mFriction = 0.2f;
    float mRestitution = 0.0f;
    float mLinearDamping = 0.05f;
    float mAngularDamping = 0.05f;
    float mMaxLinearVelocity = 500.0f;
    float mMaxAngularVelocity = 0.25f * JPH_PI * 60.0f;
    float mGravityFactor = 1.0f;

    /*
        Shape Specific Params
    */

    Vec3 mSize = Vec3(1, 1, 1);
    float mRadius = 0.5f;
    float mHeight = 2.0f;

public:
    BodyParams(const char *params)
    {
        json j = json::parse(params);

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
    }

    Vec3 GetPosition() { return mPosition; }
    Quat GetRotation() { return mRotation; }
    Vec3 GetLinearVelocity() { return mLinearVelocity; }
    Vec3 GetAngularVelocity() { return mAngularVelocity; }

    EMotionType GetMotionType() { return mMotionType; }
    ObjectLayer GetLayer() { return mLayer; }

    bool GetEnhancedInternalEdgeRemoval() { return mEnhancedInternalEdgeRemoval; }
    bool GetAllowSleeping() { return mAllowSleeping; }
    float GetFriction() { return mFriction; }
    float GetRestitution() { return mRestitution; }
    float GetLinearDamping() { return mLinearDamping; }
    float GetAngularDamping() { return mAngularDamping; }
    float GetMaxLinearVelocity() { return mMaxLinearVelocity; }
    float GetMaxAngularVelocity() { return mMaxAngularVelocity; }
    float GetGravityFactor() { return mGravityFactor; }

    Vec3 GetSize() { return mSize; }
    float GetRadius() { return mRadius; }
    float GetHeight() { return mHeight; }

};

class ModParams
{
protected:
    BodyID mBodyID;
    BodyID mOtherID;
    Vec3 mVelocity = Vec3(0, 0, 0);
    Quat mRotation = Quat::sIdentity();

public:
    ModParams(const char *params)
    {
        printf("ModParams: %s\n", params);
        json j = json::parse(params);
        if (!j.contains("bodyID"))
        {
            JPH_ASSERT(false, "bodyID is required");
        }

        mBodyID = BodyID(j.at("bodyID").get<uint32_t>());

        if (j.contains("otherID"))
        {
            mOtherID = BodyID(j.at("otherID").get<uint32_t>());
        }

        if (j.contains("velocity"))
        {
            mVelocity = Vec3(j.at("velocity").at(0).get<double>(), j.at("velocity").at(1).get<double>(), j.at("velocity").at(2).get<double>());
        }

        if (j.contains("rotation"))
        {
            mRotation = Quat(j.at("rotation").at(0).get<double>(), j.at("rotation").at(1).get<double>(), j.at("rotation").at(2).get<double>(), j.at("rotation").at(3).get<double>());
        }
    }
    BodyID GetBodyID() { return mBodyID; }
    BodyID GetOtherID() { return mOtherID; }

    Vec3 GetVelocity() { return mVelocity; }
    Quat GetRotation() { return mRotation; }
};

#endif