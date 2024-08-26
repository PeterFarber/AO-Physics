#include "AFixedConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/FixedConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    AFixedConstraint::AFixedConstraint(const char *params) : AConstraint(params)
    {
        json j = json::parse(params);

        if (j.contains("autoDetectPoint"))
            mAutoDetectPoint = j.at("autoDetectPoint").get<bool>();

        if (j.contains("point1"))
            mPoint1 = Vec3(j.at("point1").at(0).get<double>(), j.at("point1").at(1).get<double>(), j.at("point1").at(2).get<double>());
        if (j.contains("axisX1"))
            mAxisX1 = Vec3(j.at("axisX1").at(0).get<double>(), j.at("axisX1").at(1).get<double>(), j.at("axisX1").at(2).get<double>());
        if (j.contains("axisY1"))
            mAxisY1 = Vec3(j.at("axisY1").at(0).get<double>(), j.at("axisY1").at(1).get<double>(), j.at("axisY1").at(2).get<double>());
        if (j.contains("point2"))
            mPoint2 = Vec3(j.at("point2").at(0).get<double>(), j.at("point2").at(1).get<double>(), j.at("point2").at(2).get<double>());
        if (j.contains("axisX2"))
            mAxisX2 = Vec3(j.at("axisX2").at(0).get<double>(), j.at("axisX2").at(1).get<double>(), j.at("axisX2").at(2).get<double>());
        if (j.contains("axisY2"))
            mAxisY2 = Vec3(j.at("axisY2").at(0).get<double>(), j.at("axisY2").at(1).get<double>(), j.at("axisY2").at(2).get<double>());

        delete &params;

        Initialize();
    }

    void AFixedConstraint::Initialize()
    {

        FixedConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mAutoDetectPoint = mAutoDetectPoint;
        constraint_settings.mPoint1 = mPoint1;
        constraint_settings.mAxisX1 = mAxisX1;
        constraint_settings.mAxisY1 = mAxisY1;
        constraint_settings.mPoint2 = mPoint2;
        constraint_settings.mAxisX2 = mAxisX2;
        constraint_settings.mAxisY2 = mAxisY2;

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json AFixedConstraint::GetData()
    {
        json j;
        j["type"] = "Fixed";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        j["point1"] = {mPoint1.GetX(), mPoint1.GetY(), mPoint1.GetZ()};
        j["point2"] = {mPoint2.GetX(), mPoint2.GetY(), mPoint2.GetZ()};
        return j;
    }
}