// ~/constants/easings.ts

export const easings = {
  // Bounce effects (light to heavy)
  bounceLight: [0.25, 0.46, 0.45, 0.94] as const,
  bounceMedium: [0.25, 1.2, 0.5, 1] as const,
  bounceHeavy: [0.25, 1.45, 0.5, 1] as const,
  
  // Smooth effects (no bounce)
  smooth: [0.4, 0, 0.2, 1] as const,        // Material Design smooth
  smoothFast: [0.2, 0, 0.4, 1] as const,    // Quicker acceleration
  smoothSlow: [0.6, 0, 0.2, 1] as const,    // More gradual
} as const;