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
        description: getTaskDescriptionFromTask(taskElement).value,
        list: getTaskCheckboxFromTask(taskElement).checked ? "done" : "todo"};
};

const createNewCheckboxElement = () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", switchTaskList);
    
    return checkbox;
};

const displayDraggedElementPosition = (event, list) => {
    const dragged = document.getElementsByClassName("dragging")[0];
    const afterTask = getElementAfterDraggedElement(list, dragged, event.clientY);

    if (list === dragged.parentElement) {
        event.preventDefault();

        if (afterTask === undefined) {
            list.appendChild(dragged);
        } else {
            list.insertBefore(dragged, afterTask);
        }

        list.dragged = createTaskObjectFromElement(dragged);
        list.afterTask = createTaskObjectFromElement(afterTask);
    }
};

const switchTaskList = (event) => {
    const task = getTaskElementFromHisChildren(event.target);
    event.target.checked ? moveToDone(task) : moveToTodo(task);
    updateTaskStatusInLocalStorage(event);
};

const cancelTaskEdit = (event) => {
    if (event.key === "Escape") {
        event.target.value = event.target.dataset.recentTaskDescription;
        disableDescriptionEdit(event);
    }
};

const setTaskList = (task, taskElement) => {
    const checkboxElement = getTaskCheckboxFromTask(taskElement);
    if (task.list === "todo") {
        checkboxElement.checked = false;
        todoList.appendChild(taskElement);
    } else {
        checkboxElement.checked = true;
        doneList.appendChild(taskElement);
    }
};

const setListsEventListeners = () => {
    applyListEventListeners(todoList);
    applyListEventListeners(doneList);
};

const applyListEventListeners = (list) => {
    list.addEventListener("dragover", (event) => {
        displayDraggedElementPosition(event, list);
    });

    list.addEventListener("dragend", () => {
        updateLocalStorageAfterPositionSwap(list.dragged, list.afterTask)
    });
};

const getElementAfterDraggedElement = (list, dragged, elementHeight) => {
    const draggableElements = getListElementsExceptForSpecifiedElement(list, dragged);

   return draggableElements.reduce((closest, currentTask) => {
       const elementBox = currentTask.getBoundingClientRect();
       const offset = elementHeight - elementBox.top - elementBox.height / 2;
       if (offset < 0 && offset > closest.offset) {
           return { offset: offset, element: currentTask };
       } else {
           return closest;
       }
   }, { offset: Number.NEGATIVE_INFINITY }).element;
};