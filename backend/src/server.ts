import path from "path";

require('dotenv').config()
import express from 'express';
import cors from 'cors';
import * as mongoose from "mongoose";
import eventRouter from "./routes/event";
import friendshipRouter from "./routes/friendship";
import userRouter from "./routes/user";
import groupRouter from "./routes/group";
import loginRouter from './routes/login';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Centralized error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({message: 'An unknown error occurred'});
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL!, {})
    .then(() => {
        console.log('Successfully connected to the database!');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// Setting up routes
app.use('/groups', groupRouter);
app.use('/events', eventRouter);
app.use('/friendships', friendshipRouter);
app.use('/users', userRouter);
app.use('/login', loginRouter);

const angularAppPath = path.join(__dirname, '../../frontend/dist/frontend/browser');
app.use(express.static(angularAppPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(angularAppPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Added functions for graceful exits
mongoose.connection.on('error', (err) => {
    console.log(err.message)
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
});
process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
});

