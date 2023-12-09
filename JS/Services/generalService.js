'use strict';

//Every http method will be here...

const ProcessGet = async (pRouterName, pParams) => {

    let result = null;

    // await axios({
    //     method: 'get',
    //     url: apiUrl + pRouterName,
    //     responseType: 'json',
    //     params: pParams
    // })
    //     .then((res) => {
    //         result = res.data;
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    let requestOptionsFetch = {
        method: 'GET',
        redirect: 'follow'
    }

    let url = apiUrl + pRouterName + '?' + new URLSearchParams(pParams);

    await fetch(url, requestOptionsFetch)
        .then(async res => {
            let data = await res.json();
            result = data;
        }).catch((error) => {
            console.log(error);
        });
    return result;
}

const ProcessPost = async (pRouterName, pData, pSubdocuments) => {
    let res = await ProcessAction('POST', pRouterName, pData);

    if (pRouterName == '/RegisterPerson') {
        if (res.result == false) {
            switch (res.error.code) {
                case 11000:
                    res.msg = 'No se pudo registrar al usuario ya que existe un usuario con esa mismo identificacion o correo.';
                    console.log('registro error 11000 == same values');
                    break;
                default:
                    break;
            }
        } else {
            // let cardData = {
            //     '_id': res.resultDB._id,
            //     'paymentMethods': pSubdocuments
            // }
            // let resCardNumber = await ProcessAction('POST', '/RegisterPaymentMethod', cardData);
            // console.log('/RegisterPaymentMethod', resCardNumber);
        }
    }
    return res;
}

const ProcessPut = async (pRouterName, pData, pSubdocuments) => {
    let res = await ProcessAction('PUT', pRouterName, pData);
    if (pRouterName == '/UpdatePerson') {
        if (res.result == false) {
            switch (res.error.code) {
                case 11000:
                    res.msg = 'No se pudo actualizar al usuario ya que existe un usuario con esa misma identificacion o correo.';
                    console.log('Actualizacion error 11000 == same values');
                    break;
                default:
                    break;
            }
        } else {
            // let cardData = {
            //     '_id': pData._id,
            //     'paymentMethods': pSubdocuments
            // }
            // let resCardNumber = await ProcessAction('POST', '/RegisterPaymentMethod', cardData);
            // console.log('/RegisterPaymentMethod', resCardNumber);
        }
    }
    return res;
}

const ProcessDelete = async (pRouterName, pData) => {
    let res = await ProcessAction('DELETE', pRouterName, pData);
    return res;
}

const ProcessAction = async (pMethod, pRouterName, pData) => {
    let result = null;
    let headersOptionFetch = new Headers();
    headersOptionFetch.append('Content-Type', 'application/json');

    let requestOptionsFetch = {
        method: pMethod,
        redirect: 'follow',
        body: JSON.stringify(pData),
        headers: headersOptionFetch
    }

    let url = apiUrl + pRouterName;

    await fetch(url, requestOptionsFetch)
        .then(async res => {
            let data = await res.json();
            result = data;
        }).catch((error) => {
            console.log(error);
        });
    return result;
}

const SetActiveSesion = (pProfilData) => {
    localStorage.setItem('ActiveSesionData', JSON.stringify(pProfilData));
    //sessionStorage.setItem('DatosSesionActiva', JSON.stringify(pDatosPerfil));
};

const CleanActiveSession = () => {
    localStorage.removeItem('ActiveSesionData');
};

const CleanAll = () => {
    localStorage.clear();
};

const GetSesionActiva = () => {
    let dataLocalStorage = localStorage.getItem('ActiveSesionData');
    let result = JSON.parse(dataLocalStorage);
    return result;
};
const SignOut = () => {
    CleanActiveSession();
    location.href = 'login.html';
}