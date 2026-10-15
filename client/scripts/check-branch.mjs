// Usage: node scripts/check-branch.mjs <branch>
// Stops a deploy unless the current git branch is the expected one, so the
// main (ready-to-sell) site can't be published to the public pre-sale address by mistake.
import { execSync } from 'node:child_process'

const expected = process.argv[2]
const current = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()

if (current !== expected) {
  console.error(`\nDeploy stopped: this deploy is for the "${expected}" branch, but you are on "${current}".`)
  console.error(`Switch with: git switch ${expected}\n`)
  process.exit(1)
}
console.log(`Branch check passed (${current}).`)
