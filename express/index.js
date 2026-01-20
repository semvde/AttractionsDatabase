import express from "express";
import mongoose from "mongoose";
import ridesRouter from "./routes/ridesRouter.js"

const app = express();

try {
    await mongoose.connect(process.env.MONGO_DB_URI);

    // Use Express default Middleware
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Check if user specified application/json, except if method is OPTIONS
    app.use((req, res, next) => {
        const accept = req.headers.accept;
        const method = req.method;

        res.header("Access-Control-Allow-Origin", "*");

        if (!accept || !accept.includes('application/json')) {
            if (method !== "OPTIONS") {
                res.status(406).json({
                    message: 'Only application/json is accepted'
                });
            }
        }

        next();
    });

    // Use my Routers
    app.use('/rides', ridesRouter);
} catch (e) {
    app.use((req, res) => {
        res.status(500).json({
            message: "Unable to connect to database"
        });
    })
    console.log("Unable to connect to database");
}

// Start listening to requests
app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});