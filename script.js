const apikey = 'fd6f3e35-6f87-4354-a3e2-daf349731f36';
const apihost = 'https://todo-api.coderslab.pl';

function apiListTasks() {
    return fetch(apihost + '/api/tasks',
        {
            headers : { Authorization: apikey }
            }
            ).then(
                function (resp) {
                    if(!resp.ok) {
                        alert('Error, open devTools and network page in browser and find the cause');
                    }
                    return resp.json();
                }
    )
}

document.addEventListener('DOMContentLoaded', function() {
apiListTasks().then(
    function (response) {
        response.data.forEach(
            function (task) {
                renderTask(task.id, task.title, task.description, task.status);
            }
        )
    }
)
});

function renderTask(taskId, title, description, status) {

    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center'
    section.appendChild(headerDiv);

    //lewy div (na tytuł i opis)
    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    //tytuł
    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    //opis
    const h6 = document.createElement('h6');
    h6.innerText = description;
    h6.className = 'card-subtitle text-muted';
    headerLeftDiv.appendChild(h6);

    //prawy div (na przyciski finish i delete)
    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    //przycisk finish
    if(status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'finish';
        headerRightDiv.appendChild(finishButton);
    }

    //przycisk usuń
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'delete';
    headerRightDiv.appendChild(deleteButton);

    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(
            function () {
                section.parentElement.removeChild(section);
            }
        )
    })

    //pusta lista ul
    const listGroupUl = document.createElement('ul');
    listGroupUl.className = 'list-group list-group-flush';
    section.appendChild(listGroupUl);

    apiListOperationsForTask(taskId).then(function (response) {
        response.data.forEach(function (operation) {
            renderOperation(listGroupUl, status, operation.id, operation.description, operation.timeSpent);
        });
    });

    //Dodanie operacji do zadania (ostatni div w section)
    const addOperationDiv = document.createElement('div');
    addOperationDiv.className = 'card-body';
    section.appendChild(addOperationDiv);

    //formularz w ostatnim divie w sekcji
    const formInOperationDiv = document.createElement('form');
    addOperationDiv.appendChild(formInOperationDiv);

    //div w formularzu w divie
    const divInOperationDivForm = document.createElement('div');
    divInOperationDivForm.className = 'input-group';
    formInOperationDiv.appendChild(divInOperationDivForm);

    //input - div - form - div
    const inputInOperationDivFormDiv = document.createElement('input');
    inputInOperationDivFormDiv.type = 'text';
    inputInOperationDivFormDiv.placeholder = 'Operation description';
    inputInOperationDivFormDiv.className = 'form-control';
    inputInOperationDivFormDiv.minLength = 5;
    divInOperationDivForm.appendChild(inputInOperationDivFormDiv);

    //div w div - form - div
    const divInOprDivFormDiv = document.createElement('div');
    divInOprDivFormDiv.className = 'input-group-append';
    divInOperationDivForm.appendChild(divInOprDivFormDiv);

    // przycisk dodawania operacji w div - div - form - div
    const addOprButton = document.createElement('button');
    addOprButton.className = 'btn btn-info';
    addOprButton.innerText = 'add';
    divInOprDivFormDiv.appendChild(addOprButton);

    formInOperationDiv.addEventListener('submit', function (event) {
        event.preventDefault();
        apiCreateOperationForTask(taskId, inputInOperationDivFormDiv.value).then(function (response) {
            renderOperation(listGroupUl, status, response.data.id, response.data.description, response.data.timeSpent);
            });
        inputInOperationDivFormDiv.value = '';
    });
}

function apiListOperationsForTask (taskId) {
    return fetch(apihost + "/api/tasks/" + taskId + "/operations",
        {
            headers : { Authorization: apikey }
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Error, open devTools and network page in browser and find the cause');
            }
            return resp.json();
        }
    );
}

function renderOperation (operationList, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    //operationsList to lista <ul> z <section>
    operationList.appendChild(li);

    // lewy <div> z <li>
    const descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    //<span> z lewego diva z <li>
    const timeSpan = document.createElement('span');
    timeSpan.className = 'badge badge-success badge-pill ml-2';
    timeSpan.innerText = formatTime(timeSpent);

    descriptionDiv.appendChild(timeSpan);

    if (status === "open") {

        const controlDiv = document.createElement('div');
        controlDiv.className = 'js-task-open-only';
        li.appendChild(controlDiv);

        // obsługa kliknięcia przycisku "+15m"
        const add15minButton = document.createElement('button');
        add15minButton.className = 'btn btn-outline-success btn-sm mr-2';
        add15minButton.innerText = '+15m';
        controlDiv.appendChild(add15minButton);

        // obsługa kliknięcia przycisku "+1h"
        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1h';
        controlDiv.appendChild(add1hButton);

        // obsługa kliknięcia przycisku "Delete"
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.innerText = 'Delete';
        controlDiv.appendChild(deleteButton);
    }

    function formatTime(timeSpent) {

        const hours = Math.floor(timeSpent / 60);
        const minutes = timeSpent % 60;
        if (hours > 0) {
            return hours + 'h ' + minutes + 'm';
        } else {
            return minutes + 'm';
        }
    }
}

function apiCreateTask (title, description) {
    return fetch( apihost + '/api/tasks',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Error, open devTools and network page in browser and find the cause')
                }
                return resp.json();
            }
    )
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.js-task-adding-form').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log(event.target.elements.title.value)
        apiCreateTask(event.target.elements.title.value, event.target.elements.description.value).then(
            function(response) { renderTask(response.data.id, response.data.title, response.data.description, response.data.status); }
        )
    })
});

function apiDeleteTask(taskId) {
    return fetch( apihost + '/api/tasks/' + taskId,
        {
            headers: { Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Error, open devTools and network page in browser and find the cause')
            }
            return resp.json();
        }
    )
}

function apiCreateOperationForTask(taskId, description) {
    return fetch( apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Error, open devTools and network page in browser and find the cause')
                }
                return resp.json();
            }
    )
}



