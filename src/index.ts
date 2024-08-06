import dotenv from 'dotenv-flow';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { usersRouter } from './routes/users';
import { authRouter } from './routes/auth';
import { subcriptionsRouter } from './routes/subscriptions';
import { streamsRouter } from './routes/streams';


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', authRouter); // ["/oauth/*", "/signup"]
app.use('/', usersRouter); // ["/users", "/me"]
app.use('/streams', streamsRouter);

app.use('/sub', subcriptionsRouter);

const file = readFileSync('./swagger-doc.json', 'utf8')
const swaggerDocument = JSON.parse(file);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server starting!");
});
