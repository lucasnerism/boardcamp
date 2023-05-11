import sanitizeObjects from "../helpers/sanitizeObjects.helper.js";

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(sanitizeObjects(req.body), { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(422).json(errors);
    }
    next();
  };
};

export default validateSchema;