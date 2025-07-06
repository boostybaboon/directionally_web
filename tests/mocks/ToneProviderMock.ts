import type { ToneProvider } from '../../src/core/interfaces/ToneProvider';

export class ToneProviderMock implements ToneProvider {
  private _seconds = 0;
  private lastTriggeredTime = 0;
  private scheduledEvents: Array<{ fn: (time: number) => void, time: number }> = [];
  private drawEvents: Array<{ fn: () => void, time?: number }> = [];
  private isPlaying = false;

  getTransport() {
    const self = this; // Store reference to 'this' for use in getter/setter
    return {
      schedule: (fn: (time: number) => void, time: number) => {
        this.scheduledEvents.push({ fn, time });
      },
      start: () => {
        this.isPlaying = true;
        this.triggerScheduledEvents();
      },
      pause: () => {
        this.isPlaying = false;
      },
      stop: () => {
        this.isPlaying = false;
        this._seconds = 0;
      },
      get seconds() { return self._seconds; },
      set seconds(val: number) { 
        self._seconds = val;
        self.triggerScheduledEvents();
      }
    };
  }

  getDraw() {
    const self = this;
    return {
      schedule: (fn: () => void, time?: number) => {
        self.drawEvents.push({ fn, time });
        // If no time specified or time is in the past, execute immediately
        if (time === undefined || time <= self._seconds) {
          fn();
        }
      },
      anticipation: 0.5
    };
  }

  start() {
    // Mock implementation - no-op
  }

  Context = class MockContext {
    constructor(options: any) {
      // Mock implementation - no-op
    }
  };

  setContext(context: any) {
    // Mock implementation - no-op
  }

  triggerEventsUpTo(time: number) {
    // Advance to the specified time and trigger all events that should have fired
    // Only trigger events between lastTriggeredTime and the new time
    this._seconds = time;
    
    // Trigger scheduled events that should fire between lastTriggeredTime and time
    this.scheduledEvents.forEach(event => {
      if (event.time >= this.lastTriggeredTime && event.time <= time) {
        event.fn(event.time);
      }
    });
    
    // Trigger draw events that are due
    this.drawEvents.forEach(event => {
      if (event.time !== undefined && event.time >= this.lastTriggeredTime && event.time <= time) {
        event.fn();
      }
    });
    
    this.lastTriggeredTime = time;
  }

  private triggerScheduledEvents() {
    // Trigger events when seconds are set, regardless of play state
    this.scheduledEvents.forEach(event => {
      if (event.time <= this._seconds) {
        event.fn(event.time);
      }
    });
    
    // Also trigger draw events that are due
    this.drawEvents.forEach(event => {
      if (event.time === undefined || event.time <= this._seconds) {
        event.fn();
      }
    });
  }
} 