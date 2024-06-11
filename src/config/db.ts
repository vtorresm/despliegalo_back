import mongoose from 'mongoose';
import colors from 'colors';
import { exit } from 'node:process';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${conn.connection.host}:${conn.connection.host}`;
    console.log(
      colors.magenta.bold(`MongoDB conectado en: ${conn.connection.host}`)
    );
  } catch (error) {
    console.log(colors.bgRed.bold(`Error: Error al conectar a la base de datos`));
    exit(1);
  }
};
