import rentalsService from "../services/rentals.service.js";

const getRentals = async (req, res) => {
  const { status, rentals } = await rentalsService.findRentals();
  res.status(status).json(rentals);
};

const postRentals = async (req, res) => {
  const { status, message } = await rentalsService.insertNewRental(req.body);
  res.status(status).json({ message });
};

const returnRentals = async (req, res) => {
  const { id } = req.params;
  const { status, message } = await rentalsService.endRental(id);
  res.status(status).json({ message });
};

const deleteRentals = async (req, res) => {
  const { id } = req.params;
  const { status, message } = await rentalsService.deleteRental(id);
  res.status(status).json({ message });
};

export default {
  getRentals,
  postRentals,
  returnRentals,
  deleteRentals
};