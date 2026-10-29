# Reference Colour Palette

Verified from the public CSS and computed styles at https://www.vet-er.co.uk/ and https://www.vet-er.co.uk/pricing on 29 October 2026, rather than estimating screenshot colours.

| Role | Exact reference value |
| --- | --- |
| Deep purple / footer | `#4B1761` |
| Matte gold / buttons | `#AF822F` |
| Lavender / pricing surfaces | `#B2A0C5` |
| Off-white / page surfaces | `#F8F8F8` |
| Charcoal / text | `#0C0C0C` |
| White | `#FFFFFF` |

`src/app/reference-theme.css` is the final shared colour layer. It is imported after the legacy global stylesheet. The reference values are brand tokens; lighter supporting tints are derived design choices, not claimed as exact reference colours.

Gold primary buttons use charcoal text for legibility rather than copying the reference's lower-contrast white labels. Secondary actions use purple outlines. The footer is deep purple, with light links and a white logo plate so the original logo remains legible. Existing navigation, imagery and typography are retained.

To inspect colours in a browser: inspect the element, open **Computed**, then read **color** and **background-color**. Inspect inner text spans separately if they override their parent. RGB values can be converted to hex in the DevTools colour picker. DevTools selection highlights and shadows are not the underlying element's colour.
