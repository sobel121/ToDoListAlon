const todoList = document.getElementById("toDo");
const doneList = document.getElementById("done");

const getTaskNumberFromLocalStorage = () => {
    let taskNumber = JSON.parse(localStorage.getItem("taskNumber"));
    
    if (taskNumber === null) {
        taskNumber = 1;
    }
    
    return taskNumber;
}

let taskNumber = getTaskNumberFromLocalStorage();
const getTasksFromLocalStorage = () => {
    let savedTasks = JSON.parse(localStorage.getItem("tasks"));
    
    if (savedTasks === null) {
        savedTasks = [];
    }
    
    return savedTasks;
};

let tasks = getTasksFromLocalStorage();

const generateTaskId = (taskNumber) => "t" + taskNumber;

const updateTaskNumber = () => {
    taskNumber++;
    localStorage.setItem("taskNumber", JSON.stringify(taskNumber));
};

const createNewTaskElement = (id) => {
    const task = document.createElement("div");
    task.classList.add("task");
    task.id = id;

    return task;
};

const switchTaskList = (event) => {
    const task = event.target.parentElement.parentElement;
    event.target.checked ? moveToDone(task) : moveToTodo(task);
    updateTaskListInLocalStorage(event);
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

const createTaskDescription = (description) => {
    const taskDescription = document.createElement("input");
    taskDescription.type = "TextArea";
    taskDescription.classList.add("taskDescription");
    taskDescription.addEventListener("change", disableDescriptionEdit)
    taskDescription.disabled = true;
    taskDescription.value = description;

    return taskDescription;
};

const deleteTask = (event) => {
    removeTaskFromLocalStorage(event);
    event.target.parentElement.parentElement.remove();
};

const createDeleteTaskButtonElement = () => {
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.innerText = "X";
    deleteTaskButton.classList.add("deleteTaskButton");
    deleteTaskButton.addEventListener("click", deleteTask);

    return deleteTaskButton
};

const enableEditDescription = (event) => {
    const wantedDescription = event.target.parentElement.parentElement.children[0].children[1]
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

const connectTaskContent = (id, description) => {
    const task = createNewTaskElement(id);

    const checkboxAndText = connectCheckboxAndText(description);
    const editAndDeleteButtons = connectEditAndDeleteButtons();
    
    task.appendChild(checkboxAndText);
    task.appendChild(editAndDeleteButtons);

    return task;
};

const specifyTaskList = (task, taskElement) => {
    const checkboxElement = taskElement.children[0].children[0];
    if (task.list === "todo") {
        checkboxElement.checked = false;
        todoList.appendChild(taskElement);
    } else {
        checkboxElement.checked = true;
        doneList.appendChild(taskElement);
    }
};

const createTaskElementFromLocalStorage = (task) => {
    const taskElement = connectTaskContent(task.id, task.description);
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
    const task = connectTaskContent(generateTaskId(taskNumber), event.target.value);
    
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

const addTaskToLocalStorage = (task) => {
    const savedTask = {
        id: task.id,
        description: task.children[0].children[1].value,
        list: task.children[0].children[0].checked ? "done" : "todo"
    }

    tasks.push(savedTask);

    updateTasksInLocalStorage(tasks);
};

const removeTaskFromLocalStorage = (event) => {
    const taskId = event.target.parentElement.parentElement.id;

    tasks = tasks.filter(task => task.id !== taskId);

    updateTasksInLocalStorage(tasks);
};

const updateTaskDescriptionInLocalStorage = (event) => {
    const taskId = event.target.parentElement.parentElement.id;

    tasks.map(task => {
        if (task.id === taskId) {
            return task.description = event.target.value;
        }

        return task;
    });

    updateTasksInLocalStorage(tasks);
};

const updateTaskListInLocalStorage = (event) => {
    const taskId = event.target.parentElement.parentElement.id;
    
    tasks.map(task => {
        if (task.id === taskId) {
            task.list = event.target.checked ? "done" : "todo";
        }
    });

    updateTasksInLocalStorage(tasks);
};

const updateTasksInLocalStorage = (savedTasks) => localStorage.setItem("tasks", JSON.stringify(savedTasks));

const RemoveAllListTasksFromLocalStorage = (listName) => {

    tasks = tasks.filter(task => task.list !== listName);
    updateTasksInLocalStorage(tasks);
};

const deleteListTasks = (list) => {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};

const deleteDoneTasks = () => {
    deleteListTasks(doneList);
    RemoveAllListTasksFromLocalStorage("done");
};

const deleteTodoTasks = () => {
    deleteListTasks(todoList);
    RemoveAllListTasksFromLocalStorage("todo");
};

const deleteAllTasks = () => {
    deleteTodoTasks();
    deleteDoneTasks();
};

document.getElementById("taskDescriptionInput").addEventListener("change", newTask);
document.getElementById("deleteDoneTasksButton").addEventListener("click", deleteDoneTasks);
document.getElementById("deleteTasksButton").addEventListener("click", deleteAllTasks);