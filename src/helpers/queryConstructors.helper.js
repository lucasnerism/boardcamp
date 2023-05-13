import { isTableName } from "./checkTableName.helper.js";

export const queryConstructor = (initialQuery, queryString) => {
  const { offset, limit, order, desc } = { ...queryString };

  const dependencyArray = [];
  let query = initialQuery;

  if (offset) {
    dependencyArray.push(offset);
    query += ` OFFSET $${dependencyArray.length}`;
  }
  if (limit) {
    dependencyArray.push(limit);
    query += ` LIMIT $${dependencyArray.length}`;
  }
  if (order && isTableName(order)) {
    query += ` ORDER BY "${order}"`;
    if (desc === "true") {
      query += ` DESC`;
    }
  }

  return { query, dependencyArray };
};

export const rentalsQueryConstructor = (queryString) => {
  const { status, startDate, customerId, gameId } = { ...queryString };
  const initialQuery = `
  SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
  FROM rentals
  JOIN customers
    ON rentals."customerId"=customers.id
  JOIN games
    ON rentals."gameId"=games.id
  `;
  let { query, dependencyArray } = queryConstructor(initialQuery, queryString);
  let whereUsed = false;

  if (customerId) {
    dependencyArray.push(customerId);
    query += ` WHERE "customerId"=$${dependencyArray.length}`;
    whereUsed = true;
  }
  if (gameId) {
    dependencyArray.push(gameId);
    query += whereUsed ? ` AND "gameId"=$${dependencyArray.length}` : ` WHERE "gameId"=$${dependencyArray.length}`;
    whereUsed = true;
  }
  if (status === "open") {
    query += whereUsed ? ` AND "returnDate" IS NULL` : ` WHERE "returnDate" IS NULL`;
    whereUsed = true;
  }
  if (status === "closed") {
    query += whereUsed ? ` AND "returnDate" IS NOT NULL` : ` WHERE "returnDate" IS NOT NULL`;
    whereUsed = true;
  }
  if (startDate) {
    dependencyArray.push(startDate);
    query += whereUsed ? ` AND "rentDate" >=$${dependencyArray.length}` : ` WHERE "rentDate" >=$${dependencyArray.length}`;
  }
  query += `;`;
  return { text: query, values: dependencyArray };
};

export const gamesQueryConstructor = (queryString) => {
  const { name } = { ...queryString };
  const initialQuery = `SELECT * FROM games`;
  let { query, dependencyArray } = queryConstructor(initialQuery, queryString);
  if (name) {
    dependencyArray.push(name);
    query += ` WHERE name LIKE $${dependencyArray.length}`;
  }
  query += `;`;
  return { text: query, values: dependencyArray };
};

export const customersQueryConstructor = (queryString) => {
  const { cpf } = { ...queryString };
  const initialQuery = `SELECT * FROM customers`;
  let { query, dependencyArray } = queryConstructor(initialQuery, queryString);
  if (cpf) {
    dependencyArray.push(cpf);
    query += ` WHERE cpf LIKE $${dependencyArray.length}`;
  }
  query += `;`;
  return { text: query, values: dependencyArray };
};
