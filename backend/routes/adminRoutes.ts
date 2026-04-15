import express from 'express';
import protect from '../middleware/auth';
import admin from '../middleware/admin';
import {
    deleteAnyDocument,
    deleteUser,
    getAllDocuments,
    getAllUsers,
    getSystemStats,
    getUserById,
} from '../controller/adminController';

const AdminRouter = express.Router();

// All admin routes require authentication AND admin middleware check
AdminRouter.use(protect);
AdminRouter.use(admin);

// User management
AdminRouter.get('/users', getAllUsers);
AdminRouter.get('/users/:id', getUserById);
AdminRouter.delete('/users/:id', deleteUser);

// Document management
AdminRouter.get('/documents', getAllDocuments);
AdminRouter.delete('/documents/:id', deleteAnyDocument);

// Statistics
AdminRouter.get('/stats', getSystemStats);

export default AdminRouter;
