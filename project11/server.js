// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB using the new user credentials
mongoose.connect('mongodb://myuser:salam123@localhost:27017/todolist')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Task Schema
const Task = mongoose.model('Task', new mongoose.Schema({
    name: String,
}));

// API Endpoints
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving tasks', error: err });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task({ name: req.body.name });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Error saving task', error: err });
    }
});

// Endpoint to delete a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted', task: deletedTask });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err });
    }
});

// Start the server
const bindAddress = '0.0.0.0'; // This will bind the server to all available network interfaces

app.listen(PORT, bindAddress, () => {
    console.log(`Server is running on http://${bindAddress}:${PORT}`);
});