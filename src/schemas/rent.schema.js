import joi from "joi";

export const rentSchema = joi.object({
  customerId: joi.number().integer().required(),
  gameId: joi.number().integer().required(),
  daysRented: joi.number().integer().required()
});