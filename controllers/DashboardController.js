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
   //   res.status(201).json(newTask);
   return newTask;
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


// async function deleteTask(user, taskId) {
//    try {
//      await UserService.removeTask(req.user, req.params.taskId);
//      req.flash('success_message', 'The task was removed.');
//      return res.redirect('/dashboard'); // Redirect to the dashboard
//    } catch (error) {
//      res.status(404).send(`The task is not found!, ${error}`);
//    }
//  }


 async function deleteTask(user, taskId) {
   try {
      await UserService.removeTask(user, taskId);
      return Promise.resolve(); // Resolve the promise once the task is deleted
   } catch (error) {
      return Promise.reject(error); // Reject the promise if there's an error
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
    const taskID = req.params.id;
    const taskData = {
      // Extract task data from req.body as needed
      taskName: req.body.taskName,
      taskDescription: req.body.taskDescription,
      taskStatus: req.body.taskStatus,
      deadline: req.body.deadline,
    };
    
    await UserService.updateTask(req.user, taskID, taskData); // Pass taskID and taskData
    
    return res.status(200).redirect(303, '/dashboard');
  } catch (error) {
    console.error(error);
    return res.status(404).send('The task is not found!');
  }
}
a
 
// Controller function to edit a task by ID
// async function editTaskById(req, res, taskID, taskData) {
//    try {
//      // Update the task using your TaskService or Mongoose methods
//      // Assuming TaskService.update is defined properly in your code
//      await UserService.updateTask(taskID, taskData);
 
//      // Redirect to the root URL after editing the task
//      res.redirect('/');
//    } catch (error) {
//      console.error(error);
//      res.status(404).send('The task is not found!');
//    }
//  }

//  async function editTaskById(req, res) {
//    try {
//      const taskID = req.params.id;
//      const taskData = {
//        taskName: req.body.taskName,
//        taskDescription: req.body.taskDescription,
//        taskStatus: req.body.taskStatus,
//        deadline: req.body.deadline,
//      };
//      console.log('Task ID:', taskID);
//      console.log('Task Data:', taskData);
 
//      // Find the user by ID (assuming you have a User model)
//      const user = await User.findById(req.user._id);
 
//      if (!user) {
//        return res.status(404).send('User not found');
//      }
 
//      // Find the task by ID within the user's tasks array
//      const taskIndex = user.tasks.findIndex(task => task._id == taskID);
 
//      if (taskIndex === -1) {
//        return res.status(404).send('Task not found');
//      }
 
//      // Update the task data
//      user.tasks[taskIndex].taskName = taskData.taskName;
//      user.tasks[taskIndex].taskDescription = taskData.taskDescription;
//      user.tasks[taskIndex].taskStatus = taskData.taskStatus;
//      user.tasks[taskIndex].deadline = taskData.deadline;
 
//      // Save the updated user document
//      await user.save();
 
//      // Redirect to the root URL after editing the task
//      res.redirect('/');
//    } catch (error) {
//      console.error(error);
//      res.status(500).send('Internal Server Error');
//    }
//  }
 
 



