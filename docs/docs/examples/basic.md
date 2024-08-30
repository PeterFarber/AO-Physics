# **Basic Example**
This example demonstrates how to create and manage a simple simulation using AO Physics in Lua. The script sets up a world, creates multiple physical bodies with different properties and interactions, and then runs a simulation for a specified number of frames.

## **Code Overview**

```lua linenums="1"
-- Load the AO Physics library
AOP = require("AOP")

-- Define the number of simulation frames and the time step for each frame
local framesToSimulate = 1000
local deltaTime = 1.0 / 60.0

--- Create a World ---
-- Initialize a new world and create it
local world = AOP:World()
world:Create()

--- Create a Floor ---
-- Create a static floor body with a large size to act as the ground
local floor = AOP:Body()
floor.shape = "Box" -- Shape of the body
floor.size = { 100.0, 1.0, 100.0 } -- Size of the box (length, width, height)
floor.motionType = "Static" -- The body does not move
floor.layer = "NON_MOVING" -- Layer for static objects
floor.activate = false -- Do not activate this body initially
floor:Add() -- Add the body to the world

-- Create a dynamic sphere body and set its initial linear velocity
local sphere = AOP:Body()
sphere.shape = "Sphere" -- Shape of the body
sphere.radius = 0.5 -- Radius of the sphere
sphere.position = { -3.0, 1, 0.0 } -- Initial position of the sphere (x, y, z)
sphere:Add() -- Add the body to the world
sphere:SetLinearVelocity({ 0.0, 0.0, 5.0 }) -- Set the initial linear velocity

-- Create another dynamic sphere body and apply a force
local sphere2 = AOP:Body()
sphere2.shape = "Sphere" -- Shape of the body
sphere2.radius = 0.5 -- Radius of the sphere
sphere2.position = { -1.0, 1, 0.0 } -- Initial position of the sphere
sphere2:Add() -- Add the body to the world
sphere2:AddForce({ 0.0, 0.0, 100000.0 }) -- Apply a force to the sphere

-- Create a third dynamic sphere body and apply an impulse
local sphere3 = AOP:Body()
sphere3.shape = "Sphere" -- Shape of the body
sphere3.radius = 0.5 -- Radius of the sphere
sphere3.position = { 1.0, 1, 0.0 } -- Initial position of the sphere
sphere3:Add() -- Add the body to the world
sphere3:AddImpulse({ 0.0, 0.0, 1500.0 }) -- Apply an impulse to the sphere

-- Create a fourth dynamic sphere body and apply torque
local sphere4 = AOP:Body()
sphere4.shape = "Sphere" -- Shape of the body
sphere4.radius = 0.5 -- Radius of the sphere
sphere4.position = { 3.0, 1, 0.0 } -- Initial position of the sphere
sphere4:Add() -- Add the body to the world
sphere4:AddTorque({ 50000.0, 0.0, 0 }) -- Apply torque to the sphere

--- Update the World ---
-- Simulate the world for the specified number of frames
for i = 1, framesToSimulate do
    world:Update(1, deltaTime) -- Update the world with a single step
    world:GetState() -- Get the current state of the world
end

--- Get World States ---
-- Print the states of the world after simulation
print(world:GetStates())

--- Destroy the World ---
-- Clean up and destroy the world to free resources
world:Destroy()

-- Return
return ""
```

## **Step-by-Step Breakdown**

Load the AO Physics Library:
```lua
AOP = require("AOP")
```

Define Simulation Parameters:
```lua
local framesToSimulate = 1000
local deltaTime = 1.0 / 60.0
```

Create a World:
```lua
local world = AOP:World()
world:Create()
```

Create a Static Floor:
```lua
-- Create a static floor body with a large size to act as the ground
local floor = AOP:Body() -- Create a new body object
floor.shape = "Box" -- Set the shape of the body to a box
floor.size = { 100.0, 1.0, 100.0 } -- Set the size of the box (length, width, height)
floor.motionType = "Static" -- Set the motion type of the body to static (does not move)
floor.layer = "NON_MOVING" -- Set the layer of the body to NON_MOVING
floor.activate = false -- Set the activation state of the body to false (do not activate initially)
floor:Add() -- Add the body to the world
```

Create and Configure Multiple Spheres:

```lua
local sphere = AOP:Body() -- Create a new body object
sphere.shape = "Sphere" -- Set the shape of the body to a sphere
sphere.radius = 0.5 -- Set the radius of the sphere
sphere.position = { -3.0, 1, 0.0 } -- Set the initial position of the sphere (x, y, z)
sphere:Add() -- Add the body to the world
sphere:SetLinearVelocity({ 0.0, 0.0, 5.0 }) -- Set the initial linear velocity of the sphere

local sphere2 = AOP:Body() -- Create a new body object for sphere2
sphere2.shape = "Sphere" -- Set the shape of sphere2 to a sphere
sphere2.radius = 0.5 -- Set the radius of sphere2 to 0.5
sphere2.position = { -1.0, 1, 0.0 } -- Set the initial position of sphere2 to (-1.0, 1, 0.0)
sphere2:Add() -- Add sphere2 to the world
sphere2:AddForce({ 0.0, 0.0, 100000.0 }) -- Apply a force of (0.0, 0.0, 100000.0) to sphere2

local sphere3 = AOP:Body() -- Create a new body object for sphere3
sphere3.shape = "Sphere" -- Set the shape of sphere3 to a sphere
sphere3.radius = 0.5 -- Set the radius of sphere3 to 0.5
sphere3.position = { 1.0, 1, 0.0 } -- Set the initial position of sphere3 to (1.0, 1, 0.0)
sphere3:Add() -- Add sphere3 to the world
sphere3:AddImpulse({ 0.0, 0.0, 1500.0 }) -- Apply an impulse of (0.0, 0.0, 1500.0) to sphere3

local sphere4 = AOP:Body() -- Create a new body object for sphere4
sphere4.shape = "Sphere" -- Set the shape of sphere4 to a sphere
sphere4.radius = 0.5 -- Set the radius of sphere4 to 0.5
sphere4.position = { 3.0, 1, 0.0 } -- Set the initial position of sphere4 to (3.0, 1, 0.0)
sphere4:Add() -- Add sphere4 to the world
sphere4:AddTorque({ 50000.0, 0.0, 0 }) -- Apply a torque of (50000.0, 0.0, 0) to sphere4
```

Run the Simulation:
```lua
for i = 1, framesToSimulate do
    world:Update(1, deltaTime) -- Update the world with a single step
    world:GetState() -- Get the current state of the world
end
```

Output World States and Clean Up:
```lua
-- Print the states of the world after simulation
print(world:GetStates())

-- Clean up and destroy the world to free resources
world:Destroy()
```

## Notes

- This script initializes a world and several physical bodies with different properties and forces.
- It simulates the world for 1000 frames, printing the world state after each frame.
- The simulation environment is destroyed at the end to clean up resources.

For more details on the AO Physics library and its components, please refer to the [AO Physics Documentation](https://peterfarber.github.io/AO-Physics/).
