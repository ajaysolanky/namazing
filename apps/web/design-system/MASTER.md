# Namazing Design System — Nature Distilled

## Aesthetic
Minimal editorial feel. Restrained, confident, warm. Generous whitespace, split layouts, and border dividers between sections.

## Source of truth
- CSS tokens: `apps/web/app/globals.css`
- Tailwind theme tokens: `apps/web/tailwind.config.ts`
- Shared landing recipes: `apps/web/design-system/landing.ts`

## Core color tokens
- `studio-sand`: `#F5EFE6` page background
- `studio-ink`: `#1F2933` primary text
- `studio-forest`: `#455A44` primary action/icons
- `studio-forest-dark`: `#324231` primary hover
- `studio-peach`: `#F4AC74` warm accent
- `studio-border`: `#EADCC8` section/card borders
- `studio-muted`: `#5C5A56` body copy

## Typography
- Display: Fraunces (`font-display`)
- Body/UI: Inter (`font-body`)
- Hero heading: `landingDesign.heroHeading`
- Section heading: `landingDesign.headingDisplay`
- Body copy: `landingDesign.bodyLarge` and `landingDesign.body`

## Layout patterns
- Primary section rhythm: `landingDesign.section`
- Hero section rhythm: `landingDesign.sectionWide`
- Dividers: `border-t border-studio-border`
- Split blocks: `flex flex-col md:flex-row items-center gap-16`

## Component guidance
- Primary buttons use `Button` variant `forest`
- Main feature cards use `rounded-3xl` and subtle green-tinted shadows
- Keep motion to fade/slide in-view transitions only
