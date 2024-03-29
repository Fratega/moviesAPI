import express, { json } from 'express' // require -> commonJS
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import pkg from 'cors';
const { cors } = pkg;



// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

// Todos los recursos que sean MOVIES se identifica con /movies

const app = express()
app.use(json())
app.use(pkg())
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
