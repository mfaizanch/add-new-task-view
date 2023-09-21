const MongooseService = require('./MongooseService')
const TaskService = require('./TaskService')
const UserModel = require('../models/user')

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



 
 async updateTask(user, taskId) {
   try {
      const task = await TaskService.find(taskId)
      await TaskService.update(taskId, {
         isCompleted: !task.isCompleted,
      })
      const updatedTasks = await user.tasks.map((task) =>
         task._id == taskId ? {...task, isCompleted: !task.isCompleted} : task
      )
      user.tasks = updatedTasks
      await user.save()
   }  catch (error) {
      throw new Error(error)
   }
}

    }

module.exports = new UserService(UserModel)
      

