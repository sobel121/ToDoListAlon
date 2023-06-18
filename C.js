let taskNumber = 1;
const todoList = document.getElementById("toDo");
const doneList = document.getElementById("done");

const generateTaskId = (taskNumber) => "t" + taskNumber;

const createNewTaskElement = () => {
    const task = document.createElement("div");
    task.id = generateTaskId(taskNumber);
    taskNumber++;
    task.classList.add("toDoTask", "task");

    return task;
}

const createNewCheckboxElement = () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", switchTaskList);
    
    return checkbox;
}

const createTaskDescription = (event) => {
    const taskDescription = document.createElement("span");
    taskDescription.innerText = event.target.value;

    return taskDescription;
}

const createDeleteTaskButtonElement = () => {
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.innerText = "X";
    deleteTaskButton.classList.add("deleteButton");
    deleteTaskButton.addEventListener("click", deleteTask);

    return deleteTaskButton
}

const createEditTaskIconElement = () => {
    const editTaskIcon = document.createElement("img");
    editTaskIcon.src = "./assets/editIcon.png";
    editTaskIcon.classList.add("editIcon");
    editTaskIcon.addEventListener("click", editDescription());

    return editTaskIcon;
}

const connectCheckboxAndText = (event) => {
    const connector = document.createElement("div");
    connector.appendChild(createNewCheckboxElement());
    connector.appendChild(createTaskDescription(event));

    return connector;
}

const connectEditAndDeleteButtons = () => {
    const connector = document.createElement("div");
    connector.appendChild(createEditTaskIconElement());
    connector.appendChild(createDeleteTaskButtonElement());

    return connector;
}

const clearTaskInput = (event) => event.target.value = "";

const newTask = (event) => {
    const task = createNewTaskElement();

    const checkboxAndText = connectCheckboxAndText(event);
    const editAndDeleteButtons = connectEditAndDeleteButtons();
    
    task.appendChild(checkboxAndText);
    task.appendChild(editAndDeleteButtons);
    
    todoList.appendChild(task);
    clearTaskInput(event);
};

const switchTaskList = (event) => {
    const task = event.target.parentElement.parentElement;
    event.target.checked ? moveToDone(task) : moveToTodo(task);
};

const moveToDone = (task) => {
    todoList.removeChild(task);
    doneList.appendChild(task);
    task.classList.remove("toDoTask");
    task.classList.add("doneTask");
};

const moveToTodo = (task) => {
    doneList.removeChild(task);
    todoList.appendChild(task);
    task.classList.remove("doneTask");
    task.classList.add("toDoTask");
};

const deleteTask = (event) => event.target.parentElement.parentElement.remove();

const editDescription = () => {
    
}

document.getElementById("taskDescriptionInput").addEventListener("change", newTask);