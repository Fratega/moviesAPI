import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3307',
  password: '',
  database: 'moviesdb'
}
const connectionString = process.env.DATABASE_URL ?? config

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll({ genre }) {
    try {
      const [movies] = await connection.query(
        'SELECT * FROM movie',
      )
      return movies;
    } catch (error) {
      console.error("Error al obtener todas las películas:", error);
      throw { status: 500, message: "Error interno del servidor" };
    }
  }

  static async getById({ id }) {
    try {
      const [movie] = await connection.query(
        'SELECT * FROM movie WHERE id = ?;',
        [id]
      );
      if (!movie[0]) throw { status: 404, message: "Película no encontrada" };
      return movie[0]; 
    } catch (error) {
      console.error("Error al obtener película por ID:", error);
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      const result = await connection.query(
        'DELETE FROM movie WHERE id = ?',
        [id]
      );
  
      if (result.affectedRows === 0) {
        throw { status: 404, message: "Película no encontrada" };
      }
  
      return { message: "Película eliminada correctamente" }; 
    } catch (error) {
      console.error("Error al eliminar película:", error);
      throw { status: 500, message: "Error interno del servidor" };
    }
  }

  static async create({ title, year, director, duration, poster, rate }) {
    try {
      const newMovie = await connection.query(
        'INSERT INTO movie (title, year, director, duration, poster, rate) VALUES ( ?, ?, ?, ?, ?, ?);',
        [title, year, director, duration, poster, rate]
      );

      const newMovieId = newMovie[0].insertId;

      const [movie] = await connection.query(
        'SELECT * FROM movie WHERE id = ?;',
        [newMovieId]
      );

      return movie[0];
    } catch (error) {
      console.error("Error al crear película:", error);
      throw { status: 500, message: "Error interno del servidor" };
    }
  }

  static async update({ id, result }) {
    try {
      const { title, year, director, duration, poster, rate } = result;
      const queryResult = await connection.query(
        'UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = ?;',
        [title, year, director, duration, poster, rate, id]
      );

      if (queryResult[0].affectedRows === 0) {
        throw { status: 404, message: "Película no encontrada" };
      }

      const updatedMovie = await MovieModel.getById({ id });
      return updatedMovie;
    } catch (error) {
      console.error("Error al actualizar película:", error);
      throw { status: 500, message: "Error interno del servidor" };
    }
  }
}
