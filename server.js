// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const morgan = require('morgan');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();

// const mongodbUri = process.env.MONGODB_URI;


// // db connection
// mongoose.connect(mongodbUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// })
//   .then(() => {
//     console.log('MongoDB connected');
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

// // middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));
// app.use(express.json({
//   limit: '50mb',
//   type: 'application/json',
// }));
// app.use(morgan('dev'));
// app.use(express.urlencoded({ extended: true }));

// // routes
// // app.use('/api/v1/auth', require('./routes/auth'));
// // app.use('/api/v1/users', require('./routes/users'));
// // app.use('/api/v1/posts', require('./routes/posts'));
// // app.use('/api/v1/comments', require('./routes/comments'));
// // app.use('/api/v1/likes', require('./routes/likes'));
// // app.use('/api/v1/dislikes', require('./routes/dislikes'));

// // routes
// app.post('/api/register', (req, res) => {
//   console.log('Register =>', req.body);
//   res.status(200).json({ message: 'Registration successful' });
// });

// const port = process.env.PORT || 8006;

// app.listen(port, () => console.log(`Server is running on port ${port}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');
const {readdirSync} = require('fs');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 8007;

const mongodbUri = process.env.MONGODB_URI;

// Enable CORS
app.options('*', cors());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
}));

// Connect to MongoDB using Mongoose
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Set up middleware for parsing JSON requests
app.use(express.json({
  limit: '50mb',
  type: 'application/json',
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Set up routes
readdirSync('./routes').forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use('/api/v1/posts', require('./routes/posts'));
  app.use('/api/v1', route);
});
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/api/register', (req, res) => {
  console.log('Register =>', req.body);
  res.status(200).json({ message: 'Registration successful' });
});

// Create an HTTP server
const server = process.env.NODE_ENV === 'production'
  ? https.createServer({
      key: fs.readFileSync('path/to/private-key.pem'),
      cert: fs.readFileSync('path/to/certificate.pem'),
    }, app)
  : http.createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


