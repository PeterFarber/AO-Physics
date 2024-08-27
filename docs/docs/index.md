# Overview

This documentation provides an overview of the core components of the physics simulation system: `World`, `Body`, and various `Constraints`. Each component plays a crucial role in defining the behavior and interactions of objects within the simulation.

## Table of Contents

1. [World](#world)
2. [Body](#body)
3. [Constraints](#constraints)
4. [Example Usage](#example-usage)

## World

The `World` object represents the simulation environment, managing global settings and the overall state of the simulation. It handles physical properties such as gravity, body limits, and simulation time.

For detailed information on how to configure and use the `World`, refer to the [World documentation](world.md).

## Body

The `Body` object represents an individual object within the simulation. Bodies have physical attributes like mass, position, and velocity, and they interact with other bodies through forces and constraints.

For detailed information on the properties and methods available for `Body`, refer to the [Body documentation](body.md).

## Constraints

Constraints define relationships and restrictions between bodies, simulating various physical joints and connections. They determine how bodies move relative to each other and the types of interactions that can occur.

For detailed information on the different types of constraints and their configurations, refer to the [Constraints documentation](constraint.md).

## Example Usage

Here is a brief example showing how to create a world, add bodies, and apply constraints:

```lua
-- Create a new world
local world = AOP:World()
world.gravity = {0.0, -9.81, 0.0}
world:Create()

-- Create two bodies
local body1 = AOP:Body()
local body2 = AOP:Body()
body1:Create()
body2:Create()

-- Create a hinge constraint between the two bodies
local hinge = AOP:ConstraintHinge()
hinge.point1 = {1, 2, 3}
hinge.hingeAxis1 = {0, 1, 0}
local hingeID = hinge:Add(body1, body2)

-- Update the world simulation
world:Update(1, 0.016)  -- 1 step, 16 ms per step

-- Retrieve and print the world state
local state = world:GetState()
print("World State:", state)

-- Cleanup
world:Destroy()
```

This example demonstrates how to initialize the simulation environment, create and configure bodies, apply constraints, and update and retrieve simulation states. For more detailed usage, please consult the respective documentation for each component.