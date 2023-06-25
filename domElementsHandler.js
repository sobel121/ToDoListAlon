const createNewTaskContainer = (id) => {
    const task = document.createElement("div");
    task.classList.add("task");
    task.id = id;
    task.addEventListener("mouseover", showEditButton);
    task.addEventListener("mouseout", hideEditButton);
    task.addEventListener("dragstart", () => {
        task.classList.add("dragging");
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
    });
    task.draggable = true;

    return task;
};

const createTaskDescription = (description) => {
    const taskDescription = document.createElement("input");
    taskDescription.type = "TextArea";
    taskDescription.classList.add("taskDescription");
    taskDescription.addEventListener("change", disableDescriptionEdit);
    taskDescription.addEventListener("keydown", cancelTaskEdit);
    taskDescription.disabled = true;
    taskDescription.value = description;
    taskDescription.dataset.recentTaskDescription = description;

    return taskDescription;
};

const createDeleteTaskButtonElement = () => {
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.innerText = "X";
    deleteTaskButton.classList.add("deleteTaskButton");
    deleteTaskButton.addEventListener("click", deleteTask);

    return deleteTaskButton
};

const createEditTaskIconElement = () => {
    const editTaskIcon = document.createElement("img");
    editTaskIcon.src = "./assets/editTextIcon.png";
    editTaskIcon.classList.add("editIcon");
    editTaskIcon.addEventListener("click", enableEditDescription);
    editTaskIcon.hidden = true;

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

const createTaskObjectFromElement = (taskElement) => {
    return taskElement === undefined ? taskElement : {id: taskElement.id, 
        description: taskElement.children[0].children[1].value,
        list: taskElement.children[0].children[0].checked ? "done" : "todo"};
};

const createNewCheckboxElement = () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", switchTaskList);
    
    return checkbox;
};