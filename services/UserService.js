const MongooseService = require('./MongooseService')
const TaskService = require('./TaskService')
const UserModel = require('../models/user')
const user = require('../models/user')

class UserService extends MongooseService {
   // async createTask(user, taskData) {
   //     const { taskName, taskDescription, taskStatus, deadline } = taskData;

       
   //         // Create a new task document
   //         const newTask = await TaskService.insert({
   //            user,
   //            body: taskName,
   //            body: taskDescription,
   //            body: taskStatus,
   //            body: deadline,
   //         });

   //         // Push the new task to the user's tasks array and save the user
   //         user.tasks.push(newTask);
   //        user.save();

   //         return newTask;
       
   // }
  
   async  removeTask(user, taskId) {
      try {
         await TaskService.removeOne('_id', taskId)
         const filteredTasks = await user.tasks.filter((task) => task._id != taskId)
         user.tasks = filteredTasks
         await user.save()
      }  catch (error) {
         throw new Error(error)
      }
   }
   
  
//   async updateTask(userID, taskID, updatedTaskData) {
//     try {
//       // Find the user by ID
//       const user = await TaskService.find(userID);

//       if (!user) {
//         throw new Error('User not found');
//       }

//       // Find the task by ID within the user's tasks array
//       const taskIndex = TaskService.findOne(task => task._id == taskID);

//       if (taskIndex === -1) {
//         throw new Error('Task not found');
//       }

//       // Update the task data
//       user.tasks[taskOne].taskName = updatedTaskData.taskName;
//       user.tasks[taskIndex].taskDescription = updatedTaskData.taskDescription;
//       user.tasks[taskIndex].taskStatus = updatedTaskData.taskStatus;
//       user.tasks[taskIndex].deadline = updatedTaskData.deadline;

//       // Save the updated user document
//       await user.save();

//       // Return the updated user object with the edited task
//       return user;
//     } catch (error) {
//       throw error;
//     }
//   }
  
// async  updateTask(user, taskId) {
//    try {
//       if (!user || !user.tasks) {
//          throw new Error('User or user.tasks is undefined');
//       }

//       // Find the task by its ID
//       const task = await TaskService.find(taskId);

//       if (!task) {
//          throw new Error('Task not found');
//       }

//       // Toggle the 'isCompleted' field of the task
//       const updatedIsCompleted = !task.isCompleted;

//       // Update the task's 'isCompleted' field
//       await TaskService.update(taskId, { isCompleted: updatedIsCompleted });

//       // Update the user's tasks array to reflect the change
//       user.tasks = user.tasks.map(userTask => {
//          if (userTask._id.equals(taskId)) {
//             return { ...userTask, isCompleted: updatedIsCompleted };
//          }
//          return userTask;
//       });

//       // Save the user document
//       await user.save();
//    }  catch (error) {
//       throw new Error(error);
//    }
// } 


async updateTask(user, taskId, taskData) {
   try {
     // Find the task by ID
     const task = await TaskService.find(taskId);
     
     // Update the task data using taskData
     await TaskService.update(taskId, taskData);
     
     // Update the user's tasks array
     const updatedTasks = user.tasks.map((task) =>
       task._id.toString() === taskId.toString() ? {...task, ...taskData} : task
     );
     
     user.tasks = updatedTasks;
     
     await user.save();
   } catch (error) {
     throw new Error(error);
   }
 }
 




 
//  async updateTask(user, taskId) {
//    try {
//       const task = await TaskService.find(taskId)
//       await TaskService.update(taskId, {
//          isCompleted: !task.isCompleted,
//       })
//       const updatedTasks = await user.tasks.map((task) =>
//          task._id == taskId ? {...task, isCompleted: !task.isCompleted} : task
//       )
//       user.tasks = updatedTasks
//       await user.save()
//    }  catch (error) {
//       throw new Error(error)
//    }
// }
  };
    

module.exports = new UserService(UserModel)
      

