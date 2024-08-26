#include "ADistanceConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/DistanceConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    ADistanceConstraint::ADistanceConstraint(const char *params) : AConstraint(params)
    {
        json j = json::parse(params);

        if (j.contains("point1"))
            mPoint1 = Vec3(j.at("point1").at(0).get<double>(), j.at("point1").at(1).get<double>(), j.at("point1").at(2).get<double>());
        if (j.contains("point2"))
            mPoint2 = Vec3(j.at("point2").at(0).get<double>(), j.at("point2").at(1).get<double>(), j.at("point2").at(2).get<double>());

        if (j.contains("minDistance"))
            mMinDistance = j.at("minDistance").get<float>();
        if (j.contains("maxDistance"))
            mMaxDistance = j.at("maxDistance").get<float>();

        if (j.contains("limitsSpringSettings"))
        {
            SpringSettings settings;
            if (j.at("limitsSpringSettings").at("mode").get<std::string>() == "FrequencyAndDamping")
            {
                settings.mMode = ESpringMode::FrequencyAndDamping;
            }
            else
            {
                settings.mMode = ESpringMode::StiffnessAndDamping;
            }
            if (j.at("limitsSpringSettings").contains("stiffness"))
                settings.mStiffness = j.at("limitsSpringSettings").at("stiffness").get<float>();
            if (j.at("limitsSpringSettings").contains("frequency"))
                settings.mFrequency = j.at("limitsSpringSettings").at("frequency").get<float>();
            if (j.at("limitsSpringSettings").contains("damping"))
                settings.mDamping = j.at("limitsSpringSettings").at("damping").get<float>();
            mLimitsSpringSettings = settings;
        }

        delete &params;

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