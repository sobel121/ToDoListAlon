const getTaskNumberFromLocalStorage = () => JSON.parse(localStorage.getItem("taskNumber")) || 1;

export default { getTaskNumberFromLocalStorage };