#include "AGearConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/GearConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    AGearConstraint::AGearConstraint(json * params) : AConstraint(params)
    {

        if (params->contains("numTeeth1"))
            mNumTeeth1 = params->at("numTeeth1").get<float>();
        if (params->contains("numTeeth2"))
            mNumTeeth2 = params->at("numTeeth2").get<float>();

        if (params->contains("hingeAxis1"))
            mHingeAxis1 = Vec3(params->at("hingeAxis1").at(0).get<double>(), params->at("hingeAxis1").at(1).get<double>(), params->at("hingeAxis1").at(2).get<double>());

        if (params->contains("hingeAxis2"))
            mHingeAxis2 = Vec3(params->at("hingeAxis2").at(0).get<double>(), params->at("hingeAxis2").at(1).get<double>(), params->at("hingeAxis2").at(2).get<double>());

        if (params->contains("ratio"))
            mRatio = params->at("ratio").get<float>();

        if(mNumTeeth1 != 1 || mNumTeeth2 != 1){
            mRatio = mNumTeeth1 / mNumTeeth2;
        }


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