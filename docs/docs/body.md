# Body

The `Body` class represents a physical object within the simulation, allowing for various configurations and interactions.

## **Table of Contents**

- [Introduction](#introduction)
- [Settings](#settings)
- [Functions](#functions)
    - [`Add`](#add) - Add's the **Body** to the **World** 
    - [`Remove`](#remove) - Remove the **Body** from the **World**
    - [`SetData`](#setdata) - Set custom **Data** on the **Body**
    - [`GetData`](#getdata) - Get the custom set **Data** from the **Body**
    - [`SetLinearVelocity`](#setlinearvelocity) - Sets the **Linear Velocity** of the **Body**
    - [`SetAngularVelocity`](#setangularvelocity) - Adds to the **Linear Velocity** of the **Body**
    - [`AddLinearVelocity`](#addlinearvelocity) - Sets the **Angular Velocity** of the **Body**
    - [`AddAngularVelocity`](#addangularvelocity) - Adds to the **Angular Velocity** of the **Body**
    - [`AddForce`](#addforce)  - Adds **Force** of the **Body**
    - [`AddTorque`](#addtorque)  - Adds **Torque** of the **Body**
    - [`AddImpulse`](#addimpulse) - Adds **Impulse** of the **Body**
    - [`CastRay`](#castray) - Casts a ray from a starting point in a specified direction and returns information about any intersected objects.
- [Example: Creating and Configuring a Sphere Body](#example)



## **Settings**

The following properties define the state and behavior of a body object in the simulation.

| Property                      | Type                 | Description                                                              | Default Value |
|--------|----------------------|--------------------------------------------------------------------------|---------------|
| `data`               | `table` | Custom JSON data associated with the body.                                       | `{}` |
| `position`               | `table` | The position of the body in 3D space.                                       | `{ 0, 0, 0 }` |
| `rotation`               | `table` | The rotation of the body as a quaternion (x, y, z, w).                       | `{ 0, 0, 0, 1 }` |
| `linearVelocity`         | `table` | The linear velocity of the                                              | `{ 0, 0, 0 }` |
| `angularVelocity`        | `table` | The angular velocity of the                                             | `{ 0, 0, 0 }` |
| `motionType`             | `string`             | The motion type of the  Options are `"Dynamic"`, `"Static"`, `"Kinematic"`. | `"Dynamic"` |
| `motionQuality`          | `string`             | The motion quality of the  Options are `"Discrete"`, `"LinearCast"`.     | `"Discrete"` |
| `layer`                  | `string`             | The collision layer of the  Options are `"MOVING"`, `"NON_MOVING"`.      | `"MOVING"` |
| `shape`                  | `string`             | The shape of the  Options are `"Box"`, `"Sphere"`, `"Capsule"`, `"Cylinder"`. | `"Box"` |
| `activate`               | `boolean`            | Determines if the body is active.                                            | `true` |
| `enhancedInternalEdgeRemoval` | `boolean`            | Determines if enhanced internal edge removal is enabled.                      | `false` |
| `allowSleeping`          | `boolean`            | Allows the body to enter a sleeping state when not in motion.                 | `true` |
| `friction`               | `number`             | The friction coefficient of the                                          | `0.2` |
| `restitution`            | `number`             | The restitution (bounciness) of the                                      | `0.0` |
| `linearDamping`          | `number`             | The linear damping applied to the                                        | `0.05` |
| `angularDamping`         | `number`             | The angular damping applied to the                                       | `0.05` |
| `maxLinearVelocity`      | `number`             | The maximum linear velocity of the                                       | `500.0` |
| `maxAngularVelocity`     | `number`             | The maximum angular velocity of the                                       | `0.25 * π * 60.0` |
| `gravityFactor`          | `number`             | The factor by which gravity affects the                                  | `1.0` |
| `size`                   | `table` | The size of the body (used for `Box` shape).                                    | `{ 1, 1, 1 }` |
| `radius`                 | `number`             | The radius of the body (used for `Sphere` and `Capsule` shapes).              | `0.5` |
| `height`                 | `number`             | The height of the body (used for `Capsule` and `Cylinder` shapes).           | `2.0` |


## **Functions**
---
### Add

Adds the body to the physics simulation and assigns it a unique `id`.

#### Example Usage
```lua
body:Add()
```

This function serializes the body's properties and adds it to the simulation, generating and assigning a unique identifier (id) for the body. This id is used in subsequent operations to reference this specific body within the physics system.

---

### Remove

Removes the body from the physics simulation using its unique `id`.

#### Example Usage
```lua
body:Remove()
```

This function removes the body associated with the given `id` from the simulation. Once removed, the body's id will no longer be valid for operations within the physics system.

---

### SetData

Allows setting custom JSON data to be associated with a body within the physics simulation without affecting its actual properties.

#### Example Usage
```lua
body:SetData({"customKey": "customValue"})
```

This function stores the provided JSON data with the body in the physics simulation but does not modify the body's physical properties or behavior. It can be used to attach metadata or other non-physical information to the body for tracking or reference purposes.

---

### GetData

Retrieves the custom JSON data associated with a body within the physics simulation.

#### Example Usage
```lua
local data = body:GetData()
```

This function returns the JSON data that was previously set using `SetData`. The retrieved data does not affect the body's physical properties or behavior and is typically used for accessing metadata or other non-physical information associated with the body.

---

### SetLinearVelocity

Sets the linear velocity of the body.

#### Parameters
- `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the linear velocity.

#### Example Usage
```lua
local velocity = {1.0, 2.0, 0.0}
body:SetLinearVelocity(velocity)
```

This function sets the body's linear velocity to the specified vector components, directly altering its motion in the simulation.

---

### SetAngularVelocity

Sets the angular velocity of the body.

#### Parameters
- `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the angular velocity.

#### Example Usage
```lua
local angularVelocity = {0.1, 0.2, 0.3}
body:SetAngularVelocity(angularVelocity)
```
This function sets the body's angular velocity to the specified vector components, directly affecting its rotational motion in the simulation.

---

### AddLinearVelocity

Adds to the current linear velocity of the body.

#### Parameters
- `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the velocity to add. 

#### Example Usage
```lua
local velocity = {1.0, 0.5, 0.0}
body:AddLinearVelocity(velocity)
```
This function modifies the body's current linear velocity by adding the specified velocity vector components to it.

---

### AddAngularVelocity

Adds to the current angular velocity of the body.

#### Parameters
- `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the angular velocity to add.

#### Example Usage
```lua
local angularVelocity = {0.1, 0.2, 0.3}
body:AddAngularVelocity(angularVelocity)
```

This function adjusts the body's current angular velocity by adding the specified velocity vector components to it, effectively changing the body's rotational motion.

---

### AddForce

Applies a force to the body.

#### Parameters
- `force` (`table {number, number, number}`): A table representing the x, y, and z components of the force to apply.

#### Example Usage
```lua
local force = {10.0, 0.0, 0.0}
body:AddForce(force)
```

This function applies a force to the body, influencing its movement and interaction with other bodies.

---

### AddTorque

Applies a torque to the body.

#### Parameters
- `torque` (`table {number, number, number}`): A table representing the x, y, and z components of the torque to apply.

#### Example Usage
```lua
local torque = {0.0, 5.0, 0.0}
body:AddTorque(torque)
```

This function applies a torque to the body, affecting its rotational motion.

---

### AddImpulse

Applies an impulse to the body.

#### Parameters
- `impulse` (`table {number, number, number}`): A table representing the x, y, and z components of the impulse to apply.

#### Example Usage
```lua
local impulse = {0.0, 10.0, 0.0}
body:AddImpulse(impulse)
```

This function applies an impulse to the body, resulting in a sudden change in its velocity.

---

### CastRay

Casts a ray from the body's current position in a specified direction to detect collisions.

#### Parameters
- `direction` (`table {number, number, number}`): A table representing the x, y, and z components of the direction vector for the ray.

#### Returns
- `result` (`table`): A table containing the result of the ray cast, including:
  - `hit` (`boolean`): Whether the ray hit something.
  - `hitPoint` (`table {number, number, number}`): The point of collision.
  - `hitBodyID` (`number`): The ID of the body that was hit.

#### Example Usage
```lua
local direction = {0.0, 0.0, -1.0}
local result = body:CastRay(direction)
if result.hit then
    print("Hit at:", result.hitPoint[1], result.hitPoint[2], result.hitPoint[3])
end
```

This function casts a ray from the body's current position in the specified direction and returns information about any collisions detected.

## **Example**

This example demonstrates how to create a sphere body, configure its properties, and set its linear velocity.

### Code
```lua
local sphere = AOP:Body()               -- Create a new body instance.
sphere.shape = "Sphere"                -- Set the shape of the body to "Sphere".
sphere.radius = 0.5                    -- Set the radius of the sphere to 0.5 units.
sphere.position = { -3.0, 1, 0.0 }    -- Position the sphere at coordinates (-3.0, 1, 0.0).
sphere.layer = "MOVING"                -- Assign the body to the "MOVING" layer.
sphere.activate = true                 -- Activate the body in the simulation.
sphere:Add()                           -- Add the body to the physics simulation.
sphere:SetLinearVelocity({ 0.0, 0.0, 5.0 })  -- Set the linear velocity of the body to (0.0, 0.0, 5.0).
```
### Description

- **Create a Body Instance:** `AOP:Body()` creates a new body instance.
- **Set Shape:** The `shape` property is set to `"Sphere"`, defining the body's shape.
- **Set Radius:** The `radius` property is set to `0.5`, defining the sphere's size.
- **Set Position:** The `position` property sets the sphere's location in 3D space.
- **Set Layer:** The `layer` property is set to `"MOVING"`, indicating the body is part of the moving layer.
- **Activate the Body:** The `activate` property is set to `true` to enable the body in the simulation.
- **Add to Simulation:** The `Add` method is called to add the body to the physics simulation.
- **Set Linear Velocity:** The `SetLinearVelocity` method is used to set the body's linear velocity to `(0.0, 0.0, 5.0)`, influencing its movement in the simulation.

