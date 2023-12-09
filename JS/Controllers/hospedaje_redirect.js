function updateNavLinks() {
    let loginLink = document.querySelector('.nav-bar a[href="../HTML/login.html"]');
    let registerLink = document.querySelector('.nav-bar a[href="../HTML/register_Homepage.html"]');
    let loggedUserString = localStorage.getItem('ActiveSesionData');

    if (loggedUserString) {
        // Cambiar el texto de los enlaces cuando hay un usuario logeado
        loginLink.textContent = 'Cerrar Sesion';
        // registerLink.textContent = 'Cuenta';
    } else {
        // Restaurar el texto original si no hay usuario logeado
        loginLink.textContent = 'Inicia Sesión';
        registerLink.textContent = 'Registrarse';
    }
};
updateNavLinks();

let redirectFeaturedToursRioPerdido = document.getElementById('featuredToursRioPerdido');
redirectFeaturedToursRioPerdido.onclick = async () => {

    await GetUserslist();
    let loggedUserString = localStorage.getItem('ActiveSesionData');

    // Verifica si existe el usuario logeado en el localStorage
    if (loggedUserString) {
        let loggedUser = JSON.parse(loggedUserString);

        // Busca al usuario logeado en la lista
        let foundUser = usersList.find(user => user._id === loggedUser._id);

        if (foundUser) {
            // Redirige con los datos del usuario logeado
            window.location.href = 'rio_perdido.html?_id=' + foundUser._id;
        } else {
            console.error('El usuario logeado no se encuentra en la lista.');
        }
    } else {
        console.error('No hay datos de usuario logeado en el localStorage.');
    }
};

let redirectFeaturedToursRiuGuanacaste = document.getElementById('featuredToursRiu');
redirectFeaturedToursRiuGuanacaste.onclick = async () => {

    await GetUserslist();
    let loggedUserString = localStorage.getItem('ActiveSesionData');

    // Verifica si existe el usuario logeado en el localStorage
    if (loggedUserString) {
        let loggedUser = JSON.parse(loggedUserString);

        // Busca al usuario logeado en la lista
        let foundUser = usersList.find(user => user._id === loggedUser._id);

        if (foundUser) {
            // Redirige con los datos del usuario logeado
            window.location.href = 'riu.html?_id=' + foundUser._id;
        } else {
            console.error('El usuario logeado no se encuentra en la lista.');
        }
    } else {
        console.error('No hay datos de usuario logeado en el localStorage.');
    }
};