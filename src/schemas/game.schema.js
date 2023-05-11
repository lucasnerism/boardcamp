import joi from "joi";

export const gameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().allow(""),
  stockTotal: joi.number().positive(),
  pricePerDay: joi.number().positive()
});