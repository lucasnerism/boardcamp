import db from "../database/connect.js";

const findAllGames = async () => {
  try {
    const games = (await db.query("SELECT * FROM games;")).rows;
    return { status: 200, games };
  } catch (error) {
    return { status: 500, games: { message: "Erro de servidor" } };
  }
};

const insertNewGame = async ({ name, image, stockTotal, pricePerDay }) => {
  try {
    const game = (await db.query("SELECT * FROM games WHERE name = $1;", [name])).rows[0];
    if (game) return { status: 409, message: "Esse jogo já existe" };
    await db.query(`INSERT INTO games (name,image,"stockTotal","pricePerDay") VALUES($1 , $2 , $3 , $4)`, [name, image, stockTotal, pricePerDay]);
    return { status: 201, message: "Jogo adicionado com sucesso" };
  } catch (error) {
    return { status: 500, message: "Erro de servidor" };
  }
};

export default {
  findAllGames,
  insertNewGame
};