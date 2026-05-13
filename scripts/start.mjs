import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Find prisma CLI — try root node_modules first, then standalone
const candidates = [
  join(root, 'node_modules', 'prisma', 'build', 'index.js'),
  join(root, '.next', 'standalone', 'node_modules', 'prisma', 'build', 'index.js'),
]
const prismaCli = candidates.find(existsSync)

if (!prismaCli) {
  console.error('❌ prisma CLI not found. Run npm install first.')
  process.exit(1)
}

const prismaDir = join(root, 'prisma')
const schema = join(prismaDir, 'schema.prisma')

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: root, ...opts })
}

try {
  // 1. Push schema
  run(`node ${prismaCli} db push --schema="${schema}" --accept-data-loss --skip-generate`)

  // 2. Seed
  run(`node ${join(prismaDir, 'seed.mjs')}`)

  // 3. Start server
  const serverPaths = [
    join(root, 'server.js'),                    // Docker standalone at root
    join(root, '.next', 'standalone', 'server.js'), // Build output
  ]
  const server = serverPaths.find(existsSync)
  if (server) {
    run(`node ${server}`, { stdio: 'inherit' })
  } else {
    run('npx next start', { stdio: 'inherit' })
  }
} catch (e) {
  console.error('❌ Startup failed:', e.message)
  process.exit(1)
}
