import { stripHtml } from "string-strip-html";

const sanitizeObjects = (obj) => {
  for (const [key, data] of Object.entries(obj)) {
    if (typeof data !== "number") {
      obj[key] = stripHtml(data).result;
    }
  }
  return obj;
};

export default sanitizeObjects;