import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { rentSchema } from "../schemas/rent.schema.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals');
rentalsRouter.post('/rentals', validateSchema(rentSchema));
rentalsRouter.post('/rentals/:id/return');
rentalsRouter.delete('/rentals/:id');

export default rentalsRouter;