let todoItems = [];


document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoItemsRef');
    if(ref){
        todoItems = JSON.parse(ref);
        todoItems.forEach(t => {
            renderTodo(t);
        });
    }
});

const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('.js-todo-input');
    
    const text = input.value.trim();
    if(text !== ''){
        addTodo(text);
        input.value = '';
        input.focus();
    }
});

const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event =>{
    if(event.target.classList.contains('js-tick')){
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
    if(event.target.classList.contains('js-delete-todo')){
        const itemKey = event.target.parentElement.dataset.key;
        
        deleteTodo(itemKey);
    }
});

const options = document.querySelector('.options');
options.addEventListener('click', event =>{
    if(event.target.classList.contains('js-todo-delete-all')){
        deleteAll()
    }
    if(event.target.classList.contains('js-todo-done-all')){
        doneAll()
    }
})

function addTodo(text){
    const todo = {
        text,
        checked: false,
        id: Date.now()
    };
    todoItems.push(todo);
    renderTodo(todo);
}

function createTodo(todo){
    const isChecked = todo.checked ? 'done': '';
    
    const node = document.createElement("li");

    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    
    node.innerHTML = `
    <input id="${todo.id}" type="checkbox" />
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
    `;

    return node;
}

function renderTodo(todo){
    
    const node = createTodo(todo)
    
    const item = document.querySelector(`[data-key='${todo.id}']`);
    
    if(todo.deleted){
        item.remove();
        if(todoItems.length === 0) list.innerHTML = '';
        return
    }
   
    
    if(item){
        list.replaceChild(node, item);
    }else{
        list.append(node);
    }
    
    localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
    console.log(localStorage.getItem('todoItemsRef'));
}



function toggleDone(key){
    const index = todoItems.findIndex(item => item.id === Number(key));
    todoItems[index].checked = !todoItems[index].checked;
    renderTodo(todoItems[index]);
}

function deleteTodo(key){
    const index = todoItems.findIndex(item => item.id === Number(key));
    const todo = {
        deleted: true,
        ...todoItems[index]
    };

    todoItems = todoItems.filter(item => item.id !== Number(key));
    renderTodo(todo);
}

function deleteAll(){
    todoItems.map( item => {
        deleteTodo(item.id)
    })
    localStorage.clear('todoItemsRef');
}

function doneAll(){
    todoItems.map( item => {
        toggleDone(item.id)
    })
}