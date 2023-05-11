import customersService from "../services/customers.service.js";

const getCustomers = async (req, res) => {
  const { status, customers } = await customersService.findAllCustomers();
  res.status(status).json(customers);
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;
  const { status, customer } = await customersService.findCustomerById(id);
  res.status(status).json(customer);
};

const postCustomer = async (req, res) => {
  const { status, message } = await customersService.insertNewCustomer(req.body);
  res.status(status).json({ message });
};

const putCustomer = async (req, res) => {
  const { id } = req.params;
  const { status, message } = await customersService.editCustomer(id, req.body);
  res.status(status).json({ message });
};

export default {
  getCustomers,
  getCustomerById,
  postCustomer,
  putCustomer
};