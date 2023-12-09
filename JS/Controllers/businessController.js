'use strict';

let userBusinessList = [];

const GetUsersBusinessList = async () => {
    let res = await ProcessGet('/ListPersons', null);

    if (res != null && res != false) {
        userBusinessList = res.listPersonsDB;
        printData();
    } else {
        PrintErrorMessage(res.msg);
        return;
    }
}
GetUsersBusinessList();

const printData = () => {
    let tbody = document.getElementById('tbdUsers');
    tbody.innerHTML = '';

    for (let i = 0; i < userBusinessList.length; i++) {
        for (let j = 0; j < userBusinessList[i].UserBusiness.length; j++) {
            let row = tbody.insertRow();
            let owner = row.insertCell();
            let nBusinessName = row.insertCell();
            let contact = row.insertCell();
            let status = row.insertCell();
            let actions = row.insertCell();

            owner.innerHTML = userBusinessList[i].Name + ' ' + userBusinessList[i].FirstlastName;
            nBusinessName.innerHTML = userBusinessList[i].UserBusiness[j].UserBusinessName;
            contact.innerHTML = userBusinessList[i].UserBusiness[j].UserBusinessContactNumber;
            status.innerHTML = GetUserBusinessStatus(userBusinessList[i].UserBusiness[j].UserBusinessStatus);

            let btnActivate = document.createElement('button');
            btnActivate.type = 'button';
            btnActivate.innerText = 'Activar';
            btnActivate.title = 'Activar Negocio';
            btnActivate.id = 'admin-redirect'
            btnActivate.onclick = async () => {
                let confirmation = false;
                await Swal.fire({
                    title: '¿Está seguro que desea activar el negocio: ' + userBusinessList[i].UserBusiness[j].UserBusinessName + '?',
                    icon: 'warning',
                    confirmButtonText: 'Confirmar',
                    denyButtontext: 'Cancelar',
                    showDenyButton: true
                }).then((res) => {
                    confirmation = res.isConfirmed;
                });

                if (confirmation) {
                    let data = {
                        '_id': userBusinessList[i]._id,
                        'businessId': userBusinessList[i].UserBusiness[j]._id
                    };

                    let result = await ProcessPut('/ActivateUserBusiness', data);

                    if (result != null && result.result == true) {
                        PrintSuccessMessage(result.msg);
                    } else {
                        PrintErrorMessage(result.msg);
                    }

                    await GetUsersBusinessList();
                }
            };

            let btnDisable = document.createElement('button');
            btnDisable.type = 'button';
            btnDisable.innerText = 'Inactivar';
            btnDisable.title = 'Inactivar Negocio';
            btnDisable.id = 'admin-redirect'
            btnDisable.onclick = async () => {
                let confirmation = false;
                await Swal.fire({
                    title: '¿Está seguro que desea desactivar el negocio: ' + userBusinessList[i].UserBusiness[j].UserBusinessName + '?',
                    icon: 'warning',
                    confirmButtonText: 'Confirmar',
                    denyButtontext: 'Cancelar',
                    showDenyButton: true
                }).then((res) => {
                    confirmation = res.isConfirmed;
                });

                if (confirmation) {
                    let data = {
                        '_id': userBusinessList[i]._id,
                        'businessId': userBusinessList[i].UserBusiness[j]._id
                    };

                    let result = await ProcessPut('/DisableUserBusiness', data);

                    if (result != null && result.result == true) {
                        PrintSuccessMessage(result.msg);
                    } else {
                        PrintErrorMessage(result.msg);
                    }

                    await GetUsersBusinessList();
                }
            };


            let divBtns = document.createElement('div');
            divBtns.id = 'actionsBtnsdiv';
            divBtns.appendChild(btnActivate);
            divBtns.appendChild(btnDisable);

            actions.appendChild(divBtns);
        }
    }
};

