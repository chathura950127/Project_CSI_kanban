import './index.css';

document.addEventListener("DOMContentLoaded", function () {
    loadColumnsFromLocalStorage();
    loadTasksFromLocalStorage();
});

let taskCounter = parseInt(localStorage.getItem('taskCounter')) || 1;
const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
const task_board_section = document.getElementById("task_board_section");
const addColumnBtn = document.getElementById("add_column_btn");
const column_add = document.getElementById("column_add");
const closePopupBtn = document.getElementById("close_popup_btn");
const saveColumnBtn = document.getElementById("save_column_btn");
const columnNameInput = document.getElementById("column_name_input");


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
    const columnId = columnName.replace(/\s+/g, "-");
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
    enableTaskSectionDrop(columnId);
}

function enableTaskSectionDrop(columnId) {
    const taskSection = document.getElementById(`${columnId}_task_section`);

    taskSection.addEventListener("dragover", (e) => e.preventDefault());
    
    taskSection.addEventListener("drop", (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const draggedTask = document.getElementById(taskId);

        if (draggedTask) {
            taskSection.appendChild(draggedTask);

            const column = taskSection.closest(".column");
            const title = draggedTask.querySelector(".task_headline");
            const taskIdElement = draggedTask.querySelector(".task-id");

            if (column && column.id.toLowerCase() === "done") {
                if (title) title.style.textDecoration = "line-through";
                if (taskIdElement) taskIdElement.style.textDecoration = "line-through";
            } else {
                if (title) title.style.textDecoration = "none";
                if (taskIdElement) taskIdElement.style.textDecoration = "none";
            }

           
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].column = columnId;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }
    });
}



function saveColumnsToLocalStorage() {
    const columns = [...document.querySelectorAll(".column")].map(column => ({
        columnId: column.id,
        columnName: column.querySelector(".column_name_section").textContent
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

    // Remove any empty open tasks
    document.querySelectorAll('.task .task_headline textarea').forEach(task => {
        const taskCard = task.closest('.task');
        taskCard.style.display = "none";
    });

    const taskCard = document.createElement("div");
    taskCard.className = "task";
    taskCard.setAttribute("draggable", "true");
    taskCard.id = `TASK-${Date.now()}`;

    // Task input
    const taskHeadline = document.createElement("div");
    taskHeadline.className = "task_headline";
    const inputField = document.createElement("textarea");
    inputField.placeholder = "Enter task title and press Enter";
    inputField.rows = 2;
    inputField.classList.add("task_input_style");
    inputField.style.overflowY = "hidden";
    inputField.addEventListener("input", function () {
        this.style.height = "auto"; 
        this.style.height = this.scrollHeight + "px"; 
    });

    taskHeadline.appendChild(inputField);

    // Task ID
    const taskId = `Task - ${taskCounter}`;

    // Task footer
    const taskFooter = document.createElement("div");
    taskFooter.className = "task_footer";

    const iconButton = document.createElement("button");
    iconButton.className = "icon-selector-btn";
    iconButton.innerHTML = '<i class="bi bi-clipboard-check text-primary"></i>';
    iconButton.dataset.icon = "clipboard-check";
    iconButton.dataset.color = "text-primary";

    const popup = document.createElement("div");
    popup.className = "icon-popup";
    popup.innerHTML = ` 
        <div class="icon-option" data-icon="clipboard-check" data-color="text-primary"><i class="bi bi-clipboard-check text-primary"></i></div>
        <div class="icon-option" data-icon="bug" data-color="text-danger"><i class="bi bi-bug text-danger"></i></div>
        <div class="icon-option" data-icon="card-list" data-color="text-success"><i class="bi bi-card-list text-success"></i></div>
    `;
    popup.style.display = "none";

    iconButton.addEventListener("click", function (e) {
        e.stopPropagation();
        popup.style.display = popup.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", () => popup.style.display = "none");

    popup.querySelectorAll(".icon-option").forEach(option => {
        option.addEventListener("click", function () {
            const icon = this.dataset.icon;
            const color = this.dataset.color;
            iconButton.innerHTML = `<i class='bi bi-${icon} ${color}'></i>`;
            iconButton.dataset.icon = icon;
            iconButton.dataset.color = color;
            popup.style.display = "none";
        });
    });

    const idSpan = document.createElement("span");
    idSpan.textContent = taskId;
    idSpan.classList.add("task-id");

    const profileBtn = document.createElement("button");
    profileBtn.className = "profile-btn";
    profileBtn.innerHTML = '<img src="profile-pic.png" class="membr_profile_img small-profile">';

    taskFooter.appendChild(idSpan);
    taskFooter.appendChild(iconButton);
    taskFooter.appendChild(popup);
    taskFooter.appendChild(profileBtn);

    // Append elements
    taskCard.appendChild(taskHeadline);
    taskCard.appendChild(taskFooter);
    section.appendChild(taskCard);

    inputField.focus();

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const taskTitle = inputField.value.trim();
            if (taskTitle === "") {
                taskCard.style.display = "none";
                return;
            }
            const titleSpan = document.createElement("span");
            titleSpan.textContent = taskTitle;
            taskHeadline.innerHTML = "";
            taskHeadline.appendChild(titleSpan);

            const icon = iconButton.dataset.icon || "clipboard-check";
            const color = iconButton.dataset.color || "text-info";

            savedTasks.push({ title: taskTitle, id: taskId, icon: icon, color: color, column: columnId });
            localStorage.setItem("tasks", JSON.stringify(savedTasks));

            taskCounter++;
            localStorage.setItem("taskCounter", taskCounter);
        }
        
        else{
            document.addEventListener("click", function (event) {
                if (!taskCard.contains(event.target)) {
                    taskCard.style.display = "none"; 
                }
            });
        }
        
    });

    enableDragEvents(taskCard);
}

function updateTaskTitleAndIdOnLoad() {
        document.querySelectorAll('.task').forEach(task => {
            const column = task.closest('.column');
            if (column) {
                const columnId = column.id.toLowerCase();
                const taskColumn = task.querySelector('.task-id').textContent.trim().toLowerCase(); 

                if (columnId === "done" || taskColumn === "done") {
                    const title = task.querySelector('.task_headline');
                    const taskId = task.querySelector('.task-id');
                    if (title) title.style.textDecoration = "line-through"; 
                    if (taskId) taskId.style.textDecoration = "line-through"; 
                }
            }
        });
   
}


function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        const section = document.getElementById(`${task.column}_task_section`);
        if (section) createTaskCard(task.title, task.id, section);
    });
    document.querySelectorAll('.task').forEach(task => {
        const column = task.closest('.column');
        if (column) {
            const columnId = column.id.toLowerCase();
            const taskColumn = task.querySelector('.task-id').textContent.trim().toLowerCase(); 


            if (columnId === "done" || taskColumn === "done") {
                const title = task.querySelector('.task_headline');
                const taskId = task.querySelector('.task-id');
                if (title) title.style.textDecoration = "line-through"; 
                if (taskId) taskId.style.textDecoration = "line-through"; 
            }
        }});
    updateTaskTitleAndIdOnLoad();
}

