#ifndef AOP_PARAMS_H
#define AOP_PARAMS_H

#include "./Core/Core.h"
#include "Helpers.h"

#include "../vendors/json.hpp"

using json = nlohmann::json;

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