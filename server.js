import express from "express"
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import morgan from 'morgan'
dotenv.config()

import authRouter from './routes/authRouter.js'
import projectRouter from './routes/projectRouter.js'
import resultRouter from './routes/resultRouter.js'

const app = express();
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

const config = {
    host: 'localhost',
    user: 'root',
    password: 'harsh@mysql',
    database: 'dip',
};

let connection

async function connectToDatabase() {
    try {
        connection = await mysql.createConnection(config);
        console.log('Connected to MySQL database');
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        process.exit(1);
    }
}
connectToDatabase()

app.use(express.json())


app.get('/api', (req, res) => {
    res.json({ msg: 'API' })
})
app.use('/api/auth', authRouter)
app.use('/api/results',resultRouter)
app.use('/api/projects',projectRouter)


const port = process.env.PORT || 5000;

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}
start();

export {connection}



