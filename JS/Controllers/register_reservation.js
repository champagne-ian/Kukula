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

let businessName = document.getElementById('fBusinessName')
let quantityPerson = document.getElementById('reservation_people');
let dateFrom = document.getElementById('reservationDateFrom');
let dateTo = document.getElementById('reservationDateTo');
let reserveButton = document.getElementById('reserveButton');
let reservePrice = document.getElementById('fBusinessPrice');

let queryString, urlParams, _id, PersonDB;

const GetPersons = async () => {
    let params = {
        '_id': _id
    }

    let res = await ProcessGet('/LookForIDDB', params);
    if (res != null && res.result == true && res.PersonDB != null) {
        PersonDB = res.PersonDB;
        // listCard = PersonDB.PaymentMethods;
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

const register_reserve = async () => {
    let nBusinessName = businessName.value;
    let nQuantityPerson = quantityPerson.value;
    let nDateFrom = dateFrom.value;
    let ndateTo = dateTo.value;
    let nReserveprice = reservePrice.value;
    let s_id = _id;

    if (validate_reservatioForm() == false) {
        return;
    }

    let data = {
        '_id': s_id,
        'UserReservationName': nBusinessName,
        'UserQuantityPeople': nQuantityPerson,
        'UserDates': nDateFrom + " - " + ndateTo,
        'UserBusinessPrice': nReserveprice * nQuantityPerson
    };

    let res = await ProcessPost('/RegisterReserve', data, null);

    if (res != null && res.result == true) {
        Swal.fire({
            title: '¡Éxito!',
            text: res.msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then((res) => {
            location.href; //Agregar que hace despues, probablemente llevar al carrito
        }).catch();
    } else {
        PrintErrorMessage(res.msg);
    }
};
reserveButton.addEventListener('click', register_reserve);

const validate_reservatioForm = () => {
    let nBusinessName = businessName.value;
    let nQuantityPerson = quantityPerson.value;
    let nDateFrom = dateFrom.value;
    let nDateTo = dateTo.value;
    let nReservePrice = reservePrice.value;

    if (!nBusinessName || !nQuantityPerson || !nDateFrom || !nDateTo || !nReservePrice) {
        PrintErrorMessage("Todos los campos son obligatorios");
        return false;
    }

    if (parseInt(nQuantityPerson) <= 0) {
        PrintErrorMessage("La cantidad de personas debe ser mayor que 0");
        return false;
    }

    let currentDate = new Date();
    let startDate = new Date(nDateFrom);
    if (startDate < currentDate) {
        PrintErrorMessage("La fecha de inicio no puede ser igual o menor a hoy:(");
        return false;
    }

    let endDate = new Date(nDateTo);
    if (endDate < startDate) {
        PrintErrorMessage("La fecha de término no puede ser menor a la fecha de inicio");
        return false;
    }

    return true;
}