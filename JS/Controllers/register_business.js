'use strict';

let businessName = document.getElementById('name-business-registry');
let businessPhotos = document.getElementById('business-pictures');
let businessPhone = document.getElementById('business-phone');
let businessAddress = document.getElementById('business-address');
let businessDescription = document.getElementById('business-description');

const validateBusinessForm = () => {

    let nbusinessName = businessName.value;
    // let nbusinessPhotos = document.getElementById('business-pictures');
    let nbusinessPhone = businessPhone.value;
    let nbusinessAddress = businessAddress.value;
    let nbusinessDescription = businessDescription.value;

    if (
        nbusinessName == '' || nbusinessName == null || nbusinessName ==  undefined ||
        // nbusinessPhotos.files.length === 0 ||
        nbusinessPhone == '' || nbusinessPhone == null || nbusinessPhone ==  undefined ||
        nbusinessAddress == '' || nbusinessAddress == null || nbusinessAddress ==  undefined ||
        nbusinessDescription == '' || nbusinessDescription == null || nbusinessDescription ==  undefined
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ups! Parece que nos quedan espacios en blanco...'
        });
    } else {
        Swal.fire({
            title: '¡Éxito!',
            text: 'Negocio registrado!',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }
}
