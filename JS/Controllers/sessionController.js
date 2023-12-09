'use strict';

const IdentifyLoggedUser = () => {
    let result = GetSesionActiva();

    if(result != null){
        document.getElementById('adminController').innerHTML = 'Que bueno verte de nuevo ' + result.Name;
    }
}
IdentifyLoggedUser();