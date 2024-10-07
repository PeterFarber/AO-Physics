#include "APulleyConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/PulleyConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    APulleyConstraint::APulleyConstraint(json * params) : AConstraint(params)
    {
        
        if (params->contains("bodyPoint1"))
            mBodyPoint1 = Vec3(params->at("bodyPoint1").at(0).get<double>(), params->at("bodyPoint1").at(1).get<double>(), params->at("bodyPoint1").at(2).get<double>());

        if (params->contains("fixedPoint1"))
            mFixedPoint1 = Vec3(params->at("fixedPoint1").at(0).get<double>(), params->at("fixedPoint1").at(1).get<double>(), params->at("fixedPoint1").at(2).get<double>());

        if (params->contains("bodyPoint2"))
            mBodyPoint2 = Vec3(params->at("bodyPoint2").at(0).get<double>(), params->at("bodyPoint2").at(1).get<double>(), params->at("bodyPoint2").at(2).get<double>());

        if (params->contains("fixedPoint2"))
            mFixedPoint2 = Vec3(params->at("fixedPoint2").at(0).get<double>(), params->at("fixedPoint2").at(1).get<double>(), params->at("fixedPoint2").at(2).get<double>());

        if (params->contains("ratio"))
            mRatio = params->at("ratio").get<float>();

        if (params->contains("minLength"))
            mMinLength = params->at("minLength").get<float>();

        if (params->contains("maxLength"))
            mMaxLength = params->at("maxLength").get<float>();

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