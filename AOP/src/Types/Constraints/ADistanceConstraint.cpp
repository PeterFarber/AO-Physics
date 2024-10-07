#include "ADistanceConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/DistanceConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    ADistanceConstraint::ADistanceConstraint(json * params) : AConstraint(params)
    {

        if (params->contains("point1"))
            mPoint1 = Vec3(params->at("point1").at(0).get<double>(), params->at("point1").at(1).get<double>(), params->at("point1").at(2).get<double>());
        if (params->contains("point2"))
            mPoint2 = Vec3(params->at("point2").at(0).get<double>(), params->at("point2").at(1).get<double>(), params->at("point2").at(2).get<double>());

        if (params->contains("minDistance"))
            mMinDistance = params->at("minDistance").get<float>();
        if (params->contains("maxDistance"))
            mMaxDistance = params->at("maxDistance").get<float>();

        if (params->contains("limitsSpringSettings"))
        {
            SpringSettings settings;
            if (params->at("limitsSpringSettings").at("mode").get<std::string>() == "FrequencyAndDamping")
            {
                settings.mMode = ESpringMode::FrequencyAndDamping;
            }
            else
            {
                settings.mMode = ESpringMode::StiffnessAndDamping;
            }
            if (params->at("limitsSpringSettings").contains("stiffness"))
                settings.mStiffness = params->at("limitsSpringSettings").at("stiffness").get<float>();
            if (params->at("limitsSpringSettings").contains("frequency"))
                settings.mFrequency = params->at("limitsSpringSettings").at("frequency").get<float>();
            if (params->at("limitsSpringSettings").contains("damping"))
                settings.mDamping = params->at("limitsSpringSettings").at("damping").get<float>();
            mLimitsSpringSettings = settings;
        }


        Initialize();
    }

    void ADistanceConstraint::Initialize()
    {

        DistanceConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mPoint1 = mPoint1;
        constraint_settings.mPoint2 = mPoint2;
        constraint_settings.mMinDistance = mMinDistance;
        constraint_settings.mMaxDistance = mMaxDistance;
        constraint_settings.mLimitsSpringSettings = mLimitsSpringSettings;

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json ADistanceConstraint::GetData()
    {
        json j;
        j["type"] = "Distance";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        j["point1"] = {mPoint1.GetX(), mPoint1.GetY(), mPoint1.GetZ()};
        j["point2"] = {mPoint2.GetX(), mPoint2.GetY(), mPoint2.GetZ()};
        return j;
    }
}