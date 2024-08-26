#include "APulleyConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/PulleyConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    APulleyConstraint::APulleyConstraint(const char *params) : AConstraint(params)
    {
        json j = json::parse(params);
        
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

        delete &params;

        Initialize();
    }

    void APulleyConstraint::Initialize()
    {

        PulleyConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mBodyPoint1 = mBodyPoint1;
        constraint_settings.mFixedPoint1 = mFixedPoint1;
        constraint_settings.mBodyPoint2 = mBodyPoint2;
        constraint_settings.mFixedPoint2 = mFixedPoint2;
        constraint_settings.mRatio = mRatio;
        constraint_settings.mMinLength = mMinLength;
        constraint_settings.mMaxLength = mMaxLength;

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json APulleyConstraint::GetData()
    {
        json j;
        j["type"] = "Pulley";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        j["bodyPoint1"] = {mBodyPoint1.GetX(), mBodyPoint1.GetY(), mBodyPoint1.GetZ()};
        j["fixedPoint1"] = {mFixedPoint1.GetX(), mFixedPoint1.GetY(), mFixedPoint1.GetZ()};
        j["bodyPoint2"] = {mBodyPoint2.GetX(), mBodyPoint2.GetY(), mBodyPoint2.GetZ()};
        j["fixedPoint2"] = {mFixedPoint2.GetX(), mFixedPoint2.GetY(), mFixedPoint2.GetZ()};
        return j;
    }
}