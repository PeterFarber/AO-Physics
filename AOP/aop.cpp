

#ifdef __cplusplus
#include "lua.hpp"
#else
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"
#endif

#include "src/AWorld.h"
// #include "src/Helpers.h"
// #include "src/Params.h"

// so that name mangling doesn't mess up function names
#ifdef __cplusplus
extern "C"
{
#endif

  static int l_create_character(lua_State *L)
  {
    uint32 body_id = AOP::AWorld::GetInstance()->mCharacterManager->CreateCharacter(luaL_checkstring(L, 1));
    lua_pushnumber(L, body_id);
    return 1;
  }

  static int l_move_character(lua_State *L)
  {
    AOP::AWorld::GetInstance()->mCharacterManager->MoveCharacter(luaL_checkstring(L, 1));
    return 0;
  }

  static int l_create_world(lua_State *L)
  {
    WorldParams world_params(luaL_checkstring(L, 1));
    AOP::AWorld::GetInstance()->Create(world_params);
    return 0;
  }

  static int l_update_world(lua_State *L)
  {
    AOP::AWorld::GetInstance()->Update();
    return 0;
  }

  static int l_destroy_world(lua_State *L)
  {
    AOP::AWorld::GetInstance()->Destroy();
    return 0;
  }

  static int l_get_world_state(lua_State *L)
  {
    json world_state_json = AOP::AWorld::GetInstance()->GetWorldState();
    lua_pushstring(L, world_state_json.dump().c_str());
    return 1;
  }

  static int l_create_body(lua_State *L)
  {

    uint32 body_id = AOP::AWorld::GetInstance()->mBodyManager->CreateBody(luaL_checkstring(L, 1));

    lua_pushnumber(L, body_id);
    return 1;
  }

  static int l_set_linear_velocity(lua_State *L)
  {
    ModParams mod_params(luaL_checkstring(L, 1));

    AOP::AWorld::GetInstance()->SetLinearVelocity(mod_params);

    return 0;
  }

  static int l_add_constraint(lua_State *L)
  {

    AOP::AWorld::GetInstance()->mConstraintManager->AddConstraint(luaL_checkstring(L, 1));

    return 0;
  }

  // library to be registered
  static const struct luaL_Reg aop_funcs[] = {
      {"add_character", l_create_character},
      {"move_character", l_move_character},

      {"world_create", l_create_world},
      {"world_update", l_update_world},
      {"world_destroy", l_destroy_world},
      {"get_world_state", l_get_world_state},
      {"set_linear_velocity", l_set_linear_velocity},


      {"add_body", l_create_body},

      {"add_constraint", l_add_constraint},
      {NULL, NULL} /* sentinel */
  };

  int luaopen_AOP(lua_State *L)
  {
    luaL_newlib(L, aop_funcs);
    return 1;
  }

#ifdef __cplusplus
}
#endif

// static int update_world(lua_State *L)
// {
//   int steps = luaL_checknumber(L, 1);
//   double deltaTime = luaL_checknumber(L, 2);

//   // // Optional step: Before starting the physics simulation you can optimize the broad phase. This improves collision detection performance (it's pointless here because we only have 2 bodies).
//   // // You should definitely not call this every frame or when e.g. streaming in a new level section as it is an expensive operation.
//   // // Instead insert all new objects in batches instead of 1 at a time to keep the broad phase efficient.
//   world_state.physics_system->OptimizeBroadPhase();

//   while (steps > 0)
//   {

//     // If you take larger steps than 1 / 60th of a second you need to do multiple collision steps in order to keep the simulation stable. Do 1 collision step per 1 / 60th of a second (round up).
//     const int cCollisionSteps = 1;

//     world_state.physics_system->Update(deltaTime, cCollisionSteps, world_state.temp_allocator, world_state.job_system);

//     steps--;
//   }
//   return 0;
// }

// static int destroy_world(lua_State *L)
// {
//   // For each jolt_state bodies
//   BodyIDVector bodies;
//   world_state.physics_system->GetBodies(bodies);
//   for (BodyID body_id : bodies)
//   {
//     // Remove the body from the physics system
//     world_state.body_interface->RemoveBody(body_id);

