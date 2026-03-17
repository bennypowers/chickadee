# Chickadee Development Guide

## Context

Chickadee is a from-first-principles design system. While it draws inspiration
from existing systems and design specifications, the implementation here is
canonical. Design specs from upstream should be treated as input, not law -
apply engineering judgment and a critical eye when translating designs into components.

## Design-to-Code Principles

- **Designers spec components; engineers architect them.** A design file may
  combine distinct concerns into a single component (e.g. icon button as a
  button variant). If accessibility, semantics, or composability benefit from
  a separate element, make a separate element.
- **Token names and structures are ours to define.** Upstream token taxonomies
  may use different naming conventions or groupings. Chickadee tokens should
  follow their own consistent naming scheme.
  Eventually, design committee and engineering will agree and codify names, but
  it's too early for that right now. That being said, try to hew closely to both
  source material and design recommendations.
- **Figma variants are not necessarily HTML attributes.** A Figma variant
  matrix (Type x State x Size) is a design tool. The element API should be
  driven by HTML semantics and CSS capabilities, not by Figma's component
  property model. That being said, use `variant="foo|bar|baz"` on elements where
  it adds design and semantic value.
- **States belong in CSS, not attributes.** Hover, focus, active, and clicked
  are CSS pseudo-class concerns. Don't create attributes for states that CSS
  handles natively.
- **Review the design-api skill** (`/design-api`) before designing any new
  element's public API. It contains hard-won conventions from thousands of
  code reviews.

## Build & Tooling

- `npm run build` - builds tokens (asimonim) then manifest (cem)
- `npm start` - runs `cem serve` dev server on port 8000
- `cem health` - checks documentation quality (target: 80%+ per element)
- Tokens are authored as YAML in `tokens/`, converted to JSON by `asimonim`
- Element CSS uses `light-dark()` fallbacks for all semantic color tokens
- Backticks in HTML comments inside Lit `html` templates break cem's TS
  transform - escape them or avoid them

## Element Conventions

- Package: `@chickadee/elements`
- Token prefix: `--chickadee-`
- Private CSS custom properties use `--_` prefix
- Public CSS properties are documented via JSDoc in CSS files, not in TS
- Slot and part docs go in HTML comments in the template
- Demos are HTML partials using package specifier imports
- Borders that change width on hover use `box-shadow: inset` to avoid layout
  shift

## Memory

Update this file with important design-to-dev context provided by the user, as you go

## CSS
Use baseline 2025 features, e.g. css nesting, light-dark(), etc

## Git
Use conventional commit syntax. scopes are unprefixed element names e.g. `fix(button)`
