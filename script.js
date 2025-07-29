// Get references to the HTML elements
const taskInput = document.querySelector('#new-task');
const addButton = document.querySelector('.add-button');
const taskList = document.querySelector('#task-list');
const allButton = document.querySelector('.all-button');
const activeButton = document.querySelector('.active-button');
const completedButton = document.querySelector('.completed-button');
const clearCompletedButton = document.querySelector('#clear-completed');
const taskCount = document.querySelector('#task-count');

// Array of tasks in localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedCount = JSON.parse(localStorage.getItem('completedCount')) || 0;

// Render all tasks in localStorage when DOM loads
window.addEventListener('DOMContentLoaded', function(event) {
  tasks.forEach(task => {
    renderTask(task);
  });
  renderTaskCount();
  manageClearCompletedButton();
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
  renderTaskCount();
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
    if(task.completed) { count--; }
    manageClearCompletedButton();
    renderTaskCount();
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
          completedCount++;
          manageClearCompletedButton();
          renderTaskCount();
          localStorage.setItem('tasks', JSON.stringify(tasks));
          localStorage.setItem('completedCount', JSON.stringify(completedCount));
        }
      });
    }
    else {
      tasks.forEach(task => {
        if(task.text == span.textContent) {
          task.completed = false;
          completedCount--;
          manageClearCompletedButton();
          renderTaskCount();
          localStorage.setItem('tasks', JSON.stringify(tasks));
          localStorage.setItem('completedCount', JSON.stringify(completedCount));
        }
      });
    }
  });

  // Add event listener to each dynamically created <span> element
  span.addEventListener('dblclick', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    li.replaceChild(input, span);
    input.focus();
    cancelEdit = false;

    input.addEventListener('blur', () => {
      if(cancelEdit)
      {
        li.replaceChild(span, input);
        return;
      }
      task.text = input.value;
      span.textContent = input.value;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      li.replaceChild(span, input);
    });

    input.addEventListener('keydown', function(event) {
      const key = event.key;
      if(key == 'Enter')
      {
        cancelEdit = false;
        input.blur();
      }
      else if(key == 'Escape')
      {
        cancelEdit = true;
        input.blur();
      }
    });
  });

}

allButton.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    renderTask(task);
  });
});

activeButton.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    if(!task.completed) { renderTask(task); }
  });
});

completedButton.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    if(task.completed) { renderTask(task); }
  });
});

taskInput.addEventListener('keydown', function(event) {
  const key = event.key;
  if(key == 'Enter')
  {
    addButton.click();
    taskInput.blur();
  }
});

function renderTaskCount()
{
  if(tasks.length == 0)
  {
    taskCount.style.display = 'none';
    return;
  }
  taskCount.style.display = 'block';
  if(completedCount < 0) { completedCount = 0; }
  else if(completedCount == 1)
  {
    taskCount.innerHTML = `1 completed &#x2022; ${tasks.length - 1} left`;
  }
  else {
    taskCount.innerHTML = `${completedCount} completed &#x2022; ${tasks.length - completedCount} left`;
  }
}

clearCompletedButton.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    if(task.completed) 
    {
      tasks = tasks.filter(item => item !== task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
  tasks.forEach(task => {
    renderTask(task);
  });
  completedCount = 0;
  manageClearCompletedButton();
  renderTaskCount();
  localStorage.setItem('completedCount', JSON.stringify(completedCount));
});

function manageClearCompletedButton()
{
  if(completedCount === 0)
  {
    clearCompletedButton.style.display = 'none';
  }
  else {
    clearCompletedButton.style.display = 'block';
  }
}
