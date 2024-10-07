#include "ASliderConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/SliderConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    ASliderConstraint::ASliderConstraint(json * params) : AConstraint(params)
    {


    
        if (params->contains("point1"))
            mPoint1 = Vec3(params->at("point1").at(0).get<double>(), params->at("point1").at(1).get<double>(), params->at("point1").at(2).get<double>());

        if (params->contains("sliderAxis1"))
            mSliderAxis1 = Vec3(params->at("sliderAxis1").at(0).get<double>(), params->at("sliderAxis1").at(1).get<double>(), params->at("sliderAxis1").at(2).get<double>());

        if (params->contains("normalAxis1"))
            mNormalAxis1 = Vec3(params->at("normalAxis1").at(0).get<double>(), params->at("normalAxis1").at(1).get<double>(), params->at("normalAxis1").at(2).get<double>());

        if (params->contains("point2"))
            mPoint2 = Vec3(params->at("point2").at(0).get<double>(), params->at("point2").at(1).get<double>(), params->at("point2").at(2).get<double>());

        if (params->contains("sliderAxis2"))
            mSliderAxis2 = Vec3(params->at("sliderAxis2").at(0).get<double>(), params->at("sliderAxis2").at(1).get<double>(), params->at("sliderAxis2").at(2).get<double>());

        if (params->contains("normalAxis2"))
            mNormalAxis2 = Vec3(params->at("normalAxis2").at(0).get<double>(), params->at("normalAxis2").at(1).get<double>(), params->at("normalAxis2").at(2).get<double>());

        if (params->contains("limitsMin"))
            mLimitsMin = params->at("limitsMin").get<float>();

        if (params->contains("limitsMax"))
            mLimitsMax = params->at("limitsMax").get<float>();

        if (params->contains("limitsSpringSettings")){
            SpringSettings settings;	
            if(params->at("limitsSpringSettings").at("mode").get<std::string>() == "FrequencyAndDamping"){
                settings.mMode = ESpringMode::FrequencyAndDamping;
            }else{
                settings.mMode = ESpringMode::StiffnessAndDamping;
            }
            if(params->at("limitsSpringSettings").contains("stiffness"))
                settings.mStiffness = params->at("limitsSpringSettings").at("stiffness").get<float>();
            if (params->at("limitsSpringSettings").contains("frequency"))
                settings.mFrequency = params->at("limitsSpringSettings").at("frequency").get<float>();
            if (params->at("limitsSpringSettings").contains("damping"))
                settings.mDamping = params->at("limitsSpringSettings").at("damping").get<float>();
            mLimitsSpringSettings = settings;
        }
        if (params->contains("maxFrictionForce"))
            mMaxFrictionForce = params->at("maxFrictionForce").get<float>();

        if (params->contains("motorSettings"))
            mMotorSettings = MotorSettings(params->at("motorSettings").at("frequency").get<float>(), params->at("motorSettings").at("damping").get<float>());


        Initialize();
    }

    void ASliderConstraint::Initialize()
    {

        SliderConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mAutoDetectPoint = mAutoDetectPoint;
        if(!constraint_settings.mAutoDetectPoint){
            constraint_settings.mPoint1 = mPoint1;
            constraint_settings.mPoint2 = mPoint2;
        }
        constraint_settings.mSliderAxis1 = mSliderAxis1;
        constraint_settings.mNormalAxis1 = mNormalAxis1;
        constraint_settings.mSliderAxis2 = mSliderAxis2;
        constraint_settings.mNormalAxis2 = mNormalAxis2;
        constraint_settings.mLimitsMin = mLimitsMin;
        constraint_settings.mLimitsMax = mLimitsMax;
        constraint_settings.mLimitsSpringSettings = mLimitsSpringSettings;
        constraint_settings.mMaxFrictionForce = mMaxFrictionForce;
        constraint_settings.mMotorSettings = mMotorSettings;
    

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json ASliderConstraint::GetData()
    {
        json j;
        j["type"] = "Slider";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        j["point1"] = {mPoint1.GetX(), mPoint1.GetY(), mPoint1.GetZ()};
        j["point2"] = {mPoint2.GetX(), mPoint2.GetY(), mPoint2.GetZ()};
        return j;
    }
}