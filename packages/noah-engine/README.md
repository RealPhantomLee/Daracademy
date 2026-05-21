# @daracademy/noah-engine

Animated learning assistant for Daracademy. Noah is a white cat character that provides encouragement, reminders, and notifications throughout the learning experience.

## Features

- **XState v5 State Machine**: Robust state management with 6 states (idle, welcome, notification, helper, celebration, reading)
- **Animated Placeholder**: CSS/SVG white cat with Framer Motion animations
- **3D Model Support**: Ready for GLB model integration via swap flag
- **React Context**: Easy event dispatching for parent components
- **Predefined Dialogue**: Flat object of 12+ response strings
- **Tailwind Styling**: Responsive speech bubble with animations

## Installation

```bash
pnpm install @daracademy/noah-engine
```

## Usage

```tsx
import { NoahWidget } from "@daracademy/noah-engine";

export function App() {
  return (
    <div>
      {/* Your app content */}
      <NoahWidget enabled={true} />
    </div>
  );
}
```

## State Machine

Noah cycles through these states:

- **idle**: Default state, floating animation
- **welcome**: Greeting with scale animation (5s)
- **notification**: Alert with rotate animation (4s)
- **helper**: Assistance with slide animation (5s)
- **celebration**: Praise with bounce animation (3s)
- **reading**: Assignment reading state (60s)

## Dispatching Events

```tsx
import { useContext } from "react";
import { noahContext, noahResponses } from "@daracademy/noah-engine";

export function LessonComplete() {
  const noah = useContext(noahContext);

  return (
    <button
      onClick={() =>
        noah?.dispatch({
          type: "SHOW_CELEBRATION",
          message: noahResponses.celebration,
        })
      }
    >
      Complete Lesson
    </button>
  );
}
```

## Dialogue Strings

```tsx
import { noahResponses } from "@daracademy/noah-engine";

// Available keys:
noahResponses.welcome
noahResponses.sessionReminder
noahResponses.assignmentDue
noahResponses.titleUnlocked
noahResponses.celebration
noahResponses.helper
```

## 3D Model Integration

When the GLB model is ready:

1. Place `noah.glb` in public assets
2. Set `USE_3D_MODEL = true` in `src/renderer/NoahRenderer.tsx`
3. Implement `NoahGLB` component with three.js + @react-three/fiber

## Architecture

```
NoahWidget (entry point)
├── NoahRenderer (swap: PlaceholderRenderer or GLB)
│   ├── NoahPlaceholder (CSS/SVG cat, Framer Motion)
│   └── NoahGLB (TODO: 3D model)
├── DialogueBubble (speech bubble, Framer Motion)
└── noahContext (dispatch provider)
```
