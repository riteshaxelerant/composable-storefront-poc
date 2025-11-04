# HowToBuySection Component Documentation

## Overview

The `HowToBuySection` component displays a step-by-step guide with animated number circles that appear on scroll. It uses GSAP's ScrollTrigger plugin to create scroll-triggered animations with staggered timing and elastic bounce effects.

## Key Features

- **Scroll-Triggered Animations**: Elements animate when scrolled into view
- **Staggered Number Reveals**: Numbers appear sequentially with delays
- **Elastic Bounce Effect**: Circle backgrounds use elastic easing for playful animation
- **One-Time Animation**: Each element animates only once when first viewed
- **Sequential Circle + Number**: Circle appears first, then number fades in

## GSAP Usage

### Core GSAP Concepts Used

1. **ScrollTrigger Plugin**: Triggers animations when elements enter viewport
2. **Timelines**: Orchestrates multi-step animations (circle → number)
3. **Elastic Easing**: `back.out()` creates bouncy, elastic effect
4. **Staggered Delays**: Sequential animation timing across multiple elements

---

## Component Structure

The component consists of two main parts:

1. **HowToBuySection**: The main component with GSAP animations
2. **HowToBuyDemo**: A demo wrapper that provides sample data

### HowToBuyDemo Usage

```tsx
<HowToBuyDemo />
```

This renders `HowToBuySection` with pre-configured step data:

```tsx
const steps = [
  {
    number: 1,
    title: 'Plan your kitchen',
    description: 'Find inspiration...',
    cta: 'Browse kitchens',
    ctaHref: '/categories',
  },
  // ... more steps
];
```

---

## Animation Breakdown

### 1. Initial State Setup

**Location**: `useEffect` hook (lines 37-99)

**Purpose**: Hides all number circles and numbers before animation begins.

**GSAP Implementation**:

```typescript
// Set initial state - numbers hidden
numberRefs.current.forEach((numberEl) => {
  if (numberEl) {
    gsap.set(numberEl, {
      opacity: 0,    // Invisible
      scale: 0,      // Scaled down to zero
    });
  }
});

// Set initial state - circles hidden
circleRefs.current.forEach((circleEl) => {
  if (circleEl) {
    gsap.set(circleEl, {
      scale: 0,      // Scaled down to zero
    });
  }
});
```

**How it works**:
1. Uses `gsap.set()` to instantly set initial state (no animation)
2. Numbers are invisible (`opacity: 0`) and scaled to zero (`scale: 0`)
3. Circles are scaled to zero (`scale: 0`)
4. This ensures elements start hidden and only appear when triggered

**Key GSAP Method**:
- `gsap.set()`: Sets properties instantly without animation

---

### 2. ScrollTrigger Animation

**Location**: `useEffect` hook (lines 59-93)

**Purpose**: Creates scroll-triggered animations that activate when the section enters the viewport.

**GSAP Implementation**:

```typescript
// Create scroll trigger animation for each step
steps.forEach((step, index) => {
  const numberEl = numberRefs.current[index];
  const circleEl = circleRefs.current[index];

  // Create timeline for each number with stagger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,        // Element that triggers animation
      start: 'top 80%',                   // Trigger when top of section is 80% down viewport
      toggleActions: 'play none none none', // Only play on enter, no reverse/replay
      once: true,                         // Only animate once
    },
    delay: index * 0.3,                   // Stagger delay: 0s, 0.3s, 0.6s
  });
  
  // Animation sequence...
});
```

**ScrollTrigger Configuration**:

| Property | Value | Description |
|----------|-------|-------------|
| `trigger` | `sectionRef.current` | The element that triggers the animation |
| `start` | `'top 80%'` | Animation starts when top of trigger is 80% down viewport |
| `toggleActions` | `'play none none none'` | Only play on enter, no reverse/replay/reset |
| `once` | `true` | Animation only happens once |

