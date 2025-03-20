
import './index.css';

const tasks = document.querySelectorAll('.task');
const task_section = document.querySelectorAll('.task_section');

tasks.forEach(task => {
    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
    });
});

task_section.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        column.appendChild(dragging);
    });
});

document.querySelectorAll(".filter_checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", function() {
        let selectedTypes = Array.from(document.querySelectorAll(".filter_checkbox:checked"))
            .map(cb => cb.value);

        document.querySelectorAll(".task").forEach(task_card => {
            task_card.style.display = selectedTypes.includes(task_card.dataset.type) ? "block":"none";
            
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    let toggleBtn = document.querySelector(".slider_collaps_button");
    let sidebar = document.querySelector(".sidebar");
    let kanbanBoard = document.querySelector(".body_of_board");
    let toggleIcon = document.querySelector(".slider_collaps_button i");

    if (!toggleBtn || !sidebar || !kanbanBoard || !toggleIcon) {
        console.error("One or more required elements are missing from the DOM.");
        return;
    }

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");

        // Adjust Kanban board width
        kanbanBoard.style.width = sidebar.classList.contains("collapsed") 
            ? "calc(100% - 85px)" 
            : "calc(100% - 250px)";

        // Toggle button icon
        if (sidebar.classList.contains("collapsed")) {
            toggleIcon.classList.remove("bi-chevron-double-left");
            toggleIcon.classList.add("bi-chevron-double-right");
        } else {
            toggleIcon.classList.remove("bi-chevron-double-right");
            toggleIcon.classList.add("bi-chevron-double-left");
        }
    });
});



