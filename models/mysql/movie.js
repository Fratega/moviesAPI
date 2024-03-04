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
  static async getAll ({ genre }) {
    const [movies] = await connection.query(
      'SELECT * FROM movie',
      )
    return movies;
  }

  static async getById({ id }) {
    const [movie] = await connection.query(
      'SELECT * FROM movie WHERE id = ?;',
      [id]
    );
    return movie[0]; // 
  }

  static async delete ({ id }) {
    try {
      // Ejecutar la consulta para eliminar la película por su ID
      const result = await connection.query(
        'DELETE FROM movie WHERE id = ?',
        [id]
      );
  
      // Verificar si se afectó alguna fila (resultado > 0)
      if (result.affectedRows === 0) {
        return false; // La película no fue encontrada
      }
  
      return true; // La película fue eliminada correctamente
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error; // Reenviar el error para ser manejado por el controlador
    }
}

  static async create({ title, year, director, duration, poster, rate }) {
  try {
    // Insertar la nueva película en la base de datos
    const newMovie = await connection.query(
      'INSERT INTO movie (title, year, director, duration, poster, rate) VALUES ( ?, ?, ?, ?, ?, ?);',
      [title, year, director, duration, poster, rate]
    );

    // Obtener el ID de la película recién creada
    const newMovieId = newMovie[0].insertId;

    // Realizar una segunda consulta para obtener los datos completos de la película recién creada
    const [movie] = await connection.query(
      'SELECT * FROM movie WHERE id = ?;',
      [newMovieId]
    );

    // Devolver los datos completos de la película recién creada
    return movie[0];
  } catch (error) {
    console.error("Error creating movie:", error);
    throw error; // Reenviar el error para ser manejado por el controlador
  }
}

static async update({ id, result }) {
  try {
    // Realizar la consulta SQL de actualización
    const { title, year, director, duration, poster, rate } = result;
    const queryResult = await connection.query(
      'UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = ?;',
      [title, year, director, duration, poster, rate, id]
    );

    // Verificar si se actualizó correctamente
    if (queryResult[0].affectedRows === 0) {
      // Si no se actualizó ningún registro, significa que la película no fue encontrada
      return { success: false, message: 'Movie not found' };
    }

    // Si se actualizó correctamente, devolver los datos actualizados de la película
    const updatedMovie = await MovieModel.getById({ id });
    return updatedMovie;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error; // Reenviar el error para ser manejado por el controlador
  }
}

}