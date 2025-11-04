# HeroSlider Component Documentation

## Overview

The `HeroSlider` component is a full-width hero slider with smooth GSAP-powered animations. It features an initial expansion animation, auto-play functionality with progress indicators, and smooth slide transitions.

## Key Features

- **Initial Expansion Animation**: First slide expands from a small center rectangle to full screen
- **Auto-play with Progress Bars**: Visual progress indicators show time remaining for each slide
- **Smooth Slide Transitions**: Fade transitions between slides with content animations
- **Navigation Controls**: Previous/Next buttons and dot indicators
- **Customizable**: Duration, easing, and auto-play intervals can be configured

## GSAP Usage

### Core GSAP Concepts Used

1. **Timelines**: Used to orchestrate complex multi-step animations
2. **Transforms**: `scaleX`, `x`, `y`, `opacity` for smooth animations
3. **Transform Origins**: Used for expansion from center point
4. **Easing Functions**: `power2.out`, `power3.out` for natural motion

---

## Animation Breakdown

### 1. Initial Expansion Animation

**Location**: `useEffect` hook (lines 137-230)

**Purpose**: Creates a dramatic entrance effect where the first slide expands from a small rectangle in the center of the screen to full width and height.

**GSAP Implementation**:

```typescript
// Set initial state - small rectangle in center
gsap.set(firstSlideRef.current, {
  width: initialWidth,      // 300px
  height: initialHeight,    // 150px
  x: centerX,               // Centered horizontally
  y: centerY,               // Centered vertically
  transformOrigin: 'center center',
});

// Expand to full size
tl.to(firstSlideRef.current, {
  width: containerWidth,
  height: containerHeight,
  x: 0,
  y: 0,
  duration: duration * 1.5,  // 1.8 seconds (if duration = 1.2)
  ease: 'power3.out',        // Smooth deceleration
});
```

**How it works**:
1. Calculates container dimensions and center position
2. Sets first slide to 300x150px at the center
3. Uses GSAP timeline to animate expansion to full size
4. Uses `transformOrigin: 'center center'` to ensure expansion from center point
5. After expansion, fades in text content with a subtle upward motion

**Key GSAP Methods**:
- `gsap.set()`: Sets initial state without animation
- `gsap.timeline()`: Creates a sequence of animations
- `.to()`: Animates to target values

---

### 2. Slide Transitions

**Location**: `goToSlide` function (lines 233-320)

**Purpose**: Smoothly transitions between slides with fade effects and content animations.

**GSAP Implementation**:

```typescript
// Fade out current slide
gsap.to(fromSlide, {
  opacity: 0,
  duration: duration * 0.5,  // 0.6 seconds
  ease: easing,              // 'power2.out' by default
});

// Fade in new slide
gsap.fromTo(
  toSlide,
  {
    opacity: 0,
    zIndex: 1,
  },
  {
    opacity: 1,
    zIndex: 2,
    duration: duration,      // 1.2 seconds
    ease: easing,
    onComplete: () => {
      // Animation complete callback
    },
  }
);
```

**How it works**:
1. Fades out current slide (50% of duration)
2. Simultaneously fades in new slide (100% of duration) with higher z-index
3. Resets previous slide's z-index after transition
4. Animates content (text) with fade-up effect
5. Starts progress bar after content is visible

**Key GSAP Methods**:
- `gsap.to()`: Animates from current state to target
- `gsap.fromTo()`: Animates from specific start to end values
- `onComplete`: Callback when animation finishes

---

### 3. Progress Bar Animation

**Location**: `animateProgressBar` function (lines 82-134)

**Purpose**: Visual indicator showing time remaining until auto-advance to next slide.

**GSAP Implementation**:

