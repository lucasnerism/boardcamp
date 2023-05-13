import db from "../database/connect.js";
import dayjs from "dayjs";
import queryConstructor from "../helpers/queryConstructor.helper.js";

const findRentals = async (queryString) => {
  const initialQuery = `
  SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
  FROM rentals
  JOIN customers
    ON rentals."customerId"=customers.id
  JOIN games
    ON rentals."gameId"=games.id
  `;
  const query = queryConstructor(initialQuery, queryString);

  try {
    const originalRentals = (await db.query(query)).rows;
    const rentals = originalRentals.map(rent => (
      {
        id: rent.id,
        customerId: rent.customerId,
        gameId: rent.gameId,
        rentDate: dayjs(rent.rentDate).format("YYYY-MM-DD"),
        daysRented: rent.daysRented,
        returnDate: rent.returnDate ? dayjs(rent.renturnDate).format("YYYY-MM-DD") : rent.returnDate,
        originalPrice: rent.originalPrice,
        delayFee: rent.delayFee,
        customer: { id: rent.customerId, name: rent.customerName },
        game: { id: rent.gameId, name: rent.gameName }
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

    const gameRentals = (await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`, [gameId])).rows;
    if (game.stockTotal - gameRentals.length <= 0) return { status: 400, message: "Esse jogo não está disponível no momento" };

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
  try {
    const rental = (await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])).rows[0];
    if (!rental) return { status: 404, message: "Esse aluguel não existe" };
    if (rental.returnDate) return { status: 400, message: "Esse aluguel já foi finalizado" };

    const returnDate = dayjs();
    const rentDate = dayjs(rental.rentDate);
    let delayFee = null;
    const daysDiff = returnDate.diff(rentDate, 'day');
    if (daysDiff > rental.daysRented) {
      delayFee = (daysDiff - rental.daysRented) * (rental.originalPrice / rental.daysRented);
    }
    await db.query(`UPDATE rentals SET "returnDate"=$1,"delayFee"=$2 WHERE id = $3`, [returnDate.format("YYYY-MM-DD"), delayFee, id]);

    return { status: 200, message: "Aluguel finalizado com sucesso" };
  } catch (error) {
    return { status: 500, message: "Erro de servidor" };
  }
};

const deleteRental = async (id) => {
  try {
    const rental = (await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])).rows[0];
    if (!rental) return { status: 404, message: "Esse aluguel não existe" };
    if (!rental.returnDate) return { status: 400, message: "Esse aluguel ainda não foi finalizado" };

    await db.query('DELETE FROM rentals WHERE id=$1', [id]);
    return { status: 200, message: "Aluguel deletado com sucesso" };
  } catch (error) {
    return { status: 500, message: "Erro de servidor" };
  }
};

export default {
  findRentals,
  insertNewRental,
  endRental,
  deleteRental
};