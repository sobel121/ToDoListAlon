const todoList = document.getElementById("toDo");
const doneList = document.getElementById("done");

const getTaskNumberFromLocalStorage = () => JSON.parse(localStorage.getItem("taskNumber")) || 1;

let taskNumber = getTaskNumberFromLocalStorage();
const getTasksFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks")) || [];

let tasks = getTasksFromLocalStorage();

const generateTaskId = (taskNumber) => "t" + taskNumber;

const updateTaskNumber = () => {
    taskNumber++;
    localStorage.setItem("taskNumber", JSON.stringify(taskNumber));
};

const createNewTaskContainer = (id) => {
    const task = document.createElement("div");
    task.classList.add("task");
    task.id = id;

    return task;
};

const switchTaskList = (event) => {
    const task = getTaskElementFromHisChildren(event.target);
    event.target.checked ? moveToDone(task) : moveToTodo(task);
    updateTaskStatusInLocalStorage(event);
};

const createNewCheckboxElement = () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", switchTaskList);
    
    return checkbox;
};

const disableDescriptionEdit = (event) => {
    event.target.disabled = true;
    updateTaskDescriptionInLocalStorage(event);
};

const getTaskDescriptionBeforeEdit = (event) => {
    const taskId = getTaskElementFromHisChildren(event.target).id;

    return tasks.find(task => task.id = taskId).description;
};

const cancelTaskEdit = (event) => {
    if (event.key === "Escape") {
        event.target.value = getTaskDescriptionBeforeEdit(event);
        disableDescriptionEdit(event);
    }
};

const createTaskDescription = (description) => {
    const taskDescription = document.createElement("input");
    taskDescription.type = "TextArea";
    taskDescription.classList.add("taskDescription");
    taskDescription.addEventListener("change", disableDescriptionEdit);
    taskDescription.addEventListener("keydown", cancelTaskEdit);
    taskDescription.disabled = true;
    taskDescription.value = description;

    return taskDescription;
};

const deleteTask = (event) => {
    removeTaskFromLocalStorage(event);
    getTaskElementFromHisChildren(event.target).remove();
};

const createDeleteTaskButtonElement = () => {
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.innerText = "X";
    deleteTaskButton.classList.add("deleteTaskButton");
    deleteTaskButton.addEventListener("click", deleteTask);

    return deleteTaskButton
};

const enableEditDescription = (event) => {
    const wantedDescription = getTaskDescriptionFromTask(getTaskElementFromHisChildren(event.target));
    wantedDescription.disabled = false;
    wantedDescription.focus();
};

const createEditTaskIconElement = () => {
    const editTaskIcon = document.createElement("img");
    editTaskIcon.src = "./assets/editIcon.png";
    editTaskIcon.classList.add("editIcon");
    editTaskIcon.addEventListener("click", enableEditDescription);

    return editTaskIcon;
};

const connectCheckboxAndText = (description) => {
    const connector = document.createElement("div");
    connector.appendChild(createNewCheckboxElement());
    connector.appendChild(createTaskDescription(description));

    return connector;
};

const connectEditAndDeleteButtons = () => {
    const connector = document.createElement("div");
    connector.appendChild(createEditTaskIconElement());
    connector.appendChild(createDeleteTaskButtonElement());

    return connector;
};

const createNewTaskElement = (id, description) => {
    const task = createNewTaskContainer(id);

    const checkboxAndText = connectCheckboxAndText(description);
    const editAndDeleteButtons = connectEditAndDeleteButtons();
    
    task.appendChild(checkboxAndText);
    task.appendChild(editAndDeleteButtons);

    return task;
};

const specifyTaskList = (task, taskElement) => {
    const checkboxElement = getTaskCheckboxFromTask(task);
    if (task.list === "todo") {
        checkboxElement.checked = false;
        todoList.appendChild(taskElement);
    } else {
        checkboxElement.checked = true;
        doneList.appendChild(taskElement);
    }
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

initializeTasksFromLocalStorage();

const clearTaskInput = (event) => event.target.value = "";

const newTask = (event) => {
    const task = createNewTaskElement(generateTaskId(taskNumber), event.target.value);
    
    todoList.appendChild(task);
    addTaskToLocalStorage(task);
    updateTaskNumber();
    clearTaskInput(event);
};

const moveToDone = (task) => {
    todoList.removeChild(task);
    doneList.appendChild(task);
};

const moveToTodo = (task) => {
    doneList.removeChild(task);
    todoList.appendChild(task);
};

const getTaskCheckboxFromTask = (task) => task.children[0].children[0];

const getTaskDescriptionFromTask = (task) => task.children[0].children[1];

const getTaskElementFromHisChildren = (element) => {
    let fatherElement = element;

    while (!fatherElement.id.includes('t')) {
        fatherElement = fatherElement.parentElement;
    }

    return fatherElement;
}

const addTaskToLocalStorage = (task) => {
    const savedTask = {
        id: task.id,
        description: getTaskDescriptionFromTask(task).value,
        list: getTaskCheckboxFromTask(task).checked ? "done" : "todo"
    };

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

    setTasksInLocalStorage();
};

const updateTaskStatusInLocalStorage = (event) => {
    const taskId = getTaskElementFromHisChildren(event.target).id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    tasks[taskIndex].list = event.target.checked ? "done" : "todo";

    setTasksInLocalStorage();
};

const setTasksInLocalStorage = () => localStorage.setItem("tasks", JSON.stringify(tasks));

const RemoveAllListTasksFromLocalStorage = (listName) => {

    tasks = tasks.filter(task => task.list !== listName);
    setTasksInLocalStorage();
};

const clearListTasksDisplay  = (list) => {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};

const deleteDoneTasks = () => {
    clearListTasksDisplay (doneList);
    RemoveAllListTasksFromLocalStorage("done");
};

const deleteTodoTasks = () => {
    clearListTasksDisplay (todoList);
    RemoveAllListTasksFromLocalStorage("todo");
};

const deleteAllTasks = () => {
    deleteTodoTasks();
    deleteDoneTasks();
};

document.getElementById("taskDescriptionInput").addEventListener("change", newTask);
document.getElementById("deleteDoneTasksButton").addEventListener("click", deleteDoneTasks);
document.getElementById("deleteTasksButton").addEventListener("click", deleteAllTasks);