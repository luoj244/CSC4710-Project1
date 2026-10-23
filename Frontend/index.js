document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5050/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

const registerBtn = document.querySelector('#register-btn');
registerBtn.onclick = function (){
    const username = document.querySelector('#reg-username').value;
    const password = document.querySelector('#reg-password').value;
    const firstname = document.querySelector('#reg-firstname').value;
    const lastname = document.querySelector('#reg-lastname').value;
    const salary = document.querySelector('#reg-salary').value;
    const age = document.querySelector('#reg-age').value;
    const message = document.querySelector('#register-message');

    fetch('http://localhost:5050/register', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            salary: salary,
            age: age
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.data && data.data.error){
            message.textContent = "Registration failed: " + data.data.error;
        } else {
            message.textContent = "Registered successfully: " + data.data.username;
            document.querySelector('#reg-username').value = "";
            document.querySelector('#reg-password').value = "";
            document.querySelector('#reg-firstname').value = "";
            document.querySelector('#reg-lastname').value = "";
            document.querySelector('#reg-salary').value = "";
            document.querySelector('#reg-age').value = "";
        }
    })
    .catch(err => {
        message.textContent = "Registration error.";
        console.log(err);
    });
}

const signinBtn = document.querySelector('#signin-btn');
signinBtn.onclick = function (){
    const username = document.querySelector('#signin-username').value;
    const password = document.querySelector('#signin-password').value;
    const message = document.querySelector('#signin-message');

    fetch('http://localhost:5050/signin', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.data && data.data.success){
            message.textContent = "Welcome, " + data.data.user.firstname + " " + data.data.user.lastname + "!";
            document.querySelector('#signin-username').value = "";
            document.querySelector('#signin-password').value = "";
        } else {
            message.textContent = (data.data && data.data.message) ? data.data.message : "Sign-in failed.";
        }
    })
    .catch(err => {
        message.textContent = "Sign-in error.";
        console.log(err);
    });
}

function loadUsersTable(data){
    const table = document.querySelector('#users-table tbody');
    if(!data || data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";
    data.forEach(function (user){
         tableHtml += "<tr>";
         tableHtml +=`<td>${user.username}</td>`;
         tableHtml +=`<td>${user.firstname}</td>`;
         tableHtml +=`<td>${user.lastname}</td>`;
         tableHtml +=`<td>${user.salary}</td>`;
         tableHtml +=`<td>${user.age}</td>`;
         tableHtml +=`<td>${user.registerday ? new Date(user.registerday).toLocaleDateString() : ''}</td>`;
         tableHtml +=`<td>${user.signintime ? new Date(user.signintime).toLocaleString() : 'Never'}</td>`;
         tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
}

document.querySelector('#search-name-btn').onclick = function (){
    const firstname = document.querySelector('#search-firstname').value;
    const lastname = document.querySelector('#search-lastname').value;
    const params = new URLSearchParams();
    if(firstname) params.append('firstname', firstname);
    if(lastname) params.append('lastname', lastname);
    fetch('http://localhost:5050/users/search/name?' + params.toString())
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

document.querySelector('#search-userid-btn').onclick = function (){
    const username = document.querySelector('#search-userid').value;
    fetch('http://localhost:5050/users/search/userid/' + encodeURIComponent(username))
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

document.querySelector('#search-salary-btn').onclick = function (){
    const min = document.querySelector('#salary-min').value;
    const max = document.querySelector('#salary-max').value;
    fetch('http://localhost:5050/users/search/salary?min=' + min + '&max=' + max)
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

document.querySelector('#search-age-btn').onclick = function (){
    const min = document.querySelector('#age-min').value;
    const max = document.querySelector('#age-max').value;
    fetch('http://localhost:5050/users/search/age?min=' + min + '&max=' + max)
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

document.querySelector('#search-after-btn').onclick = function (){
    const userid = document.querySelector('#after-userid').value;
    fetch('http://localhost:5050/users/search/after/' + encodeURIComponent(userid))
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

document.querySelector('#search-never-btn').onclick = function (){
    fetch('http://localhost:5050/users/search/never-signed-in')
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

document.querySelector('#search-sameday-btn').onclick = function (){
    const userid = document.querySelector('#sameday-userid').value;
    fetch('http://localhost:5050/users/search/same-day/' + encodeURIComponent(userid))
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

document.querySelector('#search-today-btn').onclick = function (){
    fetch('http://localhost:5050/users/search/today')
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
}

const addBtn = document.querySelector('#add-name-btn');
addBtn.onclick = function (){
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5050/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

let rowToDelete;

// Delete/Edit buttons are created later, so listen on the table instead
document.querySelector('table tbody').addEventListener('click',
      function(event){
        if(event.target.className === "delete-row-btn"){
            deleteRowById(event.target.dataset.id);
            rowToDelete = event.target.parentNode.parentNode.rowIndex;
            debug("delete which one:");
            debug(rowToDelete);
        }
        if(event.target.className === "edit-row-btn"){
            showEditRowInterface(event.target.dataset.id);
        }
      }
);

function deleteRowById(id){
    fetch('http://localhost:5050/delete/' + id,
       {
        method: 'DELETE'
       }
    )
    .then(response => response.json())
    .then(
         data => {
             if(data.success){
                document.getElementById("table").deleteRow(rowToDelete);
             }
         }
    );
}

let idToUpdate = 0;

function showEditRowInterface(id){
    debug("id clicked: ");
    debug(id);
    document.querySelector('#update-name-input').value = "";
    const updateSetction = document.querySelector("#update-row");
    updateSetction.hidden = false;
    idToUpdate = id;
    debug("id set!");
    debug(idToUpdate+"");
}

const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function(){
    debug("update clicked");
    debug("got the id: ");
    debug(updateBtn.value);

    const updatedNameInput = document.querySelector('#update-name-input');

    fetch('http://localhost:5050/update',
          {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(
                  {
                    id: idToUpdate,
                    name: updatedNameInput.value
                  }
            )
          }
    )
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
        else
           debug("no update occurs");
    })
}

function debug(data)
{
    fetch('http://localhost:5050/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}

function insertRowIntoTable(data){
   debug("index.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

   let tableHtml = "<tr>";

   for(var key in data){
      if(data.hasOwnProperty(key)){
            if(key === 'dateAdded'){
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

   tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
   tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

   tableHtml += "</tr>";

    if(isTableData){
       debug("case 1");
       table.innerHTML = tableHtml;
    }
    else {
        debug("case 2");
        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data){
    debug("index.js: loadHTMLTable called.");

    const table = document.querySelector('table tbody');

    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function ({id, name, date_added}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${id}</td>`;
         tableHtml +=`<td>${name}</td>`;
         tableHtml +=`<td>${new Date(date_added).toLocaleString()}</td>`;
         tableHtml +=`<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
         tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
