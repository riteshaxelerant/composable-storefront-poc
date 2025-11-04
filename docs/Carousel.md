# Carousel Component Documentation

## Overview

The `Carousel` component is an infinite-loop carousel that displays multiple slides side-by-side with smooth GSAP animations. It features a "train-coach turbulence" effect where slides expand and contract as they move, creating a dynamic visual experience.

## Key Features

- **Infinite Loop**: Seamless looping using duplicated slides at the beginning and end
- **Side-by-Side Display**: Shows 2.5 slides at once (40% width each)
- **Train-Coach Turbulence Effect**: Slides expand/contract with a rubber-band effect during transitions
- **Progressive Image Loading**: Images load as they become visible
- **Smooth GSAP Transitions**: Hardware-accelerated animations

## GSAP Usage

### Core GSAP Concepts Used

1. **Transform Animations**: `x`, `scaleX` for position and size changes
2. **Transform Origins**: Control which edge stays fixed during expansion
3. **Timelines**: Orchestrate staggered animations across multiple slides
4. **Dynamic Calculations**: Real-time position calculations based on container width

---

## Animation Breakdown

### 1. Infinite Loop Implementation

**Location**: `useMemo` hook (lines 69-77)

**Purpose**: Creates seamless infinite scrolling by duplicating slides.

**How it works**:
```typescript
const infiniteSlides = [
  ...slides.map((s, i) => ({ ...s, id: `clone-end-${s.id}` })),  // End clones
  ...slides.map((s, i) => ({ ...s, id: s.id })),                 // Real slides
  ...slides.map((s, i) => ({ ...s, id: `clone-start-${s.id}` })), // Start clones
];
```

**GSAP Position Jumping**:
When reaching a clone, the carousel instantly jumps (without animation) to the corresponding real slide:

```typescript
if (toIndex >= slides.length * 2) {
  // At end clone, jump to corresponding real slide
  const newIndex = toIndex - slides.length;
  const jumpX = getTranslateX(newIndex);
  gsap.set(carouselWrapperRef.current, { x: jumpX }); // Instant jump
}
```

**Key GSAP Method**:
- `gsap.set()`: Instantly sets position without animation (for seamless loop)

---

### 2. Main Carousel Movement

**Location**: `animateSlide` function (lines 226-270)

**Purpose**: Smoothly moves the entire carousel wrapper to center the active slide.

**GSAP Implementation**:

```typescript
// Calculate translateX to center active slide
const translateX = getTranslateX(toIndex);

// Animate carousel wrapper
gsap.to(carouselWrapperRef.current, {
  x: translateX,              // Horizontal position
  duration: duration,         // 1.2 seconds
  ease: easing,              // 'power2.out'
  onComplete: () => {
    // Handle infinite loop jumping
  },
});
```

**Position Calculation**:
```typescript
const getTranslateX = (index: number) => {
  const slideWidth = containerWidth * 0.4;  // 40% of container
  const gap = containerWidth * 0.02;        // 2% gap
  const totalOffset = index * (slideWidth + gap);
  return containerWidth / 2 - slideWidth / 2 - totalOffset;
};
```

**How it works**:
1. Calculates target position to center the active slide
2. Animates the entire wrapper using `x` transform
3. Uses smooth easing for natural motion
4. Handles infinite loop jumping in `onComplete`

**Key GSAP Methods**:
- `gsap.to()`: Animates wrapper position
- `x` property: Horizontal translation (better performance than `left`)

---

### 3. Train-Coach Turbulence Effect (Rubber Band)

**Location**: `updateSlideStates` function (lines 147-223)

**Purpose**: Creates a subtle expansion/contraction effect on visible slides, simulating a "rubber band" or "train-coach" visual effect.

**GSAP Implementation**:

```typescript
// Determine transform origin based on direction
const transformOrigin = isNext ? 'left center' : 'right center';

// Set transform origin (pins one edge)
gsap.set(imageWrapper, {
  transformOrigin: transformOrigin,
});

// Create staggered timeline
const tl = gsap.timeline({ 
  delay: duration * 0.1 + staggerDelay 
});

// Rubber band effect: compress → expand → normalize
tl.fromTo(
  imageWrapper,
  {
    scaleX: 0.99,  // Slightly compressed
  },
  {
    scaleX: 1.01,  // Slightly expanded from fixed edge
    duration: duration * 0.45,
    ease: 'power2.out',
  }
).to(imageWrapper, {
  scaleX: 1,       // Return to normal
  duration: duration * 0.4,
  ease: 'power1.out',
});
```

**How it works**:
1. **Direction Detection**: Determines if moving next (left) or previous (right)
2. **Transform Origin**: 
   - Next: `left center` (left edge fixed, right expands)
   - Previous: `right center` (right edge fixed, left expands)
3. **Three-Stage Animation**:
   - **Compress**: `scaleX: 0.99` (very subtle)
   - **Expand**: `scaleX: 1.01` (from fixed edge)
   - **Normalize**: `scaleX: 1` (return to normal)
4. **Staggered Timing**: Each slide has a delay based on distance from active slide
   ```typescript
   const staggerDelay = distance * 0.06; // 0s, 0.06s, 0.12s
   ```

