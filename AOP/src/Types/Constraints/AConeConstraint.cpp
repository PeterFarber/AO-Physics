#include "AConeConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/ConeConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    AConeConstraint::AConeConstraint(json * params) : AConstraint(params)
    {

        
        if (params->contains("point1"))
            mPoint1 = Vec3(params->at("point1").at(0).get<double>(), params->at("point1").at(1).get<double>(), params->at("point1").at(2).get<double>());

        if (params->contains("twistAxis1"))
            mTwistAxis1 = Vec3(params->at("twistAxis1").at(0).get<double>(), params->at("twistAxis1").at(1).get<double>(), params->at("twistAxis1").at(2).get<double>());

        if (params->contains("point2"))
            mPoint2 = Vec3(params->at("point2").at(0).get<double>(), params->at("point2").at(1).get<double>(), params->at("point2").at(2).get<double>());

        if (params->contains("twistAxis2"))
            mTwistAxis2 = Vec3(params->at("twistAxis2").at(0).get<double>(), params->at("twistAxis2").at(1).get<double>(), params->at("twistAxis2").at(2).get<double>());

        if (params->contains("halfConeAngle"))
            mHalfConeAngle = params->at("halfConeAngle").get<float>();


        Initialize();
    }

    void AConeConstraint::Initialize()
    {

        ConeConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mPoint1 = mPoint1;
        constraint_settings.mTwistAxis1 = mTwistAxis1;
        constraint_settings.mPoint2 = mPoint2;
        constraint_settings.mTwistAxis2 = mTwistAxis2;
        constraint_settings.mHalfConeAngle = DegreesToRadians(mHalfConeAngle);
    

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json AConeConstraint::GetData(){
        json j;
        j["type"] = "Cone";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        j["point1"] = {mPoint1.GetX(), mPoint1.GetY(), mPoint1.GetZ()};
        j["point2"] = {mPoint2.GetX(), mPoint2.GetY(), mPoint2.GetZ()};
        return j;
    }
}