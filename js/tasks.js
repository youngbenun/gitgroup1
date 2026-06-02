const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

const filterButtons = document.querySelectorAll(".filters button");

let todos = getTodos();
let currentFilter = "all";

function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    // בלשונית "פתוחות" - נציג רק משימות שלא סומנו ב-V ולא אורכבו
    if (currentFilter === "active") {
      return !todo.completed && !todo.archived;
    }

    // בלשונית "הושלמו" - נציג משימות שסומנו כהושלמו ונוקו (עברו ארכוב)
    if (currentFilter === "completed") {
      return todo.archived;
    }

    // בלשונית "הכל" - נציג את כל המשימות השוטפות שעוד לא אורכבו
    return !todo.archived;
  });

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    // אם המשימה כבר בארכיון (הושלמה ונוקתה), לא נציג לה כפתור עריכה או צ'קבוקס
    if (todo.archived) {
      li.innerHTML = `
        <div class="todo-content">
          <span class="completed" style="opacity: 0.6;">
            ✔️ ${todo.text}
          </span>
        </div>
        <button
          class="delete-btn"
          onclick="deleteTodo(${todo.id})"
        >
          מחק לתמיד
        </button>
      `;
    } else {
      // משימה רגילה (פעילה או מסומנת ב-V זמני)
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
    }

    todoList.appendChild(li);
  });

  // מציג את כפתור הסיום רק אם המשתמש נמצא בלשונית שלא מציגה כבר את הארכיון
  renderDoneButton();
}

function renderDoneButton() {
  const existingDoneBtn = document.getElementById("clearCompletedBtn");
  if (existingDoneBtn) {
    existingDoneBtn.remove();
  }

  // בודקים אם יש משימות שסומנו ב-V אבל עדיין לא אורכבו
  const hasCompletedText = todos.some(todo => todo.completed && !todo.archived);

  // נציג את הכפתור רק אם יש משימות מסומנות ואנחנו לא בלשונית "הושלמו"
  if (hasCompletedText && currentFilter !== "completed") {
    const doneBtn = document.createElement("button");
    doneBtn.id = "clearCompletedBtn";
    doneBtn.className = "delete-btn";
    doneBtn.style.width = "100%";
    doneBtn.style.marginTop = "20px";
    doneBtn.style.padding = "14px";
    doneBtn.style.background = "#2d005f"; 
    doneBtn.innerText = "סיום (העבר משימות שנבחרו ל-'הושלמו')";
    
    doneBtn.onclick = archiveCompletedTodos;
    
    document.querySelector(".todo-box").appendChild(doneBtn);
  }
}

// במקום למחוק - הפונקציה הזו מעבירה את המשימות למצב ארכיון (archived)
function archiveCompletedTodos() {
  todos = todos.map(todo => {
    if (todo.completed) {
      return { ...todo, archived: true };
    }
    return todo;
  });
  saveTodos(todos);
  renderTodos();
}

function editTodo(id) {
  const todoToEdit = todos.find(todo => todo.id === id);
  if (!todoToEdit || todoToEdit.archived) return;

  const newText = prompt("ערוך את המשימה:", todoToEdit.text);

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
    archived: false, // שדה חדש שמסמן האם המשימה הועברה להיסטוריית המושלמות
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