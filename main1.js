// MVC = Model View Controller
// View => user interface
// Model => retrieve data, store data, modify data & update the View
// Controller => manage data & handle users' actions


// IIFE
const Api =(()=>{
    const url = 'https://jsonplaceholder.typicode.com/todos';
    const getData = fetch(url).then((res) => res.json()).catch();
    const deletData = fetch(url,{method:'DELETE'})

    return {
        getData     // Promise
    }
})();

const View = (()=>{
    let domSelector = {
        container: ".todo-container",
        inputBox: "#user-input",
        btn:"#addBtn"
    }
    
    // console.log(document.getElementsByClassName(container));
    // console.log(document.querySelector('.todo-container'));
    
    const creatTmp = (arr)=>{
        let template = '';
        arr.forEach((todo) => {
            template += `<li>
                <span>${todo.id}</span>
                <span>${todo.title}</span>
                <button id="del">Delete</button>
            </li>`;
        });
        return template;
    }
    
    const render = (ele, template)=>{
        ele.innerHTML = template;
    }

    return {
        domSelector,
        creatTmp,
        render
    }
})();

const Model = ((api, view)=>{
    const { domSelector, creatTmp, render } = view;
    const { getData } = api;

    class State{
        constructor(){
            this._todoList = [];
        }

        get getTodoList(){
            return this._todoList;
        }

        set newTodoList(newList){
            this._todoList = newList;
            // Invoking functions
            let todoContainer = document.querySelector(domSelector.container);
            
            let tmp = creatTmp(this._todoList);
            render(todoContainer, tmp);
        }
    }

    return {
        State,
        getData
    }
})(Api, View);

const Controller = ((view, model)=>{
    const { domSelector } = view;
    const { State, getData } = model;

    const state = new State();
    const init = () => {
        getData.then((data) => {
            state.newTodoList = data;
        });
    }

    // Add event listeners
    const addTodo = () => {
        const userInput = document.querySelector(domSelector.inputBox);
        const btn = document.querySelector(domSelector.btn);
        
        btn.addEventListener('click', ()=>{
            let item = {
                title: userInput.value,
                id: Math.floor(Math.random()*100) + 200
            };
            const newList = [item, ...state.getTodoList];
            state.newTodoList = newList;
            console.log(newList)
            userInput.value="";
        })
    }
    const deleteTodo = ()=>{
        // logic to delete
    }
    
    // wrap all function
    const bootstrap = ()=>{
        init();
        addTodo();
    }

    return {
        bootstrap,
    }
    
})(View, Model);

Controller.bootstrap();