#include "AHingeConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/HingeConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    AHingeConstraint::AHingeConstraint(const char *params) : AConstraint(params)
    {
        json j = json::parse(params);
        // delete &params;

        if (j.contains("point1"))
            mPoint1 = Vec3(j.at("point1").at(0).get<double>(), j.at("point1").at(1).get<double>(), j.at("point1").at(2).get<double>());
        if (j.contains("hingeAxis1"))
            mHingeAxis1 = Vec3(j.at("hingeAxis1").at(0).get<double>(), j.at("hingeAxis1").at(1).get<double>(), j.at("hingeAxis1").at(2).get<double>());
        if (j.contains("normalAxis1"))
            mNormalAxis1 = Vec3(j.at("normalAxis1").at(0).get<double>(), j.at("normalAxis1").at(1).get<double>(), j.at("normalAxis1").at(2).get<double>());

        if (j.contains("point2"))
            mPoint2 = Vec3(j.at("point2").at(0).get<double>(), j.at("point2").at(1).get<double>(), j.at("point2").at(2).get<double>());
        if (j.contains("hingeAxis2"))
            mHingeAxis2 = Vec3(j.at("hingeAxis2").at(0).get<double>(), j.at("hingeAxis2").at(1).get<double>(), j.at("hingeAxis2").at(2).get<double>());
        if (j.contains("normalAxis2"))
            mNormalAxis2 = Vec3(j.at("normalAxis2").at(0).get<double>(), j.at("normalAxis2").at(1).get<double>(), j.at("normalAxis2").at(2).get<double>());

        if (j.contains("limitsMin"))
            mLimitsMin = j.at("limitsMin").get<float>();
        if (j.contains("limitsMax"))
            mLimitsMax = j.at("limitsMax").get<float>();

        if (j.contains("maxFrictionTorque"))
            mMaxFrictionTorque = j.at("maxFrictionTorque").get<float>();

        if (j.contains("limitsSpringSettings")){
            SpringSettings settings;	
            if(j.at("limitsSpringSettings").at("mode").get<std::string>() == "FrequencyAndDamping"){
                settings.mMode = ESpringMode::FrequencyAndDamping;
            }else{
                settings.mMode = ESpringMode::StiffnessAndDamping;
            }
            if(j.at("limitsSpringSettings").contains("stiffness"))
                settings.mStiffness = j.at("limitsSpringSettings").at("stiffness").get<float>();
            if (j.at("limitsSpringSettings").contains("frequency"))
                settings.mFrequency = j.at("limitsSpringSettings").at("frequency").get<float>();
            if (j.at("limitsSpringSettings").contains("damping"))
                settings.mDamping = j.at("limitsSpringSettings").at("damping").get<float>();
            mLimitsSpringSettings = settings;
        }
        if (j.contains("motorSettings"))
            mMotorSettings = MotorSettings(j.at("motorSettings").at("frequency").get<float>(), j.at("motorSettings").at("damping").get<float>());
        
        if(j.contains("motorState"))
            mMotorState = Helpers::GetMotorState(j.at("motorState").get<std::string>());

        if(j.contains("targetAngularVelocity"))
            mTargetAngularVelocity = j.at("targetAngularVelocity").get<float>();

        if(j.contains("targetAngle"))
            mTargetAngle = j.at("targetAngle").get<float>();

        Initialize();
    }

    void AHingeConstraint::Initialize()
    {

        HingeConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mPoint1 = mPoint1;
        constraint_settings.mHingeAxis1 = mHingeAxis1;
        constraint_settings.mNormalAxis1 = mNormalAxis1;
        constraint_settings.mPoint2 = mPoint2;
        constraint_settings.mHingeAxis2 = mHingeAxis2;
        constraint_settings.mNormalAxis2 = mNormalAxis2;
        constraint_settings.mLimitsMin = DegreesToRadians(mLimitsMin);
        constraint_settings.mLimitsMax = DegreesToRadians(mLimitsMax);
        constraint_settings.mLimitsSpringSettings = mLimitsSpringSettings;
        constraint_settings.mMaxFrictionTorque = mMaxFrictionTorque;
        constraint_settings.mMotorSettings = mMotorSettings;

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json AHingeConstraint::GetData()
    {
        json j;
        j["type"] = "Hinge";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        j["point1"] = {mPoint1.GetX(), mPoint1.GetY(), mPoint1.GetZ()};
        j["point2"] = {mPoint2.GetX(), mPoint2.GetY(), mPoint2.GetZ()};
        return j;
    }
}