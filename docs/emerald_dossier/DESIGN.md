# Emerald Intelligence: Design System Document

### 1. Overview & Creative North Star
**Creative North Star: The Executive Ledger**
Emerald Intelligence is designed for high-stakes commercial environments where clarity, precision, and authority are paramount. Moving beyond standard SaaS templates, this system embraces a "High-End Editorial" aesthetic. It utilizes asymmetric layouts—pairing a focused, dense configuration sidebar with a spacious, airy content canvas—to guide the user through complex onboarding and analytical workflows. The aesthetic is defined by its deep botanical greens, slate neutrals, and a sophisticated use of whitespace that feels intentional rather than empty.

### 2. Colors
The palette is rooted in a "Fidelity" model, prioritizing brand-appropriate greens and professional slates.

*   **Primary (#14532D):** A deep, authoritative emerald used for brand identity, primary actions, and active states.
*   **Secondary/Tertiary:** Slates and deep blues provide a professional "Intelligence" feel, used for supplementary information and status indicators.
*   **The "No-Line" Rule:** Sectioning is primarily achieved through background shifts (e.g., the transition from `background` to `surface`). Avoid 1px borders for large layout divisions. Borders should only be used for interactive elements like cards and inputs.
*   **Surface Hierarchy:** 
    *   `surface_container_low` (#F8FAFC) is used for the page background.
    *   `surface` (#FFFFFF) is reserved for the primary interactive canvas.
    *   `surface_container` (#F1F5F9) is used for inactive elements or "Pro Tip" callouts to create immediate visual distinction without harsh lines.
*   **Signature Textures:** Utilize high-opacity brand colors (e.g., `primary/10`) for large background icons or subtle decorative overlays to add depth to flat surfaces.

### 3. Typography
The system uses **Inter** across all roles to maintain a cohesive, Swiss-style clarity, but differentiates through extreme weight and scale variations.

*   **Display (4.5rem):** Reserved for large background decorative numbers or icons.
*   **Headline (1.875rem / 1.5rem):** Heavy weights (800+) with tight tracking for a bold, editorial look.
*   **Title (1.125rem):** Medium to bold weight for section headers.
*   **Body (0.875rem):** The standard reading size, utilizing `on_surface_variant` (#64748B) for long-form description to reduce eye strain.
*   **Label (0.75rem):** Used for navigation steps and "Pro Tips," often uppercase with wide tracking (+0.05em) for a technical feel.

### 4. Elevation & Depth
Emerald Intelligence rejects traditional "floating" shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is created by placing white `surface` cards on top of `background` (#F8FAFC) or `surface_dim` (#F1F5F9) layers.
*   **Ambient Shadows:** When shadows are required, use highly diffused, low-opacity values. The system specifically uses a `shadow-sm` for the main canvas and a `shadow-lg` (specifically `shadow-emerald-900/10`) for primary action buttons to give them a "lifted" emerald glow.
*   **The "Ghost Border":** Use `outline` (#E2E8F0) for card boundaries to provide definition without breaking the minimalist flow.

### 5. Components
*   **Buttons:**
    *   *Primary:* Heavy emerald background, white text, 8px (0.5rem) roundedness, with a soft emerald drop shadow.
    *   *Ghost:* Text-only with icons, using `on_surface_variant` for a subtle, secondary feel.
*   **Persona Cards:** Interactive containers using 2px borders when selected. Background shifts to `primary_container/20` to indicate active selection.
*   **Progress Trackers:** Vertical alignment in the sidebar. Completed steps use a solid `primary_container` fill with a checkmark, while active steps use a double-ringed stroke.
*   **Pro-Tip Callouts:** Containers using `secondary_container` with a decorative, rotated background icon for visual interest.
*   **Inputs:** Minimalist borders with high roundedness (`rounded-lg` or `0.25rem`).

### 6. Do's and Don'ts
*   **Do:** Use high contrast in typography (e.g., pairing a 30pt Extrabold headline with a 14pt Regular body).
*   **Do:** Utilize "Step" indicators in uppercase with wide tracking for navigation.
*   **Don't:** Use vibrant colors for non-primary actions; keep the interface grounded in slates and deep greens.
*   **Don't:** Overuse borders. Let the shift from gray backgrounds to white canvases define the structure.
*   **Do:** Ensure accessibility by maintaining high contrast between `on_surface` and its containers.