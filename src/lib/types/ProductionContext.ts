/** This needs to be replaced by svelte 5 reactivity
 *  This is a direct solution to get the production context working,
 *  to get a callback when the production reference changes
 */


import type { Production } from '$core/interfaces/Production';

export type ProductionObserver = {
  onProductionChanged: (production: Production | null) => void;
};

export type ProductionContext = {
  currentProduction: Production | null;
  createProduction: () => void;
  openProduction: () => void;
  registerObserver: (observer: ProductionObserver) => () => void;
}; 