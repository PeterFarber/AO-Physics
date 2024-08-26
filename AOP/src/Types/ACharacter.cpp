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

        if (j.contains("input"))
            mInput = Vec3(j.at("input")[0], 0, j.at("input")[1]).Normalized();

        if (j.contains("jump"))
            mJump = j.at("jump");

        if (j.contains("sprint"))
            mSprint = j.at("sprint");

        if (j.contains("crouch"))
            mCrouch = j.at("crouch");
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

        if (j.contains("height_standing"))
            mHeightStanding = j.at("height_standing").get<float>();

        if (j.contains("radius_standing"))
            mRadiusStanding = j.at("radius_standing").get<float>();

        if (j.contains("max_slope_angle"))
            mMaxSlopeAngle = DegreesToRadians(j.at("max_slope_angle").get<float>());

        if (j.contains("friction"))
            mFriction = j.at("friction").get<float>();

        if (j.contains("mass"))
            mMass = j.at("mass").get<float>();

        if (j.contains("gravity_factor"))
            mGravityFactor = j.at("gravity_factor").get<float>();

        if (j.contains("layer"))
            mLayer = Helpers::GetLayer(j.at("layer").get<std::string>().c_str());

        if (j.contains("activate"))
            mActivation = Helpers::GetActivation(j.at("activate").get<bool>());

        if (j.contains("can_move_while_jumping"))
            mCanMoveWhileJumping = j.at("can_move_while_jumping").get<bool>();

        if (j.contains("speed"))
            mSpeed = j.at("speed").get<double>();

        if (j.contains("sprint_speed"))
            mSprintSpeed = j.at("sprint_speed").get<double>();

        if (j.contains("jump_force"))
            mJumpForce = j.at("jump_force").get<double>();

        Initialize();
    }

    void ACharacter::Initialize()
    {
        RefConst<Shape> standing_shape = RotatedTranslatedShapeSettings(Vec3(0, 0.5f * mHeightStanding + mRadiusStanding, 0), Quat::sIdentity(), new CapsuleShape(0.5f * mHeightStanding, mRadiusStanding)).Create().Get();

        Ref<CharacterSettings> settings = new CharacterSettings();
        settings->mMaxSlopeAngle = mMaxSlopeAngle;
        settings->mLayer = mLayer;
        settings->mShape = standing_shape;
        settings->mFriction = mFriction;
        settings->mSupportingVolume = Plane(Vec3::sAxisY(), -mRadiusStanding);

        character = new Character(settings, mPosition, mRotation, 0, AWorld::GetInstance()->mPhysicsSystem);
        character->AddToPhysicsSystem(mActivation);

        mID = character->GetBodyID().GetIndexAndSequenceNumber();
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

        // Cancel movement in opposite direction of normal when touching something we can't walk up
        Vec3 movement_direction = controlInput;
        Character::EGroundState ground_state = character->GetGroundState();
        if (ground_state == Character::EGroundState::OnSteepGround || ground_state == Character::EGroundState::NotSupported)
        {
            Vec3 normal = character->GetGroundNormal();
            normal.SetY(0.0f);
            float dot = normal.Dot(movement_direction);
            if (dot < 0.0f)
                movement_direction -= (dot * normal) / normal.LengthSq();
        }

        // Stance switch

        if (mCanMoveWhileJumping || character->IsSupported())
        {
            // Update velocity
            Vec3 current_velocity = character->GetLinearVelocity();
            Vec3 desired_velocity = mSpeed * movement_direction;
            if (!desired_velocity.IsNearZero() || current_velocity.GetY() < 0.0f || !character->IsSupported())
                desired_velocity.SetY(current_velocity.GetY());
            Vec3 new_velocity = 0.75f * current_velocity + 0.25f * desired_velocity;

            // Jump
            if (jump && ground_state == Character::EGroundState::OnGround)
                new_velocity += Vec3(0, mJumpForce, 0);

            // Update the velocity
            character->SetLinearVelocity(new_velocity);
        }
    }

    void ACharacter::PostSimulation(float inDeltaTime)
    {
        character->PostSimulation(cCollisionTolerance);
    }
}