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

        InputParams(json * params);

    };

    class ACharacter
    {
    private:
        const float cCollisionTolerance = 0.05f;

    public:
        uint32 mID;
        Character *mCharacter = nullptr;

        json mData;
        
        // Shapes
        RefConst<Shape> mStandingShape;
        RefConst<Shape> mCrouchingShape;

        // Position and Rotation 
        Vec3 mPosition = Vec3::sZero();
        Quat mRotation = Quat::sIdentity();
        Vec3 mUp = Vec3::sAxisY();

        // Abilities
        bool mCanMoveWhileJumping = false;
        bool mCanJump = true;

        // Movement
        double mSpeed = 1.0;
        double mSprintMultiplier = 2.0;
        double mCrouchSpeed = 0.5;
        double mJumpForce = 6.0;

        bool mCrouching = false;

        // Character Properties
        float mHeightStanding = 2.0f;
        float mRadiusStanding = 0.5f;
        float mHeightCrouching = 1.0f;
        float mRadiusCrouching = 0.5f;
        
        // Physics
        float mMaxSlopeAngle = DegreesToRadians(45.0f);
        float mFriction = 0.5f;
        float mMass = 0.0f;
        float mGravityFactor = 1.0f;


        ObjectLayer mLayer = Layers::MOVING;
        EActivation mActivation = EActivation::Activate;


    public:
        ACharacter(json * params);

        void Initialize();
        void PreSimulation(float inDeltaTime);
        void HandleInput(InputParams params);
        void PostSimulation(float inDeltaTime);

        void SetData(json * params);
        json GetData();

        json GetCharacterData();
    };
}
#endif