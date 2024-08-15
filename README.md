# AO-Physics

## Example Lua Program

```lua
local jolt = require('jolt')
jolt.create_world()
local box_id = jolt.create_box(10,1,10, 0.0, 0.0, 0.0, 'Static')
local sphere_id = jolt.create_sphere(0.5, 0.0, 2.0, 0.0, 'Dynamic')
jolt.set_linear_velocity(sphere_id, 0, 0, 0)
jolt.update_world(100, 0.01666666666)
jolt.destroy_world()
return "Jolted"
```

## Create World
Create/Initialize a physics simulation. 
```lua
jolt.create_world()
```

## Destroy World
Shutdown the physics simulation. 
```lua
jolt.destroy_world()
```

## Update World
Create/Initialize a physics simulation. 
```lua
jolt.update_world(100, 0.01666666666)
```

### Arguments

| Name    	| Type   	| Description                                   	|
|---------	|--------	|-----------------------------------------------	|
| steps 	| number 	| The number of steps to run in the update. 	    |
| deltaTime | number 	| The delta time.                               	|


## Create Box
Create a box body and place it in the world.
```lua
local box_id = jolt.create_box(10, 1, 10, 0.0, 0.0, 0.0, 'Static')
```

### Arguments

| Name    	    | Type   	| Description                                   	| Options |
|---------	    |--------	|-----------------------------------------------	| ------- |
| x_size 	    | number 	| The width of the box.	                            |
| y_size        | number 	| The height of the box.                            |
| z_size        | number 	| The depth of the box.                             |
| x_pos 	    | number 	| The x position of the box.	                    |
| y_pos         | number 	| The y position of the box.                        |
| z_pos         | number 	| The z position of the box.                        |
| motion_type   | string 	| The type of motion the body has.                  | "Static", "Dynamic", "KiniKinematic      |

Returns a body_id (string).


## Create Sphere
Create a sphere body and place it in the world.
```lua
local sphere_id = jolt.create_sphere(0.5, 0.0, 2.0, 0.0, 'Dynamic')
```

### Arguments

| Name    	    | Type   	| Description                                   	| Options |
|---------	    |--------	|-----------------------------------------------	| ------- |
| radius 	    | number 	| The radius of the sphere.                         |
| x_pos 	    | number 	| The x position of the sphere.	                    |
| y_pos         | number 	| The y position of the sphere.                        |
| z_pos         | number 	| The z position of the sphere.                        |
| motion_type   | string 	| The type of motion the body has.                  | "Static", "Dynamic", "KiniKinematic      |

Returns a body_id (string).


## Set Linear Velocity
Sets the linear velocity of a specified body.
```lua
jolt.set_linear_velocity([body_id], 0, 1, 0)
```

### Arguments

| Name    	| Type   	| Description                                   	|
|---------	|--------	|-----------------------------------------------	|
| body_id 	| string 	| The body id of the body you want to update. 	    |
| x_vel   	| number 	| The x velocity.                               	|
| y_vel   	| number 	| The y velocity.                               	|
| z_vel   	| number 	| The z velocity.                               	|