//     // Destroy the body. After this the body ID is no longer valid.
//     world_state.body_interface->DestroyBody(body_id);
//   }

//   // Unregisters all types with the factory and cleans up the default material
//   UnregisterTypes();

//   // Destroy the physics system
//   delete world_state.physics_system;

//   // Destroy the factory
//   delete Factory::sInstance;
//   Factory::sInstance = nullptr;
//   return 0;
// }

// static int create_floor(lua_State *L)
// {
//   double x_size = luaL_checknumber(L, 1);
//   double y_size = luaL_checknumber(L, 2);
//   double z_size = luaL_checknumber(L, 3);
//   double x_pos = luaL_checknumber(L, 4);
//   double y_pos = luaL_checknumber(L, 5);
//   double z_pos = luaL_checknumber(L, 6);

//   BoxShapeSettings floor_shape_settings(Vec3(x_size * 0.5f, y_size * 0.5f, z_size * 0.5f));
//   floor_shape_settings.SetEmbedded(); // A ref counted object on the stack (base class RefTarget) should be marked as such to prevent it from being freed when its reference count goes to 0.

//   // Create the shape
//   ShapeSettings::ShapeResult floor_shape_result = floor_shape_settings.Create();
//   ShapeRefC floor_shape = floor_shape_result.Get(); // We don't expect an error here, but you can check floor_shape_result for HasError() / GetError()

//   // Create the settings for the body itself. Note that here you can also set other properties like the restitution / friction.
//   BodyCreationSettings floor_settings(floor_shape, RVec3(x_pos, y_pos, z_pos), Quat::sIdentity(), EMotionType::Static, Layers::NON_MOVING);

//   // Create the actual rigid body
//   Body *floor = world_state.body_interface->CreateBody(floor_settings); // Note that if we run out of bodies this can return nullptr

//   // Add it to the world
//   world_state.body_interface->AddBody(floor->GetID(), EActivation::DontActivate);

//   lua_pushnumber(L, floor->GetID().GetIndexAndSequenceNumber());
//   return 1;
// }

// static int create_box(lua_State *L)
// {
//   double x_size = luaL_checknumber(L, 1);
//   double y_size = luaL_checknumber(L, 2);
//   double z_size = luaL_checknumber(L, 3);
//   double x_pos = luaL_checknumber(L, 4);
//   double y_pos = luaL_checknumber(L, 5);
//   double z_pos = luaL_checknumber(L, 6);
//   const char *motion_type_string = luaL_checkstring(L, 7);
//   const char *layer_string = luaL_checkstring(L, 8);

//   JPH::ObjectLayer layer = Helpers::GetLayer(layer_string);
//   EMotionType motion_type = Helpers::GetMotionType(motion_type_string);

//   BodyCreationSettings box_settings(new BoxShape(Vec3(x_size * 0.5f, y_size * 0.5f, z_size * 0.5f)), RVec3(x_pos, y_pos, z_pos), Quat::sIdentity(), motion_type, layer);
//   box_settings.mMotionQuality = EMotionQuality::LinearCast;
//   box_settings.mEnhancedInternalEdgeRemoval = true;
//   box_settings.mAllowSleeping = false;

//   BodyID box_id = world_state.body_interface->CreateAndAddBody(box_settings, EActivation::Activate);

//   lua_pushnumber(L, box_id.GetIndexAndSequenceNumber());
//   return 1;
// }

// static int create_sphere(lua_State *L)
// {
//   double radius = luaL_checknumber(L, 1);                  // radius of the sphere
//   double x_pos = luaL_checknumber(L, 2);                   // x-coordinate of the sphere's position
//   double y_pos = luaL_checknumber(L, 3);                   // y-coordinate of the sphere's position
//   double z_pos = luaL_checknumber(L, 4);                   // z-coordinate of the sphere's position
//   const char *motion_type_string = luaL_checkstring(L, 5); // motion type of the sphere ('D' for dynamic, 'S' for static, 'K' for kinematic)

//   EMotionType motion_type = Helpers::GetMotionType(motion_type_string);

