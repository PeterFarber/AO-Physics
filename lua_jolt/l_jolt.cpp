

#ifdef __cplusplus
#include "lua.hpp"
#else
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"
#endif

#include "JoltState.h"

// so that name mangling doesn't mess up function names
#ifdef __cplusplus
extern "C"
{
#endif

  static JoltState jolt_state;

  static int create_world(lua_State *L)
  {
    jolt_state.Init();
    return 0;
  }

  static int update_world(lua_State *L)
  {
    int steps = luaL_checknumber(L, 1);
    double deltaTime = luaL_checknumber(L, 2);

    // // Optional step: Before starting the physics simulation you can optimize the broad phase. This improves collision detection performance (it's pointless here because we only have 2 bodies).
    // // You should definitely not call this every frame or when e.g. streaming in a new level section as it is an expensive operation.
    // // Instead insert all new objects in batches instead of 1 at a time to keep the broad phase efficient.
    jolt_state.physics_system->OptimizeBroadPhase();

    while (steps > 0)
    {
      // For each jolt_state bodies
      for (BodyID body_id : jolt_state.bodies)
      {
        if (jolt_state.body_interface->IsActive(body_id))
        {
          // Output current position and velocity of the sphere
          RVec3 position = jolt_state.body_interface->GetCenterOfMassPosition(body_id);
          Vec3 velocity = jolt_state.body_interface->GetLinearVelocity(body_id);
          cout << "ID: " << body_id.GetIndexAndSequenceNumber() << " | " << "Position = (" << position.GetX() << ", " << position.GetY() << ", " << position.GetZ() << "), Velocity = (" << velocity.GetX() << ", " << velocity.GetY() << ", " << velocity.GetZ() << ")" << endl;

          // If you take larger steps than 1 / 60th of a second you need to do multiple collision steps in order to keep the simulation stable. Do 1 collision step per 1 / 60th of a second (round up).
          const int cCollisionSteps = 1;

          // Step the world
          jolt_state.physics_system->Update(deltaTime, cCollisionSteps, jolt_state.temp_allocator, jolt_state.job_system);
        }
      }
      steps--;
    }
    return 0;
  }

  static int destroy_world(lua_State *L)
  {
    // For each jolt_state bodies
    for (BodyID body_id : jolt_state.bodies)
    {
      // Remove the body from the physics system
      jolt_state.body_interface->RemoveBody(body_id);

      // Destroy the body. After this the body ID is no longer valid.
      jolt_state.body_interface->DestroyBody(body_id);
    }

    // Unregisters all types with the factory and cleans up the default material
    UnregisterTypes();

    // Destroy the factory
    delete Factory::sInstance;
    Factory::sInstance = nullptr;
    return 0;
  }

  static int create_box(lua_State *L)
  {
    double x_size = luaL_checknumber(L, 1);
    double y_size = luaL_checknumber(L, 2);
    double z_size = luaL_checknumber(L, 3);
    double x_pos = luaL_checknumber(L, 4);
    double y_pos = luaL_checknumber(L, 5);
    double z_pos = luaL_checknumber(L, 6);

    const char *motion_type_string = luaL_checkstring(L, 7); // D for dynamic, S for static, K for kinematic
    EMotionType motion_type;
    switch (motion_type_string[0])
    {
    case 'D':
      motion_type = EMotionType::Dynamic;
      break;
    case 'S':
      motion_type = EMotionType::Static;
      break;
    case 'K':
      motion_type = EMotionType::Kinematic;
      break;
    default:
      motion_type = EMotionType::Dynamic;
    }

    BodyCreationSettings box_settings(new BoxShape(Vec3(x_size, y_size, z_size), 0.5f, nullptr), RVec3(x_pos, y_pos, z_pos), Quat::sIdentity(), motion_type, Layers::NON_MOVING);
    BodyID box_id = jolt_state.body_interface->CreateAndAddBody(box_settings, EActivation::Activate);

    jolt_state.bodies.push_back(box_id);

    lua_pushnumber(L, box_id.GetIndexAndSequenceNumber());
    return 1;
  }

  static int create_sphere(lua_State *L)
  {
    double radius = luaL_checknumber(L, 1);                  // radius of the sphere
    double x_pos = luaL_checknumber(L, 2);                   // x-coordinate of the sphere's position
    double y_pos = luaL_checknumber(L, 3);                   // y-coordinate of the sphere's position
    double z_pos = luaL_checknumber(L, 4);                   // z-coordinate of the sphere's position
    const char *motion_type_string = luaL_checkstring(L, 5); // motion type of the sphere ('D' for dynamic, 'S' for static, 'K' for kinematic)

    EMotionType motion_type;
    switch (motion_type_string[0])
    {
    case 'D':
      motion_type = EMotionType::Dynamic;
      break;
    case 'S':
      motion_type = EMotionType::Static;
      break;
    case 'K':
      motion_type = EMotionType::Kinematic;
      break;
    default:
      motion_type = EMotionType::Dynamic;
    }

    BodyCreationSettings sphere_settings(new SphereShape(radius), RVec3(x_pos, y_pos, z_pos), Quat::sIdentity(), motion_type, Layers::MOVING);
    BodyID sphere_id = jolt_state.body_interface->CreateAndAddBody(sphere_settings, EActivation::Activate);

    jolt_state.bodies.push_back(sphere_id);

    lua_pushnumber(L, sphere_id.GetIndexAndSequenceNumber());

    return 1;
  }

  static int set_linear_velocity(lua_State *L)
  {
    int body_id = luaL_checknumber(L, 1);  // The index and sequence number of the body
    double x_vel = luaL_checknumber(L, 2); // The x-component of the linear velocity
    double y_vel = luaL_checknumber(L, 3); // The y-component of the linear velocity
    double z_vel = luaL_checknumber(L, 4); // The z-component of the linear velocity

    BodyID body_id_obj(body_id);

    jolt_state.body_interface->SetLinearVelocity(body_id_obj, Vec3(x_vel, y_vel, z_vel));

    return 0;
  }

  // library to be registered
  static const struct luaL_Reg jolt_funcs[] = {
      {"create_world", create_world},
      {"update_world", update_world},
      {"destroy_world", destroy_world},

      {"create_box", create_box},
      {"create_sphere", create_sphere},
      {"set_linear_velocity", set_linear_velocity},
      {NULL, NULL} /* sentinel */
  };

  int luaopen_jolt(lua_State *L)
  {
    luaL_newlib(L, jolt_funcs);
    return 1;
  }

#ifdef __cplusplus
}
#endif
