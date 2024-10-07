#ifndef AOP_CHARACTER_MANAGER_H
#define AOP_CHARACTER_MANAGER_H

#include "../Core/Core.h"
#include "../Types/ACharacter.h"

namespace AOP
{

    class ACharacterManager
    {
    public:
        std::map<uint32, ACharacter *> mCharacters;
        

    public:
        ACharacterManager();
        ~ACharacterManager();

        uint32 CreateCharacter(json * params);
        void MoveCharacter(json * params);

        void PostSimulation(float deltaTime);

        std::map<uint32, ACharacter *> GetCharacters() { return mCharacters; }
        ACharacter *GetCharacter(uint32 id) { return mCharacters[id]; }

    public:
        
    };

}
#endif