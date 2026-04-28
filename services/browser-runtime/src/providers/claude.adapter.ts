import { Page } from 'playwright';
import { ProviderCapabilities } from '@connectme/shared-types';
import { BaseProviderAdapter } from '@connectme/provider-sdk';
import path from 'path';
import fs from 'fs';

export class ClaudeAdapter extends BaseProviderAdapter {
  name = 'claude' as const;
  private page: Page;
  private screenshotDir: string;

  constructor(page: Page, screenshotDir: string) {
    super();
    this.page = page;
    this.screenshotDir = screenshotDir;
  }

  async ensureLoggedIn(): Promise<boolean> {
    try {
      await this.page.goto('https://claude.ai', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForTimeout(2000);
      const url = this.page.url();
      return !url.includes('login');
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
        models.push('Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku');
        features.artifacts = true;
        features.files = true;
      }

      return { loggedIn, models, tools: [], features };
    } catch {
      await this.takeScreenshot('claude-capabilities-error');
      return { loggedIn: false, models: [], tools: [], features: {} };
    }
  }

  async sendPrompt(prompt: string): Promise<AsyncIterable<string>> {
    const page = this.page;
    const self = this;

    const url = page.url();
    if (!url.includes('claude.ai')) {
      await page.goto('https://claude.ai', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    // Type prompt
    const composer = await page.waitForSelector('div[contenteditable="true"]', { timeout: 15000 });
    await composer.click();
    await page.keyboard.type(prompt, { delay: 30 });

    // Submit - try button or Enter
    const sendBtn = await page.$('button[aria-label="Send Message"]');
    if (sendBtn) {
      await sendBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }

    return {
      [Symbol.asyncIterator]: async function* () {
        let lastText = '';
        const startTime = Date.now();
        const timeout = 120000;

        while (Date.now() - startTime < timeout) {
          await page.waitForTimeout(500);
          try {
            const responseEls = await page.$$('[data-is-streaming="false"] .font-claude-message');
            if (responseEls.length > 0) {
              const lastEl = responseEls[responseEls.length - 1];
              const text = await lastEl.textContent() || '';
              if (text !== lastText) {
                const delta = text.slice(lastText.length);
                if (delta) yield delta;
                lastText = text;
              }
              // If not streaming, we're done
              break;
            }
          } catch {
            break;
          }
        }

        if (!lastText) {
          await self.takeScreenshot('claude-no-response');
          yield '[Error: No response received from Claude]';
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
