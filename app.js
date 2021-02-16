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
        app.sum();

        const form = document.querySelector('#addTodo');
        form.addEventListener('submit', app.addTodo);
        
        app.container.addEventListener('click', app.setStatus);
        app.container.addEventListener('input', app.setPrice);
        app.container.addEventListener('input', app.setQuantity);
        app.container.addEventListener('click', app.handleDelete);

    },

    handleDelete: e => {
        if(!e.target.matches('i.fa-trash')) return;
        
        app.Tasks = app.Tasks.filter((task) => task.id !== parseInt(e.target.dataset.key)
            );
            localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
            console.log(app.Tasks);
            app.sum();
            app.populateList(app.Tasks, app.container);
    },

    setPrice: e => {
        if(e.target.dataset.name !== 'price' || !parseInt(e.target.value)) return;
        if(e.target.value == ''){
            e.target.value = 0;
        }
        let el = e.target;
        let index = el.dataset.index;
        let newPrice = el.value;
        app.Tasks[index].price = newPrice;
        localStorage.setItem('listTasks', JSON.stringify(app.Tasks));
        app.sum();
    },
    
    setQuantity: e => {
        if(e.target.dataset.name !== 'quantity' || !parseInt(e.target.value)) return;
        if(e.target.value == ''){
            e.target.value = 0;
        }
        let el = e.target;
        let index = el.dataset.index;
        let newQuantity = el.value;
        app.Tasks[index].quantity = newQuantity;
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
        console.log(el);
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
            app.sum;
            app.populateList(app.Tasks, app.container);
            e.target.children[0].value = '';
            console.log('Ajout');
        }; 
    },

    getId: () => {
        return JSON.parse(localStorage.getItem('listTasks')) != null ? JSON.parse(localStorage.getItem('listTasks')).length
        : 0;
    },

    populateList: (array = [], parentElement) => {
       
        parentElement.innerHTML = array.map((todo, i) => {
            let className = todo.status ? 'todo active' : 'todo';
            return (   
            `<div class="${className}" id="${todo.id}">
                <div class="content">
                    <input type="checkbox" ${todo.status ? 'checked' : ''} data-index="${todo.id}">
                    <p>${todo.label}</p>
                    <button class="icon-trash"><i data-key="${todo.id}" class="fas fa-trash"></i></button>
                </div>
                <div class="input">
                    <div class="price">
                        <input type="number" data-name="price" data-index="${todo.id}" value="${todo.price}">
                        <i class="fas fa-euro-sign"></i>
                    </div>
                    <div class="quantity">
                        <input type="number" data-name="quantity" data-index="${todo.id}" value="${todo.quantity}">
                        <span>Qté</span>
                    </div>
                </div>
            </div>`
            );
        }).join('');
    }
}
window.addEventListener('DOMContentLoaded', app.init);