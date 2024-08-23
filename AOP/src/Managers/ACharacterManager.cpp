

#include "ACharacterManager.h"

#include "../AWorld.h"

namespace AOP
{

    ACharacterManager::ACharacterManager()
    {
    }

    ACharacterManager::~ACharacterManager()
    {
    }

    uint32 ACharacterManager::CreateCharacter(const char *params)
    {
        ACharacter *character = new ACharacter(params);
        mCharacters[character->mID] = character;
        return character->mID;
    }

    void ACharacterManager::MoveCharacter(const char *params)
    {
        InputParams input_params(params);
        if (mCharacters.find(input_params.mID) != mCharacters.end())
        {   
            ACharacter *character = mCharacters[input_params.mID];
            character->HandleInput(input_params);
        }
    }

    void ACharacterManager::PostSimulation(float deltaTime)
    {
        for (auto &character : mCharacters)
        {
            character.second->PostSimulation(deltaTime);
        }
    }
}