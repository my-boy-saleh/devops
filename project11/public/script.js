// public/script.js
async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task._id);

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value;
    if (taskName) {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: taskName }),
        });
        taskInput.value = '';
        fetchTasks();
    }
}

async function deleteTask(taskId) {
    await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
    });
    fetchTasks(); // Refresh the task list after deletion
}

// Initial fetch
fetchTasks();
