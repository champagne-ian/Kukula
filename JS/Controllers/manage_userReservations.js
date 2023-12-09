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
        listCard = PersonDB.UserReservations;
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

const printCardData = () => {
    let tbody = document.getElementById('tbdcards');
    tbody.innerHTML = '';

    for (let i = 0; i < listCard.length; i++) {

        let row = tbody.insertRow();
        let reservationName = row.insertCell();
        let reservationPeople = row.insertCell();
        let reservationDates = row.insertCell();
        let reservationTotal = row.insertCell();
        let actions = row.insertCell();

        reservationName.innerHTML = listCard[i].UserReservationName;
        reservationPeople.innerHTML = listCard[i].UserQuantityPeople;
        reservationDates.innerHTML = listCard[i].UserDates;
        reservationTotal.innerHTML = "$" + listCard[i].UserBusinessPrice;

        let btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.innerText = 'Eliminar';
        btnDelete.title = 'Eliminar Usuario';
        btnDelete.id = 'deleteCard';
        btnDelete.onclick = async () => {
            let confirmation = false;
            await Swal.fire({
                title: 'Esta seguro que desea eliminar la reserva: ' + listCard[i].UserReservationName + '?',
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
                    '_idreservation': listCard[i]._id
                };

                let result = await ProcessDelete('/DeleteUserReservation', data);

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