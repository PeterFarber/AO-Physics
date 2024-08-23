#ifndef AOP_CHARACTER_MANAGER_H
#define AOP_CHARACTER_MANAGER_H

#include "../Core/Core.h"
#include "../Types/ACharacter.h"

namespace AOP
{

    class ACharacterManager
    {
    private:
        std::map<uint32, ACharacter *> mCharacters;
        

    public:
        ACharacterManager();
        ~ACharacterManager();

        uint32 CreateCharacter(const char *params);
        void MoveCharacter(const char *params);

        void PostSimulation(float deltaTime);

    public:
        
    };

}
#endif