import { Router } from "express";

const customersRouter = Router();

customersRouter.get('/customers');
customersRouter.post('/customers');
customersRouter.get('/customers/:id');
customersRouter.put('/customers/:id');

export default customersRouter;