**How it works**:
1. Creates a timeline for each step (3 steps total)
2. Each timeline has a ScrollTrigger attached
3. When section scrolls to 80% down the viewport, animations trigger
4. Each step has a staggered delay (`index * 0.3` seconds)
   - Step 1: 0s delay
   - Step 2: 0.3s delay
   - Step 3: 0.6s delay

**Key GSAP Features**:
- **ScrollTrigger Plugin**: Must be registered before use
  ```typescript
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  ```
- **Timeline with ScrollTrigger**: Combines timeline sequencing with scroll detection
- **Staggered Delays**: Creates sequential reveal effect

---

### 3. Circle Background Animation (Elastic Bounce)

**Location**: Timeline animation (lines 77-81)

**Purpose**: Circle backgrounds expand with an elastic bounce effect.

**GSAP Implementation**:

```typescript
// Animate circle background appearing with elastic bounce
tl.to(circleEl, {
  scale: 1,                    // Expand from 0 to full size
  duration: 0.7,                // 0.7 seconds
  ease: 'back.out(1.5)',       // Elastic bounce effect
});
```

**How it works**:
1. Animates `scale` from 0 (set initially) to 1 (full size)
2. Uses `back.out(1.5)` easing for elastic bounce
   - `back.out`: Creates overshoot effect (goes past target, then settles)
   - `1.5`: Controls overshoot amount (higher = more bounce)
3. Duration of 0.7 seconds allows bounce to be visible

**Visual Effect**:
- Circle starts scaled to 0 (invisible point)
- Expands to full size
- Slightly overshoots (goes past full size)
- Settles back to normal size
- Creates playful, bouncy entrance

**Key GSAP Features**:
- **Elastic Easing**: `back.out()` creates overshoot bounce
- **Transform Origin**: Circles use `center center` (set in CSS) for expansion from center

---

### 4. Number Text Animation (Fade-In)

**Location**: Timeline animation (lines 83-92)

**Purpose**: Numbers fade in and scale up after circle appears.

**GSAP Implementation**:

```typescript
// Animate number appearing
tl.to(
  numberEl,
  {
    opacity: 1,                 // Fade to visible
    scale: 1,                   // Scale to full size
    duration: 0.5,               // 0.5 seconds
    ease: 'power2.out',         // Smooth deceleration
  },
  '-=0.3'                       // Start 0.3s before circle animation finishes
);
```

**How it works**:
1. Animates `opacity` from 0 to 1 (fade in)
2. Animates `scale` from 0 to 1 (scale up)
3. Uses `'-=0.3'` timeline position to overlap with circle animation
   - Starts 0.3 seconds before circle animation completes
   - Creates smooth transition: circle expands → number appears while circle settles
4. Duration of 0.5 seconds with `power2.out` easing for smooth deceleration

**Timeline Position Syntax**:
- `'-=0.3'`: Start 0.3 seconds before previous animation ends (overlap)
- Creates simultaneous/overlapping animations

**Key GSAP Features**:
- **Timeline Positioning**: `'-=0.3'` creates overlapping animations
- **Multiple Properties**: Animates both `opacity` and `scale` simultaneously
- **Smooth Easing**: `power2.out` for natural deceleration

---

## Complete Animation Sequence

For each step, the animation follows this sequence:

```
1. Section scrolls into view (80% down viewport)
   ↓
2. ScrollTrigger fires
   ↓
3. Circle expands with elastic bounce (0.7s)
   ├─ Starts at scale: 0
   ├─ Expands to scale: 1
   └─ Overshoots and settles (back.out easing)
   ↓
4. Number fades in (0.5s, starts 0.3s before circle finishes)
   ├─ Starts at opacity: 0, scale: 0
   └─ Animates to opacity: 1, scale: 1
   ↓
5. Animation complete
```

**Staggered Timing**:
- Step 1: Starts immediately (0s delay)
- Step 2: Starts after 0.3s delay
- Step 3: Starts after 0.6s delay

