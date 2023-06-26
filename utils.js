const getTaskCheckboxFromTask = (task) => task.children[0].children[0];

const getTaskDescriptionFromTask = (taskElement) => taskElement.children[0].children[1];

const getTaskElementFromHisChildren = (element) => {
    let fatherElement = element;

    while (!fatherElement.id.includes('t')) {
        fatherElement = fatherElement.parentElement;
    }

    return fatherElement;
};

const generateTaskId = (taskNumber) => "t" + taskNumber;

const getListElementsExceptForSpecifiedElement = (list, element) => Object.values(list.children).filter(task => task.id !== element.id);

const placeMovedTaskLastInArray = (taskIndex) => {
    const movedTask = tasks.splice(taskIndex, 1);
    tasks.push(movedTask[0]);
};

const newTask = (event) => {
    const task = createNewTaskElement(generateTaskId(taskNumber), event.target.value);
    
    todoList.appendChild(task);
    addTaskToLocalStorage(task);
    updateTaskNumberInLocalStorage();
    clearTaskInput(event);
};