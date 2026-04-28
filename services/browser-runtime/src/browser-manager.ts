import { chromium, BrowserContext, Page } from 'playwright';
import path from 'path';
import fs from 'fs';

export class BrowserManager {
  private contexts: Map<string, BrowserContext> = new Map();
  private pages: Map<string, Page> = new Map();

  async getContext(provider: string, profilesDir: string): Promise<BrowserContext> {
    if (this.contexts.has(provider)) {
      return this.contexts.get(provider)!;
    }

    const userDataDir = path.join(profilesDir, provider);
    fs.mkdirSync(userDataDir, { recursive: true });

    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
      viewport: { width: 1280, height: 900 }
    });

    this.contexts.set(provider, context);
    return context;
  }

  async getPage(provider: string, profilesDir: string): Promise<Page> {
    if (this.pages.has(provider)) {
      const page = this.pages.get(provider)!;
      if (!page.isClosed()) return page;
    }

    const context = await this.getContext(provider, profilesDir);
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();
    this.pages.set(provider, page);
    return page;
  }

  async closeAll(): Promise<void> {
    for (const ctx of this.contexts.values()) {
      await ctx.close().catch(() => {});
    }
    this.contexts.clear();
    this.pages.clear();
  }
}
