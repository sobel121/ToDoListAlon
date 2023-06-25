const todoList = document.getElementById("todo");
const doneList = document.getElementById("done");
const lists = [todoList, doneList];

let taskNumber = getTaskNumberFromLocalStorage()

let tasks = getTasksFromLocalStorage();

const setListsEventListeners = () => {
    lists.forEach(list => {
        list.addEventListener("dragover", (event) => {
            event.preventDefault();
            const dragged = document.getElementsByClassName("dragging")[0];
            const afterTask = getDragAfterElement(list, dragged, event.clientY);
            if (list === dragged.parentElement) {
                if (afterTask === undefined) {
                    list.appendChild(dragged);
                } else {
                    list.insertBefore(dragged, afterTask);
                }

                list.dragged = createTaskObjectFromElement(dragged);
                list.afterTask = createTaskObjectFromElement(afterTask);
            }
        });

        list.addEventListener("dragend", () => {
            updateLocalStorageAfterPositionSwap(list.dragged, list.afterTask)
        });
    });
};

const createTaskObjectFromElement = (task) => {
    return task === undefined ? task : {id: task.id, 
        description: task.children[0].children[1].value,
        list: task.children[0].children[0].checked ? "done" : "todo"};
};
    
setListsEventListeners();

const getDragAfterElement = (list, dragged, elementHeight) => {
    const draggableElements = Object.values(list.children).filter(task => task.id !== dragged.id);

    return draggableElements.reduce((closest, currentTask) => {
        const ElementBox = currentTask.getBoundingClientRect();
        const offset = elementHeight - ElementBox.top - ElementBox.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: currentTask };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};

const generateTaskId = (taskNumber) => "t" + taskNumber;

const updateTaskNumber = () => {
    taskNumber++;
    localStorage.setItem("taskNumber", JSON.stringify(taskNumber));
};

const displayEditButton = (event, flag) => {
    const taskElement = getTaskElementFromHisChildren(event.target);
    const editButton = taskElement.children[1].children[0];

    editButton.hidden = flag;
};

const hideEditButton = (event) => displayEditButton(event, true);

const showEditButton = (event) => displayEditButton(event, false);

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

const cancelTaskEdit = (event) => {
    if (event.key === "Escape") {
        event.target.value = event.target.dataset.recentTaskDescription;
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
    taskDescription.dataset.recentTaskDescription = description;

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

const getTaskCheckboxFromTask = (task) => task.children[0].children[0];

const specifyTaskList = (task, taskElement) => {
    const checkboxElement = getTaskCheckboxFromTask(taskElement);
    if (task.list === "todo") {
        checkboxElement.checked = false;
        todoList.appendChild(taskElement);
    } else {
        checkboxElement.checked = true;
        doneList.appendChild(taskElement);
    }
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

const getTaskDescriptionFromTask = (task) => task.children[0].children[1];

const getTaskElementFromHisChildren = (element) => {
    let fatherElement = element;

    while (!fatherElement.id.includes('t')) {
        fatherElement = fatherElement.parentElement;
    }

    return fatherElement;
};

const placeMovedTaskLastInArray = (taskIndex) => {
    const movedTask = tasks.splice(taskIndex, 1);
    tasks.push(movedTask[0]);
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