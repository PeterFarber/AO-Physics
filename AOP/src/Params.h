#ifndef AOP_PARAMS_H
#define AOP_PARAMS_H

#include "./Core/Core.h"
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

class ConstraintParams
{
protected:
    BodyID mBody1ID;
    BodyID mBody2ID;

    EConstraintSubType mType = EConstraintSubType::Fixed;
    EConstraintSpace mSpace = EConstraintSpace::WorldSpace;
    bool mAutoDetectPoint = false;

    Vec3 mPoint1 = Vec3::sZero();
    Vec3 mAxisX1 = Vec3::sAxisX();
    Vec3 mAxisY1 = Vec3::sAxisY();
    Vec3 mTwistAxis1 = Vec3::sAxisX();

    Vec3 mHingeAxis1 = Vec3::sAxisY();
    Vec3 mNormalAxis1 = Vec3::sAxisX();

    Vec3 mPoint2 = Vec3::sZero();
    Vec3 mAxisX2 = Vec3::sAxisX();
    Vec3 mAxisY2 = Vec3::sAxisY();
    Vec3 mTwistAxis2 = Vec3::sAxisX();

    Vec3 mHingeAxis2 = Vec3::sAxisY();
    Vec3 mNormalAxis2 = Vec3::sAxisX();

    Vec3 mBodyPoint1 = Vec3::sZero();
    Vec3 mFixedPoint1 = Vec3::sZero();

    Vec3 mBodyPoint2 = Vec3::sZero();
    Vec3 mFixedPoint2 = Vec3::sZero();

    float mRatio = 1.0f;
    float mMinLength = 0.0f;
    float mMaxLength = -1.0f;
    float mMinDistance = -1.0f;
    float mMaxDistance = -1.0f;
    float mLimitsMin = -JPH_PI;
    float mLimitsMax = JPH_PI;
    float mMaxFrictionTorque = 0.0f;
    float mHalfConeAngle = 0.0f;

public:
    ConstraintParams(const char *params)
    {
        json j = json::parse(params);

        if (j.contains("body1ID"))
            mBody1ID = BodyID(j.at("body1ID").get<uint32_t>());
        if (j.contains("body2ID"))
            mBody2ID = BodyID(j.at("body2ID").get<uint32_t>());

        if (j.contains("type"))
            mType = Helpers::GetConstraintSubType(j.at("type").get<std::string>());
        if (j.contains("space"))
            mSpace = Helpers::GetConstraintSpace(j.at("space").get<std::string>());
        if (j.contains("autoDetectPoint"))
            mAutoDetectPoint = j.at("autoDetectPoint").get<bool>();

        if (j.contains("point1"))
            mPoint1 = Vec3(j.at("point1").at(0).get<double>(), j.at("point1").at(1).get<double>(), j.at("point1").at(2).get<double>());
        if (j.contains("axisX1"))
            mAxisX1 = Vec3(j.at("axisX1").at(0).get<double>(), j.at("axisX1").at(1).get<double>(), j.at("axisX1").at(2).get<double>());
        if (j.contains("axisY1"))
            mAxisY1 = Vec3(j.at("axisY1").at(0).get<double>(), j.at("axisY1").at(1).get<double>(), j.at("axisY1").at(2).get<double>());
        if (j.contains("twistAxis1"))
            mTwistAxis1 = Vec3(j.at("twistAxis1").at(0).get<double>(), j.at("twistAxis1").at(1).get<double>(), j.at("twistAxis1").at(2).get<double>());

        if (j.contains("hingeAxis1"))
            mHingeAxis1 = Vec3(j.at("hingeAxis1").at(0).get<double>(), j.at("hingeAxis1").at(1).get<double>(), j.at("hingeAxis1").at(2).get<double>());
        if (j.contains("normalAxis1"))
            mNormalAxis1 = Vec3(j.at("normalAxis1").at(0).get<double>(), j.at("normalAxis1").at(1).get<double>(), j.at("normalAxis1").at(2).get<double>());

        if (j.contains("point2"))
            mPoint2 = Vec3(j.at("point2").at(0).get<double>(), j.at("point2").at(1).get<double>(), j.at("point2").at(2).get<double>());
        if (j.contains("axisX2"))
            mAxisX2 = Vec3(j.at("axisX2").at(0).get<double>(), j.at("axisX2").at(1).get<double>(), j.at("axisX2").at(2).get<double>());
        if (j.contains("axisY2"))
            mAxisY2 = Vec3(j.at("axisY2").at(0).get<double>(), j.at("axisY2").at(1).get<double>(), j.at("axisY2").at(2).get<double>());
        if (j.contains("twistAxis2"))
            mTwistAxis2 = Vec3(j.at("twistAxis2").at(0).get<double>(), j.at("twistAxis2").at(1).get<double>(), j.at("twistAxis2").at(2).get<double>());

        if (j.contains("hingeAxis2"))
            mHingeAxis2 = Vec3(j.at("hingeAxis2").at(0).get<double>(), j.at("hingeAxis2").at(1).get<double>(), j.at("hingeAxis2").at(2).get<double>());
        if (j.contains("normalAxis2"))
            mNormalAxis2 = Vec3(j.at("normalAxis2").at(0).get<double>(), j.at("normalAxis2").at(1).get<double>(), j.at("normalAxis2").at(2).get<double>());

        if (j.contains("bodyPoint1"))
            mBodyPoint1 = Vec3(j.at("bodyPoint1").at(0).get<double>(), j.at("bodyPoint1").at(1).get<double>(), j.at("bodyPoint1").at(2).get<double>());
        if (j.contains("fixedPoint1"))
            mFixedPoint1 = Vec3(j.at("fixedPoint1").at(0).get<double>(), j.at("fixedPoint1").at(1).get<double>(), j.at("fixedPoint1").at(2).get<double>());

        if (j.contains("bodyPoint2"))
            mBodyPoint2 = Vec3(j.at("bodyPoint2").at(0).get<double>(), j.at("bodyPoint2").at(1).get<double>(), j.at("bodyPoint2").at(2).get<double>());
        if (j.contains("fixedPoint2"))
            mFixedPoint2 = Vec3(j.at("fixedPoint2").at(0).get<double>(), j.at("fixedPoint2").at(1).get<double>(), j.at("fixedPoint2").at(2).get<double>());

        if (j.contains("ratio"))
            mRatio = j.at("ratio").get<float>();
        if (j.contains("minLength"))
            mMinLength = j.at("minLength").get<float>();
        if (j.contains("maxLength"))
            mMaxLength = j.at("maxLength").get<float>();
        if (j.contains("minDistance"))
            mMinDistance = j.at("minDistance").get<float>();
        if (j.contains("maxDistance"))
            mMaxDistance = j.at("maxDistance").get<float>();
        if (j.contains("limitsMin"))
            mLimitsMin = j.at("limitsMin").get<float>();
        if (j.contains("limitsMax"))
            mLimitsMax = j.at("limitsMax").get<float>();
        if (j.contains("maxFrictionTorque"))
            mMaxFrictionTorque = j.at("maxFrictionTorque").get<float>();
        if (j.contains("halfConeAngle"))
            mHalfConeAngle = j.at("halfConeAngle").get<float>();
    }

public:
    BodyID GetBody1ID() { return mBody1ID; }
    BodyID GetBody2ID() { return mBody2ID; }