```typescript
// Reset all progress bars
progressBarRefs.current.forEach((bar) => {
  if (bar) {
    gsap.set(bar, {
      scaleX: 0,                    // Start at 0 width
      transformOrigin: 'left center', // Expand from left
    });
  }
});

// Animate progress bar filling
progressTimelineRef.current = gsap.timeline({
  onComplete: () => {
    // Auto-advance to next slide when complete
  },
});

progressTimelineRef.current.to(progressBar, {
  scaleX: 1,                       // Expand to full width
  duration: autoPlayInterval / 1000, // Convert ms to seconds
  ease: 'none',                    // Linear progress (no easing)
});
```

**How it works**:
1. Resets all progress bars to `scaleX: 0`
2. Sets `transformOrigin: 'left center'` so expansion happens from left
3. Creates a timeline that animates `scaleX` from 0 to 1
4. Uses `ease: 'none'` for linear progress (constant speed)
5. When complete, automatically advances to next slide

**Key GSAP Features**:
- `scaleX`: Horizontal scaling (0 = collapsed, 1 = full width)
- `transformOrigin`: Controls expansion direction
- Timeline `onComplete`: Triggers auto-advance

---

### 4. Content Animation (Fade-Up Effect)

**Location**: Within `goToSlide` and initial animation (lines 298-310, 212-229)

**Purpose**: Smoothly reveals text content with a subtle upward motion.

**GSAP Implementation**:

```typescript
// Hide content initially
gsap.set(newSlideContent, {
  opacity: 0,
  y: 20,  // Slight vertical offset
});

// Fade in and move up
gsap.to(newSlideContent, {
  opacity: 1,
  y: 0,   // Move to original position
  duration: duration * 0.8,  // 0.96 seconds
  ease: 'power2.out',
});
```

**How it works**:
1. Sets initial state: invisible (`opacity: 0`) and slightly below (`y: 20`)
2. Animates to visible and original position
3. Creates a smooth fade-up effect
4. Starts after slide transition completes

---

## State Management with Refs

The component uses refs extensively to avoid stale closures in GSAP callbacks:

```typescript
const currentIndexRef = useRef(0);
const goToSlideRef = useRef<((index: number) => void) | null>(null);
const progressTimelineRef = useRef<gsap.core.Timeline | null>(null);
```

**Why refs?**
- GSAP callbacks (like `onComplete`) can capture stale state values
- Refs always have the latest value
- Prevents animation bugs and ensures correct auto-advance behavior

---

## Performance Optimizations

1. **willChange CSS Property**: Applied to animated elements for GPU acceleration
   ```typescript
   style={{ willChange: 'transform, opacity' }}
   ```

2. **Lazy Loading**: Only first slide loads immediately, others use `loading="lazy"`

3. **Timeline Cleanup**: Progress timelines are killed before creating new ones
   ```typescript
   if (progressTimelineRef.current) {
     progressTimelineRef.current.kill();
   }
   ```

---

## Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `1.2` | Animation duration in seconds |
| `easing` | `string` | `'power2.out'` | GSAP easing function |
| `autoPlay` | `boolean` | `true` | Enable auto-play |
| `autoPlayInterval` | `number` | `2000` | Milliseconds between slides |

---

## Easing Functions

The component uses GSAP's built-in easing functions:

- **`power2.out`**: Smooth deceleration (default for transitions)
- **`power3.out`**: Stronger deceleration (used for initial expansion)
- **`none`**: Linear (used for progress bars)

---

## Example Usage

```tsx
<HeroSlider
  slides={[
    {
      id: 1,
      image: '/hero-1.jpg',
      content: <div>Slide Content</div>,
    },
  ]}
  autoPlay={true}
  autoPlayInterval={6000}
  duration={1.5}
  easing="power3.out"
/>
```

---

## Key Takeaways

1. **GSAP Timelines** orchestrate complex multi-step animations
2. **Transform Origins** control where scaling/rotation happens
3. **Refs** prevent stale closures in GSAP callbacks
4. **Linear Progress** (`ease: 'none'`) for progress bars
5. **Performance**: Use `willChange` and cleanup timelines

