require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

//+++++++++++ LIBRARY MOMENT +++++++++++//
mongoose.connect(process.env.MONGODB_URI);
console.log(process.env.MONGODB_URI);
const moment = require("moment");
let time = moment().format("llll");
//+++++++++++// LIBRARY MOMENT //+++++++++++//

//======= model pour creation new Todo ============/
const Todo = mongoose.model("Todo", {
  title: String,
  discription: String,
  date: Object,
});
//=======// model pour creation new Todo //============/

//+++++++++++++++ CREATION NEW TODO ============//
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      discription: req.body.discription,
      date: time,
    });
    await newTodo.save();
    res.status(201).json({
      message: "new task created",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//+++++++++++++++// CREATION NEW TODO //============//

//+++++++++++++++ Ramner touts les Todos ============//
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await Todo.find();
    res.status(200).json(allTodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//+++++++++++++++// Ramner touts les Todos //============//

//+++++++++++++++ Metttre a Jour Todos ============//
app.put("/todos/:id", async (req, res) => {
  try {
    const allTodos = await Todo.find();
    let correteId;
    for (let i = 0; i < allTodos.length; i++) {
      if (allTodos[i].id === req.params.id) {
        correteId = allTodos[i].id;
      }
    }
    if (correteId !== req.params.id) {
      return res.status(404).json({
        message: `Votre Id :${req.params.id} ne figure pas dans ma base de donnees`, //
      });
    }
    const updatedTodos = await Todo.findById(correteId);
    updatedTodos.name = req.body.titleTodo;
    await updatedTodos.save();
    res.status(200).json({
      message: "task successfully updated",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//+++++++++++++++// Metttre a Jour Todos //============//

//+++++++++++++++ Supprimer Todos ============//
app.delete("/todos/:id", async (req, res) => {
  try {
    const allTodos = await Todo.find();
    let correteId;
    for (let i = 0; i < allTodos.length; i++) {
      if (allTodos[i].id === req.params.id) {
        correteId = allTodos[i].id;
      }
    }
    if (correteId !== req.params.id) {
      return res.status(404).json({
        message: `Votre Id :${req.params.id} ne figure pas dans ma base de donnees`, //
      });
    }
    const deleteTodo = await Todo.findByIdAndDelete(correteId);
    res.status(200).json({
      message: "task successfully deleted",
      deleteTodo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//+++++++++++++++ Rechercher Todo Par Nom ============//
app.get("/todos/name", async (req, res) => {
  try {
    let nameCorrect;
    let todos;
    const allTodos = await Todo.find();
    for (let i = 0; i < allTodos.length; i++) {
      if (allTodos[i].name === req.body.titleTodo) {
        nameCorrect = allTodos[i].name;
        todos = allTodos[i];
      }
    }
    if (nameCorrect !== req.body.titleTodo) {
      return res.status(404).json({
        message: `Votre name :${req.body.titleTodo} ne figure pas dans ma base de donnees`, //
      });
    }
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//+++++++++++++++// Rechercher Todo Par Nom //============//

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(" 🚀 Server started  🚀 🚀 🚀 🚀 🚀 🚀 🚀");
});

//+++++++++++++++ CREATION NEW TODO ============//
