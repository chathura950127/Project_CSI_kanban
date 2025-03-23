import './index.css';

document.addEventListener("DOMContentLoaded", function () {
    loadColumnsFromLocalStorage();
    loadTasksFromLocalStorage();
});

const task_board_section = document.getElementById("task_board_section");
const addColumnBtn = document.getElementById("add_column_btn");
const column_add = document.getElementById("column_add");
const closePopupBtn = document.getElementById("close_popup_btn");
const saveColumnBtn = document.getElementById("save_column_btn");
const columnNameInput = document.getElementById("column_name_input");

// Event listeners
addColumnBtn.addEventListener("click", () => column_add.style.display = "block");
closePopupBtn.addEventListener("click", () => column_add.style.display = "none");

saveColumnBtn.addEventListener("click", function () {
    const columnName = columnNameInput.value.trim();
    if (!columnName) {
        alert("Please enter a column name.");
        return;
    }
    addColumn(columnName);
    saveColumnsToLocalStorage();
    column_add.style.display = "none";
    columnNameInput.value = "";
});

function addColumn(columnName) {
    const columnId = columnName.toLowerCase().replace(/\s+/g, "_");
    const newColumn = document.createElement("div");
    newColumn.className = "column";
    newColumn.id = columnId;
    newColumn.innerHTML = `
        <div class="column_name_section"><h4>${columnName}</h4></div>
        <div class="task_section" id="${columnId}_task_section"></div>
        <div class="add_new_task_section">
            <button class="add_new_task_btn" id="new_task_${columnId}">
                <i class="bi bi-plus-square text-secondary" style="font-size: 30px;"></i>
                <span>Create New Task</span>
            </button>
        </div>
    `;
    task_board_section.appendChild(newColumn);
    document.getElementById(`new_task_${columnId}`).addEventListener("click", () => createNewTask(columnId));
}

function saveColumnsToLocalStorage() {
    const columns = [...document.querySelectorAll(".column")].map(column => ({
        columnId: column.id,
        columnName: column.querySelector(".column_name_section h4").textContent,
        taskSectionId: `${column.id}_task_section`,
        newsectionbtn: `new_task_${column.id}`
    }));
    localStorage.setItem("columns", JSON.stringify(columns));
}

function loadColumnsFromLocalStorage() {
    const storedColumns = JSON.parse(localStorage.getItem("columns")) || [];
    storedColumns.forEach(column => addColumn(column.columnName));
}

function createNewTask(columnId) {
    const section = document.getElementById(`${columnId}_task_section`);
    if (!section) return;
    const taskCard = document.createElement("div");
    taskCard.className = "task";
    taskCard.setAttribute("draggable", "true");
    taskCard.id = `TASK-${Date.now()}`;
    taskCard.innerHTML = `<textarea placeholder="Enter task title and press Enter" rows="2" class="task_input_style"></textarea>`;
    section.appendChild(taskCard);
    const inputField = taskCard.querySelector("textarea");
    inputField.focus();

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const taskTitle = inputField.value.trim();
            if (!taskTitle) {
                taskCard.remove();
                return;
            }
            taskCard.innerHTML = `<span>${taskTitle}</span>`;
            saveTask(taskTitle, columnId, taskCard.id);
        }
    });

    enableDragEvents(taskCard);
}

function saveTask(title, columnId, taskId) {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.push({ title, id: taskId, column: columnId });
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(({ title, id, column }) => {
        const section = document.getElementById(`${column}_task_section`);
        if (section) createTaskCard(title, id, section);
    });
}

function createTaskCard(title, id, section) {
    const taskCard = document.createElement("div");
    taskCard.className = "task";
    taskCard.setAttribute("draggable", "true");
    taskCard.id = id;
    taskCard.innerHTML = `<span>${title}</span>`;
    section.appendChild(taskCard);
    enableDragEvents(taskCard);
}

function enableDragEvents(task) {
    task.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", task.id));
}

document.querySelectorAll(".task_section").forEach(section => {
    section.addEventListener("dragover", e => e.preventDefault());
    section.addEventListener("drop", function (e) {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("text/plain");
        const draggedTask = document.getElementById(taskId);
        if (draggedTask) {
            section.appendChild(draggedTask);
            updateTasksInLocalStorage();
        }
    });
});

function updateTasksInLocalStorage() {
    const tasks = [...document.querySelectorAll(".task")].map(task => ({
        title: task.textContent.trim(),
        id: task.id,
        column: task.closest(".task_section").id.replace("_task_section", "")
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
