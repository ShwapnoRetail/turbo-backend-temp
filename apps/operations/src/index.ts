import express from 'express';
import blogRoutes from './blog/blog.routes'; // Adjust the import path as necessary

//dotenv config
import dotenv from 'dotenv';
dotenv.config({
  path: ['.env']
});


const app = express();
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
}
);

app.use('/api/blogs', blogRoutes);


app.get('/', (req, res) => {
  res.send('welcome to the BIN Backend API');
});

const PORT = process.env.PORT;


app.listen(PORT, () => {
  console.log(`server running on: http://localhost:${PORT}`);
});
