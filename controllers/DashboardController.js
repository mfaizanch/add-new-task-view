const express = require('express');
const app = express();
const {UserService, TaskService} = require('../services'); 


const mongoose = require('mongoose');
require('../models/task');
require('../models/user')
const Task = mongoose.model('Task');
const User = mongoose.model('User');

module.exports = {
   allTasks,
   createTask,
   deleteTask,
   findTaskById,
   editTaskById,
   findTaskByStatus
};

// function allTasks() {
//    return Task.find();
// }

async function allTasks(req, res, next) {
   try {
      const { name, tasks } = req.user;
      return res.render('dashboard', {
         name,
         tasks,
      });
   } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).send('Internal Server Error');
   }
}

// async function createTask(data) {
//    try {
//       const taskData = new Task({
//          taskName: data.taskName,
//          taskDescription: data.taskDescription,
//          taskStatus: data.taskStatus,
//          deadline: data.deadlineDate || null, // Set a default value or null if not provided
//       });
//       return taskData.save();
//    } catch (error) {
//       console.error(error);
//       throw error; // Rethrow the error for further handling
//    }
// }

// Import the Task model

// Your other imports and setup here

// Controller function to create a task for a user
// async function createTask(req, res) {
//   try {
//     const { taskName, taskDescription, taskStatus, deadline } = req.body;
    
//     // Check if the required fields are provided
//     if (!taskName || !taskDescription || !taskStatus) {
//       return res.status(400).json({ error: 'Please provide taskName, taskDescription, and taskStatus.' });
//     }

//     // Create a new task document
//     const newTask = new Task({
//       user: req.user.id, // Assign the user ID to the task
//       taskName,
//       taskDescription,
//       taskStatus,
//       deadline,
//     });

//     // Save the task to the database
//     await newTask.save();

//     // Optionally, you can return the created task as a response
//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Internal Server Error');
//   }
// }



async function createTask(req, res) {
   try {
     const { taskName, taskDescription, taskStatus, deadline } = req.body;
 
     // Check if the required fields are provided
     if (!taskName || !taskDescription || !taskStatus) {
       return res.status(400).json({ error: 'Please provide taskName, taskDescription, and taskStatus.' });
     }
 
     // Create a new task document
     const newTask = new Task({
      user: req.user._id,
       taskName,
       taskDescription,
       taskStatus,
       deadline,
     });
 
     // Save the task to the database
     await newTask.save();
 
     // Now, associate the task with the user by pushing the entire task object into the user's tasks array
     const user = await User.findById(req.user._id).populate('tasks');;
 
     if (!user) {
       return res.status(404).json({ error: 'User not found.' });
     }
 
     user.tasks.push(newTask); // Push the entire task object
 
     // Save the updated user with the new task association
     await user.save();
 
     // Optionally, you can return the created task as a response
     res.status(201).json(newTask);
   } catch (error) {
     console.error(error);
     return res.status(500).send('Internal Server Error');
   }
 }


// async function createTask(req, res) {
//    try {
//       const { taskName, taskDescription, taskStatus, deadline } = req.body;

//       if (!taskName || !taskDescription || !taskStatus || !deadline) {
//          return res.status(400).json({ error: 'Please fill in all task details.' });
//       }

//       const task = {
//          taskName,
//          taskDescription,
//          taskStatus,
//          deadline,
//       };

//       const newTask = await UserService.createTask(req.user, task);

//       if (newTask instanceof Error) {
//          // Handle the error returned from the service
//          console.error(newTask);
//          return res.status(500).send('Internal Server Error');
//       }

//       req.flash('success_message', 'The task was created successfully.');
//       return res.status(201).redirect('/dashboard');
//    } catch (error) {
//       console.error(error);
//       return res.status(500).send('Internal Server Error');
//    }
// }


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




