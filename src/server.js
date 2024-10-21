import http from "http"
import morgan from "morgan"
import { app } from "./app/app.js"

//==> middelwares <==// 
app.use(morgan('tiny'))

// server 
const PORT = process.env.PORT || 3001
// creating the server using the core moduel and the express so that the socket.io like core feature can be used 
const server = http.createServer(app)
server.listen(PORT, () => {
    console.log(`Server is running at the port ${PORT}`)
})


