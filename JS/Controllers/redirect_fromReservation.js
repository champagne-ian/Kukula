let redirectProfile = document.getElementById('pRedirectProfile');
redirectProfile.onclick = async () => {
    await GetUserslist();

    let loggedUserString = localStorage.getItem('ActiveSesionData');

    // Verifica si existe el usuario logeado en el localStorage
    if (loggedUserString) {
        let loggedUser = JSON.parse(loggedUserString);

        // Busca al usuario logeado en la lista
        let foundUser = usersList.find(user => user._id === loggedUser._id);

        if (foundUser) {
            // Redirige con los datos del usuario logeado
            window.location.href = 'profile_data.html?_id=' + foundUser._id;
        } else {
            console.error('El usuario logeado no se encuentra en la lista.');
        }
    } else {
        console.error('No hay datos de usuario logeado en el localStorage.');
    }
};

let redirectStartKukula = document.getElementById('registry_id_start');
redirectStartKukula.onclick = async () => {
    await GetUserslist();
    let loggedUserString = localStorage.getItem('ActiveSesionData');

    // Verifica si existe el usuario logeado en el localStorage
    if (loggedUserString) {
        let loggedUser = JSON.parse(loggedUserString);

        // Busca al usuario logeado en la lista
        let foundUser = usersList.find(user => user._id === loggedUser._id);

        if (foundUser) {
            // Redirige con los datos del usuario logeado
            window.location.href = 'kukula_mainpage.html?_id=' + foundUser._id;
        } else {
            console.error('El usuario logeado no se encuentra en la lista.');
        }
    } else {
        console.error('No hay datos de usuario logeado en el localStorage.');
    }
};