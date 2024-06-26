import path from "path";

require('dotenv').config()
import express from 'express';
import cors from 'cors';
import * as mongoose from "mongoose";

// auth imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// routes
import eventRouter from "./routes/event";
import friendshipRouter from "./routes/friendship";
import userRouter from "./routes/user";
import groupRouter from "./routes/group";
import loginRouter from './routes/login';
import groupMembershipRouter from "./routes/groupMembership";
import eventMembershipRouter from "./routes/eventMembership";


const app = express();
const port = process.env.PORT || 3000 ;

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

// Generate JWT token
function generateToken(user:any) {
    return jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });
}


// Setting up routes
app.use('/groups', groupRouter);
app.use('/group-memberships', groupMembershipRouter);
app.use('/events', eventRouter);
app.use('/event-memberships', eventMembershipRouter);
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

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
});

