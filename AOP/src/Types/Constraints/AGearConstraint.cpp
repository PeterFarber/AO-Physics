#include "AGearConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/GearConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    AGearConstraint::AGearConstraint(const char *params) : AConstraint(params)
    {
        json j = json::parse(params);

        if (j.contains("numTeeth1"))
            mNumTeeth1 = j.at("numTeeth1").get<float>();
        if (j.contains("numTeeth2"))
            mNumTeeth2 = j.at("numTeeth2").get<float>();

        if (j.contains("hingeAxis1"))
            mHingeAxis1 = Vec3(j.at("hingeAxis1").at(0).get<double>(), j.at("hingeAxis1").at(1).get<double>(), j.at("hingeAxis1").at(2).get<double>());

        if (j.contains("hingeAxis2"))
            mHingeAxis2 = Vec3(j.at("hingeAxis2").at(0).get<double>(), j.at("hingeAxis2").at(1).get<double>(), j.at("hingeAxis2").at(2).get<double>());

        if (j.contains("ratio"))
            mRatio = j.at("ratio").get<float>();

        if(mNumTeeth1 != 1 || mNumTeeth2 != 1){
            mRatio = mNumTeeth1 / mNumTeeth2;
        }

        delete &params;

        Initialize();
    }

    void AGearConstraint::Initialize()
    {

        GearConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mHingeAxis1 = mHingeAxis1;
        constraint_settings.mHingeAxis2 = mHingeAxis2;
        constraint_settings.mRatio = mRatio;

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json AGearConstraint::GetData()
    {
        json j;
        j["type"] = "Gear";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        return j;
    }
}