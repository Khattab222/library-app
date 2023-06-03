
import express from 'express';
import moment from 'moment';
import { connectionDb } from './DB/connection.js';
import * as allRoutes from './modules/index.routes.js'
import { failResHandle } from './utils/errorhandling.js';
import { config } from "dotenv";
config({path:'./DB/secret.env'});
const app = express();
const port = process.env.PORT;
const baseUrl = '/api/v1'
app.use(express.json());
connectionDb();


app.use(`${baseUrl}/user`,allRoutes.userRouter)
app.use(`${baseUrl}/book`,allRoutes.bookRouter)
app.use(`${baseUrl}/uploads`,express.static('./uploads'))
app.use(failResHandle)







app.listen(port, () => console.log(`Example app listening on port ${port}!`))