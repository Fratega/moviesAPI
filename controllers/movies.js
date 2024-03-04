// import { MovieModel } from '../models/local-file-system/movie.js'
import { MovieModel } from '../models/mysql/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await MovieModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
  }

  static async create(req, res) {
    const result = validateMovie(req.body);
  
    if (!result.success) {
      // 400 Bad Request
      return res.status(400).json({ error: result.error.message });
    }
  
    try {
      // Crear la nueva película en el modelo
      const newMovieId = await MovieModel.create(result.data);
  
      // Respondemos con el ID de la película creada
      return res.status(201).json({ id: newMovieId });
    } catch (error) {
      console.error("Error creating movie:", error);
      // 500 Internal Server Error
      return res.status(500).json({ error: "Error creating movie" });
    }
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedMovie = await MovieModel.update({ id, result: result.data });

    return res.json(updatedMovie)
  }
}