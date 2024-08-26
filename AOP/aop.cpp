

#ifdef __cplusplus
#include "lua.hpp"
#else
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"
#endif

#include "src/AWorld.h"

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
    AOP::AWorld::GetInstance()->Create(luaL_checkstring(L, 1));
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

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 velocity = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    AOP::AWorld::GetInstance()->mBodyManager->SetLinearVelocity(body_id, velocity);

    return 0;
  }

  static int l_set_angular_velocity(lua_State *L)
  {

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 velocity = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    AOP::AWorld::GetInstance()->mBodyManager->SetAngularVelocity(body_id, velocity);

    return 0;
  }

  static int l_add_linear_velocity(lua_State *L)
  {

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 velocity = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    AOP::AWorld::GetInstance()->mBodyManager->AddLinearVelocity(body_id, velocity);

    return 0;
  }

  static int l_add_angular_velocity(lua_State *L)
  {

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 velocity = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    AOP::AWorld::GetInstance()->mBodyManager->AddAngularVelocity(body_id, velocity);

    return 0;
  }

  static int l_add_force(lua_State *L)
  {

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 force = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    AOP::AWorld::GetInstance()->mBodyManager->AddForce(body_id, force);

    return 0;
  }

  static int l_add_torque(lua_State *L)
  {

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 torque = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    AOP::AWorld::GetInstance()->mBodyManager->AddTorque(body_id, torque);

    return 0;
  }

  static int l_add_impulse(lua_State *L)
  {

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 impulse = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    AOP::AWorld::GetInstance()->mBodyManager->AddImpulse(body_id, impulse);

    return 0;
  }

  static int l_cast_ray(lua_State *L)
  {

    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 direction = Vec3(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));
    json hit_results = AOP::AWorld::GetInstance()->mBodyManager->CastRay(body_id, direction);

    lua_pushstring(L, hit_results.dump().c_str());
    return 1;
  }

  static int l_add_constraint(lua_State *L)
  {

    uint32 constraint_id = AOP::AWorld::GetInstance()->mConstraintManager->AddConstraint(luaL_checkstring(L, 1));
    lua_pushnumber(L, constraint_id);

    return 1;
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
      {"set_angular_velocity", l_set_angular_velocity},
      {"add_linear_velocity", l_add_linear_velocity},
      {"add_angular_velocity", l_add_angular_velocity},
      {"add_force", l_add_force},
      {"add_torque", l_add_torque},
      {"add_impulse", l_add_impulse},
      {"cast_ray", l_cast_ray},

      {"add_body", l_create_body},

      {"add_constraint", l_add_constraint},
      {NULL, NULL} /* sentinel */
  };

  int luaopen_aop(lua_State *L)
  {
    luaL_newlib(L, aop_funcs);
    return 1;
  }

#ifdef __cplusplus
}
#endif
