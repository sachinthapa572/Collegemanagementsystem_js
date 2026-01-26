import http from 'http';
import { app } from './app/app.js';
import dotenv from 'dotenv/config';
import { dbConnect } from './config/dbConnect.js';

// server
const PORT = process.env.PORT || 3001;
// creating the server using the core module and the express so that the socket.io like core feature can be used
const server = http.createServer(app);

dbConnect().then(
	() => {
		server.listen(PORT, () => {
			console.log(`Server is running at the port ${PORT}`);
		});
	},
	(error) => {
		console.log('Error connecting to database', error.message);
	}
);