**Visual Effect**:
- Creates a "rubber band" or "train-coach" effect where slides appear to stretch and contract
- One edge stays fixed while the other expands
- Staggered delays create a wave-like motion across visible slides

**Key GSAP Features**:
- `scaleX`: Horizontal scaling (1 = normal, <1 = compressed, >1 = expanded)
- `transformOrigin`: Controls which edge stays fixed
- `fromTo()`: Animates from specific start to end values
- Timeline with delays: Creates staggered wave effect

---

### 4. Slide Width and Container Management

**Location**: `updateCarouselWidth` function (lines 119-128)

**Purpose**: Dynamically calculates and sets the total width of the carousel wrapper.

**GSAP Implementation**:

```typescript
const updateCarouselWidth = () => {
  const containerWidth = carouselContainerRef.current.offsetWidth;
  const slideWidth = containerWidth * 0.4;  // 40% per slide
  const gap = containerWidth * 0.02;         // 2% gap
  const totalWidth = infiniteSlides.length * (slideWidth + gap) - gap;
  
  gsap.set(carouselWrapperRef.current, {
    width: totalWidth,
  });
};
```

**How it works**:
1. Calculates total width needed for all slides
2. Uses `gsap.set()` to instantly update wrapper width
3. Called on mount, resize, and slide changes

---

### 5. Responsive Resize Handling

**Location**: `useEffect` hook (lines 399-429)

**Purpose**: Updates slide widths and positions when window resizes.

**GSAP Implementation**:

```typescript
const handleResize = () => {
  // Update slide widths
  slidesRef.current.forEach((slide, index) => {
    if (!slide) return;
    gsap.set(slide, {
      width: slideWidth,
      marginRight: isLast ? 0 : gap,
    });
  });
  
  // Update wrapper width
  updateCarouselWidth();
  
  // Recalculate position
  const translateX = getTranslateX(currentIndex);
  gsap.set(carouselWrapperRef.current, {
    x: translateX,
  });
};
```

**How it works**:
1. Recalculates slide widths based on new container size
2. Updates all slide widths instantly with `gsap.set()`
3. Recalculates and updates carousel position

---

## Advanced Techniques

### 1. Progressive Image Loading

Images are loaded as slides become visible (within 2 slides distance):

```typescript
const loadImage = (index: number) => {
  if (distance <= 2) {
    // Load image for visible/nearby slides
  }
};
```

### 2. Staggered Animations

Each slide's turbulence effect is staggered based on distance:

```typescript
const staggerDelay = distance * 0.06; // 0s, 0.06s, 0.12s for slides 0, 1, 2
```

### 3. Direction-Based Transform Origin

The transform origin changes based on scroll direction to create realistic rubber-band effect:

- **Next (moving left)**: `left center` - left edge fixed, right expands
- **Previous (moving right)**: `right center` - right edge fixed, left expands

---

## Performance Optimizations

1. **willChange Property**: Applied to animated elements
   ```typescript
   style={{ willChange: 'transform' }}
   ```

2. **GPU Acceleration**: Uses `transform` (x, scaleX) instead of `left/width` properties

3. **Lazy Image Loading**: Images only load when visible or nearby

4. **Efficient Calculations**: Width calculations cached and reused

---

## Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `1.2` | Animation duration in seconds |
| `easing` | `string` | `'power2.out'` | GSAP easing function |
| `autoPlay` | `boolean` | `false` | Enable auto-play |
| `autoPlayInterval` | `number` | `5000` | Milliseconds between slides |
| `blurAmount` | `number` | `2` | Blur for inactive slides (not currently used) |

---

## Visual Layout

```
┌─────────────────────────────────────────┐
│         Container (100% width)          │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ Slide  │ │ Slide  │ │ Slide  │ ...  │ ← 40% width each
│  │  (2)   │ │  (0)   │ │  (1)   │      │ ← 2% gap between
│  └────────┘ └────────┘ └────────┘     │
│         ↑                                │
│    Active (centered)                    │
└─────────────────────────────────────────┘
```

---

## Example Usage

```tsx
<Carousel
  slides={[
    {
      id: 1,
      image: '/slide-1.jpg',
      content: <div>Content</div>,
    },
  ]}
  autoPlay={true}
  autoPlayInterval={4000}
  duration={1.2}
  easing="power2.out"
/>
```

---

## Key Takeaways

1. **Infinite Loop**: Duplicate slides at start/end, jump with `gsap.set()` when reaching clones
2. **Transform Origins**: Control which edge stays fixed during rubber-band effect
3. **Staggered Animations**: Delay based on distance creates wave effect
4. **Dynamic Calculations**: Real-time position calculations for responsive behavior
5. **GPU Acceleration**: Use `transform` properties (`x`, `scaleX`) for smooth animations

---

## The "Train-Coach Turbulence" Effect Explained

The name comes from the visual similarity to train cars moving past each other:

1. **Fixed Edge**: One edge of each slide stays in place (like a train car's connection point)
2. **Expanding Edge**: The other edge expands outward (like cars stretching apart)
3. **Staggered Motion**: Each slide animates slightly after the previous one (like a wave)
4. **Subtle Effect**: Very small scale changes (0.99 → 1.01) create a realistic, subtle motion

This creates a dynamic, organic feeling that makes the carousel feel alive and responsive.

