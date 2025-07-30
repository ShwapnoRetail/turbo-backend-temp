import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database'; // Adjust the import path as necessary

const JWT_SECRET = process.env.JWT_SECRET as string | undefined;

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // const user = await prisma.user.findUnique({ where: { email } });
  // if (!user) return res.status(404).json({ message: 'Invalid credentials' });

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  // res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

  try{
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.log('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
