#ifndef AOP_CHARACTER_H
#define AOP_CHARACTER_H

// #include "Jolt/Physics/Collision/Shape/RotatedTranslatedShape.h"
#include "../Core/Core.h"
#include "../Core/Layers.h"

#include "Jolt/Physics/Character/Character.h"


namespace AOP
{

    class InputParams
    {
    public:
        uint32 mID;
        Vec3 mInput = Vec3::sZero();
        bool mJump = false;
        bool mSprint = false;
        bool mCrouch = false;

        InputParams(const char *params);

    };

    class ACharacter
    {
    private:
        const float cCollisionTolerance = 0.05f;

    public:
        uint32 mID;
        Character *character = nullptr;

        // Custom
        bool mCanMoveWhileJumping = false;
        double mSpeed = 1.0;
        double mSprintSpeed = 2.0;
        double mJumpForce = 6.0;

        // Physics
        float mHeightStanding = 1.35f;
        float mRadiusStanding = 0.3f;
        float mMaxSlopeAngle = DegreesToRadians(45.0f);
        float mFriction = 0.5f;
        float mMass = 0.0f;
        float mGravityFactor = 1.0f;

        Vec3 mPosition = Vec3::sZero();
        Quat mRotation = Quat::sIdentity();
        Vec3 mUp;

        ObjectLayer mLayer = Layers::MOVING;
        EActivation mActivation = EActivation::Activate;

    public:
        ACharacter(const char *params);

        void Initialize();
        void PreSimulation(float inDeltaTime);
        void HandleInput(InputParams params);
        void PostSimulation(float inDeltaTime);
    };
}
#endif