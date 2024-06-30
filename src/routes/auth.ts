import { authController } from '@lambo/controllers/auth';
import { isAnonymous, isAuthenticated } from '@lambo/utils/auth';
import express from 'express';

const router = express.Router();

router.post(
  '/login', 
  isAnonymous,
  authController.login
);

router.get(
  '/logout',
  isAuthenticated,
  authController.logout
);

export default router;