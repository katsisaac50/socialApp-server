const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');
const { readdirSync } = require('fs');
const socketIO = require('socket.io');

// console.log(certificates)

require('dotenv').config();

const app = express();
const mongodbUri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongodbUri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Set up middleware for parsing JSON requests
app.use(express.json({ limit: '50mb', type: 'application/json' }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Enable CORS for regular HTTP requests
app.use(cors({ origin: '*' }));

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
      key: fs.readFileSync('../server/private-key.pem', 'utf8'),
      cert: fs.readFileSync('../server/certificate.pem', 'utf8'),
    }, app)
  : http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// // Socket.IO event handling
// io.on('connection', (socket) => {
//   console.log('user connected with id:', socket.id);

  
//     socket.on('send-message', (message) => {
//       // console.log('recieved message =>', message)
//       socket.broadcast.emit('recieve-message', message);
//       // socket.emit('recieve-message', message);
//     })
// });

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('user connected with id:', socket.id);

  
    socket.on('new-post', (message) => {
      //  console.log('recieved message =>', message)
       socket.broadcast.emit('recieve-message', message);
      // socket.emit('recieve-message', message);
    })
});

const port = process.env.PORT || 8007;

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});