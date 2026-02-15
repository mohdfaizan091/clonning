import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";

const PORT = process.env.PORT || 3000
import connectDB from "./utils/db.js";

connectDB();

app.listen(PORT, (req, res) => {
    console.log(`server is running on PORT ${PORT}`)
})