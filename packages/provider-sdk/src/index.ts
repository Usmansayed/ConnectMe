import { ProviderCapabilities, ProviderName } from '@connectme/shared-types';

export interface ProviderAdapter {
  name: ProviderName;
  ensureLoggedIn(): Promise<boolean>;
  getCapabilities(): Promise<ProviderCapabilities>;
  sendPrompt(prompt: string, mode?: string): Promise<AsyncIterable<string>>;
  takeScreenshot(filename: string): Promise<void>;
}

export interface BrowserRuntimeConfig {
  profileDir: string;
  headless: boolean;
}

export abstract class BaseProviderAdapter implements ProviderAdapter {
  abstract name: ProviderName;
  abstract ensureLoggedIn(): Promise<boolean>;
  abstract getCapabilities(): Promise<ProviderCapabilities>;
  abstract sendPrompt(prompt: string, mode?: string): Promise<AsyncIterable<string>>;
  abstract takeScreenshot(filename: string): Promise<void>;
}
