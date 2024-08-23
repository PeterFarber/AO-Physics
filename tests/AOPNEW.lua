_AOP = require("AOP")
local json = require('json')

local function class(base, init)
  local c = {} -- a new class instance
  if not init and type(base) == 'function' then
    init = base
    base = nil
  elseif type(base) == 'table' then
    -- our new class is a shallow copy of the base class!
    for i, v in pairs(base) do
      c[i] = v
    end
    c._base = base
  end
  -- the class will be the metatable for all its objects,
  -- and they will look up their methods in it.
  c.__index = c

  -- expose a constructor which can be called by <classname>(<args>)
  local mt = {}
  mt.__call = function(class_tbl, ...)
    local obj = {}
    setmetatable(obj, c)
    if init then
      init(obj, ...)
    else
      -- make sure that any stuff from the base class is initialized!
      if base and base.init then
        base.init(obj, ...)
      end
    end
    return obj
  end
  c.init = init
  c.is_a = function(self, klass)
    local m = getmetatable(self)
    while m do
      if m == klass then return true end
      m = m._base
    end
    return false
  end
  setmetatable(c, mt)
  return c
end

AOPClass = class(function(aop) end)

AOP = AOPClass()


function AOP:Body()
  local body = {
    position = { 0, 0, 0 },
    rotation = { 0, 0, 0, 1 },
    linearVelocity = { 0, 0, 0 },
    angularVelocity = { 0, 0, 0 },
    motionType = "Dynamic",
    layer = "MOVING",
    shape = "Box",
    activate = true,
    enhancedInternalEdgeRemoval = false,
    allowSleeping = true,
    friction = 0.2,
    restitution = 0.0,
    linearDamping = 0.05,
    angularDamping = 0.05,
    maxLinearVelocity = 500.0,
    maxAngularVelocity = 0.25 * 3.14159265359 * 60.0,
    gravityFactor = 1.0,
    size = { 1, 1, 1 },
    radius = 0.5,
    height = 2.0
  }
  body.id = -1
  function body:Add()
    self.id = math.floor(_AOP.add_body(json.encode(self)))
  end

  return body;
end

function AOP:Constraint()
  local constraint = {
    type = "Distance", -- "Distance" | "Fixed" | "Point" | "Pulley"
    space = "WorldSpace",
    autoDetectPoint = false,
    point1 = { 0, 0, 0 },
    axisX1 = { 1, 0, 0 },
    axisY1 = { 0, 1, 0 },
    twistAxis1 = { 1, 0, 0 },
    hingeAxis1 = { 0, 1, 0 },
    normalAxis1 = { 1, 0, 0 },
    point2 = { 0, 0, 0 },
    axisX2 = { 1, 0, 0 },
    axisY2 = { 0, 1, 0 },
    twistAxis2 = { 1, 0, 0 },
    hingeAxis2 = { 0, 1, 0 },
    normalAxis2 = { 1, 0, 0 },
    bodyPoint1 = { 0, 0, 0 },
    fixedPoint1 = { 0, 0, 0 },
    bodyPoint2 = { 0, 0, 0 },
    fixedPoint2 = { 0, 0, 0 },
    ratio = 1.0,
    minLength = 0.0,
    maxLength = -1.0,
    minDistance = -1.0,
    maxDistance = -1.0,
    limitsMin = -3.14159265359,
    limitsMax = 3.14159265359,
    maxFrictionTorque = 0.0,
    halfConeAngle = 0.0,
  }
  constraint.id = -1
  function constraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id

    _AOP.add_constraint(json.encode(self))
  end

  return constraint;
end

function AOP:Character()
  local character = {
    canMoveWhileJumping = false,
    speed = 1.0,
    sprintSpeed = 2.0,
    jumpForce = 6.0,
    heightStanding = 1.35,
    radiusStanding = 0.3,
    maxSlopeAngle = 45.0,
    friction = 0.5,
    mass = 0.0,
    gravityFactor = 1.0,
    position = { 0, 0, 0 },
    rotation = { 0, 0, 0, 1 },
    up = { 0, 1, 0 },
    layer = "MOVING",
    activate = true
  }
  character.id = -1;
  function character:Add()
    self.id = math.floor(_AOP.add_character(json.encode(self)))
    return self.id;
  end

  function character:Input()
    local input = {
      x = 0,
      z = 0,
      jump = false,
      sprint = false,
      crouch = false
    }
    return input
  end

  function character:SendInput(data)
    local msg = {
      id = self.id,
      input = { data.x, data.z },
      jump = data.jump,
      sprint = data.sprint,
      crouch = data.crouch
    }
    _AOP.move_character(json.encode(msg))
  end

  return character;
end

function AOP:World()
  local world = {
    gravity = { 0.0, -9.81, 0.0 },
    timeBeforeSleep = 0.5,
    allowSleeping = true,
    maxBodies = 1024,
    numBodyMutexes = 0,
    maxBodyPairs = 1024,
    maxContactConstraints = 1024
  }
  world.WorldStates = {}

  function world:Create()
    _AOP.world_create(json.encode(self))
  end

  function world:Update(steps, deltaTime)
    _AOP.world_update(steps, deltaTime)
  end

  function world:GetState()
    local worldState = _AOP.get_world_state()
    table.insert(self.WorldStates, worldState)
    return worldState
  end

  function world:GetStates()
    local state = [[{ "worldStates": []]
    for i = 1, #self.WorldStates do
      state = state .. self.WorldStates[i] .. ","
    end
    state = state:sub(1, #state - 1)
    state = state .. "]}"
    self.WorldStates = {}
    return state
  end

  return world;
end

return AOP
