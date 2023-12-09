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

let btnRegistercard = document.getElementById('business-register-button');
let cardNumber = document.getElementById('payment-method-number');
let cardName = document.getElementById('name-card');
let cardExpMonth = document.getElementById('mmEXP');
let cardexpYear = document.getElementById('yyEXP');
let cardCVV = document.getElementById('cvv');

let queryString, urlParams, _id, PersonDB;

//Esta funcion solamente limitara el numero de digitos de tarjetas de credito (16) y (2) para expiracion NO TOCAR
const limitDigits = (element, maxLength) => {

    let value = element.value;
    value = value.replace(/\D/g, '');

    if (value.length > maxLength) {
        value = value.slice(0, maxLength);
    }

    element.value = value;

}

const GetPersons = async () => {
    let params = {
        '_id': _id
    }

    let res = await ProcessGet('/LookForIDDB', params);
    if (res != null && res.result == true && res.PersonDB != null) {
        PersonDB = res.PersonDB;
        listCard = PersonDB.PaymentMethods;
        printCardData();
    } else {
        PrintErrorMessage(res.msg);
    }
};

const GetUrlParams = async () => {
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);

    _id = urlParams.get('_id');

    if (_id != null && _id != undefined) {
        await GetPersons();
    }
};
GetUrlParams();

const RegisterCard = async () => {
    let nCardNumber = cardNumber.value;
    let nCardName = cardName.value;
    let nCardExpMonth = cardExpMonth.value;
    let nCardexpYear = cardexpYear.value;
    let nCardCVV = cardCVV.value;
    let s_id = _id;

    if (validatePaymentMethod() == false) {
        return;
    }

    let data = {
        '_id': s_id,
        'CardName': nCardName,
        'CardNumber': nCardNumber,
        'ExpireDate': nCardExpMonth + '/' + nCardexpYear,
        'CVV': nCardCVV,
    };

    let res = await ProcessPost('/RegisterPaymentMethod', data, null);

    if (res != null && res.result == true) {
        Swal.fire({
            title: '¡Éxito!',
            text: res.msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then((res) => {
            location.href = 'register_Payment_Methods.html?_id=' + _id;
        }).catch();
    } else {
        PrintErrorMessage(res.msg);
    }
};
btnRegistercard.addEventListener('click', RegisterCard);

//Esto es para validar el form al agregar una tarjets NOTA: NO ACEPTAMOS AMEX (yet)
const validatePaymentMethod = () => {
    let nCardNumber = cardNumber.value;
    let nCardName = cardName.value;
    let nCardExpMonth = cardExpMonth.value;
    let nCardExpYear = cardexpYear.value;
    let nCardCVV = cardCVV.value;

    if (
        nCardNumber == '' || nCardNumber == null || nCardNumber == undefined || nCardNumber.length != 16 ||
        nCardName == '' || nCardName == null || nCardName == undefined ||
        nCardExpMonth > 12 || nCardExpMonth < 0 || nCardExpMonth == null || nCardExpMonth == '' || nCardExpMonth == undefined ||
        nCardExpYear > 99 || nCardExpYear < 0 || nCardExpYear == null || nCardExpYear == '' || nCardExpYear == undefined ||
        nCardCVV.length < 3 || nCardCVV == null || nCardCVV == undefined || nCardCVV == ''
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ups! Parece que alguna informacion de la tarjeta esta incorrecta:('
        });
        return false;
    }
    return true;
}

const printCardData = () => {
    let tbody = document.getElementById('tbdcards');
    tbody.innerHTML = '';

    for (let i = 0; i < listCard.length; i++) {

        let row = tbody.insertRow();
        let cardName = row.insertCell();
        let cardNumber = row.insertCell();
        let cardExpire = row.insertCell();
        let actions = row.insertCell();

        cardName.innerHTML = listCard[i].CardName;
        cardNumber.innerHTML = listCard[i].CardNumber;
        cardExpire.innerHTML = listCard[i].ExpireDate;


        let btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.innerText = 'Eliminar';
        btnDelete.title = 'Eliminar Usuario';
        btnDelete.id = 'deleteCard';
        btnDelete.onclick = async () => {
            let confirmation = false;
            await Swal.fire({
                title: 'Esta seguro que desea eliminar la tarjeta: ' + listCard[i].CardNumber + '?',
                icon: 'warning',
                confirmButtonText: 'Confirmar',
                denyButtontext: 'Cancelar',
                showDenyButton: true
            }).then((res) => {
                confirmation = res.isConfirmed;
            });

            if (confirmation == true) {
                let data = {
                    '_idPerson': PersonDB._id,
                    '_idCard': listCard[i]._id
                };

                let result = await ProcessDelete('/DeletePaymentMethod', data);

                if (result != null && result.result == true) {
                    PrintSuccessMessage(result.msg);
                } else {
                    PrintErrorMessage(result.msg);
                }

                await GetUrlParams();
            }
        };

        let divBtns = document.createElement('div');
        divBtns.appendChild(btnDelete);

        actions.appendChild(divBtns);
    }
};

