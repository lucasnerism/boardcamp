import joi from "joi";

export const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().pattern(/^[0-9]+$/, 'numbers').min(10).max(11),
  cpf: joi.string().pattern(/^[0-9]+$/, 'numbers').length(11),
  birthday: joi.date()
});