This creates a cascading effect where numbers appear one after another.

---

## Cleanup

**Location**: `useEffect` cleanup (lines 96-98)

**Purpose**: Properly cleanup ScrollTrigger instances when component unmounts.

**GSAP Implementation**:

```typescript
// Cleanup
return () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};
```

**How it works**:
1. Gets all ScrollTrigger instances
2. Calls `kill()` on each to remove event listeners
3. Prevents memory leaks and ensures animations don't continue after unmount

**Why it's important**:
- ScrollTrigger attaches scroll event listeners
- Without cleanup, listeners persist after component unmounts
- Can cause memory leaks and unexpected behavior

---

## Component Props

### HowToBuySection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"How to buy"` | Main heading text |
| `subtitle` | `string` | `"We're with you..."` | Subtitle text |
| `steps` | `StepData[]` | Required | Array of step objects |
| `className` | `string` | `undefined` | Additional CSS classes |

### StepData Interface

```typescript
interface StepData {
  number: number;           // Step number (1, 2, 3...)
  title: string;            // Step title
  description: string;      // Step description
  cta: string;              // Call-to-action text
  ctaHref?: string;         // CTA link URL (optional)
}
```

---

## Example Usage

### Basic Usage

```tsx
import { HowToBuySection } from './HowToBuySection';

<HowToBuySection
  title="How it works"
  subtitle="Simple steps to get started"
  steps={[
    {
      number: 1,
      title: 'Step One',
      description: 'First step description',
      cta: 'Learn more',
      ctaHref: '/learn',
    },
    // ... more steps
  ]}
/>
```

### Using the Demo Component

```tsx
import { HowToBuyDemo } from './HowToBuyDemo';

<HowToBuyDemo />
```

---

## Performance Considerations

1. **ScrollTrigger Registration**: Must register plugin before use
   ```typescript
   if (typeof window !== 'undefined') {
     gsap.registerPlugin(ScrollTrigger);
   }
   ```

2. **One-Time Animation**: `once: true` prevents re-animation on scroll
   - Better performance (no repeated calculations)
   - Cleaner UX (elements don't reset)

3. **Cleanup**: Always cleanup ScrollTrigger instances
   - Prevents memory leaks
   - Removes event listeners

---

## Key Takeaways

1. **ScrollTrigger Plugin**: Enables scroll-based animations
   - Must be registered: `gsap.registerPlugin(ScrollTrigger)`
   - Configure trigger, start position, and behavior

2. **Elastic Easing**: `back.out()` creates bouncy, playful effects
   - Higher values = more overshoot
   - Perfect for attention-grabbing animations

3. **Staggered Animations**: Sequential delays create cascading effects
   - Use `delay` parameter in timeline
   - Creates visual rhythm and flow

4. **Timeline Positioning**: `'-=0.3'` creates overlapping animations
   - Negative values overlap with previous animation
   - Creates smooth transitions between elements

5. **Cleanup**: Always cleanup ScrollTrigger instances
   - Prevents memory leaks
   - Use `ScrollTrigger.getAll().forEach(t => t.kill())`

---

## Visual Timeline

```
Time →
│
├─ Step 1 Timeline (0s delay)
│  ├─ Circle: scale 0 → 1 (0.7s, elastic bounce)
│  └─ Number: opacity/scale 0 → 1 (0.5s, starts at 0.4s)
│
├─ Step 2 Timeline (0.3s delay)
│  ├─ Circle: scale 0 → 1 (0.7s, elastic bounce)
│  └─ Number: opacity/scale 0 → 1 (0.5s, starts at 0.7s)
│
└─ Step 3 Timeline (0.6s delay)
   ├─ Circle: scale 0 → 1 (0.7s, elastic bounce)
   └─ Number: opacity/scale 0 → 1 (0.5s, starts at 1.0s)
```

This creates a cascading effect where each step's animation starts 0.3 seconds after the previous one.

