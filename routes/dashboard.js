const express = require('express');
const router = require('express').Router()
const app = express();
router.use(express.json());

const { DashboardController } = require('../controllers')
const { ensureAuthenticated } = require('../middlewares/auth')


router.get('/', (req, res) => {
    try {
        const tasks = DashboardController.allTasks(req, res);
        res.render('dashboard', {
            title: 'Task Manager',
            tasks: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// router.get('/', (req, res) => {

//     ensureAuthenticated,DashboardController.allTasks().then((tasks) => {
//         res.render('dashboard', {
//             title: 'Task Manager',
//             tasks: tasks
//         });

//     });
// });

// router.get('/', ensureAuthenticated, DashboardController.allTasks)

router.get('/add', (req, res) => {
    console.log('we are in form')
    res.render('partials//form', {
        flag: true
    });

    console.log('we are in form router')
});

// router.post('/add', (req, res) => {
//     console.log('req.body:', req.body);
//     let taskData = req.body;
//     DashboardController.createTask(taskData).then(() => {
//         res.redirect('/');
//     });
// });



// router.post('/add', ensureAuthenticated, async (req, res) => {
//     try {
//         await DashboardController.createTask(req, res);
//         res.redirect('/'); // Add this line to redirect to the root URL after creating a task
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send('Internal Server Error');
//     }
// });

router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
      const createdTask = await DashboardController.createTask(req, res);
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//  router.post('/add', ensureAuthenticated, DashboardController.createTask)


router.get('/edit/:id', (req, res) => {
    const taskID = req.params.id;
    DashboardController.findTaskById(taskID).then((task) => {
        res.render('partials/form', {
            flag: false,
            taskID: task._id,
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            taskStatus: task.taskStatus,
            deadlineDate: task.deadline
        });
    });
});

// router.post('/edit/:id', (req, res) => {
//     const taskID = req.params.id;
//     const taskData = req.body;
//     console.log(taskID);
//     console.log(taskData);
//     DashboardController.editTaskById(taskID, taskData).then(() => {
//         res.redirect('/');
//     });
// });
// router.post('/edit/:id', (req, res) => {
    
//     const taskID = req.params.id;
//     const taskData = req.body;
//     console.log(taskID);
//     console.log(taskData);
  
//     DashboardController.editTaskById(req, res, taskID, taskData).then(() => {
//       res.redirect('/');
//     });
//   });

//   router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
//     try {
//       const taskID = req.params.id;
//       const taskData = {
//         taskName: req.body.taskName,
//         taskDescription: req.body.taskDescription,
//         taskStatus: req.body.taskStatus,
//         deadline: req.body.deadline,
//       };
  
//       // Call the editTaskById controller function
//       await DashboardController.editTaskById(req, res, taskID, taskData);
  
//       // The editTaskById function handles the response and redirects if necessary
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
  
router.post('/edit/:id', ensureAuthenticated, DashboardController.editTaskById);

router.get('/completed', (req, res) => {
    const status = 'Completed';
    DashboardController.findTaskByStatus(status).then((tasks) => {
        res.render('completed', {
            tasks: tasks
        });
    });
});

router.get('/inprogress', (req, res) => {
    const status = 'In progress';
    DashboardController.findTaskByStatus(status).then((tasks) => {
        res.render('inprogress', {
            tasks: tasks
        });
    });
});


// router.get('/delete/:id', (req, res) => {
//   const taskID = req.params.id;
//   DashboardController.deleteTask(req.user, taskID);
// });


router.get('/delete/:id', async (req, res) => {
    try {
       const taskID = req.params.id;
       await DashboardController.deleteTask(req.user, taskID);
       req.flash('success_message', 'The task was removed.');
       res.redirect('/dashboard');
    } catch (error) {
       res.status(404).send(`The task is not found!, ${error}`);
    }
 });
 


router.get('/search', (req, res) => {

});

module.exports = router;