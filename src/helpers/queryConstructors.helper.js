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
  if (order) {
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

  if (customerId) {
    dependencyArray.push(customerId);
    query += ` WHERE "customerId" LIKE $${dependencyArray.length}`;
  }
  if (gameId) {
    dependencyArray.push(gameId);
    query += ` WHERE "gameId" LIKE $${dependencyArray.length}`;
  }
  if (status === "open") {
    customerId || gameId ? query += ` AND "returnDate" IS NULL` : query += ` WHERE "returnDate" IS NULL`;
  }
  if (status === "closed") {
    customerId || gameId ? query += ` AND "returnDate" IS NOT NULL` : query += ` WHERE "returnDate" IS NOT NULL`;
  }
  if (startDate) {
    dependencyArray.push(startDate);
    customerId || gameId || status === ("open" || "closed") ? query +=
      ` AND "rentDate" >=$${dependencyArray.length}` : query += ` WHERE "rentDate" >=$${dependencyArray.length}`;
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
