const apikey = 'fd6f3e35-6f87-4354-a3e2-daf349731f36';
const apihost = 'https://todo-api.coderslab.pl';

function apiListTasks() {
    return fetch(apihost + '/api/tasks',
        {
            headers : { Authorization: apikey}
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

    //pusta lista ul
    const listGroupUl = document.createElement('ul');
    listGroupUl.className = 'list-group list-group-flush';
    section.appendChild(listGroupUl);

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

}