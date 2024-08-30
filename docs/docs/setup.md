# **Setup**

This guide will walk you through the process of setting up and creating your own physics simulation using the AO-Physics library. By following these steps, you'll be able to integrate AO-Physics into your Lua projects with ease.

## **Step 1: Clone the AO-Physics Repository**

Start by cloning the official AO-Physics GitHub repository. This repository contains all the necessary files and resources to get you started.

Open your terminal and run the following command:

```bash
git clone https://github.com/PeterFarber/AO-Physics.git
```
!!! info 
    This command will download the entire AO-Physics project to your local machine. The repository includes the core library, examples, and other important assets.

## **Step 2: Copy the Build Directory Contents**

After cloning the repository, you'll need to integrate the AO-Physics library into your project. To do this, copy the contents of the `build` directory from the cloned repository to your module's source code directory.

Navigate to the cloned directory:

```bash
cd AO-Physics
```

Then, copy the contents:

```bash
cp -r build/* /path/to/your/module/source
```
!!! info 
    Replace `/path/to/your/module/source` with the actual path to your module’s source code. The `build` directory contains precompiled assets and scripts that are essential for running the AO-Physics library.

## **Step 3: Include AOP.lua in Your Process**

To utilize AO-Physics in your Lua project, you need to include the `AOP.lua` script in your `process.lua` file. This script provides the necessary functions and classes to build physics simulations.

Add the following line to the top of your `process.lua` file:

```lua
local AOP = require('AOP')
```

!!! info 
    This line imports the AO-Physics library, making its features available in your script. Now, you can call AO-Physics functions and access its physics engine.

## **Step 4: Write Your Lua Physics Simulation**

Now that you've integrated AO-Physics into your project, it's time to write your physics simulation. The AO-Physics library allows you to create and manage physical bodies, simulate interactions, and update the world in a few straightforward steps. Below is an example of how to set up a simple simulation:

```lua
-- Initialize a new world and create it
local world = AOP:World()
world:Create()

-- Create a static floor body with a large size to act as the ground
local floor = AOP:Body()
floor.shape = "Box" -- Shape of the body
floor.size = { 100.0, 1.0, 100.0 } -- Size of the box (length, width, height)
floor.motionType = "Static" -- The body does not move
floor.layer = "NON_MOVING" -- Layer for static objects
floor.activate = false -- Do not activate this body initially
floor:Add() -- Add the body to the world

-- Update the world with a single step
world:Update(1, 1/60)

-- Call GetState which updates the World States
world:GetState()

-- Print the states of the world after simulation
print(world:GetStates())

-- Clean up and destroy the world to free resources
world:Destroy()
```

### Explanation:

1. **Initialize a World:**
    - First, we initialize a new world using `AOP:World()`. The `Create()` function sets up the world, preparing it for simulation.
2. **Create a Static Floor:**
    - We then create a static floor using `AOP:Body()`. This body has a box shape and a large size to serve as the ground in our simulation. Setting `motionType` to `"Static"` ensures that this body remains stationary. By assigning it to the `"NON_MOVING"` layer and deactivating it initially, we prevent it from interacting with other objects unnecessarily until required.
3. **Update the World:**
    - We simulate the physics world by calling `world:Update(1, 1/60)`. This function advances the simulation by one step, calculating interactions and updating the state of all objects in the world.
4. **Retrieve and Print the State:**
    - After the simulation step, we retrieve the current state of the world using `world:GetStates()`, and print it to see the results of our simulation.
5. **Clean Up:**
    - Finally, we destroy the world using `world:Destroy()` to free up any resources used by the simulation.

!!! info 
    This example demonstrates how to set up a simple physics world, create a static body, and run a simulation step. You can build on this foundation to create more complex simulations, adding dynamic bodies, forces, and interactions as needed.

## **Step 5: Build and Run Your Simulation**

Once your simulation code is ready, it's time to build it. The AO-Physics library comes with a build command that compiles your Lua scripts into a fully functional physics simulation.

Run the following command in your terminal:

```bash
ao build
```

!!! info 
    This command will compile your project, incorporating the AO-Physics library. If everything is set up correctly, you should see a message indicating a successful build.

!!! success ""
    Congratulations! You’ve successfully created a physics simulation using AO-Physics. You can now run your simulation and observe the physics interactions you’ve programmed.

---

By following these steps, you’ll be able to easily set up and use the AO-Physics library in your Lua projects. Whether you’re creating simple physics experiments or complex simulations, AO-Physics provides the tools you need to bring your ideas to life.
