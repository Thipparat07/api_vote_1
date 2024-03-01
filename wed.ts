import express from "express";
import { router as index  } from "./api/index";
import { router as register } from "./api/register";
import { router as login } from "./api/login";
import bodyParser from "body-parser";
import cors from "cors";
//app
export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/", index);
app.use("/register", register);
app.use("/login", login);

