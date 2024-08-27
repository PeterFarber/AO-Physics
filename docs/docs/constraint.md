# Constraints

The `Constraints` class defines various constraints used to govern the relationships between bodies in the simulation. Each constraint type has specific properties and methods to manage and apply the constraints.

## **Table of Contents**

- [Introduction](#introduction)
- [Constraint Types](#constraint-types)
    - [Hinge Constraint](#hinge-constraint)
    - [Slider Constraint](#slider-constraint)
    - [Pulley Constraint](#pulley-constraint)
    - [Point Constraint](#point-constraint)
    - [Gear Constraint](#gear-constraint)
    - [Fixed Constraint](#fixed-constraint)
    - [Distance Constraint](#distance-constraint)
    - [Cone Constraint](#cone-constraint)
- [Example: Creating and Configuring Constraints](#example)

## **Constraint Types**

### Hinge Constraint

Represents a hinge-like connection between two bodies.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Hinge"`              |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `point1`                    | `table`  | The hinge's attachment point on the first body.    | `{ 0, 0, 0 }`         |
| `hingeAxis1`                | `table`  | The axis of rotation for the first body.           | `{ 0, 1, 0 }`         |
| `normalAxis1`               | `table`  | The normal axis for the first body.                | `{ 1, 0, 0 }`         |
| `point2`                    | `table`  | The hinge's attachment point on the second body.   | `{ 0, 0, 0 }`         |
| `hingeAxis2`                | `table`  | The axis of rotation for the second body.          | `{ 0, 1, 0 }`         |
| `normalAxis2`               | `table`  | The normal axis for the second body.               | `{ 1, 0, 0 }`         |
| `limitsMin`                 | `number` | Minimum angle limit for the hinge.                 | `-180.0`              |
| `limitsMax`                 | `number` | Maximum angle limit for the hinge.                 | `180.0`               |
| `maxFrictionTorque`         | `number` | Maximum friction torque for the hinge.             | `0.0`                 |
| `limitsSpringSettings`      | `table`  | Spring settings for the angle limits.               | `{ mode = "FrequencyAndDamping", frequency = 0.0, stiffness = 0.0, damping = 0.0 }` |
| `motorSettings`             | `table`  | Motor settings for the hinge.                       | `{ frequency = 0.0, damping = 0.0 }` |
| `motorState`                | `string` | State of the motor.                                | `"Off"`               |
| `targetAngularVelocity`     | `number` | Target angular velocity of the hinge.              | `0.0`                 |
| `targetAngle`               | `number` | Target angle of the hinge.                         | `0.0`                 |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the hinge constraint between two bodies.

---

### Slider Constraint

Represents a slider-like connection that allows movement along a single axis.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Slider"`             |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `autoDetectPoint`           | `boolean` | Whether the attachment point is auto-detected.     | `false`                |
| `point1`                    | `table`  | The slider's attachment point on the first body.   | `{ 0, 0, 0 }`         |
| `sliderAxis1`               | `table`  | The axis along which the slider moves for the first body. | `{ 1, 0, 0 }` |
| `normalAxis1`               | `table`  | The normal axis for the first body.                | `{ 0, 1, 0 }`         |
| `point2`                    | `table`  | The slider's attachment point on the second body.  | `{ 0, 0, 0 }`         |
| `sliderAxis2`               | `table`  | The axis along which the slider moves for the second body. | `{ 1, 0, 0 }` |
| `normalAxis2`               | `table`  | The normal axis for the second body.               | `{ 0, 1, 0 }`         |
| `limitsMin`                 | `number` | Minimum movement limit for the slider.             | `-3.40282347e+38`     |
| `limitsMax`                 | `number` | Maximum movement limit for the slider.             | `3.40282347e+38`      |
| `maxFrictionForce`          | `number` | Maximum friction force for the slider.             | `0.0`                 |
| `limitsSpringSettings`      | `table`  | Spring settings for the movement limits.            | `{ mode = "FrequencyAndDamping", frequency = 0.0, stiffness = 0.0, damping = 0.0 }` |
| `motorSettings`             | `table`  | Motor settings for the slider.                      | `{ frequency = 0.0, damping = 0.0 }` |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the slider constraint between two bodies.

---

### Pulley Constraint

Represents a pulley system connecting two bodies.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Pulley"`             |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `bodyPoint1`                | `table`  | Attachment point on the first body.                | `{ 0, 0, 0 }`         |
| `fixedPoint1`               | `table`  | Fixed point in the world for the first pulley.     | `{ 0, 0, 0 }`         |
| `bodyPoint2`                | `table`  | Attachment point on the second body.               | `{ 0, 0, 0 }`         |
| `fixedPoint2`               | `table`  | Fixed point in the world for the second pulley.    | `{ 0, 0, 0 }`         |
| `ratio`                     | `number` | Ratio of the pulley system.                        | `1.0`                 |
| `minLength`                 | `number` | Minimum length of the pulley.                      | `0.0`                 |
| `maxLength`                 | `number` | Maximum length of the pulley.                      | `0.0`                 |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the pulley constraint between two bodies.

---

### Point Constraint

Represents a point-to-point connection between two bodies.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Point"`              |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `point1`                    | `table`  | The point of attachment on the first body.         | `{ 0, 0, 0 }`         |
| `point2`                    | `table`  | The point of attachment on the second body.        | `{ 0, 0, 0 }`         |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the point constraint between two bodies.

---

### Gear Constraint

Represents a gear-like connection between two bodies.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Gear"`               |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `numTeeth1`                 | `number` | Number of teeth on the first gear.                 | `1`                    |
| `numTeeth2`                 | `number` | Number of teeth on the second gear.                | `1`                    |
| `hingeAxis1`                | `table`  | The axis of rotation for the first gear.           | `{ 1, 0, 0 }`         |
| `hingeAxis2`                | `table`  | The axis of

 rotation for the second gear.          | `{ 1, 0, 0 }`         |
| `ratio`                     | `number` | Gear ratio between the two gears.                  | `1.0`                 |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the gear constraint between two bodies.

---

### Fixed Constraint

Represents a fixed connection between two bodies.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Fixed"`              |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `point1`                    | `table`  | The attachment point on the first body.            | `{ 0, 0, 0 }`         |
| `axisX1`                    | `table`  | The X axis direction for the first body.           | `{ 0, 1, 0 }`         |
| `axisY1`                    | `table`  | The Y axis direction for the first body.           | `{ 1, 0, 0 }`         |
| `point2`                    | `table`  | The attachment point on the second body.           | `{ 0, 0, 0 }`         |
| `axisX2`                    | `table`  | The X axis direction for the second body.          | `{ 0, 1, 0 }`         |
| `axisY2`                    | `table`  | The Y axis direction for the second body.          | `{ 1, 0, 0 }`         |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the fixed constraint between two bodies.

---

### Distance Constraint

Represents a distance constraint between two bodies.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Distance"`           |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `point1`                    | `table`  | The attachment point on the first body.            | `{ 0, 0, 0 }`         |
| `point2`                    | `table`  | The attachment point on the second body.           | `{ 0, 0, 0 }`         |
| `minDistance`               | `number` | Minimum distance between the bodies.               | `-1.0`                |
| `maxDistance`               | `number` | Maximum distance between the bodies.               | `-1.0`                |
| `limitsSpringSettings`      | `table`  | Spring settings for distance limits.               | `{ mode = "FrequencyAndDamping", frequency = 0.0, stiffness = 0.0, damping = 0.0 }` |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the distance constraint between two bodies.

---

### Cone Constraint

Represents a cone-like connection allowing rotation within a cone.

#### Properties
| Property                    | Type    | Description                                         | Default Value          |
|-----------------------------|---------|-----------------------------------------------------|------------------------|
| `type`                      | `string` | Type of constraint.                                | `"Cone"`               |
| `space`                     | `string` | Space in which the constraint is defined.           | `"WorldSpace"`         |
| `point1`                    | `table`  | The point of attachment on the first body.         | `{ 0, 0, 0 }`         |
| `twistAxis1`                | `table`  | The twist axis for the first body.                 | `{ 0, 1, 0 }`         |
| `point2`                    | `table`  | The point of attachment on the second body.        | `{ 0, 0, 0 }`         |
| `twistAxis2`                | `table`  | The twist axis for the second body.                | `{ 0, 1, 0 }`         |
| `halfConeAngle`             | `number` | Half of the cone angle defining the constraint.     | `0.0`                 |

#### Methods
- [`Add(body1, body2)`](#add) - Adds the cone constraint between two bodies.

---

## **Methods**

### Add

Adds the constraint between two bodies.

#### Parameters
- `body1` (`object`): The first body to connect.
- `body2` (`object`): The second body to connect.

#### Returns
- `id` (`number`): The unique identifier for the created constraint.

#### Example Usage
```lua
local hinge = AOP:ConstraintHinge()
hinge.point1 = {1, 2, 3}
hinge.hingeAxis1 = {0, 1, 0}
local id = hinge:Add(body1, body2)
print("Hinge Constraint ID:", id)
```

This method creates and adds the constraint between the two specified bodies, returning the unique ID of the created constraint.