# Nua brand system

## Canonical product family

`Nua` is the master brand. Public product names are closed compounds with one
capital product word:

- `NuaHome` — household awareness and practical intelligence.
- `NuaTalks` — private chats, calls, Circles, posts and Moments.
- `NuaInforms` — information organised into understanding.
- `NuaCares` — consent-led care and wellbeing support.
- `NuaCreates` — creative development and production.
- `NuaInvests` — governed financial understanding and growth.

Circles is a NuaTalks capability, not a separate product. Customer-facing copy,
navigation, metadata and artwork must use `NuaTalks` for social connection,
private posting, messaging and calling.

## Kinetic Link grammar

The Nua family is connected by a kinetic-link idea: two sides remain distinct
while meeting through an intentional exchange. A product's inner signal states
its purpose. The shared visual grammar must never imply shared access to private
data.

- `NuaHome`: teal awareness eye inside the link.
- `NuaTalks`: blue open conversation orbit with invited people.
- `NuaInforms`: gold evidence points and editorial lines.
- `NuaCares`: green protected heart held by human support.
- `NuaCreates`: magenta growing idea and creative spark.
- `NuaInvests`: deep-blue chart and upward path.

The canonical SVG, wordmark, app-icon and social-card files live in
`assets/brand/`. Product surfaces must reference those files instead of drawing
or recolouring a substitute logo.

## Colour

- NuaHome teal: `#078B91` to `#16A1A4`.
- NuaTalks blue: `#0767B5` to `#178BD2`.
- NuaInforms gold: `#F2A500` to `#FFB914`.
- NuaCares green: `#318C32` to `#4BA743`.
- NuaCreates magenta: `#E80958` to `#F23C77`.
- NuaInvests blue: `#08275D` to `#17457C`.
- Shared night: `#06191F`.
- Shared warm paper: `#FBFAF6`.

Product colours identify purpose. Shared night, paper, typographic rhythm and
explicit hand-off language establish family resemblance.

## Naming and metadata rules

- Write the exact CamelCase product name with no hyphen or space.
- Use `Circles` with a capital C when naming the NuaTalks feature.
- Describe NuaHome as household intelligence or awareness, never covert
  monitoring.
- Do not describe illustrative examples as live household state.
- Do not use beta, demo or prototype language on a customer release surface.
- Preserve an old route only as a silent compatibility redirect; never expose an
  obsolete product identity in navigation, copy, metadata or production assets.

## Product boundaries

Shared identity is not shared access. Nua products may recognise the same
account and exchange a deliberately approved hand-off. Household context,
private conversations, care information, creative work and financial data stay
within the product and permission that collected them unless a person explicitly
chooses a destination and audience.

## Technical compatibility

Public names and artwork use the canonical Nua assets. Bundle IDs, package names,
deep-link schemes, API paths, database keys and installed-device credentials may
change only through a separately tested migration that preserves updates,
accounts and household links.
