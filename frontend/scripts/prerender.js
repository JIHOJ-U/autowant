import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const distDir = join(projectRoot, 'dist')

const ROUTES = [
  '/',
  '/monthly-special',
  '/immediate-stock',
  '/reviews',
  '/about',
  '/contact',
  '/managers',
  '/guide',
  '/organization',
  '/privacy',
]

const HOST = '127.0.0.1'
const PORT = 4173

async function main() {
  console.log('[prerender] Starting vite preview server…')
  const server = await preview({
    root: projectRoot,
    preview: { port: PORT, host: HOST, strictPort: true },
  })
  const base = `http://${HOST}:${PORT}`
  console.log(`[prerender] Server up on ${base}`)

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let failed = false
  try {
    for (const route of ROUTES) {
      const url = `${base}${route}`
      const t0 = Date.now()
      const page = await browser.newPage()
      try {
        await page.setViewport({ width: 1280, height: 900 })
        await page.goto(url, { waitUntil: 'load', timeout: 30000 })

        // splash 제거 + 본문 렌더 완료 대기
        await page.waitForFunction(
          () => !document.getElementById('splash') && !!document.querySelector('#app > *'),
          { timeout: 15000 }
        ).catch(() => {})

        // 추가 안정 대기 (router afterEach meta 적용, lazy import 등)
        await new Promise((r) => setTimeout(r, 1200))

        const html = await page.content()

        const outDir = route === '/' ? distDir : join(distDir, route.replace(/^\//, ''))
        if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
        writeFileSync(join(outDir, 'index.html'), html, 'utf-8')

        console.log(`[prerender] ✓ ${route}  (${Date.now() - t0}ms, ${(html.length / 1024).toFixed(1)}KB)`)
      } catch (err) {
        failed = true
        console.error(`[prerender] ✗ ${route}: ${err.message}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
    await new Promise((res) => server.httpServer.close(res))
    console.log('[prerender] Done.')
  }

  if (failed) process.exit(1)
}

main().catch((err) => {
  console.error('[prerender] FATAL:', err)
  process.exit(1)
})
