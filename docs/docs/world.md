# **World**

The `World` class represents the entire simulation environment, handling physical interactions and managing the state of the simulation.

## **Properties**

| Property                 | Type       | Description                                             | Default Value       |
|--------------------------|------------|---------------------------------------------------------|---------------------|
| `gravity`                | `table`    | The gravitational force affecting the world.            | `{ 0.0, -9.81, 0.0 }` |
| `timeBeforeSleep`        | `number`   | Time before bodies go to sleep.                         | `0.5`               |
| `allowSleeping`          | `boolean`  | Whether bodies are allowed to sleep when inactive.      | `true`              |
| `maxBodies`              | `number`   | Maximum number of bodies in the world.                  | `1024`              |
| `numBodyMutexes`         | `number`   | Number of mutexes used for body operations.             | `0`                 |
| `maxBodyPairs`           | `number`   | Maximum number of body pairs for collision detection.   | `1024`              |
| `maxContactConstraints`  | `number`   | Maximum number of contact constraints.                  | `1024`              |

## **Functions**

### Create
!!! Abstract ""
    === "Details"
    
        Initializes the world with the specified settings.
    
    === "Example"
        ```lua
        local world = AOP:World()
        world:Create()
        ```

### Update
!!! Abstract ""
    === "Details"
    
        Updates the world simulation by a specified number of steps and time delta.
    === "Parameters"
        - `steps` (`number`): The number of simulation steps to advance.
        - `deltaTime` (`number`): The time increment for each simulation step.
    
    === "Example"
        ```lua
        world:Update(1, 0.016)
        ```

### GetState
!!! Abstract ""
    === "Details"
    
        Retrieves the current state of the world.
    === "Returns"
        - `state` (`table`): The current state of the world.
    
    === "Example"
        ```lua
        local state = world:GetState()
        print(state)
        ```

### GetStates
!!! Abstract ""
    === "Details"
    
        Retrieves the history of world states since the last call.
    === "Returns"
        - `stateHistory` (`string`): A JSON string representing the history of world states.
    
    === "Example"
        ```lua
        local stateHistory = world:GetStates()
        print(stateHistory)
        ```

### Destroy
!!! Abstract ""
    === "Details"
    
        Destroys the world, cleaning up resources and ending the simulation.
    === "Example"
        ```lua
        world:Destroy()
        ```

## **Example**

This example demonstrates how to create a world, configure its properties, and update its simulation.

### Code
```lua
local world = AOP:World()              -- Create a new world instance.
world.gravity = {0.0, -9.81, 0.0}     -- Set gravity to Earth's gravity.
world.timeBeforeSleep = 1.0           -- Set time before bodies go to sleep to 1 second.
world.maxBodies = 2048                -- Set maximum number of bodies to 2048.
world:Create()                       -- Initialize the world with these settings.

world:Update(1, 0.016)               -- Advance the simulation by one step (0.016 seconds).

local currentState = world:GetState()  -- Retrieve the current state of the world.
print("Current State:", currentState)

local stateHistory = world:GetStates()  -- Retrieve and clear the history of world states.
print("State History:", stateHistory)

world:Destroy()                       -- Destroy the world and clean up resources.
```

### Description

- **Create a World Instance:** `AOP:World()` creates a new world instance with default settings.
- **Set Properties:** Modify properties such as `gravity`, `timeBeforeSleep`, and `maxBodies` to configure the world.
- **Initialize World:** The `Create` method is used to initialize the world with the configured settings.
- **Advance Simulation:** The `Update` method advances the simulation by one step, updating the world state.
- **Retrieve Current State:** The `GetState` method retrieves the current state of the world.
- **Retrieve State History:** The `GetStates` method retrieves and clears the history of world states.
- **Destroy World:** The `Destroy` method is used to clean up resources and end the simulation.