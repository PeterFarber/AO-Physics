# **Body**

The `Body` class represents a physical object within the simulation, allowing for various configurations and interactions.

## **Properties**

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

### Add
!!! Abstract ""
    === "Details"

        Adds the body to the physics simulation and assigns it a unique `id`. <br>
        > This function serializes the body's properties and adds it to the simulation, generating and assigning a unique identifier (id) for the body. This id is used in subsequent operations to reference this specific body within the physics system.

    === "Example"
        ```lua
        body:Add()
        ```

### Remove
!!! Abstract ""
    === "Details"

        Removes the body from the physics simulation using its unique `id`. <br>
        > This function removes the body associated with the given `id` from the simulation. Once removed, the body's id will no longer be valid for operations within the physics system.

    === "Example"
        ```lua
        body:Remove()
        ```

### SetData
!!! Abstract ""
    === "Details"

        Allows setting custom JSON data to be associated with a body within the physics simulation without affecting its actual properties. <br>
        > This function stores the provided JSON data with the body in the physics simulation but does not modify the body's physical properties or behavior. It can be used to attach metadata or other non-physical information to the body for tracking or reference purposes.

    === "Example"
        ```lua
        body:SetData({"customKey": "customValue"})
        ```

### GetData
!!! Abstract ""
    === "Details"

        Retrieves the custom JSON data associated with a body within the physics simulation. <br>
        > This function returns the JSON data that was previously set using `SetData`. The retrieved data does not affect the body's physical properties or behavior and is typically used for accessing metadata or other non-physical information associated with the body.

    === "Example"
        ```lua
        local data = body:GetData()
        ```

### SetLinearVelocity
!!! Abstract ""
    === "Details"

        Sets the linear velocity of the body. <br>
        > This function sets the body's linear velocity to the specified vector components, directly altering its motion in the simulation.

    === "Parameters"
        - `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the linear velocity.

    === "Example"
        ```lua
        local velocity = {1.0, 2.0, 0.0}
        body:SetLinearVelocity(velocity)
        ```

### SetAngularVelocity
!!! Abstract ""
    === "Details"

        Sets the angular velocity of the body. <br>
        > This function sets the body's angular velocity to the specified vector components, directly affecting its rotational motion in the simulation.

    === "Parameters"
        - `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the angular velocity.

    === "Example"
        ```lua
        local angularVelocity = {0.1, 0.2, 0.3}
        body:SetAngularVelocity(angularVelocity)
        ```

### AddLinearVelocity
!!! Abstract ""
    === "Details"

        Adds to the current linear velocity of the body. <br>
        > This function modifies the body's current linear velocity by adding the specified velocity vector components to it.

    === "Parameters"
        - `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the velocity to add.

    === "Example"
        ```lua
        local velocity = {1.0, 0.5, 0.0}
        body:AddLinearVelocity(velocity)
        ```

### AddAngularVelocity
!!! Abstract ""
    === "Details"

        Adds to the current angular velocity of the body. <br>
        > This function adjusts the body's current angular velocity by adding the specified velocity vector components to it, effectively changing the body's rotational motion.

    === "Parameters"
        - `velocity` (`table {number, number, number}`): A table representing the x, y, and z components of the angular velocity to add.

    === "Example"
        ```lua
        local angularVelocity = {0.1, 0.2, 0.3}
        body:AddAngularVelocity(angularVelocity)
        ```

### AddForce
!!! Abstract ""
    === "Details"

        Applies a force to the body. <br>
        > This function applies a force to the body, influencing its movement and interaction with other bodies.

    === "Parameters"
        - `force` (`table {number, number, number}`): A table representing the x, y, and z components of the force to apply.

    === "Example"
        ```lua
        local force = {10.0, 0.0, 0.0}
        body:AddForce(force)
        ```

### AddTorque
!!! Abstract ""
    === "Details"

        Applies a torque to the body. <br>
        > This function applies a torque to the body, affecting its rotational motion.

    === "Parameters"
        - `torque` (`table {number, number, number}`): A table representing the x, y, and z components of the torque to apply.

    === "Example"
        ```lua
        local torque = {0.0, 5.0, 0.0}
        body:AddTorque(torque)
        ```

### AddImpulse
!!! Abstract ""
    === "Details"

        Applies an impulse to the body. <br>
        > This function applies an impulse to the body, resulting in a sudden change in its velocity.

    === "Parameters"
        - `impulse` (`table {number, number, number}`): A table representing the x, y, and z components of the impulse to apply.

    === "Example"
        ```lua
        local impulse = {0.0, 10.0, 0.0}
        body:AddImpulse(impulse)
        ```

### CastRay
!!! Abstract ""
    === "Details"

        Casts a ray from the body's current position in a specified direction to detect collisions. <br>
        > This function casts a ray from the body's current position in the specified direction and returns information about any collisions detected.
    === "Parameters"
        - `direction` (`table {number, number, number}`): A table representing the x, y, and z components of the direction vector for the ray.
    === "Returns"
        - `result` (`table`): A table containing the result of the ray cast, including:
        - `hit` (`boolean`): Whether the ray hit something.
        - `hitPoint` (`table {number, number, number}`): The point of collision.
        - `hitBodyID` (`number`): The ID of the body that was hit.
    === "Example"
        ```lua
        local direction = {0.0, 0.0, -1.0}
        local result = body:CastRay(direction)
        if result.hit then
            print("Hit at:", result.hitPoint[1], result.hitPoint[2], result.hitPoint[3])
        end
        ```

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

