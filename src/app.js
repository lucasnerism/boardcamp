import express from "express";
import cors from "cors";
import "dotenv/config.js";
import router from "./routes/index.routes.js";
import sqlinjection from "sql-injection-v2";

const app = express();

app.use(express.json());
app.use(cors());
app.use(sqlinjection);

app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server running on port ${PORT}`));