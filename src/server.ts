import express from "express";
import morgan from "morgan";
import { errorHandler, notFound } from "./modules/middleware";
import router from "./router";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", router);
app.use(notFound);
app.use(errorHandler);

export default app;
