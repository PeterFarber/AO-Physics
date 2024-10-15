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
    InputParams::InputParams(json * params)
    {
        if (params->contains("id"))
            mID = params->at("id");

        if (params->contains("input"))
            mInput = Vec3(params->at("input").at(0).get<double>(), 0, params->at("input").at(1).get<double>());

        if (params->contains("jump"))
            mJump = params->at("jump").get<bool>();

        if (params->contains("sprint"))
            mSprint = params->at("sprint").get<bool>();

        if (params->contains("crouch"))
            mCrouch = params->at("crouch").get<bool>();
    }

    ACharacter::ACharacter(json * params)
    {

        if (params->contains("data")){
            mData = json::parse(params->at("data").get<std::string>());
        }

        if (params->contains("position"))
            mPosition = Vec3(params->at("position").at(0).get<double>(), params->at("position").at(1).get<double>(), params->at("position").at(2).get<double>());
        if (params->contains("rotation"))
            mRotation = Quat(params->at("rotation").at(0).get<double>(), params->at("rotation").at(1).get<double>(), params->at("rotation").at(2).get<double>(), params->at("rotation").at(3).get<double>());

        if (params->contains("up"))
            mUp = Vec3(params->at("up").at(0).get<double>(), params->at("up").at(1).get<double>(), params->at("up").at(2).get<double>());

        if (params->contains("heightStanding"))
            mHeightStanding = params->at("heightStanding").get<float>();

        if (params->contains("radiusStanding"))
            mRadiusStanding = params->at("radiusStanding").get<float>();

        if (params->contains("heightCrouching"))
            mHeightCrouching = params->at("heightCrouching").get<float>();

        if (params->contains("radiusCrouching"))
            mRadiusCrouching = params->at("radiusCrouching").get<float>();

        if (params->contains("maxSlopeAngle"))
            mMaxSlopeAngle = DegreesToRadians(params->at("maxSlopeAngle").get<float>());

        if (params->contains("friction"))
            mFriction = params->at("friction").get<float>();

        if (params->contains("mass"))
            mMass = params->at("mass").get<float>();

        if (params->contains("gravityFactor"))
            mGravityFactor = params->at("gravityFactor").get<float>();

        if (params->contains("layer"))
            mLayer = Helpers::GetLayer(params->at("layer").get<std::string>().c_str());

        if (params->contains("activate"))
            mActivation = Helpers::GetActivation(params->at("activate").get<bool>());

        if (params->contains("canMoveWhileJumping"))
            mCanMoveWhileJumping = params->at("canMoveWhileJumping").get<bool>();

        if (params->contains("speed"))
            mSpeed = params->at("speed").get<double>();

        if (params->contains("sprintMultiplier"))
            mSprintMultiplier = params->at("sprintMultiplier").get<double>();

        if (params->contains("jumpForce"))
            mJumpForce = params->at("jumpForce").get<double>();

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

    void ACharacter::SetData(json * params)
    {
        mData = *params;
    }

    json ACharacter::GetData()
    {
        return mData;
    }

    json ACharacter::GetCharacterData()
    {

        json character_data = Helpers::GetBodyData(AWorld::GetInstance()->mPhysicsSystem, mCharacter->GetBodyID());
        character_data["data"] = mData;
        if(mCrouching){
            character_data["height"] = mHeightCrouching;
            character_data["radius"] = mRadiusCrouching;
        }else{
            character_data["height"] = mHeightStanding;
            character_data["radius"] = mRadiusStanding;
        }
        return character_data;
    }
}    

