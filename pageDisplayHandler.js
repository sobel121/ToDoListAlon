const clearListTasksDisplay  = (list) => {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};

const deleteDoneTasks = () => {
    clearListTasksDisplay(doneList);
    RemoveAllListTasksFromLocalStorage("done");
};

const deleteTodoTasks = () => {
    clearListTasksDisplay(todoList);
    RemoveAllListTasksFromLocalStorage("todo");
};

const deleteAllTasks = () => {
    deleteTodoTasks();
    deleteDoneTasks();
};

const moveToDone = (taskElement) => {
    todoList.removeChild(taskElement);
    doneList.appendChild(taskElement);
};

const moveToTodo = (taskElement) => {
    doneList.removeChild(taskElement);
    todoList.appendChild(taskElement);
};

const clearTaskInput = (event) => event.target.value = "";

const deleteTask = (event) => {
    removeTaskFromLocalStorage(event);
    getTaskElementFromHisChildren(event.target).remove();
};

const hideEditButton = (event) => displayEditButton(event, true);

const showEditButton = (event) => displayEditButton(event, false);

const displayEditButton = (event, flag) => {
    const taskElement = getTaskElementFromHisChildren(event.target);
    const editButton = taskElement.children[1].children[0];

    editButton.hidden = flag;
};

const disableDescriptionEdit = (event) => {
    event.target.disabled = true;
    updateTaskDescriptionInLocalStorage(event);
};

const enableEditDescription = (event) => {
    const wantedDescription = getTaskDescriptionFromTask(getTaskElementFromHisChildren(event.target));
    wantedDescription.disabled = false;
    wantedDescription.focus();
};