const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // отдаёт HTML файлы

// подключение к базе данных
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.log("Ошибка подключения:", err);
    return;
  }
  console.log("База данных подключена!");
});

// создать таблицу если не существует
db.query(`
  CREATE TABLE IF NOT EXISTS words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255),
    translation VARCHAR(255)
  )
`);

// получить все слова
app.get("/words", (req, res) => {
  db.query("SELECT * FROM words", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// добавить слово
app.post("/words", (req, res) => {
  const { word, translation } = req.body;
  db.query(
    "INSERT INTO words (word, translation) VALUES (?, ?)",
    [word, translation],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, word, translation });
    },
  );
});

/*app.post("/words/translate", (req, res) => {
  const {word} = req.body;
  db.query(
    "select translation from words where word=(?)",
    [word],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0) return res.status(404).json({ error: "слово не найдено" });
      res.json({translation:result[0].translation  });
    },
  );
});
*/
/*app.post("/words/translate", (req, res) => {
  const {word} = req.body;
  db.query(
    "select from words where word=(?)",
    [word],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0) return res.status(404).json({ error: "слово не найдено" });
      res.json({translation:result[0].translation  });
    },
  );
});
*/
// app.listen(3000, () => console.log("Сервер запущен на http://localhost:3000"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));