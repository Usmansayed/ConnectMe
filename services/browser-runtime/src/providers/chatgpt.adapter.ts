import { Page } from 'playwright';
import { ProviderCapabilities } from '@connectme/shared-types';
import { BaseProviderAdapter } from '@connectme/provider-sdk';
import path from 'path';
import fs from 'fs';

export class ChatGPTAdapter extends BaseProviderAdapter {
  name = 'chatgpt' as const;
  private page: Page;
  private screenshotDir: string;

  constructor(page: Page, screenshotDir: string) {
    super();
    this.page = page;
    this.screenshotDir = screenshotDir;
  }

  async ensureLoggedIn(): Promise<boolean> {
    try {
      await this.page.goto('https://chatgpt.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForTimeout(2000);
      const url = this.page.url();
      return !url.includes('login') && !url.includes('auth');
    } catch {
      return false;
    }
  }

  async getCapabilities(): Promise<ProviderCapabilities> {
    try {
      const loggedIn = await this.ensureLoggedIn();
      const models: string[] = [];
      const features: ProviderCapabilities['features'] = {};

      if (loggedIn) {
        // Try to detect model selector
        const modelBtn = await this.page.$('[data-testid="model-switcher-dropdown-button"]');
        if (modelBtn) {
          await modelBtn.click();
          await this.page.waitForTimeout(1000);
          const modelItems = await this.page.$$('[data-testid="model-switcher-model"]');
          for (const item of modelItems) {
            const text = await item.textContent();
            if (text) models.push(text.trim());
          }
          await this.page.keyboard.press('Escape');
        }

        // Fallback models if detection fails
        if (models.length === 0) {
          models.push('GPT-4o', 'GPT-4o mini');
        }

        features.research = true;
        features.files = true;
        features.canvas = true;
      }

      return { loggedIn, models, tools: [], features };
    } catch (err) {
      await this.takeScreenshot('chatgpt-capabilities-error');
      return { loggedIn: false, models: [], tools: [], features: {} };
    }
  }

  async sendPrompt(prompt: string): Promise<AsyncIterable<string>> {
    const page = this.page;

    // Ensure we're on chatgpt.com
    const url = page.url();
    if (!url.includes('chatgpt.com')) {
      await page.goto('https://chatgpt.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    // Type prompt
    const composer = await page.waitForSelector('#prompt-textarea', { timeout: 15000 });
    await composer.click();
    await page.keyboard.type(prompt, { delay: 30 });

    // Submit
    const sendBtn = await page.waitForSelector('[data-testid="send-button"]', { timeout: 10000 });
    await sendBtn.click();

    // Wait for response
    const self = this;
    return {
      [Symbol.asyncIterator]: async function* () {
        let lastText = '';
        const startTime = Date.now();
        const timeout = 120000;

        while (Date.now() - startTime < timeout) {
          await page.waitForTimeout(500);

          try {
            const responseEl = await page.$('[data-message-author-role="assistant"]:last-child .markdown');
            if (responseEl) {
              const text = await responseEl.textContent() || '';
              if (text !== lastText) {
                const delta = text.slice(lastText.length);
                if (delta) yield delta;
                lastText = text;
              }
            }

            // Check if done (send button re-enabled)
            const sending = await page.$('[data-testid="stop-button"]');
            if (!sending && lastText.length > 0) break;
          } catch {
            break;
          }
        }

        if (!lastText) {
          await self.takeScreenshot('chatgpt-no-response');
          yield '[Error: No response received from ChatGPT]';
        }
      }
    };
  }

  async takeScreenshot(filename: string): Promise<void> {
    try {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
      await this.page.screenshot({ path: path.join(this.screenshotDir, `${filename}-${Date.now()}.png`) });
    } catch {}
  }
}
