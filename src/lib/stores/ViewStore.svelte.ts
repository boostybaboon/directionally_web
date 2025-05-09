export interface View {
  id: string;
  title: string;
  type: 'welcome' | 'view3d';
  data?: any;
  closable: boolean;
}

export interface ViewState {
  views: View[];
  activeViewId: string | null;
}

// State
let views = $state<View[]>([
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome',
    closable: true
  }
]);
let activeViewId = $state<string | null>('welcome');

// Subscription management
let subscribers = new Set<(state: ViewState) => void>();

// Notify all subscribers of state changes
function notifySubscribers() {
  const state = { views, activeViewId };
  subscribers.forEach(callback => callback(state));
}

export const viewService = {
  // Get current state
  getState(): ViewState {
    return { views, activeViewId };
  },
  
  // Subscribe to state changes
  subscribe(callback: (state: ViewState) => void) {
    subscribers.add(callback);
    // Initial callback with current state
    callback({ views, activeViewId });
    
    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
    };
  },
  
  // Add a new view
  addView(view: Omit<View, 'id'>) {
    const id = `${view.type}-${Date.now()}`;
    views = [...views, { ...view, id }];
    activeViewId = id;
    notifySubscribers();
    return id;
  },
  
  // Remove a view
  removeView(id: string) {
    views = views.filter(v => v.id !== id);
    
    // If we're removing the active view, switch to another one
    if (activeViewId === id) {
      activeViewId = views.length > 0 ? views[0].id : null;
    }
    notifySubscribers();
  },
  
  // Set active view
  setActiveView(id: string) {
    activeViewId = id;
    notifySubscribers();
  },
  
  // Update view data
  updateView(id: string, data: any) {
    views = views.map(v => 
      v.id === id ? { ...v, data } : v
    );
    notifySubscribers();
  }
}; 