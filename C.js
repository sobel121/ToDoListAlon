let taskNumber = 1;

const newTask = () => {
    const taskDescription = document.createElement("span");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "cb" + taskNumber;
    taskNumber++;
    const taskList = document.getElementById("toDo");
    const task = document.createElement("div");
    taskDescription.innerText = document.getElementById("newTask").value;
    task.classList.add("toDoTask");
    task.appendChild(checkbox);
    task.appendChild(taskDescription);
    taskList.appendChild(task);

    clearNewTask();
}

const clearNewTask = () => document.getElementById("newTask").value = "";