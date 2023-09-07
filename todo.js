var tasks = []; // An array to store the tasks
var apiUrl = "http://localhost:5000"; // The URL of the CRUD API
var databaseName = "task_management"; // The name of the MongoDB database
var collectionName = "tasks"; // The collection name in the MongoDB database

// This function is called when the "Add task" button is clicked.
function addTask() {
  var title = document.getElementById("task-title").value;
  var description = document.getElementById("task-description").value;
  var status = document.getElementById("task-status").value;

  // Create a new task object and add it to the tasks array.
  var task = {
    title: title,
    description: description,
    status: status
  };

  tasks.push(task);

  // Make a call to the CRUD API to add the new task to the database.
  var xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl + "/api/add");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(task));

  // Clear the input fields.
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
}

// This function is called when the "Edit task" button is clicked.
function editTask(id) {
  // Get the task from the database.
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl + "/api/edit/" + id);
  xhr.onload = function() {
    var taskData = JSON.parse(xhr.responseText);
    var task = taskData;

    // Display the task in the edit dialog box.
    document.getElementById("edit-task-title").value = task.title;
    document.getElementById("edit-task-description").value = task.description;
    document.getElementById("edit-task-status").value = task.status;
  };
  xhr.send();
}

// This function is called when the "Update task" button is clicked.
function updateTask() {
  var id = document.getElementById("edit-task-id").value;
  var title = document.getElementById("edit-task-title").value;
  var description = document.getElementById("edit-task-description").value;
  var status = document.getElementById("edit-task-status").value;

  // Create a new task object with the updated data
  var task = {
    _id: id,
    title: title,
    description: description,
    status: status
  };

  // Make a call to the CRUD API to update the task in the database.
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", apiUrl + "/api/update/" + id);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(task));
}

// This function is called when the "Delete task" button is clicked.
function deleteTask(id) {
  // Make a call to the CRUD API to delete the task from the database.
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", apiUrl + "/api/delete/" + id);
  xhr.send();
}

// This function is called when the page loads.
function init() {
  // Get all the tasks from the database.
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl + "/api/display");
  xhr.onload = function() {
    var tasksData = JSON.parse(xhr.responseText);
    tasks = tasksData;

    // Display the tasks in the "Tasks" section.
    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      var li = document.createElement("li");
      li.innerHTML = task.title;
      document.getElementById("tasks").appendChild(li);
    }
  };
  xhr.send();
}
