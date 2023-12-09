'use strict';

const apiUrl = 'http://localhost:3000/API';

const PrintErrorMessage = (pMsg) => {
    swal.fire({
        icon: 'error',
        title: 'Error',
        text: pMsg
    });
}
const PrintSuccessMessage = (pMsg) => {
    swal.fire({
        icon: 'success',
        title: 'Excelente!',
        text: pMsg
    });
}

const GetRole = (pRole) => {
    switch (pRole) {
        case 0:
            return 'Admin';
        case 1:
            return 'Client';
    }
}

const GetState = (pState) => {
    switch (pState) {
        case 0:
            return 'Inactivo';

        case 1:
            return 'Activo'
    }
}

const GetUserBusinessStatus = (pState) => {
    switch (pState) {
        case 0:
            return 'Inactivo';
        case 1:
            return 'Activo'
    }
};

function formatdate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getdate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
        ].join(':')
    );
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}