function createTaskCard(title, id, section) {
    const taskCard = document.createElement("div");
    taskCard.className = "task";
    taskCard.setAttribute("draggable", "true");
    taskCard.id = id;

    // Task headline
    const taskHeadline = document.createElement("div");
    taskHeadline.className = "task_headline";
    const taskTitleSpan = document.createElement("span");
    taskTitleSpan.textContent = title;
    taskTitleSpan.classList.add("task_span_style");

    taskHeadline.appendChild(taskTitleSpan);

    // Task footer
    const taskFooter = document.createElement("div");
    taskFooter.className = "task_footer";

    const idSpan = document.createElement("span");
    idSpan.textContent = id;
    idSpan.classList.add("task-id");

    const savedTask = savedTasks.find(task => task.id === id);
    const iconType = savedTask ? savedTask.icon : "clipboard-check";
    const iconColor = savedTask ? savedTask.color : "text-primary";

    const iconButton = document.createElement("button");
    iconButton.className = "icon-selector-btn";
    iconButton.innerHTML = `<i class="bi bi-${iconType} ${iconColor}"></i>`;
    iconButton.dataset.icon = iconType;
    iconButton.dataset.color = iconColor;

    const savedProfileImage = localStorage.getItem("profileImage") || "default-profile.png";
    const profileBtn = document.createElement("button");
    profileBtn.className = "profile-btn";
    profileBtn.innerHTML = `<img src="${savedProfileImage}" class="membr_profile_img small-profile">`;;

    taskFooter.appendChild(idSpan);
    taskFooter.appendChild(iconButton);
    taskFooter.appendChild(profileBtn);

    // Append elements
    taskCard.appendChild(taskHeadline);
    taskCard.appendChild(taskFooter);
    section.appendChild(taskCard);

    
    enableDragEvents(taskCard);




}

function enableDragEvents(task) {
    task.addEventListener("dragstart", (e) => e.dataTransfer.setData("taskId", task.id));

    task.addEventListener("dragover", (e) => e.preventDefault()); 
    task.addEventListener("drop", (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const draggedTask = document.getElementById(taskId);
        const targetSection = e.target.closest(".task_section");

        if (targetSection && draggedTask) {
            targetSection.appendChild(draggedTask);


            document.querySelectorAll('.task').forEach(task => {
                const column = task.closest('.column');
                if (column) {
                    const columnId = column.id.toLowerCase(); 
                    const taskColumn = task.querySelector('.task-id').textContent.trim().toLowerCase(); 
        
                    if (columnId === "done" || taskColumn === "done") {
                        const title = task.querySelector('.task_headline');
                        const taskId = task.querySelector('.task-id');
                        if (title) title.style.textDecoration = "line-through"; 
                        if (taskId) taskId.style.textDecoration = "line-through"; 
                    }
                }})


            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].column = targetSection.closest(".column").id;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }
    });
}


