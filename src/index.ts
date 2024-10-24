import dotenv from 'dotenv-flow';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { usersRouter } from './routes/users';
import { authRouter } from './routes/auth';
import { subcriptionsRouter } from './routes/subscriptions';
import { categoriesRouter } from './routes/categories';
import { meRouter } from './routes/me';
import { streamsRouter } from './routes/streams';
import { languagesRouter } from './routes/langs';
import { logger } from './utils/logger';
import { galleriesRouter } from './routes/galleries';
import { globalSettingsRouter } from './routes/settings';
import { profilesRouter } from './routes/profiles';


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

app.use('/', authRouter); // ["/oauth/*", "/signup"]
app.use('/me', meRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/streams', streamsRouter);
app.use('/sub', subcriptionsRouter);
app.use('/langs', languagesRouter);
app.use('/galleries', galleriesRouter);
app.use('/settings', globalSettingsRouter);
app.use('/profiles', profilesRouter);

const file = readFileSync('./swagger-doc.json', 'utf8')
const swaggerDocument = JSON.parse(file);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server starting!");
});
