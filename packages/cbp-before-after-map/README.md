# CBP Before/After Map

Interactive before/after slider showing wall routes removed from CBP's border map (March 2026).

## Quick Start

### 1. Copy the files into your project

```
src/components/cbp-before-after-map/
├── BeforeAfterMap.tsx   # The component
├── data.ts              # Route coordinate data
├── index.ts             # Barrel export
└── README.md
```

### 2. Install peer dependencies

```bash
npm install leaflet
npm install -D @types/leaflet
```

### 3. Import Leaflet CSS

Add this somewhere in your app (layout.tsx, globals.css, etc.):

```css
@import "leaflet/dist/leaflet.css";
```

### 4. Use the component

Since Leaflet uses `window`, dynamically import it in Next.js:

```tsx
import dynamic from "next/dynamic";

const BeforeAfterMap = dynamic(
  () => import("@/components/cbp-before-after-map").then(m => m.BeforeAfterMap),
  { ssr: false }
);

export default function MyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <BeforeAfterMap region="texas" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `region` | `"texas" \| "california"` | `"texas"` | Texas shows BBT-4 & BBT-5 (fully removed). California shows SDC-2 & ELC-2 (reduced scope). |
| `routeColor` | `string` | `"#FF9500"` | Hex color for wall route lines |
| `tileUrl` | `string` | CARTO dark | Tile layer URL template |
| `beforeLabel` | `string` | `"Before"` | Left-side label |
| `afterLabel` | `string` | `"After"` | Right-side label |
| `aspectClass` | `string` | — | CSS class for aspect ratio (e.g. Tailwind `"aspect-[2/1]"`). Falls back to inline `16/9`. |

## Regions

**Texas** (`region="texas"`): Shows the fully removed Alpine Primary Wall (BBT-4, ~110 mi) and Alpine/Sanderson/Comstock Primary Wall (BBT-5, ~157 mi).

**California** (`region="california"`): Shows segments removed from San Diego (SDC-2) near Otay Mesa and El Centro (ELC-2) toward Yuma.

## No Tailwind Required

The component uses inline styles by default — no Tailwind or CSS framework needed. The optional `aspectClass` prop lets you pass a Tailwind class if you prefer.

## Data Source

Route data extracted from CBP Smart Wall Map (ArcGIS Feature Service), comparing the February and March 2026 snapshots.
