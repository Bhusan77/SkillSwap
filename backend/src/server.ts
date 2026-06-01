import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("SkillSwap Backend Running ");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port 127.0.0.1${PORT}`);
});