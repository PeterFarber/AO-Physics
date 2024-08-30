# **Character**

The `Character` class represents a player or entity character within the simulation, providing various configurations and methods for interaction.

## **Properties**

| Property                | Type      | Description                                                                 | Default Value |
|-------------------------|-----------|-----------------------------------------------------------------------------|---------------|
| `position`              | `table`   | The position of the character in 3D space.                                  | `{ 0, 0, 0 }` |
| `rotation`              | `table`   | The rotation of the character as a quaternion (x, y, z, w).                 | `{ 0, 0, 0, 1 }` |
| `radiusStanding`        | `number`  | The radius of the character when standing.                                  | `0.5`         |
| `heightStanding`        | `number`  | The height of the character when standing.                                  | `2.0`         |
| `radiusCrouching`       | `number`  | The radius of the character when crouching.                                 | `0.5`         |
| `heightCrouching`       | `number`  | The height of the character when crouching.                                 | `1.0`         |
| `up`                    | `table`   | The up direction for the character, represented as a vector.                | `{ 0, 1, 0 }` |
| `friction`              | `number`  | The friction coefficient of the character.                                  | `0.5`         |
| `gravityFactor`         | `number`  | The factor by which gravity affects the character.                          | `1.0`         |
| `jumpForce`             | `number`  | The force applied when the character jumps.                                 | `6.0`         |
| `maxSlopeAngle`         | `number`  | The maximum slope angle the character can walk on.                          | `45.0`        |
| `speed`                 | `number`  | The movement speed of the character.                                        | `1.0`         |
| `sprintMultiplier`      | `number`  | The multiplier applied to the character's speed when sprinting.             | `2.0`         |
| `canMoveWhileJumping`   | `boolean` | Determines if the character can move while jumping.                         | `false`       |
| `activate`              | `boolean` | Determines if the character is active.                                      | `true`        |
| `layer`                 | `string`  | The collision layer of the character. Options are `"MOVING"`, `"NON_MOVING"`.| `"MOVING"`    |

## **Functions**

### Add
!!! Abstract ""
    === "Details"

        Adds the character to the simulation and assigns it a unique `id`. <br>
        > This function serializes the character's properties and adds it to the simulation, generating and assigning a unique identifier (id) for the character. This id is used in subsequent operations to reference this specific character within the simulation.

    === "Example"
        ```lua
        local character = AOP:Character()
        character:Add()
        ```

### Input
!!! Abstract ""
    === "Details"

        Creates an input table for controlling the character's movement. <br>
        > This function returns a table with default values for character movement, including directions and action states (jump, sprint, crouch). This input table can be modified and passed to `SendInput` to control the character.

    === "Returns"
        - `input` (`table`): A table containing the following fields:
            - `x` (`number`): The input value for movement along the x-axis (left/right).
            - `z` (`number`): The input value for movement along the z-axis (forward/backward).
            - `jump` (`boolean`): Whether the character should jump.
            - `sprint` (`boolean`): Whether the character should sprint.
            - `crouch` (`boolean`): Whether the character should crouch.

    === "Example"
        ```lua
        local character = AOP:Character()
        local input = character:Input()
        input.x = 1.0
        input.z = 0.5
        input.jump = true
        ```

### SendInput
!!! Abstract ""
    === "Details"

        Sends the character's movement input to the simulation. <br>
        > This function takes an input table (as created by the `Input` function) and sends it to the simulation, updating the character's movement and actions based on the input.

    === "Parameters"
        - `data` (`table`): A table containing the character's movement and action input values.

    === "Example"
        ```lua
        local character = AOP:Character()
        character:Add()
        local input = character:Input()
        input.x = 1.0
        input.z = 0.5
        input.jump = true
        character:SendInput(input)
        ```

## **Example**

This example demonstrates how to create a character, configure its properties, and control its movement.

### Code
```lua
local character = AOP:Character()     -- Create a new character instance.
character.position = { 0, 1, 0 }      -- Set the initial position of the character.
character.speed = 2.0                 -- Set the movement speed of the character.
character:Add()                       -- Add the character to the simulation.

local input = character:Input()       -- Create an input table.
input.x = 1.0                         -- Move right.
input.z = 0.5                         -- Move forward.
input.jump = true                     -- Make the character jump.

character:SendInput(input)            -- Send the input to the simulation.
```
### Description

- **Create a Character Instance:** `AOP:Character()` creates a new character instance.
- **Set Position:** The `position` property is set to `{ 0, 1, 0 }`, defining the character's initial location in the simulation.
- **Set Speed:** The `speed` property is set to `2.0`, increasing the character's movement speed.
- **Add to Simulation:** The `Add` method is called to add the character to the simulation.
- **Create Input:** The `Input` method is used to generate an input table for controlling the character.
- **Modify Input:** The `x`, `z`, and `jump` fields in the input table are set to control the character's movement and jumping action.
- **Send Input:** The `SendInput` method sends the input to the simulation, causing the character to move and jump.