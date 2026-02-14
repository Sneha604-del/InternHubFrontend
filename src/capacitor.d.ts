declare module '@capacitor/app' {
  export interface App {
    addListener(eventName: 'backButton', listenerFunc: () => void): Promise<any>;
    exitApp(): Promise<void>;
  }
  export const App: App;
}