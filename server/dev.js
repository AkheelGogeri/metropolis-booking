// Local-only convenience entry point — NOT used by Vercel (see api/[...all].js for that).
// Lets us `node server/dev.js` and curl-test the API without needing `vercel dev` linked to a project.
import 'dotenv/config'
import app from './app.js'

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Metropolis API (local dev) listening on port ${port}`)
})
