const app = {
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
    },
    
    
    setPrice: e => {
        if(e.target.dataset.name !== 'price' || !parseFloat(e.target.value)) return;
        let newPrice = e.target.value;
        app.Tasks.find(task => {
            if(task.id == e.target.dataset.index){
                task.price = newPrice;
            }
        });
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.sum();
    },
    
    setQuantity: e => {
        if(e.target.dataset.name !== 'quantity' || !parseFloat(e.target.value)) return;
        let newQuantity = e.target.value;
        app.Tasks.find(task => {
            if(task.id == e.target.dataset.index){
                task.quantity = newQuantity;
            }
        });
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.sum(); 
    },
    
    
    sum: () => {
        let totalArray = app.Tasks.map((task) => task.price * task.quantity);
        if (totalArray.length > 0) {
            let total = totalArray.reduce((acc, cur) => acc + cur);
            app.footer.textContent = Math.round(total * 100) / 100;
        }else {
            app.footer.textContent = 0;
        }
    },
    

    setStatus: e => {
        if(!e.target.matches('input[type=checkbox]')) return;
        app.Tasks.find(task => {
            if(task.id == e.target.dataset.index){
                task.status = !task.status;
            }
        });
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.sum();
        app.populateList(app.Tasks, app.container);
    },

    getId: () => {
        let arrayId = [];
        if(app.Tasks.length > 0){
            for (let i = 0; i < app.Tasks.length; i++) {
                arrayId.push(app.Tasks[i].id);
            }
            return Math.max(...arrayId);
        } else {
            return 0;
        }
    },

    addTodo: (e) => {
        e.preventDefault();
        let id = app.getId();
        const label = document.querySelector('#task').value.toString().trim();
        if(label != ''){
            
            let newTask = {
                id: ++id,
                label,
                price: 0,
                quantity: 1,
                status: false
            }
            app.Tasks.push(newTask);
            localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
            app.populateList(app.Tasks, app.container);
            app.sum();
            e.target.children[0].value = '';
        }; 
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
                    <button class="icon-trash"><img src="${`assets/icons/icon-poubelle.png`}" data-key="${todo.id}" class="img-trash"></button>
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
        if(!e.target.matches('button.icon-trash img')) return;
        
        for (let i = 0; i < app.Tasks.length; i++) {
            if (app.Tasks[i].id === parseInt(e.target.dataset.key)) {
              app.Tasks.splice(i, 1);
            }
          }

        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.sum();
        app.populateList(app.Tasks, app.container);
    },
}
window.addEventListener('DOMContentLoaded', app.init);