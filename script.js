document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Render the tasks in the list
  function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });

    filteredTasks.forEach(task => {
      const taskElement = document.createElement('li');
      taskElement.classList.toggle('completed', task.completed);

      taskElement.innerHTML = `
        <span class="task-title" onclick="toggleTaskStatus(${task.id})">${task.title}</span>
        <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
      `;
      taskList.appendChild(taskElement);
    });
  }

  // Add a new task
  addTaskBtn.addEventListener('click', () => {
    const taskTitle = taskInput.value.trim();
    if (taskTitle) {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false,
      };
      tasks.push(newTask);
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }
  });

  // Toggle task completion
  window.toggleTaskStatus = function (taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  };

  // Delete a task
  window.deleteTask = function (taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
  };

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Set up filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(button => button.classList.remove('active'));
      btn.classList.add('active');
      renderTasks(btn.id);
    });
  });

  // Initialize the app by rendering tasks
  renderTasks();
});
