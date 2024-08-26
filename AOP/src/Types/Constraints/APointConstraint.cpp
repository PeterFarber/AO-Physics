#include "APointConstraint.h"

#include "Jolt/Physics/Constraints/Constraint.h"
#include "Jolt/Physics/Constraints/PointConstraint.h"

#include "../../Helpers.h"
#include "../../AWorld.h"

namespace AOP
{

    APointConstraint::APointConstraint(const char *params) : AConstraint(params)
    {
        json j = json::parse(params);

        if (j.contains("point1"))
            mPoint1 = Vec3(j.at("point1").at(0).get<double>(), j.at("point1").at(1).get<double>(), j.at("point1").at(2).get<double>());
        if (j.contains("point2"))
            mPoint2 = Vec3(j.at("point2").at(0).get<double>(), j.at("point2").at(1).get<double>(), j.at("point2").at(2).get<double>());

        delete &params;

        Initialize();
    }

    void APointConstraint::Initialize()
    {

        PointConstraintSettings constraint_settings;
        constraint_settings.mSpace = mSpace;
        constraint_settings.mPoint1 = mPoint1;
        constraint_settings.mPoint2 = mPoint2;

        mConstraint = constraint_settings.Create(*mBody1, *mBody2);
        mID = reinterpret_cast<uint32>(mConstraint);
        AWorld::GetInstance()->mPhysicsSystem->AddConstraint(mConstraint);
    }

    json APointConstraint::GetData()
    {
        json j;
        j["type"] = "Point";
        j["id"] = mID; 
        j["body1ID"] = mBody1->GetID().GetIndexAndSequenceNumber();
        j["body2ID"] = mBody2->GetID().GetIndexAndSequenceNumber();
        j["point1"] = {mPoint1.GetX(), mPoint1.GetY(), mPoint1.GetZ()};
        j["point2"] = {mPoint2.GetX(), mPoint2.GetY(), mPoint2.GetZ()};
        return j;
    }

}