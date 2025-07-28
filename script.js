// Get references to the HTML elements
const taskInput = document.querySelector('#new-task');
const addButton = document.querySelector('.add-button');
const taskList = document.querySelector('#task-list');
const checkbox = document.querySelector('.checkbox');
const allButton = document.querySelector('.all-button');
const activeButton = document.querySelector('.active-button');
const completedButton = document.querySelector('.completed-button');

// Array of tasks in localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render all tasks in localStorage when DOM loads
window.addEventListener('DOMContentLoaded', function(event) {
  tasks.forEach(task => {
    renderTask(task);
  });
});

// Add event listener to the add button
addButton.addEventListener('click', function(event) {
  // Add task to tasks list
  const task = {
  text: taskInput.value,
  completed: false
  };
  tasks.push(task); 
  // Update the localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // Don't add empty tasks
  if(taskInput.value === '') { return; }
  else { renderTask(task); }
});

function renderTask(task) {
  // Create new <li> element for the task
  const li = document.createElement('li');
  taskList.appendChild(li);

  // Add checkbox 
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'checkbox';
  li.appendChild(checkbox);

  // Automatically empty text input
  taskInput.value = '';

  // Create span element for the text content 
  const span = document.createElement('span');
  span.textContent = task.text;
  li.appendChild(span);

  // Create a delete button for the task
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  li.appendChild(deleteButton);
  deleteButton.textContent = 'Delete';

  // Add functionality for the delete button
  deleteButton.addEventListener('click', function(event) {
    li.remove();
    tasks = tasks.filter(item => item !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  });

  // Strikethrough if task is completed
  if(task.completed) {
    const span = li.querySelector('span');
    const checkbox = li.querySelector('.checkbox')
    span.style.textDecoration = 'line-through';
    checkbox.checked = true;
  }
  
  // Add event listener to each dynamically created checkbox
  checkbox.addEventListener('change', function() {
    const li = this.closest('li');
    const span = li.querySelector('span');
    span.style.textDecoration = this.checked ? 'line-through' : 'none';
    if(this.checked) {
      tasks.forEach(task => {
        if(task.text == span.textContent) {
          task.completed = true;
          localStorage.setItem('tasks', JSON.stringify(tasks));
        }
      });
    }
    else {
      tasks.forEach(task => {
        if(task.text == span.textContent) {
          task.completed = false;
          localStorage.setItem('tasks', JSON.stringify(tasks));
        }
      });
    }
  });
}

allButton.addEventListener('click', function() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    renderTask(task);
  });
});

  activeButton.addEventListener('click', function() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      if(!task.completed) { renderTask(task); }
    });
  });

  completedButton.addEventListener('click', function() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      if(task.completed) { renderTask(task); }
    })
  })

