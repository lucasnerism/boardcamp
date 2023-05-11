import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customersRouter = Router();

customersRouter.get('/customers');
customersRouter.post('/customers', validateSchema(customerSchema));
customersRouter.get('/customers/:id');
customersRouter.put('/customers/:id', validateSchema(customerSchema));

export default customersRouter;