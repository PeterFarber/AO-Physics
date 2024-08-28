#ifndef AOP_BODY_H
#define AOP_BODY_H

#include "../Core/Core.h"
#include "../Helpers.h"

namespace AOP
{

    class ABody
    {
    public:
        uint32 mID;
        Body *body = nullptr;

        json mData;

        EShapeSubType mShape = EShapeSubType::Box;

        Vec3 mPosition = Vec3::sZero();
        Quat mRotation = Quat::sIdentity();
        Vec3 mLinearVelocity = Vec3::sZero();
        Vec3 mAngularVelocity = Vec3::sZero();

        EMotionType mMotionType = EMotionType::Dynamic;
        EMotionQuality mMotionQuality = EMotionQuality::Discrete;
        ObjectLayer mLayer = Helpers::GetLayer("MOVING");
        EActivation mActivation = EActivation::Activate;

        bool mEnhancedInternalEdgeRemoval = false;
        bool mAllowSleeping = true;
        float mFriction = 0.2f;
        float mRestitution = 0.0f;
        float mLinearDamping = 0.05f;
        float mAngularDamping = 0.05f;
        float mMaxLinearVelocity = 500.0f;
        float mMaxAngularVelocity = 0.25f * JPH_PI * 60.0f;
        float mGravityFactor = 1.0f;

        /*
            Shape Specific Params
        */

        Vec3 mSize = Vec3(1, 1, 1);
        float mRadius = 0.5f;
        float mHeight = 2.0f;

    public:
        ABody(const char *params);
        void Initialize();
        void SetLinearVelocity(Vec3 velocity);
        void SetAngularVelocity(Vec3 velocity);
        void AddForce(Vec3 force);
        void AddTorque(Vec3 torque);
        void AddImpulse(Vec3 impulse);
        void AddLinearVelocity(Vec3 velocity);
        void AddAngularVelocity(Vec3 velocity);
        json CastRay(Vec3 direction);

        void SetData(const char *params);
        json GetData();


        virtual ~ABody();
    };
}
#endif