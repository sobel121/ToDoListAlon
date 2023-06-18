let taskNumber = 1;
const toDoList = document.getElementById("toDo");
const doneList = document.getElementById("done");

const createNewTask = () => {
    const task = document.createElement("div");
    task.id = "t" + taskNumber;
    task.classList.add("toDoTask", "task");

    return task;
}

const createNewCheckbox = () => {
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

const createDeleteTaskButton = () => {
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.innerText = "X";
    deleteTaskButton.classList.add("deleteButton");
    deleteTaskButton.addEventListener("click", deleteTask);

    return deleteTaskButton
}

const newTask = (event) => {
    const task = createNewTask();
    const checkbox = createNewCheckbox();
    const taskDescription = createTaskDescription(event);
    const deleteTaskButton = createDeleteTaskButton();
    
    task.appendChild(checkbox);
    task.appendChild(taskDescription);
    task.appendChild(deleteTaskButton);
    
    toDoList.appendChild(task);

    event.target.value = "";
    taskNumber++;
};

const switchTaskList = (event) => {
    const task = event.target.parentElement;
    event.target.checked ? moveToDone(task) : moveToToDo(task);
};

const moveToDone = (task) => {
    toDoList.removeChild(task);
    doneList.appendChild(task);
    task.classList.remove("toDoTask");
    task.classList.add("doneTask");
};

const moveToToDo = (task) => {
    doneList.removeChild(task);
    toDoList.appendChild(task);
    task.classList.remove("doneTask");
    task.classList.add("toDoTask");
};

const deleteTask = (event) => {
    event.target.parentElement.remove();
}

document.getElementById("newTask").addEventListener("change", newTask);