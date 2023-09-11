const MongooseService = require('./MongooseService')
const TaskService = require('./TaskService')
const UserModel = require('../models/user')

class UserService extends MongooseService {
   async newTask(user, data) {
      const createTask = await TaskService.insert({
         user,
         taskName: data.taskName,
         taskDescription: data.taskDescription,
         taskStatus: data.taskStatus,
         deadline: data.deadlineDate,



      })
      user.tasks.push(createTask)
      await user.save()
      return newTask
   }

   // async newTypeOfTask(user, taskBody, typeOfTask  ) {
   //    const newTypeOfTask = await TaskService.insert({

   //       typeOfRequest: typeOfTask,
   //    })
   //    user.tasks.push(newTypeOfTask)
   //    await user.save()
   //    return newTask
   // }

   async removeTask(user, taskId) {
      try {
         await TaskService.removeOne('_id', taskId)
         const filteredTasks = await user.tasks.filter((task) => task._id != taskId)
         user.tasks = filteredTasks
         await user.save()
      } catch (error) {
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
            task._id == taskId ? { ...task, isCompleted: !task.isCompleted } : task
         )
         user.tasks = updatedTasks
         await user.save()
      } catch (error) {
         throw new Error(error)
      }
   }
}

module.exports = new UserService(UserModel)
