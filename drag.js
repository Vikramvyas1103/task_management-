// Define a function to add drag-and-drop behavior to tasks
function enableDragAndDrop() {
  const draggables = document.querySelectorAll(".task");
  const droppables = document.querySelectorAll(".swim-lane");

  draggables.forEach((task) => {
    task.draggable = true;

    task.addEventListener("dragstart", (e) => {
      task.classList.add("is-dragging");
      e.dataTransfer.setData("text/plain", task.id);
    });

    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  });

  droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();

      const curTaskId = e.dataTransfer.getData("text/plain");
      const curTask = document.getElementById(curTaskId);

      const bottomTask = insertAboveTask(zone, e.clientY);
      const curTaskParent = curTask.parentElement;

      if (!bottomTask) {
        zone.appendChild(curTask);
      } else {
        zone.insertBefore(curTask, bottomTask);
      }

      // Update the task status (e.g., "TODO," "Doing," "Done") based on the lane
      const newStatus = zone.id; // Assuming your lane IDs correspond to status
      updateTaskStatus(curTaskId, newStatus);
    });
  });

  const insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
      const { top } = task.getBoundingClientRect();

      const offset = mouseY - top;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
      }
    });

    return closestTask;
  };

  // Update the task status in the database using a fetch request
async function updateTaskStatus(taskId, newStatus) {
  const data = {
    status: newStatus,
  };

  try {
    const response = await fetch(`/update/${taskId}`, { // Replace with your actual update route
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Error updating task status.");
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}


// Call the function to enable drag-and-drop behavior when the page loads
window.addEventListener("load", enableDragAndDrop);}
