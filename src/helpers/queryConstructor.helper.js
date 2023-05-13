const queryConstructor = (initialQuery, queryString) => {
  const { name, offset, limit, order, desc, status, startDate } = { ...queryString };

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
    dependencyArray.push(order);
    query += ` ORDER BY $${dependencyArray.length}`;
    if (desc) {
      query += ` DESC`;
    }
  }
  if (name) {
    dependencyArray.push(name);
    query += ` WHERE name LIKE $${dependencyArray.length}`;
  }
  if (status === "open") {
    dependencyArray.push("open");
    name ? query += ` AND "returnDate" IS NULL` : query += ` WHERE "returnDate" IS NULL`;
  }
  if (status === "closed") {
    dependencyArray.push("closed");
    name ? query += ` AND "returnDate" IS NOT NULL` : query += ` WHERE "returnDate" IS NOT NULL`;
  }
  if (startDate) {
    dependencyArray.push(startDate);
    name || status ? query +=
      ` AND "rentDate" >=$${dependencyArray.length}` : query += ` WHERE "rentDate" >=$${dependencyArray.length}`;
  }
  query += `;`;
  return { text: query, values: dependencyArray };
};

export default queryConstructor;