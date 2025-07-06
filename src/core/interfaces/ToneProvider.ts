export interface ToneProvider {
  getTransport(): {
    schedule: (fn: (time: number) => void, time: number) => void;
    start: () => void;
    pause: () => void;
    stop: () => void;
    get seconds(): number;
    set seconds(value: number);
  };
  getDraw(): {
    schedule: (fn: () => void, time?: number) => void;
    anticipation: number;
  };
  start(): void;
  Context: new (options: any) => any;
  setContext(context: any): void;
} 