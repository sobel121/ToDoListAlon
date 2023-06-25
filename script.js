const todoList = document.getElementById("todo");
const doneList = document.getElementById("done");
const lists = [todoList, doneList];
let taskNumber = getTaskNumberFromLocalStorage()
let tasks = getTasksFromLocalStorage();

initializeTasksFromLocalStorage();
    
setListsEventListeners();

const generateTaskId = (taskNumber) => "t" + taskNumber;

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

const getTaskCheckboxFromTask = (task) => task.children[0].children[0];

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

const newTask = (event) => {
    const task = createNewTaskElement(generateTaskId(taskNumber), event.target.value);
    
    todoList.appendChild(task);
    addTaskToLocalStorage(task);
    updateTaskNumberInLocalStorage();
    clearTaskInput(event);
};

const getTaskDescriptionFromTask = (taskElement) => taskElement.children[0].children[1];

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

document.getElementById("taskDescriptionInput").addEventListener("change", newTask);
document.getElementById("deleteDoneTasksButton").addEventListener("click", deleteDoneTasks);
document.getElementById("deleteTasksButton").addEventListener("click", deleteAllTasks);