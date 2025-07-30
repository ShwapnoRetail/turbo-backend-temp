import express from 'express';
import authRoutes from './auth/auth.routes';
//dotenv config
import dotenv from 'dotenv';
dotenv.config({
  path: ['.env']
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);


const app = express();
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
}
);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('welcome to the Central Backend API');
});

const PORT = process.env.PORT;


app.listen(PORT, () => {
  console.log(`server running wewon: http://localhost:${PORT}`);
});
