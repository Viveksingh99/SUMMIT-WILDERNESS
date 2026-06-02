# Architectural Decisions & Trade-Offs

## Architectural Choice: URL Sync & Deep-Linking Without Router

### The Problem
The specification requires the selected variant (colour + size) to be reflected in the URL so that the page is deep-linkable. 

### The Options
1. **Option A: React Router (`react-router-dom`)** – Introduce a standard routing library to handle search parameters and dynamic routing.
2. **Option B: Native History API Sync** – Utilize standard React state coupled with native browser History API (`window.history.replaceState`) inside a unified `useEffect`.

### The Decision
We chose **Option B (Native History API)**. For a single standalone Product Detail Page (PDP), installing `react-router-dom` adds approximately 40KB of unused bundle size and unnecessary routing overhead. By syncing React's state directly with the browser's `URLSearchParams` and executing `window.history.replaceState`, we achieved instantaneous deep-linking with zero external dependencies, minimal boilerplate, and maximum performance. This aligns with a performance-first approach for technical e-commerce pages.

---

## Tabs vs. Accordion Below the Fold

### The Decision
We chose a **Tabbed Interface** for the product details section (Description, Specifications, Reviews).
On desktop screens, tabs make optimal use of the horizontal layout, presenting tabular data (Specifications) and multi-column reviews (Reviews cards) clearly. Accordions squish wide technical tables vertically and force users to perform multiple clicks to compare specifications and read reviews. We designed the tab system to scroll horizontally and collapse smoothly on mobile devices to preserve a clean single-column structure.

---

## What We Would Do Differently With More Time

1. **State Management (Zustand/Jotai)**: While the React Context API is ideal for this application's size, in a production-scale codebase we would choose **Zustand**. Context API triggers re-renders on all consumers whenever the value changes. Zustand solves this with selector-based subscription, ensuring that changing the cart state only re-renders components displaying cart data.
2. **Data Fetching & Caching (TanStack Query)**: We would replace manual `fetch` calls and state hooks with TanStack Query. This provides automatic background revalidation, query caching (preventing redundant API requests when navigating back to products), out-of-the-box retry logic, and standardized loading/error states.
3. **Advanced Image Zoom (Lens Magnifier)**: The current hover-zoom pans and scales the image within its bounds. With more time, we would implement a true "glass lens magnifier" overlay that tracks the cursor and displays a high-resolution detailed texture crop in a separate zoom container, providing a higher-fidelity texture inspection.
4. **Mocked Variant Syncing**: Currently, stock is derived deterministically from the product ID. We would build a local storage mock-database database to persist checkout actions, decrementing variant stock levels as items are purchased.
