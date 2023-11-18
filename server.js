import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

// db connection
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// middleware
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json({
  limit: '50mb',
  type: 'application/json',
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// routes
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/users', require('./routes/users'));
// app.use('/api/v1/posts', require('./routes/posts'));
// app.use('/api/v1/comments', require('./routes/comments'));
// app.use('/api/v1/likes', require('./routes/likes'));
// app.use('/api/v1/dislikes', require('./routes/dislikes'));

// routes
app.post('/api/register', (req, res) => {
  console.log('Register =>', req.body);
  res.status(200).json({ message: 'Registration successful' });
});

const port = process.env.PORT || 8006;

app.listen(port, () => console.log(`Server is running on port ${port}`));
