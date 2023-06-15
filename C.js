let taskNumber = 1;

const newTask = () => {
    const taskList = document.getElementById("toDo");
    const task = document.createElement("div");
    task.id = "t" + taskNumber;
    task.classList.add("toDoTask", "task");
    taskList.appendChild(task);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "cb" + taskNumber;
    checkbox.addEventListener("click", changeTaskList);
    task.appendChild(checkbox);
    const taskDescription = document.createElement("span");
    taskDescription.innerText = document.getElementById("newTask").value;
    task.appendChild(taskDescription);
    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.innerText = "X";
    deleteTaskBtn.classList.add("dltBtn");
    deleteTaskBtn.id = "dlt" + taskNumber;
    deleteTaskBtn.addEventListener("click", deleteTask);
    task.appendChild(deleteTaskBtn);

    clearNewTask();
    taskNumber++;
};

const clearNewTask = () => document.getElementById("newTask").value = "";

const changeTaskList = (event) => {
    const task = document.getElementById("t" + event.target.id.substring(2));
    event.target.checked ? moveToDone(task) : moveToToDo(task);
};

const moveToDone = (task) => {
    document.getElementById("toDo").removeChild(task);
    document.getElementById("done").appendChild(task);
    task.classList.remove("toDoTask");
    task.classList.add("doneTask");
};

const moveToToDo = (task) => {
    document.getElementById("done").removeChild(task);
    document.getElementById("toDo").appendChild(task);
    task.classList.remove("doneTask");
    task.classList.add("toDoTask");
};

const deleteTask = (event) => {
    document.getElementById("t" + event.target.id.substring(3)).remove();
}