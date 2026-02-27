import express from 'express';
import protect from '../middleware/auth';
import { getDashboard } from '../controller/progressController';

const ProgressRouter = express.Router();

ProgressRouter.use(protect);

ProgressRouter.get('/dashboard', getDashboard);

export default ProgressRouter;
