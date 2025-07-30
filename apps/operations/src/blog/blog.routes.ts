import { Router } from 'express';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from './blog.controller';

import { authenticate } from '@repo/middlewares-auth'; // Adjust the import path as necessary



const router = Router();

router.get('/', authenticate, getBlogs);
router.get('/:id', getBlogById);
router.post('/', authenticate, createBlog);
router.put('/:id', authenticate, updateBlog);
router.delete('/:id', authenticate, deleteBlog);

export default router;
