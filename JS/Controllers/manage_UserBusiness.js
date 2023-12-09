let businessName = document.getElementById('name-business-registry');
let businessPhotos = document.getElementById('business-pictures');
let businessPhone = document.getElementById('business-phone');
let businessAddress = document.getElementById('business-address');
let businessDescription = document.getElementById('business-description');
let businessPrice = document.getElementById('business-price');
let nState = 0;

let btnRegisterUserBusiness = document.getElementById('business-register-button');

let queryString, urlParams, _id, PersonDB;

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

const GetPersons = async () => {
    let params = {
        '_id': _id
    }

    let res = await ProcessGet('/LookForIDDB', params);
    if (res != null && res.result == true && res.PersonDB != null) {
        PersonDB = res.PersonDB;
        listCard = PersonDB.UserBusiness;
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

const RegisterUserBusiness = async () => {
    let nbusinessName = businessName.value;
    let nbusinessPhone = businessPhone.value;
    let nbusinessAddress = businessAddress.value;
    let nbusinessDescription = businessDescription.value;
    let nbusinessPrice = businessPrice.value;
    let s_id = _id;

    if (validateBusinessForm() == false) {
        return
    }

    let data = {
        '_id': s_id,
        'UserBusinessName': nbusinessName,
        'UserBusinessAddress': nbusinessAddress,
        'UserBusinessContactNumber': nbusinessPhone,
        'UserBusinessDescription': nbusinessDescription,
        'UserBusinessPrice': nbusinessPrice,
        'UserBusinessStatus': nState
    }

    let res = await ProcessPost('/RegisterUserBusiness', data, null)

    if (res != null && res.result == true) {
        Swal.fire({
            title: '¡Éxito!',
            text: res.msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then((res) => {
            location.href = 'registry_business.html?_id=' + _id;
        }).catch();
    } else {
        PrintErrorMessage(res.msg);
    }
}
btnRegisterUserBusiness.addEventListener('click', RegisterUserBusiness);

const validateBusinessForm = () => {

    let nbusinessName = businessName.value;
    // let nbusinessPhotos = document.getElementById('business-pictures');
    let nbusinessPhone = businessPhone.value;
    let nbusinessAddress = businessAddress.value;
    let nbusinessDescription = businessDescription.value;
    let nbusinessPrice = businessPrice.value;

    if (
        nbusinessName == '' || nbusinessName == null || nbusinessName == undefined ||
        // nbusinessPhotos.files.length === 0 ||
        nbusinessPhone == '' || nbusinessPhone == null || nbusinessPhone == undefined ||
        nbusinessAddress == '' || nbusinessAddress == null || nbusinessAddress == undefined ||
        nbusinessDescription == '' || nbusinessDescription == null || nbusinessDescription == undefined ||
        nbusinessPrice < 0
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ups! Parece que nos quedan espacios en blanco...'
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
        let businessName = row.insertCell();
        let businessPhone = row.insertCell();
        let businessAddress = row.insertCell();
        let businessPrice = row.insertCell();
        let businessStatus = row.insertCell();
        let actions = row.insertCell();

        businessName.innerHTML = listCard[i].UserBusinessName;
        businessPhone.innerHTML = listCard[i].UserBusinessContactNumber;
        businessAddress.innerHTML = listCard[i].UserBusinessAddress;
        businessStatus.innerHTML = GetUserBusinessStatus(listCard[i].UserBusinessStatus);
        businessPrice.innerHTML = listCard[i].UserBusinessPrice;


        let btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.innerText = 'Eliminar';
        btnDelete.title = 'Eliminar Negocio';
        btnDelete.id = 'deleteCard';
        btnDelete.onclick = async () => {
            let confirmation = false;
            await Swal.fire({
                title: 'Esta seguro que desea eliminar el negocio ' + listCard[i].businessName + '?',
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

                let result = await ProcessDelete('/DeleteUserBusiness', data);

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