const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];

function getTodoHtml(todo, index) {
    let checked = todo.status == "completed" ? "checked" : "";
    return
    <li class="todo">
        <label for="${index}">
            <input id="${index}" onClick="updateStatus(this)" type="checkbox" ${checked}>
            <span class="${checked}">${todo.name}</span>
        </label>
        
    </li>
}