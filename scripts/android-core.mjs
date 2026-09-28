import { createHash } from 'node:crypto'
import { chmod, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { gunzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const VERSION = 'v1.19.31'
const ARCHIVE_NAME = `mihomo-android-arm64-v8-${VERSION}.gz`
const EXPECTED_SHA256 = 'de00bc53ed151636ca078c812a82a5315687d8d52164db230f1935b2a37904f6'
const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const RESOURCE_DIR = path.join(ROOT, 'src-tauri', 'resources')
const OUTPUT = path.join(RESOURCE_DIR, 'verge-mihomo-android-arm64')
const ARCHIVE = path.join(RESOURCE_DIR, ARCHIVE_NAME)
const DOWNLOAD_URLS = [
  `https://github.com/MetaCubeX/mihomo/releases/download/${VERSION}/${ARCHIVE_NAME}`,
  `https://gh-proxy.org/https://github.com/MetaCubeX/mihomo/releases/download/${VERSION}/${ARCHIVE_NAME}`,
]

await mkdir(RESOURCE_DIR, { recursive: true })

try {
  const output = await stat(OUTPUT)
  if (output.size > 0) {
    console.log(`Android mihomo core already exists: ${OUTPUT}`)
    process.exit(0)
  }
} catch {
  // Download below.
}

let archive
try {
  archive = await readFile(ARCHIVE)
  console.log(`Using cached Android mihomo archive: ${ARCHIVE}`)
} catch {
  console.log(`Downloading Android mihomo core ${VERSION}...`)
  for (const downloadUrl of DOWNLOAD_URLS) {
    try {
      const response = await fetch(downloadUrl)
      if (response.ok) {
        archive = Buffer.from(await response.arrayBuffer())
        break
      }
      console.warn(`Download failed from ${downloadUrl}: ${response.status} ${response.statusText}`)
    } catch (error) {
      console.warn(`Download failed from ${downloadUrl}: ${error.message}`)
    }
  }
}
if (!archive) throw new Error(`Failed to download Android mihomo core ${ARCHIVE_NAME}`)
const digest = createHash('sha256').update(archive).digest('hex')
if (digest !== EXPECTED_SHA256) {
  throw new Error(`Android mihomo archive checksum mismatch: expected ${EXPECTED_SHA256}, got ${digest}`)
}
await writeFile(ARCHIVE, archive)

const binary = gunzipSync(archive)
const temporary = `${OUTPUT}.tmp`
await writeFile(temporary, binary, { mode: 0o755 })
await chmod(temporary, 0o755)
await rename(temporary, OUTPUT)
console.log(`Android mihomo core ready: ${OUTPUT} (${binary.length} bytes)`)
