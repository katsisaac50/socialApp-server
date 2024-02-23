const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');
const { readdirSync } = require('fs');
const socketIO = require('socket.io');
const certFile = '../server/certificate.pem';
const privKey = '../server/private-key.pem';

const pemContents = fs.readFileSync(certFile, 'utf8');
    console.log(pemContents);

require('dotenv').config();

const app = express();
const mongodbUri = process.env.MONGODB_URI;

// Enable CORS for regular HTTP requests
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Set up middleware for parsing JSON requests
app.use(express.json({ limit: '50mb', type: 'application/json' }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Set up routes
readdirSync('./routes').forEach((file) => {
  const route = require(`./routes/${file}`);
  app.use('/api', route);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Create an HTTP server
const server = process.env.NODE_ENV === 'production'
  ? https.createServer({
      key: fs.readFileSync(privKey, 'utf8'),
      cert: fs.readFileSync(certFile, 'utf8'),
    }, app)
  : http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 8007;

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
