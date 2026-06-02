const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

const filterButtons = document.querySelectorAll(".filters button");

let todos = getTodos();
let currentFilter = "all";

function renderTodos() {
  todoList.innerHTML = "";
  
  // NEW FEATURE BY TEAM
  console.log("Rendering tasks updated by team");

  const filteredTodos = todos.filter((todo) => {

    if (currentFilter === "active") {
      return !todo.completed;
    }

    if (currentFilter === "completed") {
      return todo.completed;
    }

    return true;
  });

  filteredTodos.forEach((todo) => {

    const li = document.createElement("li");

    li.className = "todo-item";

    li.innerHTML = `
      <div class="todo-content">

        <input
          type="checkbox"
          ${todo.completed ? "checked" : ""}
          onchange="toggleTodo(${todo.id})"
        />

        <span class="${todo.completed ? "completed" : ""}">
          ${todo.text}
        </span>

      </div>

      <button
        class="delete-btn"
        onclick="deleteTodo(${todo.id})"
      >
        מחק
      </button>
    `;

    todoList.appendChild(li);
  });
}

function addTodo(text) {

  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(newTodo);

  saveTodos(todos);

  renderTodos();
}

function deleteTodo(id) {

  todos = todos.filter((todo) => {
    return todo.id !== id;
  });

  saveTodos(todos);

  renderTodos();
}

function toggleTodo(id) {

  todos = todos.map((todo) => {

    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }

    return todo;
  });

  saveTodos(todos);

  renderTodos();
}

todoForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const value = todoInput.value.trim();

  if (!value) {
    return;
  }

  addTodo(value);

  todoInput.value = "";
});

filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTodos();
  });
});

renderTodos();