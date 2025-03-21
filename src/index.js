import './index.css';

document.addEventListener("DOMContentLoaded", function () {
    const taskSections = {
        todo: document.getElementById("todo_task_section"),
        inprogress: document.getElementById("inprogress_task_section"),
        done: document.getElementById("done_task_section")
    };

    let taskCounter = parseInt(localStorage.getItem('taskCounter')) || 115;

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        createTaskCard(task.title, task.id, task.icon, task.color, task.column);
        

        // Get the last added task in that section
        const taskSection = taskSections[task.column];
        const lastTask = taskSection.lastElementChild;
        const titleElement = lastTask.querySelector(".task_headline span:nth-child(2)");
        const idElement = lastTask.querySelector(".task_headline .task-id");
        
        console.log("hukapan"+  taskSection);
        if (task.column === "done") {
            if (titleElement) titleElement.style.textDecoration = "line-through";
            if (idElement) idElement.style.textDecoration = "line-through";
        } else {
            if (titleElement) titleElement.style.textDecoration = "line-through";
            if (idElement) idElement.style.textDecoration = "none";
        }
    });

    ["new_task_todo", "new_task_inprogress", "new_task_done"].forEach(btnId => {
        const button = document.getElementById(btnId);
        button.addEventListener('click', function () {
            const columnKey = btnId.split("new_task_")[1];
            createNewTask(taskSections[columnKey], columnKey);
        });
    });

    ["new_task_todo", "new_task_inprogress", "new_task_done"].forEach(btnId => {
        const button = document.getElementById(btnId);
        button.addEventListener('click', function () {
            const columnKey = btnId.split("new_task_")[1];
            createNewTask(taskSections[columnKey], columnKey);
        });
    });

    function createNewTask(section, columnKey) {
        const taskCard = document.createElement("div");
        taskCard.className = "task";
        taskCard.setAttribute("draggable", "true");

        const taskHeadline = document.createElement("div");
        taskHeadline.className = "task_headline";

        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Enter task title and press Enter";
        inputField.classList.add("task_input_style");

        taskHeadline.appendChild(inputField);

        const taskId = `TASK-${taskCounter}`;

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

        taskCard.appendChild(taskHeadline);
        taskCard.appendChild(taskFooter);
        section.appendChild(taskCard);

        inputField.focus();

        inputField.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                const taskTitle = inputField.value.trim();
                if (taskTitle === "") {
                    alert("Please enter a task title.");
                    return;
                }

                const titleSpan = document.createElement("span");
                titleSpan.textContent = taskTitle;
                taskHeadline.innerHTML = "";
                taskHeadline.appendChild(titleSpan);

                const icon = iconButton.dataset.icon || "clipboard-check";
                const color = iconButton.dataset.color || "text-info";

                savedTasks.push({ title: taskTitle, id: taskId, icon: icon, color: color, column: columnKey });
                localStorage.setItem("tasks", JSON.stringify(savedTasks));

                taskCounter++;
                localStorage.setItem("taskCounter", taskCounter);
            }
        });

        enableDragEvents(taskCard);
    }

    function createTaskCard(title, id, icon = "clipboard-check", color = "text-info", columnKey = "todo") {
        const taskCard = document.createElement("div");
        taskCard.className = "task";
        taskCard.setAttribute("draggable", "true");

        const taskHeadline = document.createElement("div");
        taskHeadline.className = "task_headline";
        const titleSpan = document.createElement("span");
        titleSpan.textContent = title;
        taskHeadline.appendChild(titleSpan);

        const taskFooter = document.createElement("div");
        taskFooter.className = "task_footer";

        const idSpan = document.createElement("span");
        idSpan.textContent = id;
        idSpan.classList.add("task-id");

        const iconEl = document.createElement("i");
        iconEl.className = `bi bi-${icon} ${color}`;

        const profileBtn = document.createElement("button");
        profileBtn.className = "profile-btn";
        profileBtn.innerHTML = '<img src="profile-pic.png" class="membr_profile_img small-profile">';

        taskFooter.appendChild(idSpan);
        taskFooter.appendChild(iconEl);
        taskFooter.appendChild(profileBtn);

        taskCard.appendChild(taskHeadline);
        taskCard.appendChild(taskFooter);
        taskSections[columnKey]?.appendChild(taskCard);

        enableDragEvents(taskCard);
    }

    function enableDragEvents(task) {
        if (!task.id) {
            task.id = "task_" + Date.now();
        }

        task.setAttribute("draggable", "true");

        task.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("text/plain", task.id);
        });
    }

    Object.entries(taskSections).forEach(([key, section]) => {
        section.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        section.addEventListener("drop", function (e) {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            const draggedTask = document.getElementById(taskId);

            if (draggedTask instanceof Node) {
                section.appendChild(draggedTask);
                const titleElement = draggedTask.querySelector(".task_headline span");
                const idElement = draggedTask.querySelector(".task_footer .task-id");

                if (key === "done") {
                    if (titleElement) {
                        titleElement.style.textDecoration = "line-through";
                    }
                    if (idElement) {
                        idElement.style.textDecoration = "line-through";
                    }
                } else {
                    if (titleElement) {
                        titleElement.style.textDecoration = "none";
                    }
                    if (idElement) {
                        idElement.style.textDecoration = "none";
                    }
                }
                saveAllTasks();
            }
        });
    });

    function saveAllTasks() {
        const tasksData = [];
        Object.entries(taskSections).forEach(([key, section]) => {
            section.querySelectorAll(".task").forEach(task => {
                const title = task.querySelector(".task_headline span")?.textContent || "";
                const id = task.querySelector(".task_footer .task-id")?.textContent || "";
                const iconClass = task.querySelector(".task_footer i")?.classList[1]?.replace("bi-", "") || "clipboard-check";
                const colorClass = task.querySelector(".task_footer i")?.classList[2] || "text-info";
                tasksData.push({ title, id, icon: iconClass, color: colorClass, column: key });
                console.log({ title, id, icon: iconClass, color: colorClass, column: key });
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasksData));
    }
});