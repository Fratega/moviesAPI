import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

const ACCEPTED_ORIGINS = [
    'https://localhost:3000',
    'https://localhost:3001'
  ]

const origin = req.header('origin')
if (ACCEPTED_ORIGINS.includes(origin)) {
  res.header('Access-Control-Allow-Origin', origin)
}

moviesRouter.get('/', MovieController.getAll, origin)
moviesRouter.post('/', MovieController.create, origin)

moviesRouter.get('/:id', MovieController.getById, origin)
moviesRouter.delete('/:id', MovieController.delete, origin)
moviesRouter.patch('/:id', MovieController.update, origin)