import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';
import router from './routes/auth.router.js';


dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', router);

// 404 Handler (if no route matches)
app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// Centralized error handler (must be last!)
app.use(errorHandler);

export default app;