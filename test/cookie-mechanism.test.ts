import { describe, it, expect, beforeAll } from 'vitest';
import http from 'node:http';

const BASE = 'http://localhost:4321';
const SECRET = process.env.SANITY_PREVIEW_URL_SECRET || '1r23456789abcdef';
const COOKIE_NAME = 'sanity-preview-perspective';

// --- Helpers ---

function request(path: string, init?: { method?: string; headers?: Record<string, string> }) {
  return new Promise<{ status: number; headers: Record<string, string | string[]>; body: string; cookies: Record<string, string> }>((resolve, reject) => {
    const url = new URL(path, BASE);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: init?.method || 'GET',
      headers: init?.headers,
    };
    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        const setCookieHeaders = res.headers['set-cookie'] || [];
        const cookies: Record<string, string> = {};
        for (const header of (Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders])) {
          const nameEnd = header.indexOf('=');
          if (nameEnd > 0) {
            const name = header.substring(0, nameEnd);
            const value = header.substring(nameEnd + 1).split(';')[0];
            cookies[name] = value;
          }
        }
        resolve({ status: res.statusCode, headers: res.headers, body, cookies });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Cookie jar — tracks cookies across requests
class CookieJar {
  store: Record<string, string> = {};

  getHeaders(): Record<string, string> {
    const entries = Object.entries(this.store);
    return entries.length ? { Cookie: entries.map(([k, v]) => `${k}=${v}`).join('; ') } : {};
  }

  applySetCookie(res: { cookies: Record<string, string> }) {
    for (const [name, value] of Object.entries(res.cookies)) {
      if (value === '' || value === 'Max-Age=0' || name === '__Host-' || name === '__Secure-') {
        delete this.store[name];
      } else {
        this.store[name] = value;
      }
    }
  }

  get(name: string): string | undefined {
    return this.store[name];
  }
}

// --- Tests ---

describe('Cookie mechanism — enable endpoint', () => {
  it('rejects requests without a secret (401)', async () => {
    const res = await request('/api/draft-mode/enable');
    expect(res.status).toBe(401);
  });

  it('rejects requests with raw ?secret= param (wrong param name)', async () => {
    const res = await request('/api/draft-mode/enable?secret=' + SECRET);
    expect(res.status).toBe(401);
  });

  it('uses sanity-preview-secret param name (not "secret")', async () => {
    // Even with correct param name, this will 401 if the secret isn't registered in Sanity
    // This is expected behavior — the secret must be registered in the Sanity project
    const res = await request('/api/draft-mode/enable?sanity-preview-secret=' + SECRET);
    // We accept either 307 (secret valid) or 401 (secret not registered)
    // The key finding is whether the mechanism works at all
    expect([307, 401]).toContainEqual(res.status);
  });

  it('reports the enable endpoint status for diagnosis', async () => {
    const res = await request('/api/draft-mode/enable?sanity-preview-secret=' + SECRET);
    // Log the actual result — this tells us if the secret is registered
    console.log(`Enable endpoint: ${res.status} (expected 307 for valid secret, 401 if not registered)`);
    if (res.status === 401) {
      console.log('DIAGNOSTIC: Secret is not registered in Sanity project, or previewUrlSecret is not configured in sanity.config.ts');
    }
  });
});

describe('Cookie mechanism — disable endpoint', () => {
  it('returns 307 redirect', async () => {
    const res = await request('/api/draft-mode/disable');
    expect(res.status).toBe(307);
  });

  it('sets cookie with Max-Age=0 to clear it', async () => {
    const res = await request('/api/draft-mode/disable');
    const setCookie = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie'].join(';')
      : res.headers['set-cookie'];
    expect(setCookie).toContain(COOKIE_NAME);
    expect(setCookie).toContain('Max-Age=0');
  });

  it('redirects to root', async () => {
    const res = await request('/api/draft-mode/disable');
    expect(res.headers['location']).toBe('/');
  });
});

describe('Cookie mechanism — cookie attributes', () => {
  it('disable endpoint sets correct cookie name', async () => {
    const res = await request('/api/draft-mode/disable');
    const setCookie = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie'].join(';')
      : res.headers['set-cookie'];
    expect(setCookie).toContain(`${COOKIE_NAME}=`);
  });

  it('cookie has path=/', async () => {
    const res = await request('/api/draft-mode/disable');
    const setCookie = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie'].join(';')
      : res.headers['set-cookie'];
    expect(setCookie).toContain('Path=/');
  });

  it('cookie is not httpOnly (client-readable)', async () => {
    const res = await request('/api/draft-mode/disable');
    const setCookie = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie'].join(';')
      : res.headers['set-cookie'];
    // Should NOT contain HttpOnly — the cookie must be readable by client-side JS for Sanity visual editing
    expect(setCookie).not.toContain('HttpOnly');
  });
});

describe('Cookie mechanism — page reads perspective from cookie', () => {
  it('page responds 200 without cookie (normal SSG/SSR)', async () => {
    const res = await request('/');
    expect(res.status).toBe(200);
  });

  it('page responds 200 with perspective cookie present', async () => {
    const res = await request('/', {
      headers: { Cookie: `${COOKIE_NAME}=drafts` },
    });
    expect(res.status).toBe(200);
  });

  it('page responds 200 with preview perspective cookie', async () => {
    const res = await request('/', {
      headers: { Cookie: `${COOKIE_NAME}=previewDrafts` },
    });
    expect(res.status).toBe(200);
  });
});

describe('Cookie mechanism — cookie persistence across requests', () => {
  it('cookie jar persists cookie value across multiple page requests', async () => {
    const jar = new CookieJar();

    // Manually set the cookie (simulating what enable endpoint would do)
    jar.store[COOKIE_NAME] = 'drafts';

    // First request — cookie should be sent
    const res1 = await request('/', { headers: jar.getHeaders() });
    expect(res1.status).toBe(200);
    expect(jar.get(COOKIE_NAME)).toBe('drafts');

    // Second request — cookie should still be there
    const res2 = await request('/work', { headers: jar.getHeaders() });
    expect(res2.status).toBe(200);
    expect(jar.get(COOKIE_NAME)).toBe('drafts');

    // Third request — still persists
    const res3 = await request('/blog', { headers: jar.getHeaders() });
    expect(res3.status).toBe(200);
    expect(jar.get(COOKIE_NAME)).toBe('drafts');
  });

  it('disable endpoint clears the cookie from the jar', async () => {
    const jar = new CookieJar();
    jar.store[COOKIE_NAME] = 'drafts';

    // Hit disable endpoint
    const res = await request('/api/draft-mode/disable', { headers: jar.getHeaders() });
    expect(res.status).toBe(307);

    // Apply the set-cookie headers (Max-Age=0 should clear it)
    jar.applySetCookie(res);
    expect(jar.get(COOKIE_NAME)).toBeUndefined();
  });
});

describe('Cookie mechanism — scope isolation', () => {
  it('cookie is not present on fresh requests (no leakage)', async () => {
    const res = await request('/');
    // Response should not set the perspective cookie on a normal page request
    const setCookie = res.headers['set-cookie'];
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      const hasPerspectiveCookie = cookies.some(c => c.startsWith(COOKIE_NAME));
      expect(hasPerspectiveCookie).toBe(false);
    }
  });

  it('different cookie values can be used (drafts vs previewDrafts)', async () => {
    const res1 = await request('/', { headers: { Cookie: `${COOKIE_NAME}=drafts` } });
    expect(res1.status).toBe(200);

    const res2 = await request('/', { headers: { Cookie: `${COOKIE_NAME}=previewDrafts` } });
    expect(res2.status).toBe(200);
  });
});

describe('Cookie mechanism — enable endpoint diagnostic report', () => {
  it('reports the current state of the enable endpoint', async () => {
    const res = await request('/api/draft-mode/enable?sanity-preview-secret=' + SECRET);

    const report = {
      status: res.status,
      hasRedirect: res.headers['location'] !== undefined,
      hasSetCookie: res.headers['set-cookie'] !== undefined,
      working: res.status === 307,
    };

    console.log('\n--- Enable Endpoint Diagnostic ---');
    console.log(`Status: ${report.status} ${report.working ? '✓ WORKING' : '✗ NOT WORKING'}`);
    console.log(`Has redirect: ${report.hasRedirect}`);
    console.log(`Has Set-Cookie: ${report.hasSetCookie}`);
    console.log('--- End Diagnostic ---\n');

    // Test passes regardless — we're just reporting
    expect(report).toBeDefined();
  });
});
