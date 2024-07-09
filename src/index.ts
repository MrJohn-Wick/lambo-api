import Express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import { bootstrap_auth } from './main.js';


const app = Express();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

bootstrap_auth(app);

app.listen(3000);
console.log("app is listening on http://localhost:3000");
