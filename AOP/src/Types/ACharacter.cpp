#include "ACharacter.h"

#include "../Helpers.h"
#include "../AWorld.h"

#include "Jolt/Physics/Collision/Shape/CapsuleShape.h"
#include "Jolt/Physics/Collision/Shape/DecoratedShape.h"
#include "Jolt/Physics/Collision/Shape/RotatedTranslatedShape.h"
#include "Jolt/Physics/Body/BodyCreationSettings.h"
#include "Jolt/Physics/Character/Character.h"
#include "Jolt/Physics/Character/CharacterVirtual.h"

namespace AOP
{
    InputParams::InputParams(const char *params)
    {
        json j = json::parse(params);

        if (j.contains("id"))
            mID = j.at("id");

        mInput = Vec3::sZero();
        if (j.contains("x"))
            mInput.SetX(j.at("x").get<double>());

        if (j.contains("z"))
            mInput.SetY(j.at("z").get<double>());

        if (j.contains("jump"))
            mJump = j.at("jump").get<bool>();

        if (j.contains("sprint"))
            mSprint = j.at("sprint").get<bool>();

        if (j.contains("crouch"))
            mCrouch = j.at("crouch").get<bool>();
    }

    ACharacter::ACharacter(const char *params)
    {
        json j = json::parse(params);
        delete &params;
        if (j.contains("position"))
            mPosition = Vec3(j.at("position").at(0).get<double>(), j.at("position").at(1).get<double>(), j.at("position").at(2).get<double>());
        if (j.contains("rotation"))
            mRotation = Quat(j.at("rotation").at(0).get<double>(), j.at("rotation").at(1).get<double>(), j.at("rotation").at(2).get<double>(), j.at("rotation").at(3).get<double>());

        if (j.contains("up"))
            mUp = Vec3(j.at("up").at(0).get<double>(), j.at("up").at(1).get<double>(), j.at("up").at(2).get<double>());

        if (j.contains("heightStanding"))
            mHeightStanding = j.at("heightStanding").get<float>();

        if (j.contains("radiusStanding"))
            mRadiusStanding = j.at("radiusStanding").get<float>();

        if (j.contains("heightCrouching"))
            mHeightCrouching = j.at("heightCrouching").get<float>();

        if (j.contains("radiusCrouching"))
            mRadiusCrouching = j.at("radiusCrouching").get<float>();

        if (j.contains("maxSlopeAngle"))
            mMaxSlopeAngle = DegreesToRadians(j.at("maxSlopeAngle").get<float>());

        if (j.contains("friction"))
            mFriction = j.at("friction").get<float>();

        if (j.contains("mass"))
            mMass = j.at("mass").get<float>();

        if (j.contains("gravityFactor"))
            mGravityFactor = j.at("gravityFactor").get<float>();

        if (j.contains("layer"))
            mLayer = Helpers::GetLayer(j.at("layer").get<std::string>().c_str());

        if (j.contains("activate"))
            mActivation = Helpers::GetActivation(j.at("activate").get<bool>());

        if (j.contains("canMoveWhileJumping"))
            mCanMoveWhileJumping = j.at("canMoveWhileJumping").get<bool>();

        if (j.contains("speed"))
            mSpeed = j.at("speed").get<double>();

        if (j.contains("sprintMultiplier"))
            mSprintMultiplier = j.at("sprintMultiplier").get<double>();

        if (j.contains("jumpForce"))
            mJumpForce = j.at("jumpForce").get<double>();

        Initialize();
    }

    void ACharacter::Initialize()
    {
        mStandingShape = RotatedTranslatedShapeSettings(Vec3(0, 0.5f * mHeightStanding - mRadiusStanding, 0), Quat::sIdentity(), new CapsuleShape((mHeightStanding * 0.5f) - mRadiusStanding, mRadiusStanding)).Create().Get();
        mCrouchingShape = RotatedTranslatedShapeSettings(Vec3(0, 0.5f * mHeightCrouching - mRadiusCrouching, 0), Quat::sIdentity(), new CapsuleShape((mHeightCrouching * 0.5f) - mRadiusCrouching, mRadiusCrouching)).Create().Get();

        Ref<CharacterSettings> settings = new CharacterSettings();
        settings->mMaxSlopeAngle = mMaxSlopeAngle;
        settings->mLayer = mLayer;
        settings->mShape = mStandingShape;
        settings->mFriction = mFriction;
        settings->mSupportingVolume = Plane(Vec3::sAxisY(), -mRadiusStanding);

        mCharacter = new Character(settings, mPosition, mRotation, 0, AWorld::GetInstance()->mPhysicsSystem);
        // character->SetShape(mStandingShape);
        mCharacter->AddToPhysicsSystem(mActivation);

        mID = mCharacter->GetBodyID().GetIndexAndSequenceNumber();
    }

    void ACharacter::PreSimulation(float inDeltaTime)
    {
        // Update camera pivot
        // mCameraPivot = GetCharacterPosition();
    }

    void ACharacter::HandleInput(InputParams params)
    {

        Vec3 controlInput = params.mInput;
        bool jump = params.mJump;
        bool sprint = params.mSprint;
        bool crouch = params.mCrouch;
        mCrouching = crouch;
        // Cancel movement in opposite direction of normal when touching something we can't walk up
        Vec3 movement_direction = controlInput;
        Character::EGroundState ground_state = mCharacter->GetGroundState();
        if (ground_state == Character::EGroundState::OnSteepGround || ground_state == Character::EGroundState::NotSupported)
        {
            Vec3 normal = mCharacter->GetGroundNormal();
            normal.SetY(0.0f);
            float dot = normal.Dot(movement_direction);
            if (dot < 0.0f)
                movement_direction -= (dot * normal) / normal.LengthSq();
        }

        // Stance switch
        float penetration_slop = AWorld::GetInstance()->mPhysicsSystem->GetPhysicsSettings().mPenetrationSlop;
        if (params.mCrouch)
        {
            mCharacter->SetShape(mCrouchingShape, 1.5f * penetration_slop);
        }
        else
        {
            mCharacter->SetShape(mStandingShape, 1.5f * penetration_slop);
        }

        if (mCanMoveWhileJumping || mCharacter->IsSupported())
        {
            // Update velocity
            Vec3 current_velocity = mCharacter->GetLinearVelocity();
            Vec3 desired_velocity = (params.mCrouch ? mCrouchSpeed : mSpeed) * (params.mSprint ? mSprintMultiplier : 1) * movement_direction;
            if (!desired_velocity.IsNearZero() || current_velocity.GetY() < 0.0f || !mCharacter->IsSupported())
                desired_velocity.SetY(current_velocity.GetY());
            Vec3 new_velocity = 0.75f * current_velocity + 0.25f * desired_velocity;
            // Jump
            if (jump && ground_state == Character::EGroundState::OnGround)
                new_velocity += Vec3(0, mJumpForce, 0);

            // Update the velocity

            mCharacter->SetLinearVelocity(new_velocity);
        }
    }

    void ACharacter::PostSimulation(float inDeltaTime)
    {
        mCharacter->PostSimulation(cCollisionTolerance);
    }
}