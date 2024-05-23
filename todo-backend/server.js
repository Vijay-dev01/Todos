const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// app.get("/", (req, res) => {
//     res.send("Hello World");
// });
app.use(express.json());
app.use(cors());
// let todos = [];
mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => {
    console.log("DB is Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

  const todoSchema = new mongoose.Schema({
    title: {
        required : true,
        type: String
    },
    description:String
  })

  const todomodel = mongoose.model("Todo", todoSchema);

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
//   const newTodo = {
//     id: todos.length + 1,
//     title,
//     description,
//   };
//   todos.push(newTodo);
try {
    const newTodo = new todomodel({title, description});
    await newTodo.save();
    res.status(201).json(newTodo);
} catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
}
});

app.get("/todos", async(req, res) => {
    try {
        const todos = await todomodel.find();
  res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

app.put("/todos/:id", async(req, res) => {
    try {
        const {title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todomodel.findByIdAndUpdate(
            id,
            {title, description},
            {new : true}
        )
        if(!updatedTodo){
           return res.status(404).json({message: "Todos not found"})
        }
        res.json(updatedTodo);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

app.delete("/todos/:id", async(req, res) =>{
    try {
        const id = req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

const port = 3000;

app.listen(port, () => {
  console.log("Server lisioning to", +port);
});
