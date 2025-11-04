# Component Documentation

This folder contains detailed documentation for the GSAP-powered UI components in this project.

## Overview

All three components use [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) for smooth, performant animations. GSAP provides:

- Hardware-accelerated animations using CSS transforms
- Advanced easing functions for natural motion
- Timeline control for complex animation sequences
- ScrollTrigger plugin for scroll-based animations

---

## Components

### 1. [HeroSlider](./HeroSlider.md)

A full-width hero slider with dramatic entrance animations and auto-play functionality.

**Key Features**:
- Initial expansion animation from center
- Auto-play with visual progress indicators
- Smooth fade transitions between slides
- Content fade-up animations

**GSAP Techniques**:
- Timeline orchestration
- Transform-based animations (scale, position)
- Progress bar animations with `scaleX`
- Content fade-up effects

**File**: `components/ui/HeroSlider.tsx`

---

### 2. [Carousel](./Carousel.md)

An infinite-loop carousel with side-by-side slides and a "train-coach turbulence" effect.

**Key Features**:
- Infinite seamless looping
- Side-by-side display (2.5 slides visible)
- Rubber-band expansion effect on slides
- Progressive image loading

**GSAP Techniques**:
- Infinite loop with position jumping
- Staggered animations across slides
- Direction-based transform origins
- Dynamic position calculations

**File**: `components/ui/Carousel.tsx`

---

### 3. [HowToBuySection](./HowToBuySection.md)

A step-by-step guide with scroll-triggered number animations.

**Key Features**:
- Scroll-triggered animations
- Elastic bounce effects
- Staggered sequential reveals
- One-time animation per element

**GSAP Techniques**:
- ScrollTrigger plugin integration
- Elastic easing (`back.out()`)
- Timeline positioning for overlapping animations
- Staggered delays

**File**: `components/ui/HowToBuySection.tsx`

---

## Common GSAP Patterns

### 1. Initial State Setup

```typescript
gsap.set(element, {
  opacity: 0,
  scale: 0,
});
```

### 2. Animation Sequences

```typescript
const tl = gsap.timeline();
tl.to(element1, { /* animation */ })
  .to(element2, { /* animation */ }, '-=0.3'); // Overlap timing
```

### 3. Transform-Based Animations

```typescript
gsap.to(element, {
  x: 100,        // Translate X (better than left)
  scaleX: 1.2,   // Scale X
  opacity: 1,
  duration: 1,
  ease: 'power2.out',
});
```

### 4. ScrollTrigger

```typescript
gsap.timeline({
  scrollTrigger: {
    trigger: element,
    start: 'top 80%',
    once: true,
  },
});
```

---

## Performance Best Practices

1. **Use Transforms**: Use `x`, `y`, `scale`, `rotate` instead of `left`, `top`, `width`, `height`
2. **willChange CSS**: Add `willChange: 'transform'` to animated elements
3. **Cleanup**: Always cleanup timelines and ScrollTriggers on unmount
4. **Refs for Callbacks**: Use refs to avoid stale closures in GSAP callbacks

---

## Getting Started

1. Install GSAP:
   ```bash
   npm install gsap
   ```

2. Import in your component:
   ```typescript
   import { gsap } from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';
   
   gsap.registerPlugin(ScrollTrigger);
   ```

3. See individual component documentation for detailed usage examples.

---

## Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/docs/v3/Eases)
- [ScrollTrigger Documentation](https://greensock.com/docs/v3/Plugins/ScrollTrigger)

