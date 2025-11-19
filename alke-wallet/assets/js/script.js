const alertPlaceholder = document.getElementById('alert-placeholder');

function iniciar_sesion(){
    email_correcto = "user@test.com"
    passwd_correcto = "pass123"
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    /*if (email.includes(".com")) { 
        console.log("Correo validado!")
    }
    else {
        showAlert('Email incorrecto. Por favor, intente de nuevo.', 'danger');
        return;
    }*/

    if (email === email_correcto && password === passwd_correcto) {
        showAlert('Inicio de sesión exitoso. Redirigiendo al menú principal...', 'success');
        setTimeout(() => window.location.href = './menu.html', 2000);
    } else {
        showAlert('Email o contraseña incorrectos. Por favor, intente de nuevo.', 'danger');
        return;
    }
}

const showAlert = (message, type) => {
    alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible" role="alert">
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>`;
};
