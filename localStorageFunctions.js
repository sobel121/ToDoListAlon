const getTaskNumberFromLocalStorage = () => JSON.parse(localStorage.getItem("taskNumber")) || 1;

const getTasksFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks")) || [];

const updateLocalStorageAfterPositionSwap = (dragged, afterTask) => {
    tasks = tasks.filter(task => task.id !== dragged.id);

    if (afterTask === undefined) {
        tasks.push(dragged);
    } else {
        tasks.splice(tasks.findIndex(task => task.id === afterTask.id), 0, dragged);
    }

    setTasksInLocalStorage();
};

const createTaskElementFromLocalStorage = (task) => {
    const taskElement = createNewTaskElement(task.id, task.description);
    specifyTaskList(task, taskElement);    
};

const initializeTasksFromLocalStorage = () => {

    tasks.forEach(task => {
        createTaskElementFromLocalStorage(task);
    });
};

const addTaskToLocalStorage = (task) => {
    const savedTask = createTaskObjectFromElement(task);

    tasks.push(savedTask);

    setTasksInLocalStorage();
};

const removeTaskFromLocalStorage = (event) => {
    const taskId = getTaskElementFromHisChildren(event.target).id;

    tasks = tasks.filter(task => task.id !== taskId);

    setTasksInLocalStorage();
};

const updateTaskDescriptionInLocalStorage = (event) => {
    const taskId = getTaskElementFromHisChildren(event.target).id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    tasks[taskIndex].description = event.target.value;
    event.target.dataset.recentTaskDescription = event.target.value;

    setTasksInLocalStorage();
};

const updateTaskStatusInLocalStorage = (event) => {
    const taskId = getTaskElementFromHisChildren(event.target).id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[taskIndex].list = event.target.checked ? "done" : "todo";

    placeMovedTaskLastInArray(taskIndex);

    setTasksInLocalStorage();
};

const setTasksInLocalStorage = () => localStorage.setItem("tasks", JSON.stringify(tasks));

const RemoveAllListTasksFromLocalStorage = (listName) => {
    tasks = tasks.filter(task => task.list !== listName);
    setTasksInLocalStorage();
};