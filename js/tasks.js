const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

const filterButtons = document.querySelectorAll(".filters button");

let todos = getTodos();
let currentFilter = "all";

function renderTodos() {
  todoList.innerHTML = "";

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
      <div style="display: flex; gap: 8px;">
        <button
          class="delete-btn"
          style="background: #8222f3;" 
          onclick="editTodo(${todo.id})"
        >
          ערוך
        </button>
        <button
          class="delete-btn"
          onclick="deleteTodo(${todo.id})"
        >
          מחק
        </button>
      </div>
    `;

    todoList.appendChild(li);
  });

  // הוספת כפתור "סיום" גלובלי אם יש משימות מסומנות
  renderDoneButton();
}

// פונקציה חדשה: מציגה כפתור "סיום" למטה שמנקה את המשימות שהושלמו
function renderDoneButton() {
  // בדיקה אם קיים כבר כפתור כזה כדי לא לשכפל אותו
  const existingDoneBtn = document.getElementById("clearCompletedBtn");
  if (existingDoneBtn) {
    existingDoneBtn.remove();
  }

  // בודקים אם יש לפחות משימה אחת מסומנת כ"הושלמה"
  const hasCompleted = todos.some(todo => todo.completed);

  if (hasCompleted) {
    const doneBtn = document.createElement("button");
    doneBtn.id = "clearCompletedBtn";
    doneBtn.className = "delete-btn";
    doneBtn.style.width = "100%";
    doneBtn.style.marginTop = "20px";
    doneBtn.style.padding = "14px";
    doneBtn.style.background = "#2d005f"; // צבע כהה שמתאים לניובר
    doneBtn.innerText = "סיום (נקה משימות שנבחרו)";
    
    doneBtn.onclick = clearCompletedTodos;
    
    // מחברים את הכפתור מתחת לרשימה בתוך ה-todo-box
    document.querySelector(".todo-box").appendChild(doneBtn);
  }
}

// פונקציה חדשה: מוחקת את כל המשימות המסומנות
function clearCompletedTodos() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos(todos);
  renderTodos();
}

// פונקציה חדשה: עריכת משימה קיימת
function editTodo(id) {
  const todoToEdit = todos.find(todo => todo.id === id);
  if (!todoToEdit) return;

  // פתיחת חלונית קלט פשוטה של הדפדפן עם הטקסט הנוכחי
  const newText = prompt("ערוך את המשימה:", todoToEdit.text);

  // בדיקה שהמשתמש לא לחץ ביטול ושאינו ריק
  if (newText !== null && newText.trim() !== "") {
    todoToEdit.text = newText.trim();
    saveTodos(todos);
    renderTodos();
  }
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
  todos = todos.filter((todo) => todo.id !== id);
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