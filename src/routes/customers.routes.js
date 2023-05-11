import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";
import customersController from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.get('/customers', customersController.getCustomers);
customersRouter.post('/customers', validateSchema(customerSchema), customersController.postCustomer);
customersRouter.get('/customers/:id', customersController.getCustomerById);
customersRouter.put('/customers/:id', validateSchema(customerSchema), customersController.putCustomer);

export default customersRouter;