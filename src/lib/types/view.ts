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