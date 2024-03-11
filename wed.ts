import express from "express";
import { router as index  } from "./api/index";
import { router as register } from "./api/register";
import { router as login } from "./api/login";
import { router as vote } from "./api/vote";
import { router as myprofile } from "./api/myprofile";
import { router as upload } from "./api/upload";
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
app.use("/vote", vote);
app.use("/myprofile", myprofile);
app.use("/upload", upload);
app.use("/uploads", express.static("upload"));


