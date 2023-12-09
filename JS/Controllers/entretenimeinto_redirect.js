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

let redirectFeaturedToursMagaly = document.getElementById('featuredToursMagaly');
redirectFeaturedToursMagaly.onclick = async () => {

    await GetUserslist();
    let loggedUserString = localStorage.getItem('ActiveSesionData');

    // Verifica si existe el usuario logeado en el localStorage
    if (loggedUserString) {
        let loggedUser = JSON.parse(loggedUserString);

        // Busca al usuario logeado en la lista
        let foundUser = usersList.find(user => user._id === loggedUser._id);

        if (foundUser) {
            // Redirige con los datos del usuario logeado
            window.location.href = 'magaly.html?_id=' + foundUser._id;
        } else {
            console.error('El usuario logeado no se encuentra en la lista.');
        }
    } else {
        console.error('No hay datos de usuario logeado en el localStorage.');
    }
};

let redirectFeaturedToursTeatro = document.getElementById('featuredToursTeatro');
redirectFeaturedToursTeatro.onclick = async () => {

    await GetUserslist();
    let loggedUserString = localStorage.getItem('ActiveSesionData');

    // Verifica si existe el usuario logeado en el localStorage
    if (loggedUserString) {
        let loggedUser = JSON.parse(loggedUserString);

        // Busca al usuario logeado en la lista
        let foundUser = usersList.find(user => user._id === loggedUser._id);

        if (foundUser) {
            // Redirige con los datos del usuario logeado
            window.location.href = 'teatro.html?_id=' + foundUser._id;
        } else {
            console.error('El usuario logeado no se encuentra en la lista.');
        }
    } else {
        console.error('No hay datos de usuario logeado en el localStorage.');
    }
};