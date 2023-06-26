const todoList = document.getElementById("todo");
const doneList = document.getElementById("done");
const lists = [todoList, doneList];
let taskNumber = getTaskNumberFromLocalStorage()
let tasks = getTasksFromLocalStorage();

initializeTasksFromLocalStorage();
    
setListsEventListeners();

document.getElementById("taskDescriptionInput").addEventListener("change", newTask);
document.getElementById("deleteDoneTasksButton").addEventListener("click", deleteDoneTasks);
document.getElementById("deleteTasksButton").addEventListener("click", deleteAllTasks);