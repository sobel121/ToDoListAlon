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

const clearTaskInput = (event) => event.target.value = "";

const newTask = (event) => {
    const task = createNewTaskElement();
    const checkbox = createNewCheckboxElement();
    const taskDescription = createTaskDescription(event);
    const deleteTaskButton = createDeleteTaskButtonElement();
    
    task.appendChild(checkbox);
    task.appendChild(taskDescription);
    task.appendChild(deleteTaskButton);
    
    todoList.appendChild(task);
    clearTaskInput(event);
};

const switchTaskList = (event) => {
    const task = event.target.parentElement;
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

const deleteTask = (event) => event.target.parentElement.remove();

document.getElementById("taskDescriptionInput").addEventListener("change", newTask);