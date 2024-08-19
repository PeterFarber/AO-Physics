#ifndef AOP_PARAMS_H
#define AOP_PARAMS_H

#include "Core.h"
#include "Helpers.h"

class WorldParams
{
private:
    Vec3 gravity;
    double timeStep;
    int steps;

public:
    WorldParams(const char *params)
    {
        json j = json::parse(params);
        gravity = Vec3(j.at("gravity").at(0).get<double>(), j.at("gravity").at(1).get<double>(), j.at("gravity").at(2).get<double>());
        timeStep = j.at("timeStep").get<double>();
        steps = j.at("steps").get<int>();
    }

    Vec3 GetGravity() { return gravity; }
    double GetTimeStep() { return timeStep; }
    int GetSteps() { return steps; }
};


class BodyParams
{
protected:
    Vec3 position;
    EMotionType motionType;
    ObjectLayer layer;

public:
    BodyParams(const char *params)
    {
        json j = json::parse(params);
        position = Vec3(j.at("position").at(0).get<double>(), j.at("position").at(1).get<double>(), j.at("position").at(2).get<double>());
        motionType = Helpers::GetMotionType(j.at("motionType").get<std::string>());
        layer = Helpers::GetLayer(j.at("layer").get<std::string>().c_str());
    }

    Vec3 GetPosition() { return position; }
    EMotionType GetMotionType() { return motionType; }
    ObjectLayer GetLayer() { return layer; }
};

class SphereParams : public BodyParams
{
private:
    double radius;

public:
    SphereParams(const char *params) : BodyParams(params)
    {
        json j = json::parse(params);
        radius = j.at("radius").get<double>();
    }

    double GetRadius() { return radius; }

};

class BoxParams : public BodyParams
{
private:
    Vec3 size;

public:
    BoxParams(const char *params) : BodyParams(params)
    {
        json j = json::parse(params);
        size = Vec3(j.at("size").at(0).get<double>(), j.at("size").at(1).get<double>(), j.at("size").at(2).get<double>());
    }

    Vec3 GetSize() { return size; }
};

class CapsuleParams : public BodyParams
{
private:
    double radius;
    double height;

public:
    CapsuleParams(const char *params) : BodyParams(params)
    {
        json j = json::parse(params);
        radius = j.at("radius").get<double>();
        height = j.at("height").get<double>();
    }

    double GetRadius() { return radius; }
    double GetHeight() { return height; }
};

class CylinderParams : public BodyParams
{
private:
    double radius;
    double height;

public:
    CylinderParams(const char *params) : BodyParams(params)
    {
        json j = json::parse(params);
        radius = j.at("radius").get<double>();
        height = j.at("height").get<double>();
    }

    double GetRadius() { return radius; }
    double GetHeight() { return height; }
};

class ModParams
{
protected:
    BodyID bodyID;
    Vec3 velocity;

public:
    ModParams(const char *params)
    {
        json j = json::parse(params);
        bodyID = BodyID(j.at("bodyID").get<uint32_t>());
        velocity = Vec3(j.at("velocity").at(0).get<double>(), j.at("velocity").at(1).get<double>(), j.at("velocity").at(2).get<double>());
    }

    Vec3 GetVelocity() { return velocity; }
    BodyID GetBodyID() { return bodyID; }
};


#endif