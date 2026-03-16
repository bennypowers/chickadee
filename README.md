# 🐦 Chickadee

![Chickadee on the branch](./chickadee.png)

**A design system that flies.**

Chickadee is a unified web component library built from first principles — no hand-me-down plumage from other flocks. Where previous efforts split the nest between product UIs and marketing sites, Chickadee roosts comfortably in both.

## 🦉 Philosophy

Some design systems try to be everything to everyone and end up molting under their own weight. Others hyper-specialize — one flock for the console, another for the landing page — and before long you've got two separate species that can't sing the same song.

Chickadee is one bird. Small, adaptable, and surprisingly loud for its size. It doesn't carry the evolutionary baggage of its ancestors. It takes what worked — semantic tokens, shadow DOM encapsulation, CSS custom properties as the theming API — and leaves behind what didn't.

The unified theme isn't a migration target. It's the egg the whole thing hatched from.

## 🪺 Nesting

```bash
git clone https://github.com/bennypowers/chickadee.git
cd chickadee
npm ci
npm start
```

## 🐣 Hatching Your First Component

```html
<script type="module">
  import '@chickadee/elements/chickadee-button/chickadee-button.js';
</script>

<chickadee-button>Take flight</chickadee-button>
```

## 🦅 What's in the Flock

| Element                   | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `<chickadee-button>`      | Push button with primary, secondary, tertiary, and link plumage |
| `<chickadee-icon-button>` | Icon-only button for tight perches                                 |

More elements hatching soon.

## 🌿 Design Tokens

Chickadee ships a full token set — colors, spacing, typography, border radii — as [DTCG-format][dtcgformat] JSON. Tokens use the `--chickadee-` prefix and lean on `light-dark()` for automatic color scheme adaptation.

```css
.my-thing {
  padding: var(--chickadee-space-lg);
  border-radius: var(--chickadee-border-radius-pill);
  color: var(--chickadee-color-interactive-primary-default);
}
```

No need to migrate from one bird's token taxonomy to another — these are the canonical feathers.

## 🔭 Development

### 🐥 Getting Started

Install as above, and open [http://localhost:8000][localhost] to see your elements in flight.

### 🥚 Adding a New Element

1. Create `elements/chickadee-<name>/chickadee-<name>.ts`
2. Create the companion `.css` file
3. Add demos in `elements/chickadee-<name>/demo/`
4. Run `npm start` — `cem` builds the manifest and launches the dev server

### 🪺 Adding Design Tokens

Tokens are authored as [DTCG-format][dtcgformat] YAML in `tokens/`. Add or edit `.yaml` files, then run `npm run build:tokens` to regenerate the JSON that `cem` consumes. The generated `tokens/chickadee.tokens.json` is tracked in git, but the YAML is the source of truth.

## 🦜 Birdsong for Your Editor

Both `cem` and `asimonim` sing beyond the CLI.

**`cem lsp`** gives your editor completions, diagnostics, and hover docs for
element tags, attributes, slots, and CSS custom properties. **`asimonim lsp`**
(hatching soon) does the same for design tokens. Wire them into anything that
speaks LSP and your editor chirps back with manifest-aware intelligence.

**`cem mcp`** exposes your component APIs to AI tools via [MCP][mcp] — so your
AI copilot can generate valid HTML without winging it on attribute names.

Both tools also ship **[Claude Code][claude-code] extensions**
(`extensions/claude-code/`). Copy the `.mcp.json`, `.lsp.json`, and `skills/`
into `.claude/` and Claude gets a bird's-eye view of your component API —
design guidance, a11y review, test scaffolding, and framework integration, all
grounded in the manifest.

## 📜 License

MIT

[dtcgformat]: https://www.designtokens.org/tr/2025.10/format/
[cem]: https://github.com/bennypowers/cem
[cem-releases]: https://github.com/bennypowers/cem/releases
[asimonim]: https://github.com/bennypowers/asimonim
[asimonim-releases]: https://github.com/bennypowers/asimonim/releases
[localhost]: http://localhost:8000
[mcp]: https://modelcontextprotocol.io
[claude-code]: https://docs.anthropic.com/en/docs/claude-code
