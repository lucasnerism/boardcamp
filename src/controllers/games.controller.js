import gamesService from "../services/games.service.js";

const getAllGames = async (req, res) => {
  const { status, games } = await gamesService.findAllGames();
  res.status(status).json(games);
};

const postGame = async (req, res) => {
  const { status, message } = await gamesService.insertNewGame(req.body);
  res.status(status).json({ message });
};

export default {
  getAllGames,
  postGame
};