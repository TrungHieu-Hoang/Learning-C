const fs = require('fs')
const path = require('path')

const dest = path.join('.next', 'standalone', 'node_modules')
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

// Copy prisma CLI, generated client, and @prisma/client into standalone
const dirs = ['prisma', '.prisma', '@prisma']
for (const d of dirs) {
  const src = path.join('node_modules', d)
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(dest, d), { recursive: true, force: true })
  }
}

console.log('✓ Copied Prisma dependencies to standalone output')