//   BodyCreationSettings sphere_settings(new SphereShape(radius), RVec3(x_pos, y_pos, z_pos), Quat::sIdentity(), motion_type, Layers::MOVING);
//   sphere_settings.mMotionQuality = EMotionQuality::LinearCast;
//   sphere_settings.mEnhancedInternalEdgeRemoval = true;
//   sphere_settings.mAllowSleeping = false;

//   BodyID sphere_id = world_state.body_interface->CreateAndAddBody(sphere_settings, EActivation::Activate);

//   lua_pushnumber(L, sphere_id.GetIndexAndSequenceNumber());

//   return 1;
// }

// static int create_capsule(lua_State *L)
// {
//   double radius = luaL_checknumber(L, 1);                  // radius of the capsule
//   double height = luaL_checknumber(L, 2);                  // half height of the capsule
//   double x_pos = luaL_checknumber(L, 3);                   // x-coordinate of the capsule's position
//   double y_pos = luaL_checknumber(L, 4);                   // y-coordinate of the capsule's position
//   double z_pos = luaL_checknumber(L, 5);                   // z-coordinate of the capsule's position
//   const char *motion_type_string = luaL_checkstring(L, 6); // motion type of the capsule ('D' for dynamic, 'S' for static, 'K' for kinematic)

//   EMotionType motion_type = Helpers::GetMotionType(motion_type_string);

//   BodyCreationSettings capsule_settings(new CapsuleShape((height * 0.5f) - (radius), radius), RVec3(x_pos, y_pos, z_pos), Quat::sIdentity(), motion_type, Layers::MOVING);
//   capsule_settings.mMotionQuality = EMotionQuality::LinearCast;
//   capsule_settings.mEnhancedInternalEdgeRemoval = true;
//   capsule_settings.mAllowSleeping = false;

//   BodyID capsule_id = world_state.body_interface->CreateAndAddBody(capsule_settings, EActivation::Activate);

//   lua_pushnumber(L, capsule_id.GetIndexAndSequenceNumber());

//   return 1;
// }

// static int set_linear_velocity(lua_State *L)
// {
//   int body_id = luaL_checknumber(L, 1);  // The index and sequence number of the body
//   double x_vel = luaL_checknumber(L, 2); // The x-component of the linear velocity
//   double y_vel = luaL_checknumber(L, 3); // The y-component of the linear velocity
//   double z_vel = luaL_checknumber(L, 4); // The z-component of the linear velocity

//   BodyID body_id_obj(body_id);

//   world_state.body_interface->SetLinearVelocity(body_id_obj, Vec3(x_vel, y_vel, z_vel));

//   return 0;
// }

// static int get_world_state(lua_State *L)
// {

//   json world_state_json;

//   world_state_json["bodies"] = json::array();
//   BodyIDVector bodies;
//   world_state.physics_system->GetBodies(bodies);
//   for (BodyID body_id : bodies)
//   {

//     const char *shape_type = Helpers::GetShapeType(world_state.body_interface->GetShape(body_id)->GetSubType());
//     const char *motion_type = Helpers::GetMotionType(world_state.body_interface->GetMotionType(body_id));

//     RVec3 position = world_state.body_interface->GetCenterOfMassPosition(body_id);
//     Vec3 size = world_state.body_interface->GetShape(body_id)->GetLocalBounds().GetSize();
//     Quat rotation = world_state.body_interface->GetRotation(body_id);
//     double radius = size.GetX() * 0.5f;
//     double height = size.GetY();

//     world_state_json["bodies"].push_back({{"id", body_id.GetIndexAndSequenceNumber()},
//                                      {"position", {position.GetX(), position.GetY(), position.GetZ()}},
//                                      {"rotation", {rotation.GetX(), rotation.GetY(), rotation.GetZ(), rotation.GetW()}},
//                                      {"size", {size.GetX(), size.GetY(), size.GetZ()}},
//                                      {"radius", radius},
//                                      {"height", height},
//                                      {"motion_type", motion_type},
//                                      {"shape", shape_type}});
//   }

//   lua_pushstring(L, world_state_json.dump().c_str());

//   return 1;
// }
