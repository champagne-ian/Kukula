'use strict';

let registerButton = document.getElementById('user-register-button');
let nameUser = document.getElementById('txtname');
let lastname = document.getElementById('txtlastName');
let secondLastname = document.getElementById('txtSecondlastName');
let email = document.getElementById('txtEmail');
let dateInput = document.getElementById('date');
let id = document.getElementById('txtId');
let address = document.getElementById('txtAddress');
let password = document.getElementById('txtPwd');
let confirmPassword = document.getElementById('txtConfirmPwd');
let checkbox = document.getElementById('checkbox');
let showAge = document.getElementById('showAge');
let input_id = document.getElementById('txt_id');

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

const formatDate = (date) => {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    let month = '' + (formattedDate.getMonth() + 1);
    let day = '' + formattedDate.getDate();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
};

const ChargeData = (pPerson, pBtn) => {
    if (pBtn == 'btnCreate') {
        document.getElementById('business-register-button').value = 'Registrar';
    } else {
        document.getElementById('user-register-button').value = 'Actualizar';

        nameUser.value = pPerson.Name;
        lastname.value = pPerson.FirstlastName + ' ' + pPerson.SecondlastName;
        email.value = pPerson.Email;
        showAge.value = pPerson.Age;
        dateInput.value = formatDate(pPerson.Birth);
        id.value = pPerson.Identification;
        address.value = pPerson.Address;
        password.value = pPerson.Password;
        confirmPassword.value = pPerson.ConfirmPassword;
        input_id.value = pPerson._id;
    }
};

const calcularEdad = (dateInput) => {
    const actualDate = new Date();
    const anoActual = parseInt(actualDate.getFullYear());
    const mesActual = parseInt(actualDate.getMonth()) + 1;
    const diaActual = parseInt(actualDate.getDate());

    const anoNacimiento = parseInt(String(dateInput).substring(0, 4));
    const mesNacimiento = parseInt(String(dateInput).substring(5, 7));
    const dianacimiento = parseInt(String(dateInput).substring(8, 10));

    let edad = anoActual - anoNacimiento;
    if (mesActual < mesNacimiento) {
        edad--;
    } else if (mesActual == mesNacimiento) {
        if (diaActual < dianacimiento) {
            edad--;
        }
    }
    return edad;
};

window.addEventListener('load', function () {

    dateInput.addEventListener('change', function () {
        if (this.value) {
            showAge.value = calcularEdad(this.value);
        }
        console.log(this.value);
    });

});

let queryString, urlParams, _id;
const IdentifyAction = async () => {
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);


    _id = urlParams.get('_id');
    let name = urlParams.get('name');
    console.log(name);

    if (_id != null && _id != undefined && _id == 'create') {
        ChargeData(null, 'btnCreate');
    } else {
        let params = { '_id': _id }
        let user = await ProcessGet('/LookForIDDB', params);

        if (user != null && user.result == true && user.PersonDB != null) {
            ChargeData(user.PersonDB, 'btnUpdate');
        }
        // else {
        //     PrintErrorMessage(user.msg);
        // }
    }
};

IdentifyAction();
const RegisterUserData = async () => {

    let nNameUser = nameUser.value;
    let nLastName = lastname.value;
    let nSecondLastName = secondLastname.value;
    let nEmail = email.value;
    let nAge = showAge.value;
    let nDate = dateInput.value;
    let nId = id.value;
    let nAddress = address.value;
    let nPassowrd = password.value;
    let nConfirmPassword = confirmPassword.value;
    let nState = 1;
    let nRole = 1;

    let s_id = input_id.value;

    if (validateuserForm() == false) {
        return;
    }

    let res = null;
    let dataBody = {
        '_id': s_id,
        'Name': nNameUser,
        'FirstlastName': nLastName,
        'SecondlastName': nSecondLastName,
        'Email': nEmail,
        'Birth': new Date(nDate),
        'Age': nAge,
        'Identification': nId,
        'Address': nAddress,
        'Password': nPassowrd,
        'ConfirmPassword': nConfirmPassword,
        'State': nState,
        'Role': nRole
    };

    if (s_id != null && s_id != '' && s_id != undefined) {
        res = await ProcessPut('/UpdatePerson', dataBody, null);
    } else {
        res = await ProcessPost('/RegisterPerson', dataBody, null);
    };

    if (res == null || res == undefined) {
        PrintErrorMessage('Ocurrio un error inesperado');
    } else if (res.result == false) {
        PrintErrorMessage(res.msg);
    } else {
        await GetUserslist();

        const i = usersList.findIndex(user => user.Email === nEmail);

        if (i !== -1) {
            swal.fire({
                icon: 'success',
                title: '¡Excelente!',
                text: 'Ahora, por seguridad, inicia sesion! :)',
                confirmButtonText: 'Ok'
            }).then(resSwetAlert => {
                location.href = 'login.html'
            });
        } else {
            PrintErrorMessage('No se pudo encontrar el usuario recién registrado');
        }
    }
};

const validateuserForm = () => {

    let nNameUser = nameUser.value;
    let nLastName = lastname.value;
    let nSecondLastName = secondLastname.value;
    let nEmail = email.value;
    let nDate = dateInput.value;
    let nId = id.value;
    let nAddress = address.value;
    let nPassowrd = password.value;
    let nConfirmPassword = confirmPassword.value;

    if (
        nNameUser == '' || nNameUser == null || nNameUser == undefined ||
        nLastName == '' || nLastName == null || nLastName == undefined ||
        nEmail == '' || nEmail == null || nEmail == undefined ||
        nId == '' || nId == null || nId == undefined ||
        nAddress == '' || nAddress == null || nAddress == undefined ||
        nPassowrd == '' || nPassowrd == null || nPassowrd == undefined ||
        nConfirmPassword == '' || nConfirmPassword == null || nConfirmPassword == undefined ||
        nPassowrd !== nConfirmPassword
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ups! Parece que hay informacion erronea en alguna parte:('
        });
        return false;
    }
    return true;
};

registerButton.addEventListener('click', RegisterUserData);