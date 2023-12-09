'use strict';

let usersList = [];

const GetUserslist = async () => {
    let res = await ProcessGet('/ListPersons', null);

    if (res != null && res != false) {
        usersList = res.listPersonsDB;
        printData();
    } else {
        PrintErrorMessage(res.msg);
        return;
    }
}
GetUserslist();

const printData = () => {
    let tbody = document.getElementById('tbdUsers');
    tbody.innerHTML = '';

    for (let i = 0; i < usersList.length; i++) {

        let row = tbody.insertRow();
        let name = row.insertCell();
        let lastname = row.insertCell();
        let email = row.insertCell();
        let birth = row.insertCell();
        let age = row.insertCell();
        let id = row.insertCell();
        let address = row.insertCell();
        let state = row.insertCell();
        let actions = row.insertCell();

        name.innerHTML = usersList[i].Name;
        lastname.innerHTML = usersList[i].FirstlastName + ' ' + usersList[i].SecondlastName;
        email.innerHTML = usersList[i].Email;

        let birthDate = new Date(usersList[i].Birth.replace('Z', ''));
        birth.innerHTML = birthDate.getDate() + '/' + (birthDate.getMonth() + 1) + '/' + birthDate.getFullYear();

        age.innerHTML = usersList[i].Age;
        id.innerHTML = usersList[i].Identification;
        address.innerHTML = usersList[i].Address;
        state.innerHTML = GetState(usersList[i].State);

        let btnActivate = document.createElement('button');
        btnActivate.type = 'button';
        btnActivate.innerText = 'Activar';
        btnActivate.title = 'Activar Usuario';
        btnActivate.id = 'admin-redirect';
        btnActivate.onclick = async () => {
            let confirmation = false;
            await Swal.fire({
                title: 'Esta seguro que desea activar el usuario: ' + usersList[i].Name + '?',
                icon: 'warning',
                confirmButtonText: 'Confirmar',
                denyButtontext: 'Cancelar',
                showDenyButton: true
            }).then((res) => {
                confirmation = res.isConfirmed;
            });

            if (confirmation == true) {
                let data = {
                    '_id': usersList[i]._id,
                    'Name': usersList[i].Name,
                    'FirstlastName': usersList[i].FirstlastName,
                    'SecondlastName': usersList[i].SecondlastName,
                    'Email': usersList[i].Email
                };

                let result = await ProcessPut('/ActivateUser', data);

                if (result != null && result.result == true) {
                    PrintSuccessMessage(result.msg);
                } else {
                    PrintErrorMessage(result.msg);
                }

                await GetUserslist();
            }
        };

        let btnDisable = document.createElement('button');
        btnDisable.type = 'button';
        btnDisable.innerText = 'Inactivar';
        btnDisable.title = 'Inactivar Usuario';
        btnDisable.id = 'admin-redirect';
        btnDisable.onclick = async () => {
            let confirmation = false;
            await Swal.fire({
                title: 'Esta seguro que desea inactivar el usuario: ' + usersList[i].Name + '?',
                icon: 'warning',
                confirmButtonText: 'Confirmar',
                denyButtontext: 'Cancelar',
                showDenyButton: true
            }).then((res) => {
                confirmation = res.isConfirmed;
            });

            if (confirmation == true) {
                let data = {
                    '_id': usersList[i]._id,
                    'Name': usersList[i].Name,
                    'FirstlastName': usersList[i].FirstlastName,
                    'SecondlastName': usersList[i].SecondlastName,
                    'Email': usersList[i].Email
                };

                let result = await ProcessPut('/DisableUser', data);

                if (result != null && result.result == true) {
                    PrintSuccessMessage(result.msg);
                } else {
                    PrintErrorMessage(result.msg);
                }

                await GetUserslist();
            }
        };

        let btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.innerText = 'Eliminar';
        btnDelete.title = 'Eliminar Usuario';
        btnDelete.id = 'admin-redirect';
        btnDelete.onclick = async () => {
            let confirmation = false;
            await Swal.fire({
                title: 'Esta seguro que desea eliminar el usuario: ' + usersList[i].Name + '?',
                icon: 'warning',
                confirmButtonText: 'Confirmar',
                denyButtontext: 'Cancelar',
                showDenyButton: true
            }).then((res) => {
                confirmation = res.isConfirmed;
            });

            if (confirmation == true) {
                let data = {
                    '_id': usersList[i]._id,
                    'Name': usersList[i].Name,
                    'FirstlastName': usersList[i].FirstlastName,
                    'SecondlastName': usersList[i].SecondlastName,
                    'Email': usersList[i].Email
                };

                let result = await ProcessDelete('/DeletePerson', data);

                if (result != null && result.result == true) {
                    PrintSuccessMessage(result.msg);
                } else {
                    PrintErrorMessage(result.msg);
                }

                await GetUserslist();
            }
        };



        let divBtns = document.createElement('div');
        // divBtns.appendChild(btnEdit);
        divBtns.appendChild(btnActivate);
        divBtns.appendChild(btnDisable);
        divBtns.appendChild(btnDelete);

        actions.appendChild(divBtns);
    }
};

// const redirectToProfileData = () => {
//     location.href = 'profile_data.html?_id=' + usersList[i]._id;
// }
