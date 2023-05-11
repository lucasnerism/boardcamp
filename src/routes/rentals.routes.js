import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { rentSchema } from "../schemas/rent.schema.js";
import rentalsController from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', rentalsController.getRentals);
rentalsRouter.post('/rentals', validateSchema(rentSchema), rentalsController.postRentals);
rentalsRouter.delete('/rentals/:id', rentalsController.deleteRentals);
rentalsRouter.post('/rentals/:id/return', rentalsController.returnRentals);

export default rentalsRouter;