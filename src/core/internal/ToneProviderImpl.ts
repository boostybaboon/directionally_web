import type { ToneProvider } from '../interfaces/ToneProvider';

export class ToneProviderImpl implements ToneProvider {
  private tone: any;

  private ensureLoaded() {
    if (!this.tone) {
      throw new Error('ToneProviderImpl not initialized. Call createToneProvider() first.');
    }
  }

  getTransport() {
    this.ensureLoaded();
    return this.tone.getTransport();
  }
  
  getDraw() {
    this.ensureLoaded();
    return this.tone.getDraw();
  }
  
  start() {
    this.ensureLoaded();
    return this.tone.start();
  }
  
  get Context() {
    this.ensureLoaded();
    return this.tone.Context;
  }
  
  setContext(context: any) {
    this.ensureLoaded();
    this.tone.setContext(context);
  }

  // Private method to set the loaded tone module
  private setToneModule(toneModule: any) {
    this.tone = toneModule;
  }

  // Factory function that dynamically imports Tone.js
  static async createToneProvider(): Promise<ToneProviderImpl> {
    const toneModule = await import('tone');
    const provider = new ToneProviderImpl();
    provider.setToneModule(toneModule);
    return provider;
  }
}

// Factory function for the web app to use
export async function createToneProvider(): Promise<ToneProvider> {
  return ToneProviderImpl.createToneProvider();
} 