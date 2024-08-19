#ifndef AOP_CONTACT_LISTENER_H
#define AOP_CONTACT_LISTENER_H

#include "Core.h"

class MyContactListener : public ContactListener
{
public:
    virtual ValidateResult OnContactValidate(const Body &inBody1, const Body &inBody2, RVec3Arg inBaseOffset, const CollideShapeResult &inCollisionResult) override
    {
        cout << "Contact validate callback" << endl;

        // Allows you to ignore a contact before it is created (using layers to not make objects collide is cheaper!)
        return ValidateResult::AcceptAllContactsForThisBodyPair;
    }

    virtual void OnContactAdded(const Body &inBody1, const Body &inBody2, const ContactManifold &inManifold, ContactSettings &ioSettings) override
    {
        cout << "A contact was added" << endl;
    }

    virtual void OnContactPersisted(const Body &inBody1, const Body &inBody2, const ContactManifold &inManifold, ContactSettings &ioSettings) override
    {
        cout << "A contact was persisted" << endl;
    }

    virtual void OnContactRemoved(const SubShapeIDPair &inSubShapePair) override
    {
        cout << "A contact was removed" << endl;
    }
};


#endif