    EConstraintSubType GetType() { return mType; }
    EConstraintSpace GetSpace() { return mSpace; }
    bool GetAutoDetectPoint() { return mAutoDetectPoint; }

    Vec3 GetPoint1() { return mPoint1; }
    Vec3 GetAxisX1() { return mAxisX1; }
    Vec3 GetAxisY1() { return mAxisY1; }
    Vec3 GetTwistAxis1() { return mTwistAxis1; }

    Vec3 GetHingeAxis1() { return mHingeAxis1; }
    Vec3 GetNormalAxis1() { return mNormalAxis1; }

    Vec3 GetPoint2() { return mPoint2; }
    Vec3 GetAxisX2() { return mAxisX2; }
    Vec3 GetAxisY2() { return mAxisY2; }
    Vec3 GetTwistAxis2() { return mTwistAxis2; }

    Vec3 GetHingeAxis2() { return mHingeAxis2; }
    Vec3 GetNormalAxis2() { return mNormalAxis2; }

    Vec3 GetBodyPoint1() { return mBodyPoint1; }
    Vec3 GetFixedPoint1() { return mFixedPoint1; }

    Vec3 GetBodyPoint2() { return mBodyPoint2; }
    Vec3 GetFixedPoint2() { return mFixedPoint2; }

    float GetRatio() { return mRatio; }
    float GetMinLength() { return mMinLength; }
    float GetMaxLength() { return mMaxLength; }
    float GetMinDistance() { return mMinDistance; }
    float GetMaxDistance() { return mMaxDistance; }
    float GetLimitsMin() { return mLimitsMin; }
    float GetLimitsMax() { return mLimitsMax; }
    float GetMaxFrictionTorque() { return mMaxFrictionTorque; }
    float GetHalfConeAngle() { return mHalfConeAngle; }
};

class ModParams
{
    BodyID mBodyID;
    Vec3 mVelocity = Vec3(0, 0, 0);
    Quat mRotation = Quat::sIdentity();

public:
    ModParams(const char *params)
    {
        json j = json::parse(params);

        if (j.contains("bodyID"))
            mBodyID = BodyID(j.at("bodyID").get<uint32_t>());

        if (j.contains("velocity"))
            mVelocity = Vec3(j.at("velocity").at(0).get<double>(), j.at("velocity").at(1).get<double>(), j.at("velocity").at(2).get<double>());
        if (j.contains("rotation"))
            mRotation = Quat(j.at("rotation").at(0).get<double>(), j.at("rotation").at(1).get<double>(), j.at("rotation").at(2).get<double>(), j.at("rotation").at(3).get<double>());
    }

    BodyID GetBodyID() { return mBodyID; }
    Vec3 GetVelocity() { return mVelocity; }
    Quat GetRotation() { return mRotation; }
};
#endif