import dayjs from "dayjs";
import db from "../database/connect.js";

const findRentals = async () => {
  try {
    const originalRentals = (await db.query(`SELECT rentals.*, customers.id AS "idFromCustomer" , customers.name AS "customerName", games.id AS "idFromGame", games.name AS "gameName"
    FROM rentals
    JOIN customers ON rentals."customerId"=customers.id
    JOIN games ON rentals."gameId"=games.id;
    `)).rows;
    const rentals = originalRentals.map(rent => (
      {
        id: rent.id,
        customerId: rent.customerId,
        gameId: rent.gameId,
        rentDate: dayjs(rent.rentDate).format("YYYY-MM-DD"),
        daysRented: rent.daysRented,
        returnDate: rent.returnDate,
        originalPrice: rent.originalPrice,
        delayFee: rent.delayFee,
        customer: { id: rent.idFromCustomer, name: rent.customerName },
        game: { id: rent.idFromGame, name: rent.gameName }
      }
    ));
    return { status: 200, rentals };
  } catch (error) {
    return { status: 500, rentals: { message: "Erro de servidor" } };
  }
};

const insertNewRental = async ({ customerId, gameId, daysRented }) => {
  try {
    const game = (await db.query("SELECT * FROM games WHERE id=$1;", [gameId])).rows[0];
    if (!game) return { status: 400, message: "Esse jogo não existe" };

    const customer = (await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId])).rows[0];
    if (!customer) return { status: 400, message: "Esse cliente não existe" };

    const gameRentals = (await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId])).rows;
    if (game.stockTotal - gameRentals.length === 0) return { status: 400, message: "Esse jogo não está disponível no momento" };

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = daysRented * game.pricePerDay;
    await db.query(`INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice", "delayFee")
    VALUES($1,$2,$3,$4,null,$5,null);
    `, [customerId, gameId, rentDate, daysRented, originalPrice]);
    return { status: 201, message: "Aluguel registrado com sucesso" };
  } catch (error) {
    return { status: 500, message: "Erro de servidor" };
  }
};

const endRental = async (id) => {

};

const deleteRental = async (id) => {

};

export default {
  findRentals,
  insertNewRental,
  endRental,
  deleteRental
};