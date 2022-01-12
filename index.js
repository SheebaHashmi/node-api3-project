// require your server and launch it
const server = require('./api/server')

server.listen(9000,() => {
    console.log('magic happening at port 9000')
})