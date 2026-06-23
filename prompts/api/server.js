const express = require("express");
const cors = require("cors");
const evaluateRouter = require("./api/evaluate");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json({ limit: "20mb" }));

app.get("/health", (_, res) => res.json({ status: "ok", service: "sim2-backend" }));

app.use("/api", evaluateRouter);

app.listen(PORT, () => {
  console.log(`SIM 2.0 backend running on port ${PORT}`);
});
