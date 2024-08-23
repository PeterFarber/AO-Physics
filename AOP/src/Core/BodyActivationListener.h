#ifndef AOP_BODY_ACTIVATION_LISTENER_H
#define AOP_BODY_ACTIVATION_LISTENER_H

#include "../Core/Core.h"


#include "Jolt/Physics/Body/BodyActivationListener.h"

class MyBodyActivationListener : public BodyActivationListener
{
public:
    virtual void OnBodyActivated(const BodyID &inBodyID, uint64 inBodyUserData) override
    {
        // std::cout << "A body got activated" << std::endl;
    }

    virtual void OnBodyDeactivated(const BodyID &inBodyID, uint64 inBodyUserData) override
    {
        // std::cout << "A body went to sleep" << std::endl;
    }
};

#endif
