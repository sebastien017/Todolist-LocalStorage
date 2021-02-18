const app = {
    defaultPrice: 0,
    defaultQuantity: 1,
    container: document.querySelector('#container-body .todos'),
    todo: document.querySelector('#container-body .todos .todo'),
    footer: document.querySelector('#container footer p'),
    Tasks: JSON.parse(localStorage.getItem('listTasks')) || [],
    
    init: () => {
        console.log('init lancée');
        app.populateList(app.Tasks, app.container);
        const form = document.querySelector('#addTodo');
        form.addEventListener('submit', app.addTodo);
        
        app.container.addEventListener('click', app.setStatus);
        app.container.addEventListener('input', app.setPrice);
        app.container.addEventListener('input', app.setQuantity);
        app.container.addEventListener('click', app.handleDelete);
        app.sum();
    },
    
    
    setPrice: e => {
        if(e.target.dataset.name !== 'price' || !parseInt(e.target.value)) return;
        let newPrice = e.target.value;
        app.Tasks[e.target.dataset.index].price = newPrice;
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.sum();
    },
    
    setQuantity: e => {
        if(e.target.dataset.name !== 'quantity' || !parseInt(e.target.value)) return;
        let newQuantity = e.target.value;
        app.Tasks[e.target.dataset.index].quantity = newQuantity;
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.sum();
    },
    
    total: () => {
        return app.Tasks.map((task) => task.price * task.quantity); 
    },
    
    sum: () => {
        app.total().length !== 0 ? 
            app.footer.textContent = [...app.total()].reduce((acc, cur) => acc + cur)
            : app.footer.textContent = 0;
    },
    

    setStatus: e => {
        if(!e.target.matches('input[type=checkbox]')) return;
        let el = e.target;
        let index = el.dataset.index;
        app.Tasks[index].status = !app.Tasks[index].status;
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.populateList(app.Tasks, app.container);
    },

    addTodo: (e) => {
        e.preventDefault();
        let id = app.getId(); 
        const label = document.querySelector('#task').value.toString().trim();
        if(label != ''){
            
            let newTask = {
                id: id++,
                label,
                price: 0,
                quantity: 1,
                status: false
            }
            app.Tasks.push(newTask);
            localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
            app.sum();
            app.populateList(app.Tasks, app.container);
            e.target.children[0].value = '';
        }; 
    },

    getId: () => {
        return JSON.parse(localStorage.getItem('listTasks')) != null ? JSON.parse(localStorage.getItem('listTasks')).length
        : 0;
    },

    removeTags: (string, array) => {
        return array ? string.split("<").filter(function(val){ return f(array, val); }).map(function(val){ return f(array, val); }).join("") : string.split("<").map(function(d){ return d.split(">").pop(); }).join("");
        function f(array, value){
          return array.map(function(d){ return value.includes(d + ">"); }).indexOf(true) != -1 ? "<" + value : value.split(">")[1];
        }
      },

    populateList: (array = [], parentElement) => {
        
        parentElement.innerHTML = array.map((todo) => {
            let className = todo.status ? 'todo active' : 'todo';
            let value = app.removeTags(todo.label);
            return (   
                `<div class="${className}" id="${todo.id}">
                <div class="content">
                    <input type="checkbox" ${todo.status ? 'checked' : ''} data-index="${todo.id}">
                    <p>${value}</p>
                    <button class="icon-trash"><i data-key="${todo.id}" class="fas fa-trash"></i></button>
                </div>
                <div class="input">
                    <div class="price">
                        <input type="number" data-name="price" data-index="${todo.id}" value="${todo.price}">
                        <span>€</span>
                    </div>
                    <div class="quantity">
                    <input type="number" data-name="quantity" data-index="${todo.id}" value="${todo.quantity}">
                        <span>Qté</span>
                    </div>
                    </div>
            </div>`
            );
        }).join('');
    },


    handleDelete: e => {
        if(!e.target.matches('i.fa-trash')) return;
        for(let i = 0; i < app.Tasks.length; i++){
            if(app.Tasks[i].id === parseInt(e.target.dataset.key)){
                app.Tasks.splice(i, 1);
            }
            
        }
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.populateList(app.Tasks, app.container);
        app.sum();
    },
}
window.addEventListener('DOMContentLoaded', app.init);