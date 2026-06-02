# Summit & Wilderness - Premium Technical Outdoor Gear PDP

A production-quality Product Detail Page (PDP) built for a high-end technical outdoor gear store. This project fetches product data dynamically from the **Fake Store API** and enriches it with detailed product specifications, color swatches, active variant sizing (in-stock, low-stock, and sold-out states), and a persistent shopping cart drawer.

## 🚀 Live Demo & Hosting
The project is hosted and can be accessed at:
*(Host URL to be included upon deployment, e.g. on Vercel/Netlify)*

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) (Hooks-based, composition model)
- **Tooling**: [Vite](https://vite.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Sass (SCSS) Modules](https://sass-lang.com/) (Scoped styles, zero Tailwind/CSS-in-JS, pure design token variables)
- **Icons**: [Lucide React](https://lucide.dev/) (Premium, thin stroke icons)
- **Data Source**: [Fake Store API](https://fakestoreapi.com)

---

## ✨ Core Features & Implementations

### 1. High-Fidelity Image Gallery
- **Desktop Zoom**: Hovering over the main product image scales and pans it smoothly based on cursor coordinates, allowing close fabric/gear inspection.
- **Mobile Responsive Swipe**: Main image supports native touch swipe-snapping with active dot position indicators.
- **Lightbox Overlay**: Tapping the active image opens a fullscreen glassmorphic modal with previous/next controls.
- **No Placeholders**: Leverages custom-generated assets for our technical backpack (main and detail views) stored in `src/assets/`.

### 2. Interactive Variant & Stock Selection
- **Color Swatches**: Rendered as circle color chips with checked active outlines (not dropdowns).
- **Dynamic Size Grid**: Sizes check variant stock levels. Sizes can be **Available**, **Low Stock** (triggers an orange "Only X left" badge), or **Sold Out** (disabled, greyed out, strikethrough).
- **Capped Qty Picker**: Increment/decrement is capped at the maximum available stock for the selected variant.
- **Delivery Estimate**: Conditionally displayed only when the selected variant is in stock.

### 3. Persistent Global State
- **Context API Cart**: Manages shopping cart drawer actions.
- **Local Storage Sync**: Cart items survive hard refreshes and page reloads.
- **URL Deep-Linking**: Selected variant (`color` and `size`) updates browser query parameters in real time without refreshing, making the product page fully deep-linkable.

### 4. Async API Add-To-Cart & Failures (Bonus)
- Clicking "Add to Cart" triggers an asynchronous mock network request (1s latency) showing a loading spinner.
- Simulates a random **20% failure rate** from the server, displaying error toast notifications, and successful entries with green success confirmations.

---

## 📂 Project Structure
```bash
/src
  ├── assets/          # Local high-res custom assets (generated backpack images)
  ├── components/      # Encapsulated React components and SCSS modules
  │     ├── Navbar     # Glassmorphic header
  │     ├── CartDrawer # Slide-out cart panel
  │     ├── ImageGallery # Image display & lightbox
  │     ├── InfoPanel  # Swatches, sizes, quantity, async CTA
  │     └── DetailsTabs# Description, specifications table, reviews
  ├── context/         # CartContext global provider
  ├── styles/          # SCSS design token variables (_variables.scss)
  ├── utils/           # enrichment layer (productMapper.ts)
  ├── App.tsx          # Main layout coordinator, loaders, errors
  ├── main.tsx         # Bootstrap entry
  ├── index.css        # Global CSS variables, resets, custom scrollbar
  └── vite-env.d.ts    # TypeScript environment types
```

---

## 🏃 Setup & Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### Running Locally
Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

*Note: You can test different products by adding a query parameter, e.g., `http://localhost:5173/?productId=3`.*

### Building for Production
Verify that compiling and bundling complete without error:
```bash
npm run build
```
This runs the TypeScript compiler `tsc` and bundles assets with Vite.

### Running Unit Tests
Validate the variant selectors, disabled CTA states, and quantity limiters via Vitest:
```bash
npm run test
```

---

## 📖 Architectural Decisions
A detailed write-up of architectural choices, trade-offs (such as why we synchronized URL state without adding a heavy router library), and future improvements can be read in [DECISIONS.md](file:///c:/Users/abhis/OneDrive/Desktop/task-for-nua/DECISIONS.md) in the project root.
# SUMMIT-WILDERNESS
