'use strict';

let inputUser = document.getElementById('input_user');
let inputPass = document.getElementById('input_password');

let usersList = [];
const GetUserslist = async () => {
    let res = await ProcessGet('/ListPersons', null);

    if (res != null && res != false) {
        usersList = res.listPersonsDB;
    } else {
        PrintErrorMessage(res.msg);
        return;
    }
};

const ValidateInputs = (pUser, pPass) => {
    if (pUser == null || pUser == undefined || pUser == '') {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'User is required!'
        });
        return false;
    }
    if (pPass == null || pPass == undefined || pPass == '') {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Password is required!'
        });
        return false;
    }
    return true;
};

const RedirectUser = async (PersonDB) => {
    let nameRol = GetRole(PersonDB.Role);
    if (nameRol == 'Client') {
        await GetUserslist();

        const i = usersList.findIndex(user => user.Email === inputUser.value);

        if (i !== -1) {
            swal.fire({
                icon: 'success',
                title: '¡Excelente!',
                text: '¡Bienvenido!',
                confirmButtonText: 'Ok'
            }).then(resSwetAlert => {
                location.href = 'profile_data.html?_id=' + usersList[i]._id;
            });
        }
    }
    if (nameRol != 'Client') {
        location.href = 'admin_reports.html';
    }
};

const SignIn = async () => {
    let user = inputUser.value;
    let pass = inputPass.value;

    if (ValidateInputs(user, pass) == false) {
        return;
    }

    let params = {
        'Email': user,
        'Password': pass
    };

    let res = await ProcessGet('/AuthenticateUser', params);

    if (res != null && res.result == true && res.PersonDB != null) {
        RedirectUser(res.PersonDB);
        SetActiveSesion(res.PersonDB);
    } else {
        PrintErrorMessage(res.msg);
    }
};

