const express = require('express');
const usersRouter = require('./users/users-router')
const server = express();
server.use(express.json())
// remember express by default cannot parse JSON in request bodies

// global middlewares and the user's router need to be connected here
server.use('/api/users',usersRouter)
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use((err,req,res,next)=> {
  res.status(err.status || 500).json({ message: `${err.message}` });
})

server.use('*', (req,res)=> {
  res.status(404).json({message: `This is not the endpoint you are looking for!`})
})
module.exports = server;
