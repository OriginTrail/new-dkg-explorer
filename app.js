require('dotenv').config();

const express = require('express');
// const { createAssetJob } = require('./queue');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// List of allowed origins
const allowedOrigins = [
    'http://localhost:8100',
    'http://localhost:5173',
    process.env.UI_ENDPOINT
];

// CORS configuration function
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.set('trust proxy', 1);

// Routes
const dashboardRoutes = require('./routes/dashboard');
const knowledgeBankRoutes = require('./routes/knowledgeBank');
const notificationRoutes = require('./routes/notifications');
const graphRoutes = require('./routes/graph');

app.use('/graph', graphRoutes);

const server = app.listen(port, () => {
    console.log(`Edge node backend running on port ${port}`);
});
server.setTimeout(120000);

module.exports = app;
