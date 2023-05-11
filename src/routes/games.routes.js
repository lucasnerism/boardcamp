import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/game.schema.js";
import gamesController from "../controllers/games.controller.js";

const gamesRouter = Router();

gamesRouter.get('/games', gamesController.getAllGames);
gamesRouter.post('/games', validateSchema(gameSchema), gamesController.postGame);

export default gamesRouter;