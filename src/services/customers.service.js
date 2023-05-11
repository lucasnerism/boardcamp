import db from "../database/connect.js";

const findAllCustomers = async () => {
  try {
    const customers = (await db.query(`SELECT * FROM customers;`)).rows;
    return { status: 200, customers };
  } catch (error) {
    return { status: 500, customers: { message: "Erro de servidor" } };
  }
};

const findCustomerById = async (id) => {
  try {
    const customer = (await db.query(`SELECT * FROM customers WHERE id = $1;`, [id])).rows[0];
    if (!customer) return { status: 404, message: "Esse cliente não existe" };
    return { status: 200, customer };
  } catch (error) {
    return { status: 500, customer: { message: "Erro de servidor" } };
  }
};

const insertNewCustomer = async ({ name, phone, cpf, birthday }) => {
  try {
    const customer = (await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])).rows[0];
    if (customer) return { status: 409, message: "Esse CPF já foi cadastrado" };
    await db.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES($1,$2,$3,$4);`, [name, phone, cpf, birthday]);
    return { status: 201, message: "Cliente criado com sucesso" };
  } catch (error) {
    return { status: 500, message: "Erro de servidor" };
  }
};

const editCustomer = async (id, { name, phone, cpf, birthday }) => {
  try {
    const customer = (await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2 ;`, [cpf, id])).rows[0];
    if (customer) return { status: 409, message: "Esse CPF já foi cadastrado" };
    await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
      [name, phone, cpf, birthday, id]);
    return ({ status: 200, message: "Cliente atualizado com sucesso" });
  } catch (error) {
    return { status: 500, message: "Erro de servidor" };
  }
};

export default {
  findAllCustomers,
  findCustomerById,
  insertNewCustomer,
  editCustomer
};