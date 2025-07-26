// Get references to the HTML elements
const taskInput = document.querySelector('#new-task');
const addButton = document.querySelector('.add-button');
const taskList = document.querySelector('#task-list');

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
  const task = taskInput.value;
  tasks.push(task); 
  // Update the localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // Don't add empty tasks
  if(task === '') { return; }
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
  span.textContent = task;
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
}