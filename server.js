import express from "express";
import dataRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use('/users', dataRoutes);
app.use('/', authRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})