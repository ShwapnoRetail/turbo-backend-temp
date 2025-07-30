import { Response, Request } from 'express';
import { prisma } from '@repo/database'; // Adjust the import path as necessary


export const createBlog = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      userId: Number(req.userId),
    },
  });

  res.status(201).json(blog);
};

export const getBlogs = async (_: Request, res: Response) => {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  res.json(blogs);
};

export const getBlogById = async (req: Request, res: Response) => {
  const blog = await prisma.blog.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
};

export const updateBlog = async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  if (blog.userId !== Number(req.userId)) return res.status(403).json({ message: 'Forbidden' });

  const { title, content } = req.body;
  const updated = await prisma.blog.update({
    where: { id: blogId },
    data: { title, content },
  });

  res.json(updated);
};

export const deleteBlog = async (req: Request, res: Response) => {
  const blogId = Number(req.params.id);

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  if (blog.userId !== Number(req.userId)) return res.status(403).json({ message: 'Forbidden' });

  await prisma.blog.delete({ where: { id: blogId } });

  res.json({ message: 'Deleted successfully' });
};
