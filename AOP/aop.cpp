#ifdef __cplusplus
#include "lua.hpp"
#else
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"
#endif

#include "src/AWorld.h"

// Helper function to safely parse JSON from Lua
json parse_json_from_lua(lua_State *L, int index)
{
  const char *lua_string = luaL_checkstring(L, index);
  std::string json_data_copy(lua_string);

  // Parse JSON
  json parsed_data = json::parse(json_data_copy);

  // Clean up memory used by std::string
  json_data_copy.clear();

  return parsed_data;
}

// so that name mangling doesn't mess up function names
#ifdef __cplusplus
extern "C"
{
#endif

  static int l_create_character(lua_State *L)
  {
    // Parse character data from Lua
    json character_data = parse_json_from_lua(L, 1);

    // Create character
    uint32 body_id = AOP::AWorld::GetInstance()->mCharacterManager->CreateCharacter(&character_data);

    // Push result to Lua stack and clear memory
    lua_pushnumber(L, body_id);
    character_data.clear();
    return 1;
  }

  static int l_move_character(lua_State *L)
  {
    // Parse character data from Lua
    json character_data = parse_json_from_lua(L, 1);

    // Move character
    AOP::AWorld::GetInstance()->mCharacterManager->MoveCharacter(&character_data);

    // Clear memory
    character_data.clear();
    return 0;
  }

  static int l_create_world(lua_State *L)
  {
    // Parse world data from Lua
    json world_data = parse_json_from_lua(L, 1);

    // Create world
    AOP::AWorld::GetInstance()->Create(&world_data);

    // Clear memory
    world_data.clear();
    return 0;
  }

  static int l_load_world_state(lua_State *L)
  {
    // Parse world state data from Lua
    json world_state = parse_json_from_lua(L, 1);

    // Load world state
    AOP::AWorld::GetInstance()->LoadWorldState(&world_state);

    // Clear memory
    world_state.clear();
    return 0;
  }

  static int l_get_world_state(lua_State *L)
  {
    // Get world state JSON
    json world_state_json = AOP::AWorld::GetInstance()->GetWorldState();

    // Push the result as a string to Lua and clear memory
    lua_pushstring(L, world_state_json.dump(-1).c_str());
    world_state_json.clear();

    // Call lua garbage collection
    lua_gc(L, LUA_GCCOLLECT, 0);
    return 1;
  }

  static int l_add_body(lua_State *L)
  {
    // Parse body data from Lua
    json body_data = parse_json_from_lua(L, 1);

    // Add body
    uint32 body_id = AOP::AWorld::GetInstance()->mBodyManager->AddBody(&body_data);

    // Push result to Lua stack and clear memory
    lua_pushnumber(L, body_id);
    body_data.clear();
    return 1;
  }

  static int l_remove_body(lua_State *L)
  {
    // Remove body by ID
    uint32 body_id = luaL_checknumber(L, 1);
    AOP::AWorld::GetInstance()->mBodyManager->RemoveBody(body_id);

    return 0;
  }

  static int l_set_data_body(lua_State *L)
  {
    // Parse body ID and body data from Lua
    uint32 body_id = luaL_checknumber(L, 1);
    json body_data = parse_json_from_lua(L, 2);

    // Set body data
    AOP::AWorld::GetInstance()->mBodyManager->SetData(body_id, &body_data);

    // Clear memory
    body_data.clear();
    return 0;
  }

  static int l_get_data_body(lua_State *L)
  {
    // Get body data by ID
    uint32 body_id = luaL_checknumber(L, 1);

    json body_data = AOP::AWorld::GetInstance()->mBodyManager->GetData(body_id);

    // Push result to Lua stack and clear memory
    lua_pushstring(L, body_data.dump().c_str());
    body_data.clear();

    return 1;
  }

  static int l_set_linear_velocity(lua_State *L)
  {
    // Set linear velocity by body ID
    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 velocity(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));

    AOP::AWorld::GetInstance()->mBodyManager->SetLinearVelocity(body_id, velocity);

    return 0;
  }

  static int l_cast_ray(lua_State *L)
  {
    // Cast ray by body ID
    uint32 body_id = luaL_checknumber(L, 1);
    Vec3 direction(luaL_checknumber(L, 2), luaL_checknumber(L, 3), luaL_checknumber(L, 4));

    // Get raycast results
    json hit_results = AOP::AWorld::GetInstance()->mBodyManager->CastRay(body_id, direction);

    // Push result to Lua stack and clear memory
    lua_pushstring(L, hit_results.dump().c_str());
    hit_results.clear();

    return 1;
  }

  static int l_update_world(lua_State *L)
  {
    // Update the world
    AOP::AWorld::GetInstance()->Update();
    return 0;
  }

  static int l_destroy_world(lua_State *L)
  {
    // Destroy the world
    AOP::AWorld::GetInstance()->Destroy();
    return 0;
  }

  // Library registration function
  static const struct luaL_Reg aop_funcs[] = {
      {"add_character", l_create_character},
      {"move_character", l_move_character},

      {"world_create", l_create_world},
      {"world_load_state", l_load_world_state},
      {"world_update", l_update_world},
      {"world_destroy", l_destroy_world},
      {"get_world_state", l_get_world_state},

      {"add_body", l_add_body},
      {"remove_body", l_remove_body},

      {"set_data_body", l_set_data_body},
      {"get_data_body", l_get_data_body},

      {"set_linear_velocity", l_set_linear_velocity},
      {"cast_ray", l_cast_ray},

      {NULL, NULL} /* Sentinel */
  };

  // Initialization function
  int luaopen_aop(lua_State *L)
  {
    luaL_newlib(L, aop_funcs);
    return 1;
  }

#ifdef __cplusplus
}
#endif
