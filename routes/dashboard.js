const router = require('express').Router()
const { DashboardController } = require('../controllers')
const { ensureAuthenticated } = require('../middlewares/auth')




router.get('/', (req, res) => {

    DashboardController.allTasks().then((tasks) => {
        res.render('dashboard', {
            title: 'Task Manager',
            tasks: tasks
        });

    });
});

router.get('/add', (req, res) => {
    console.log('we are in form')
    res.render('partials//form', {
        flag: true
    });
    
    console.log('we are in form router')
});

router.post('/add', (req, res) => {
    let taskData = req.body;
    DashboardController.createTask(taskData).then(() => {
        res.redirect('/');
    });
});

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

router.post('/edit/:id', (req, res) => {
    const taskID = req.params.id;
    const taskData = req.body;
    console.log(taskID);
    console.log(taskData);
    DashboardController.editTaskById(taskID, taskData).then(() => {
        res.redirect('/');
    });
});

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


router.get('/delete/:id', (req, res) => {
    const taskID = req.params.id;
    DashboardController.removeTask(req.user, taskID).then(() => {
        res.redirect('/');
    });
});

router.get('/search', (req, res) => {

});

module.exports = router;