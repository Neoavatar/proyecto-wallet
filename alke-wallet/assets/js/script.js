const alertPlaceholder = document.getElementById('alert-placeholder');
const TIEMPO = 2000; //2 segundos

function iniciar_sesion(){
    email_correcto = "user@test.com";
    passwd_correcto = "pass123";
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
        setTimeout(() => window.location.href = './menu.html', TIEMPO);
    } else {
        showAlert('Email o contraseña incorrectos. Por favor, intente de nuevo.', 'danger');
        return;
    }
};

const showAlert = (message, type) => {
    alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible" role="alert">
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>`;
};


/* FUNCIONES GLOBALES */
// Función para mostrar alertas de redirección


const showRedirectAlert = (message) => {
const wrapper = document.createElement('div');
wrapper.innerHTML = [
    `<div class="alert alert-info" role="alert">`,
    `   ${message}`,
    '</div>'
].join('');
alertPlaceholder.innerHTML = ''; // Limpiar alertas previas
alertPlaceholder.append(wrapper);
};

// Eventos de botones
const btn_mensajeRedireccion = (buttonId, mensaje, url) => {
    const button = document.getElementById(buttonId);
    if(button){
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir navegación inmediata
            showRedirectAlert(mensaje); // Mostrar leyenda
    
            // Redirigir después de 2 segundo
            setTimeout(() => {
                window.location.href = url;
            }, TIEMPO);
        });
    }
};

// Mensajes Segun Boton Presionado
btn_mensajeRedireccion('btn-deposito', 'Redirigiendo a Depositar...', './deposit.html');
btn_mensajeRedireccion('btn-enviar', 'Redirigiendo a Enviar Dinero...', './sendmoney.html');
btn_mensajeRedireccion('btn-transacciones', 'Redirigiendo a Últimos Movimientos...', './transactions.html');
btn_mensajeRedireccion('btn-menu', 'Redirigiendo al Menú...', './menu.html');
btn_mensajeRedireccion('btn-logout', 'Cerrando sesión...', './login.html');

/* FUNCIONES DE DEPOSITO */

// 1. Obtener saldo actual guardado o usar el inicial por defecto
let saldoInicial = 1000000; // Monto inicial*/
let saldoActual = 0;

// Si ya existe un saldo en la "memoria" del navegador, lo usamos
if (localStorage.getItem("saldo")) {
    saldoActual = parseInt(localStorage.getItem("saldo"));
} else {
    localStorage.setItem("saldo", saldoInicial);
    saldoActual = parseInt(localStorage.getItem("saldo"));
}
// 2. Mostrar el saldo SOLO si estamos en la página del menú
const elementoSaldo = document.getElementById("saldo-actual");
if (elementoSaldo) {
    // Formateamos el número
    elementoSaldo.innerText = "$" + saldoActual.toLocaleString('es-CL');
}

/* LÓGICA DE DEPÓSITO */
const btnDepositar = document.getElementById("btn-realizar-deposito");

if (btnDepositar) {
    btnDepositar.addEventListener("click", (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // 1. Capturar el monto del input
        const inputMonto = document.getElementById("montoDeposito");
        const montoIngresado = parseInt(inputMonto.value);

        // 2. Validar que sea un número positivo
        if (isNaN(montoIngresado) || montoIngresado <= 0) {
            showAlert("Por favor ingresa un monto válido.", "danger");
            inputMonto.value = "";
            inputMonto.focus();
            return;
        }

        // 3. Sumar al saldo actual
        saldoActual = saldoActual + montoIngresado;

        // 4. Guardar el nuevo saldo en la memoria del navegador
        localStorage.setItem("saldo", saldoActual);

        // 5. Mensaje y redirección
        showAlert(`Depósito exitoso. Nuevo saldo: $${saldoActual.toLocaleString('es-CL')}`, "success");
        
        setTimeout(() => {
            window.location.href = "./menu.html";
        }, TIEMPO);
    });
}

/* LÓGICA DE ENVÍO DE DINERO (sendmoney.html) */

// 1. Selección de Contacto
// Variable para guardar qué contacto se seleccionó
let contactoSeleccionado = null;
const listaContactos = document.getElementById('lista-contactos');

if (listaContactos) {
    // Escuchamos los clics dentro de la lista
    listaContactos.addEventListener('click', (event) => {
        // Buscamos el elemento <a> más cercano al clic
        const item = event.target.closest('.list-group-item');
        
        if (item) {
            event.preventDefault(); // Evitamos el salto del enlace

            // a. Quitamos la clase 'active' (azul) de todos los contactos
            document.querySelectorAll('.list-group-item').forEach(i => i.classList.remove('active'));

            // b. Se la ponemos solo al que hicimos clic
            item.classList.add('active');

            // c. Guardamos el nombre para usarlo en el mensaje
            contactoSeleccionado = item.querySelector('h6').innerText;
        }
    });
}

// 2. Realizar la Transferencia
const btnEnviar = document.getElementById("btn-realizar-envio");

if (btnEnviar) {
    btnEnviar.addEventListener("click", (event) => {
        event.preventDefault();

        // a. Validar que haya seleccionado un contacto
        if (!contactoSeleccionado) {
            showAlert("Por favor selecciona un contacto de la lista.", "danger");
            return;
        }

        // b. Obtener monto y saldo actual
        const inputMonto = document.getElementById("montoEnvio");
        const montoEnvio = parseInt(inputMonto.value);
        
        // Nos aseguramos de tener el saldo más reciente
        let saldoDisponible = parseInt(localStorage.getItem("saldo")) || 0;

        // c. Validaciones de dinero
        if (isNaN(montoEnvio) || montoEnvio <= 0) {
            showAlert("Ingresa un monto válido para transferir.", "danger");
            return;
        }

        if (montoEnvio > saldoDisponible) {
            showAlert("Fondos insuficientes para realizar esta transferencia.", "danger");
            return;
        }

        // d. Restar el dinero y guardar
        saldoDisponible -= montoEnvio;
        localStorage.setItem("saldo", saldoDisponible);

        // e. Mensaje de éxito y redirección
        showAlert(`Has enviado $${montoEnvio.toLocaleString('es-CL')} a ${contactoSeleccionado}. Saldo restante: $${saldoDisponible.toLocaleString('es-CL')}`, "success");
        
        // Deshabilitar botón para evitar doble envío
        btnEnviar.disabled = true;

        setTimeout(() => {
            window.location.href = "./menu.html";
        }, TIEMPO);
    });
}