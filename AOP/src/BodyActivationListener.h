#ifndef AOP_BODY_ACTIVATION_LISTENER_H
#define AOP_BODY_ACTIVATION_LISTENER_H

#include "Core.h"

class MyBodyActivationListener : public BodyActivationListener
{
public:
    virtual void OnBodyActivated(const BodyID &inBodyID, uint64 inBodyUserData) override
    {
        cout << "A body got activated" << endl;
    }

    virtual void OnBodyDeactivated(const BodyID &inBodyID, uint64 inBodyUserData) override
    {
        cout << "A body went to sleep" << endl;
    }
};

#endif
