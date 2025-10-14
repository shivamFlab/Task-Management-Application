import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

dotenv.config({
  path: "./.env",
});

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("Public")); // when we need to store files/imgs/pdfs in locall machine we can put them inside public folder

app.use(cookieParser()); // so that we can do CRUD operations over cookies

app.get("/", (req, res) => {
  res.send("Good to go with the youtube premium");
});

export { app };