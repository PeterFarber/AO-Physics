
#include "AConstraint.h"

#include "Jolt/Physics/Constraints/DistanceConstraint.h"
#include "Jolt/Physics/Constraints/FixedConstraint.h"
#include "Jolt/Physics/Constraints/PointConstraint.h"   
#include "Jolt/Physics/Constraints/PulleyConstraint.h"

#include "../Helpers.h"
#include "../AWorld.h"

namespace AOP
{

    AConstraint::AConstraint(const char *params)
    {
        json j = json::parse(params);

        if (j.contains("body1ID"))
            mBody1 = Helpers::GetBody(AWorld::GetInstance()->mPhysicsSystem, BodyID(j.at("body1ID").get<uint32_t>()));
        if (j.contains("body2ID"))
            mBody2 = Helpers::GetBody(AWorld::GetInstance()->mPhysicsSystem, BodyID(j.at("body2ID").get<uint32_t>()));

        if (j.contains("type"))
            mType = Helpers::GetConstraintSubType(j.at("type").get<std::string>());
        if (j.contains("space"))
            mSpace = Helpers::GetConstraintSpace(j.at("space").get<std::string>());
        if (j.contains("autoDetectPoint"))
            mAutoDetectPoint = j.at("autoDetectPoint").get<bool>();

        if (j.contains("point1"))
            mPoint1 = Vec3(j.at("point1").at(0).get<double>(), j.at("point1").at(1).get<double>(), j.at("point1").at(2).get<double>());
        if (j.contains("axisX1"))
            mAxisX1 = Vec3(j.at("axisX1").at(0).get<double>(), j.at("axisX1").at(1).get<double>(), j.at("axisX1").at(2).get<double>());
        if (j.contains("axisY1"))
            mAxisY1 = Vec3(j.at("axisY1").at(0).get<double>(), j.at("axisY1").at(1).get<double>(), j.at("axisY1").at(2).get<double>());
        if (j.contains("twistAxis1"))
            mTwistAxis1 = Vec3(j.at("twistAxis1").at(0).get<double>(), j.at("twistAxis1").at(1).get<double>(), j.at("twistAxis1").at(2).get<double>());

        if (j.contains("hingeAxis1"))
            mHingeAxis1 = Vec3(j.at("hingeAxis1").at(0).get<double>(), j.at("hingeAxis1").at(1).get<double>(), j.at("hingeAxis1").at(2).get<double>());
        if (j.contains("normalAxis1"))
            mNormalAxis1 = Vec3(j.at("normalAxis1").at(0).get<double>(), j.at("normalAxis1").at(1).get<double>(), j.at("normalAxis1").at(2).get<double>());

        if (j.contains("point2"))
            mPoint2 = Vec3(j.at("point2").at(0).get<double>(), j.at("point2").at(1).get<double>(), j.at("point2").at(2).get<double>());
        if (j.contains("axisX2"))
            mAxisX2 = Vec3(j.at("axisX2").at(0).get<double>(), j.at("axisX2").at(1).get<double>(), j.at("axisX2").at(2).get<double>());
        if (j.contains("axisY2"))
            mAxisY2 = Vec3(j.at("axisY2").at(0).get<double>(), j.at("axisY2").at(1).get<double>(), j.at("axisY2").at(2).get<double>());
        if (j.contains("twistAxis2"))
            mTwistAxis2 = Vec3(j.at("twistAxis2").at(0).get<double>(), j.at("twistAxis2").at(1).get<double>(), j.at("twistAxis2").at(2).get<double>());

        if (j.contains("hingeAxis2"))
            mHingeAxis2 = Vec3(j.at("hingeAxis2").at(0).get<double>(), j.at("hingeAxis2").at(1).get<double>(), j.at("hingeAxis2").at(2).get<double>());
        if (j.contains("normalAxis2"))
            mNormalAxis2 = Vec3(j.at("normalAxis2").at(0).get<double>(), j.at("normalAxis2").at(1).get<double>(), j.at("normalAxis2").at(2).get<double>());

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
        if (j.contains("minDistance"))
            mMinDistance = j.at("minDistance").get<float>();
        if (j.contains("maxDistance"))
            mMaxDistance = j.at("maxDistance").get<float>();
        if (j.contains("limitsMin"))
            mLimitsMin = j.at("limitsMin").get<float>();
        if (j.contains("limitsMax"))
            mLimitsMax = j.at("limitsMax").get<float>();
        if (j.contains("maxFrictionTorque"))
            mMaxFrictionTorque = j.at("maxFrictionTorque").get<float>();
        if (j.contains("halfConeAngle"))
            mHalfConeAngle = j.at("halfConeAngle").get<float>();

        Initialize();
    }

    void AConstraint::Initialize()
    {
        if (mBody1 == nullptr || mBody2 == nullptr)
        {
            return;
        }

        TwoBodyConstraintSettings *constraint_settings = nullptr;

        switch (mType)
        {
        case EConstraintSubType::Pulley:
        {
            PulleyConstraintSettings pulley_constraint_settings;
            pulley_constraint_settings.mBodyPoint1 = mBodyPoint1;
            pulley_constraint_settings.mBodyPoint2 = mBodyPoint2;
            pulley_constraint_settings.mFixedPoint1 = mFixedPoint1;
            pulley_constraint_settings.mFixedPoint2 = mFixedPoint2;
            pulley_constraint_settings.mRatio = mRatio;
            pulley_constraint_settings.mMinLength = mMinLength;
            pulley_constraint_settings.mMaxLength = mMaxLength;

            constraint_settings = &pulley_constraint_settings;
            break;
        }
        case EConstraintSubType::Fixed:
        {
            FixedConstraintSettings fixed_constraint_settings;
            fixed_constraint_settings.mAutoDetectPoint = mAutoDetectPoint;
            fixed_constraint_settings.mPoint1 = mPoint1;
            fixed_constraint_settings.mAxisX1 = mAxisX1;
            fixed_constraint_settings.mAxisY1 = mAxisY1;
            fixed_constraint_settings.mPoint2 = mPoint2;
            fixed_constraint_settings.mAxisX2 = mAxisX2;
            fixed_constraint_settings.mAxisY2 = mAxisY2;

            constraint_settings = &fixed_constraint_settings;
            break;
        }
        case EConstraintSubType::Point:
        {
            PointConstraintSettings point_constraint_settings;
            point_constraint_settings.mPoint1 = mPoint1;
            point_constraint_settings.mPoint2 = mPoint2;
            constraint_settings = &point_constraint_settings;
            break;
        }
        case EConstraintSubType::Distance:
        {
            DistanceConstraintSettings distance_constraint_settings;
            distance_constraint_settings.mPoint1 = mPoint1;
            distance_constraint_settings.mPoint2 = mPoint2;
            distance_constraint_settings.mMinDistance = mMinDistance;
            distance_constraint_settings.mMaxDistance = mMaxDistance;
            constraint_settings = &distance_constraint_settings;
            break;
        }
        default:
            break;
        }

        if (constraint_settings != nullptr)
        {
            constraint = constraint_settings->Create(*mBody1, *mBody2);
            mID = reinterpret_cast<uint32>(&constraint);
            AWorld::GetInstance()->mPhysicsSystem->AddConstraint(constraint);
        }
    }
}