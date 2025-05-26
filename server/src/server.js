import './config/instrument.js'
import * as Sentry from "@sentry/node"
import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './config/db.js';

dotenv.config();
connectDb()

const PORT =process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`);
})