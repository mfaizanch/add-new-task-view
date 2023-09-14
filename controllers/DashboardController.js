const {UserService, TaskService} = require('../services');
const { removeTask } = require('../services/UserService');

const mongoose = require('mongoose');
require('../models/task');
const Task = mongoose.model('Task');

module.exports = {
   allTasks,
   createTask,
   deleteTask,
   findTaskById,
   editTaskById,
   findTaskByStatus
};

function allTasks() {
   return Task.find();
}

// function createTask(data) {
//    const taskData = new Task({
//        taskName: data.taskName,
//        taskDescription: data.taskDescription,
//        taskStatus: data.taskStatus,
//        deadline: data.deadlineDate,
//        filename: data.filename
//    });
//    return taskData.save();
// }

async function createTask(req, res) {
   try {
      let messages = []

      // Extract the taskName, taskStatus, deadline, and body from the request body
      const { taskName, taskDescription, taskStatus, deadline} = req.body;

      // Check if the required fields are missing
      if (!taskName || !taskDescription || !taskStatus || !deadline ) {
         messages.push({ body: 'Please fill in all task details.' });
      }

      if (messages.length) {
         return res.render('dashboard', { messages, name: req.user.name });
      }

      // Create an object containing all task details
      const task = {
         taskName,
         taskDescription,
         taskStatus,
         deadline
         
      };

      // Call the UserService.newTask method with the task object
      await UserService.newTask(req.user, task);
      
      req.flash('success_message', 'The task was created successfully.');
      return res.status(200).redirect(303, '/dashboard');
   } catch (error) {
      res.status(404).send(`The task is not found!`);
   }
}

async function deleteTask(user, taskId) {
    try {
       await UserService.removeTask(req.user, req.params.taskId)
       req.flash('success_message', 'The task was removed.')
       return res.status(200).redirect(303, '/dashboard')
    } catch (error) {
       res.status(404).send(`The task is not found!, ${error}`)
    }
 }

function findTaskByStatus(status) {
   return Task.find({
       taskStatus: status
   });
}

function findTaskById(id) {
   return Task.findById(id);
}

async function editTaskById(req, res) {
   try {
      await UserService.updateTask(req.user, req.params.taskId)
      return res.status(200).redirect(303, '/dashboard')
   } catch (error) {
      res.status(404).send(`The task is not found!`)
   }
}