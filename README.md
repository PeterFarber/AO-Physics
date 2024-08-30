# AO Physics

${\color{white}\Huge{\textsf{Version: }} \color{orange}\Huge{\textsf{0.0.1}}}$

AO Physics is a powerful and flexible physics simulation system designed for creating realistic physical interactions within a virtual environment. It provides components for defining worlds, bodies, and constraints, allowing for detailed and accurate simulations.

> [!CAUTION]
> The AO Dev-Cli currently does not support building a 32 bit wasm application so you can not compile this application yet.
> The code for building 32 bit wasm applications has already been written just needs to be merged.
> Lastly the 32 bit option in AO Loader needs to be updated to support the sys funcs for jolt ( Work in Progress ).

## Features

- **World Management**: Configure and manage the overall simulation environment, including gravity, time settings, and more.
- **Body Dynamics**: Define physical objects with attributes like position, velocity, and mass, and manage their interactions.
- **Constraints**: Implement various constraints to simulate joints, connections, and interactions between bodies.
- **Character Interaction**: Define and manage characters within the simulation, including their attributes, behaviors, and interactions with the environment and other characters.

## Documentation

For detailed documentation on how to use AO Physics, including configuration, methods, and examples, please visit the [AO Physics Documentation](https://peterfarber.github.io/AO-Physics/).

The documentation covers:

- **[World](https://peterfarber.github.io/AO-Physics/world)**: Overview and configuration of the simulation environment.
- **[Body](https://peterfarber.github.io/AO-Physics/body)**: Properties and methods for defining and managing physical bodies.
- **[Constraints](https://peterfarber.github.io/AO-Physics/constraint)**: Types of constraints and their usage for simulating physical connections.
- **[Character](https://peterfarber.github.io/AO-Physics/character)**: Definition and manipulation of characters within the simulation, including properties and methods for interaction.