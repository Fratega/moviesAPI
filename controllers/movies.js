import { MovieModel } from '../models/mysql/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll(req, res) {
    try {
      const { genre } = req.query
      const movies = await MovieModel.getAll({ genre })
      res.json(movies)
    } catch (error) {
      console.error("Error al obtener todas las películas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params
      const movie = await MovieModel.getById({ id })
      if (movie) return res.json(movie)
      res.status(404).json({ message: 'Película no encontrada' })
    } catch (error) {
      console.error("Error al obtener película por ID:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async delete(req, res) {
  try {
    const { id } = req.params;
    const result = await MovieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    return res.json({ message: 'Película eliminada' });
  } catch (error) {
    console.error("Error al eliminar película:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}


  static async create(req, res) {
    try {
      const result = validateMovie(req.body)
      if (!result.success) {
        return res.status(400).json({ error: result.error.message })
      }
      const newMovieId = await MovieModel.create(result.data)
      return res.status(201).json({ id: newMovieId })
    } catch (error) {
      console.error("Error al crear película:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async update(req, res) {
    try {
      const result = validatePartialMovie(req.body)
      if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
      const { id } = req.params
      const updatedMovie = await MovieModel.update({ id, result: result.data })
      return res.json(updatedMovie)
    } catch (error) {
      console.error("Error al actualizar película:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
