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

let queryString, urlParams, _id, PersonDB;
let paybtn = document.getElementById('confirmPay');

const GetPersons = async () => {
    let params = {
        '_id': _id
    }

    let res = await ProcessGet('/LookForIDDB', params);
    if (res != null && res.result == true && res.PersonDB != null) {
        PersonDB = res.PersonDB;
        listCC = PersonDB.PaymentMethods;
        listCard = PersonDB.UserReservations;
        printReservations();
        loadCreditCards();
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

const printReservations = () => {
    let tbody = document.getElementById('tbdReservations');
    let tfoot = document.getElementById('tftTotal');
    tbody.innerHTML = '';

    let total = 0;

    for (let i = 0; i < listCard.length; i++) {
        let row = tbody.insertRow();
        let reservationName = row.insertCell();
        let reservationDates = row.insertCell();
        let reservationTotal = row.insertCell();

        reservationName.innerHTML = listCard[i].UserReservationName;
        reservationDates.innerHTML = listCard[i].UserDates;
        reservationTotal.innerHTML = "$" + listCard[i].UserBusinessPrice;

        total += parseFloat(listCard[i].UserBusinessPrice);

    }

    tfoot.innerHTML = `<tr><td colspan="2">Total a pagar:</td><td>$${total.toFixed(2)}</td></tr>`;
};

const loadCreditCards = () => {
    let creditCardOptions = document.getElementById('creditCardOptions');
    creditCardOptions.innerHTML = ''; // Limpiar opciones existentes

    for (let i = 0; i < listCC.length; i++) {
        let cardOption = document.createElement('input');
        cardOption.type = 'radio';
        cardOption.name = 'creditCardOption';
        cardOption.value = i; //identificar la tarjeta seleccionada
        cardOption.addEventListener('change', () => onCreditCardSelected(i)); // Llama a la función cuando se selecciona una tarjeta

        let cardLabel = document.createElement('label');
        cardLabel.innerHTML = `
            ${listCC[i].CardName} - ${listCC[i].CardNumber} - Exp: ${listCC[i].ExpireDate}
        `;

        creditCardOptions.appendChild(cardOption);
        creditCardOptions.appendChild(cardLabel);
        creditCardOptions.appendChild(document.createElement('br'));
    }
};

const payReservations = async () => {
    const confirmPayment = await Swal.fire({
        title: '¿Estás seguro de que quieres realizar el pago?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, realizar pago'
    });

    if (!confirmPayment.isConfirmed) {
        return;
    }

    if (!validateCreditCardSelection()) {
        await Swal.fire({
            icon: 'warning',
            title: 'Selecciona una tarjeta de crédito antes de pagar.',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    const selectedCardIndex = getSelectedCreditCardIndex();
    const selectedCard = listCC[selectedCardIndex];

    const paymentResult = await processPayment(selectedCard);

    if (paymentResult.result) {
        clearCart();
        await Swal.fire({
            icon: 'success',
            title: '¡Pago exitoso!',
            text: 'Todo listo para disfrutar! Nos vemos pronto!',
            confirmButtonColor: '#3085d6'
        });

        window.location.href = 'kukula_mainpage.html';
    } else {
        await Swal.fire({
            icon: 'error',
            title: 'Error al procesar el pago. Inténtalo de nuevo.',
            confirmButtonColor: '#3085d6'
        });
    }
};

const validateCreditCardSelection = () => {
    const selectedCardIndex = getSelectedCreditCardIndex();
    return selectedCardIndex !== -1;
};

const getSelectedCreditCardIndex = () => {
    const radioButtons = document.getElementsByName("creditCardOption");
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            return parseInt(radioButtons[i].value);
        }
    }
    return -1;
};

//Comunicarse con el backend
const processPayment = async (selectedCard) => {
    const paymentData = {
        _idPerson: _id,
        selectedCard: selectedCard
    };

    const response = await ProcessDelete('/PayReservations', paymentData);
    return response;
};

const clearCart = () => {
    listCard = [];
    printReservations();

};

paybtn.addEventListener('click', payReservations);