
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



document.querySelector(".toggle-btn").addEventListener("click", function () {
    document.querySelector(".sidebar").classList.toggle("collapsed");
});
