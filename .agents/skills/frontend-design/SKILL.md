---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
---

# Frontend Design

## Instructions

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

### Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Commit to a distinct direction: brutally minimal, maximalist chaos, luxury/refined, lo-fi/zine, dark/moody, soft/pastel, editorial/magazine, brutalist/raw, retro-futuristic, handcrafted/artisanal, organic/natural, art deco/geometric, playful/whimsical, industrial/utilitarian, etc. There are infinite varieties to start from and surpass. Use these as inspiration, but the final design should feel singular, with every detail working in service of one cohesive direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it vigorously. Bold maximalism and refined minimalism both work – the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- **Production-grade**: Functional, responsive, and shippable.
- **Visually striking**: Memorable at a glance.
- **Cohesive**: A clear aesthetic point-of-view from typography to motion.
- **Meticulously refined**: Spacing, rhythm, motion, and states are all considered.

### Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Typography carries the design's singular voice. Choose fonts with interesting personality. Default fonts signal default thinking: skip Arial, Inter, Roboto, system stacks, Space Grotesk. Font choices should be inseparable from the aesthetic direction. Display type should be expressive, even risky. Body text should be legible, refined. Pair them like actors in a scene. Work the full typographic range: size, weight, case, spacing to establish hierarchy.

- **Color & Theme**: Commit to a cohesive aesthetic. Palettes should take a clear position: bold and saturated, moody and restrained, or high-contrast and minimal. Lead with a dominant color, punctuate with sharp accents. Avoid timid, non-committal distributions. Use CSS variables for consistency.

- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise, while respecting accessibility and reduction-of-motion preferences when needed.

- **Spatial Composition**: Use unexpected layouts. Asymmetry. Overlap and z-depth. Diagonal flow. Grid-breaking elements. Dramatic scale jumps. Full-bleed moments. Generous negative space OR controlled density, depending on the chosen aesthetic.

- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to flat solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise and grain overlays, geometric patterns, layered transparencies and glassmorphism, dramatic or soft shadows and glows, parallax depth, decorative borders and clip-path shapes, print-inspired textures (halftone, duotone, stipple), knockout typography, and custom cursors when appropriate.

### Avoiding Generic AI Aesthetics

Never use generic AI-generated aesthetics such as:

- Overused font families (Inter, Roboto, Arial, Space Grotesk, system fonts).
- Clichéd color schemes (especially purple gradients on white backgrounds).
- Predictable layouts and component patterns.
- Cookie-cutter designs that lack context-specific character.

Instead:

- **Distinctive fonts**: Commit to characterful pairings that match the context.
- **Bold palettes**: Confident distributions of color, not timid accents.
- **Surprising layouts**: Push beyond generic hero + grid patterns.
- **Bespoke details**: Micro-interactions, textures, and flourishes that feel made for this interface.

Build creatively on the user's intent, and make unexpected choices that feel genuinely designed for the context. Every design should feel distinct. Actively explore the full range: light and dark themes, unexpected font pairings, substantially varied aesthetic directions. Let the specific context drive choices, NOT familiar defaults.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, elegance, and precision. All designs need careful attention to spacing, typography, and subtle details. Excellence comes from executing the vision well.

Remember: the agent is capable of extraordinary, award-worthy creative work. Do not hold back – commit relentlessly to a distinctive and unforgettable vision.

## Examples

- **Example 1 – Maximalist dashboard**: When asked to design a data-heavy SaaS analytics dashboard, choose a bold, saturated color palette with expressive display typography, asymmetrical card layouts, layered gradient backgrounds, and staggered load-in animations. Implement responsive grid layouts, hover states with motion, and CSS variables for color and spacing tokens.

- **Example 2 – Refined editorial landing page**: When asked for a minimal marketing homepage for a boutique brand, choose a high-contrast monochrome or two-color palette, an elegant serif + grotesque pairing, generous whitespace, and restrained but precise animation (e.g., subtle fade/slide on scroll). Focus on meticulous typographic hierarchy, alignment, and rhythm rather than visual noise.

- **Example 3 – Playful experimental component**: When asked to build a single interactive component (e.g., a "mood selector" or "creative timeline"), commit to a playful, whimsical direction with custom shapes, expressive hover states, and small but delightful micro-interactions, implemented with lightweight, accessible motion.

