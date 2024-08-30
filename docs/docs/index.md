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

## Examples
To help you get started with the physics simulation system, here are some examples showcasing different aspects of its usage:

1. [Basic](examples/basic.md): This example demonstrates how to initialize the simulation environment, create and configure bodies, apply physical motions, and update and retrieve simulation states. It covers the fundamental concepts and operations of the physics simulation system. 
!!! note 
    This example does not include using **Constraints**

!!! attention 
    More Coming Soon...

Feel free to explore these examples to gain a better understanding of how to use the physics simulation system in your projects.

For more detailed usage and information on each component, please consult the respective documentation linked in the table of contents.


!!! danger "IMPORTANT" 
    AO Physics is still in its early stage of development...

<!-- "attention", "caution", "danger", "error", "hint", "important", "note", "tip", "warning" -->