import { writable } from 'svelte/store';

export interface View {
  id: string;
  title: string;
  type: 'welcome' | 'view3d';
  data?: any;
}

export interface ViewState {
  views: View[];
  activeViewId: string | null;
}

const initialState: ViewState = {
  views: [{
    id: 'welcome',
    title: 'Welcome',
    type: 'welcome'
  }],
  activeViewId: 'welcome'
};

const store = writable<ViewState>(initialState);

export const viewService = {
  subscribe: store.subscribe,
  
  // Add a new view
  addView(view: Omit<View, 'id'>) {
    const id = `${view.type}-${Date.now()}`;
    store.update(state => ({
      views: [...state.views, { ...view, id }],
      activeViewId: id
    }));
    return id;
  },
  
  // Remove a view
  removeView(id: string) {
    store.update(state => {
      const views = state.views.filter(v => v.id !== id);
      let activeViewId = state.activeViewId;
      
      // If we're removing the active view, switch to another one
      if (activeViewId === id) {
        activeViewId = views.length > 0 ? views[0].id : null;
      }
      
      return { views, activeViewId };
    });
  },
  
  // Set active view
  setActiveView(id: string) {
    store.update(state => ({
      ...state,
      activeViewId: id
    }));
  },
  
  // Update view data
  updateView(id: string, data: any) {
    store.update(state => ({
      ...state,
      views: state.views.map(v => 
        v.id === id ? { ...v, data } : v
      )
    }));
  }
}; 