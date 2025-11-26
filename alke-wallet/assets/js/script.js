const alertPlaceholder = document.getElementById('alert_placeholder');
const TIEMPO = 2000; //2 segundos

/*
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
/*
    if (email === email_correcto && password === passwd_correcto) {
        showAlert('Inicio de sesión exitoso. Redirigiendo al menú principal...', 'success');
        setTimeout(() => window.location.href = './menu.html', TIEMPO);
    } else {
        showAlert('Email o contraseña incorrectos. Por favor, intente de nuevo.', 'danger');
        return;
    }
};*/

/* LOGIN CON JQUERY */
// $(document).ready(...) asegura que el código corra cuando la página cargó
$(document).ready(function() {
    $('#login_form').submit(function(event) {        
        // Prevenimos que la página se recargue automáticamente
        event.preventDefault();
        // Credenciales correctas
        const email_correcto = "user@test.com";
        const passwd_correcto = "pass123";

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        // Validación básica
        if (email === "" || password === "") {
            showAlert('Por favor, completa todos los campos.', 'warning');
            return;
        }
        // Validación de credenciales
        if (email === email_correcto && password === passwd_correcto) {
            showAlert('Inicio de sesión exitoso. Redirigiendo al menú principal...', 'success');
            setTimeout(() => {
                window.location.href = './menu.html';
            }, TIEMPO);
        } else {
            showAlert('Email o contraseña incorrectos. Por favor, intente de nuevo.', 'danger');
        }
    });
});

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
btn_mensajeRedireccion('btn_deposito', 'Redirigiendo a Depositar...', './deposit.html');
btn_mensajeRedireccion('btn_enviar', 'Redirigiendo a Enviar Dinero...', './sendmoney.html');
btn_mensajeRedireccion('btn_transacciones', 'Redirigiendo a Últimos Movimientos...', './transactions.html');
btn_mensajeRedireccion('btn_menu', 'Redirigiendo al Menú...', './menu.html');
btn_mensajeRedireccion('btn_logout', 'Cerrando sesión...', './login.html');

/* FUNCIONES DE DEPOSITO */

// 1. Obtener saldo actual guardado o usar el inicial por defecto
let saldoInicial = 1000000; // Monto inicial*/
let saldoActual = 0;

// Si ya existe un saldo en localStoragelo usamos
if (localStorage.getItem("saldo")) {
    saldoActual = parseInt(localStorage.getItem("saldo"));
} else {
    localStorage.setItem("saldo", saldoInicial);
    saldoActual = parseInt(localStorage.getItem("saldo"));
}
// 2. Mostrar el saldo SOLO si estamos en la página del menú
const elementoSaldo = document.getElementById("saldo_actual");
if (elementoSaldo) {
    // Formateamos el número
    elementoSaldo.innerText = "$" + saldoActual.toLocaleString('es-CL');
}

/* LÓGICA DE DEPÓSITO */
/*const btnDepositar = document.getElementById("btn-realizar-deposito");

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
}*/
/* ==========================================
   LÓGICA DE DEPÓSITO CON JQUERY
   ========================================== */

$(document).ready(function() {
    
    // 1. MOSTRAR SALDO AL CARGAR LA PÁGINA
    // Verificamos si estamos en la página de depósito buscando el elemento específico
    if ($('#saldo_actual').length) {
        // Obtenemos saldo de localStorage (o 0 si no existe)
        let saldoGuardado = parseInt(localStorage.getItem("saldo")) || 0;        
        // Actualizamos el texto del elemento H4
        $('#saldo_actual').text("$" + saldoGuardado.toLocaleString('es-CL'));
    }

    // 2. MANEJAR EL CLICK EN "REALIZAR DEPÓSITO"
    $('#btn_realizar_deposito').click(function(event) {
        event.preventDefault(); // Evitar recarga del form

        // Obtener valor del input con jQuery
        let montoIngresado = parseInt($('#monto_deposito').val());
        
        // Obtener saldo actual
        let saldoActual = parseInt(localStorage.getItem("saldo")) || 0;

        // Validar entrada
        if (isNaN(montoIngresado) || montoIngresado <= 0) {
            // Usamos nuestra función showAlert (que inserta HTML de Bootstrap)
            showAlert("Por favor ingresa un monto válido mayor a 0.", "danger");
            $('#monto_deposito').val('').focus(); // Limpiar y enfocar
            return;
        }

        // Calcular nuevo saldo
        let nuevoSaldo = saldoActual + montoIngresado;

        // Guardar en LocalStorage
        localStorage.setItem("saldo", nuevoSaldo);

        // 3. MOSTRAR LEYENDA CON EL MONTO DEPOSITADO
        // Usamos .html() o .text() y .show() de jQuery
        $('#leyenda_deposito')
            .text(`Has depositado: $${montoIngresado.toLocaleString('es-CL')}`)
            .fadeIn(); // Efecto visual de aparición

        // Actualizar también el saldo visual de arriba inmediatamente
        $('#saldo_actual').text("$" + nuevoSaldo.toLocaleString('es-CL'));

        // 4. MOSTRAR ALERTA DE BOOTSTRAP DE ÉXITO
        // Creamos la alerta con jQuery
        let alertaExito = `
            <div class="alert alert-success alert-dismissible fade show mb-0" role="alert">
                <strong>¡Depósito Exitoso!</strong> 
                El dinero ha sido acreditado en tu cuenta.
                
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Insertamos la alerta en el placeholder
        $('#alert_placeholder').html(alertaExito);

        // Limpiar el input
        $('#monto_deposito').val('').focus();

        // 5. REDIRIGIR DESPUÉS DE 4 SEGUNDOS
        setTimeout(function() {
            window.location.href = './menu.html';
        }, (TIEMPO+TIMEPO));
    });
});

/* ==========================================
   LÓGICA DE ENVÍO DE DINERO CON JQUERY
   (Reemplaza la sección final de tu archivo con esto)
   ========================================== */

$(document).ready(function() {
    
    // Variables globales para esta sección
    let contactoSeleccionado = null;

    // --- FUNCIÓN PARA CREAR HTML DE CONTACTO ---
    const crearHtmlContacto = (nombre, cbu, banco, alias) => {
        return `
            <a href="#" class="list-group-item list-group-item-action contacto_item">
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1 nombre_contacto">${nombre}</h6>
                </div>
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted">CBU: <span class="cbu_contacto text-muted">${cbu}</span></small>
                </div>
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted">Banco: <span class="banco_contacto text-muted">${banco}</span></small>
                </div>
                <div class="d-flex w-100 justify-content-between">
                  <small class="text-muted">Alias: <span class="alias_contacto text-muted">${alias}</span></small>
                </div>
            </a>
        `;
    };

    // --- CARGAR CONTACTOS GUARDADOS ---
    // Verificamos si estamos en la página de envío (si existe la lista)
    if ($('#lista_contactos').length) {
        // Obtenemos el array de contactos o un array vacío si es la primera vez
        const contactosGuardados = JSON.parse(localStorage.getItem('agenda_contactos')) || [];
        
        // Recorremos y agregamos cada uno a la lista
        contactosGuardados.forEach(c => {
            $('#lista_contactos').append(crearHtmlContacto(c.nombre, c.cbu, c.banco, c.alias));
        });
    }


    // -------------------------------------------------
    // 1. MOSTRAR Y OCULTAR FORMULARIO DE NUEVO CONTACTO
    // -------------------------------------------------
    
    // Mostrar formulario con efecto slide
    $('#btn_mostrar_form_contacto').click(function() {
        $('#form_nuevo_contacto').slideDown(); // Muestra el formulario
        $(this).hide(); // Oculta el botón de "Agregar"
    });

    // Ocultar formulario (Cancelar)
    $('#btn_cancelar_contacto').click(function() {
        $('#form_nuevo_contacto').slideUp(); // Oculta el formulario
        $('#btn_mostrar_form_contacto').fadeIn(); // Muestra el botón de nuevo
        // Limpiamos los campos (usando [0] para acceder al elemento nativo form)
        $('#form_agregar_contacto')[0].reset();
    });

    // -------------------------------------------------
    // 2. VALIDAR Y AGREGAR NUEVO CONTACTO
    // -------------------------------------------------
    $('#form_agregar_contacto').submit(function(event) {
        event.preventDefault();

        let nombre = $('#info_nombre').val().trim();
        let apellido = $('#info_apellido').val().trim();
        let cbu = $('#info_cbu').val().trim();
        let alias = $('#info_alias').val().trim();
        let banco = $('#info_banco').val().trim();

        // Validaciones básicas
        if (nombre === "" || cbu === "" || alias === "" || banco === "") {
            showAlert("Todos los campos son obligatorios.", "warning");
            return;
        }

        // Nombre completo para mostrar
        let nombreCompleto = nombre + (apellido ? " " + apellido : "");

        // 1. GUARDAR EN LOCALSTORAGE
        // Obtenemos la agenda actual
        const agenda = JSON.parse(localStorage.getItem('agenda_contactos')) || [];
        // Creamos el objeto del nuevo contacto
        const nuevoContactoObj = { 
            nombre: nombreCompleto, 
            cbu: cbu, 
            banco: banco, 
            alias: alias 
        };
        // Lo agregamos al array y guardamos
        agenda.push(nuevoContactoObj);
        localStorage.setItem('agenda_contactos', JSON.stringify(agenda));

        // 2. AGREGAR VISUALMENTE
        let nuevoItemHTML = crearHtmlContacto(nombreCompleto, cbu, banco, alias);
        $('#lista_contactos').append(nuevoItemHTML);
        
        showAlert("Contacto agregado exitosamente.", "success");
        $('#btn_cancelar_contacto').click(); 
    });


    // -------------------------------------------------
    // 3. BÚSQUEDA Y FILTRADO EN AGENDA
    // -------------------------------------------------
    $('#buscar_contacto').on('keyup', function() {
        let valorBusqueda = $(this).val().toLowerCase();

        // Recorremos cada item de contacto
        $('.contacto_item').filter(function() {
            // Buscamos texto en todo el contenido del item
            let textoItem = $(this).text().toLowerCase();
            // .toggle(condicion) muestra si es true, oculta si es false
            $(this).toggle(textoItem.indexOf(valorBusqueda) > -1);
        });
    });


    // -------------------------------------------------
    // 4. SELECCIONAR CONTACTO Y MOSTRAR BOTÓN DE ENVÍO
    // -------------------------------------------------
    // Usamos delegación (.on) para que funcione con los contactos nuevos
    $('#lista_contactos').on('click', '.contacto_item', function(event) {
        event.preventDefault();

        // a. Gestión visual (clase active)
        $('.contacto_item').removeClass('active');
        $(this).addClass('active');

        // b. Guardar datos (buscamos el h6 dentro del elemento clickeado)
        contactoSeleccionado = $(this).find('h6').text();

        // c. Mostrar sección de envío
        $('#nombre_contacto_seleccionado').text(contactoSeleccionado);
        
        // Si estaba oculta, la mostramos
        if ($('#seccion_envio').is(':hidden')) {
            $('#seccion_envio').fadeIn();
        }
        
        // Foco en el monto
        $('#monto_envio').focus();
    });


    // -------------------------------------------------
    // 5. ENVIAR DINERO Y CONFIRMACIÓN FINAL
    // -------------------------------------------------
    $('#btn_realizar_envio').click(function() {
        let monto = parseInt($('#monto_envio').val());
        let saldoActual = parseInt(localStorage.getItem("saldo")) || 0;

        // Validaciones
        if (isNaN(monto) || monto <= 0) {
            showAlert("Ingresa un monto válido.", "danger");
            return;
        }
        if (monto > saldoActual) {
            showAlert("Fondos insuficientes.", "danger");
            return;
        }

        // Procesar Envío
        let nuevoSaldo = saldoActual - monto;
        localStorage.setItem("saldo", nuevoSaldo);

        // Ocultamos formularios para mostrar mensaje final
        $('#seccion_envio').slideUp();
        $('#lista_contactos').slideUp();
        $('.input-group').parent().slideUp(); // Ocultar buscador

        // Mostrar mensaje de éxito
        $('#mensaje_confirmacion').fadeIn();
        
        // Redirección automática
        setTimeout(function() {
            window.location.href = './menu.html';
        }, TIEMPO);
    });

});

/* ==========================================
   LÓGICA DE ÚLTIMOS MOVIMIENTOS (transactions.html)
   ========================================== */
$(document).ready(function() {
    
    // Ejecutamos esto si estamos en la página de transacciones
    if ($('#lista_movimientos').length) {

        // 1. DATOS FICTICIOS (Simulando "La lista real")
        const listaTransacciones = [
            { id: 1, tipo: 'compra', descripcion: 'Compra en Supermercado', fecha: '11 Nov 2025', monto: -50000 },
            { id: 2, tipo: 'deposito', descripcion: 'Depósito en Efectivo', fecha: '10 Nov 2025', monto: 100000 },
            { id: 3, tipo: 'transferencia', descripcion: 'Recibido de Juan Perez', fecha: '10 Nov 2025', monto: 75000 },
            { id: 4, tipo: 'compra', descripcion: 'Pago Netflix', fecha: '09 Nov 2025', monto: -5500 },
            { id: 5, tipo: 'deposito', descripcion: 'Depósito cajero automático', fecha: '08 Nov 2025', monto: 10500 },
            { id: 6, tipo: 'compra', descripcion: 'Farmacia Cruz Verde', fecha: '07 Nov 2025', monto: -12990 },
            { id: 7, tipo: 'transferencia', descripcion: 'Recibido de Mamá', fecha: '05 Nov 2025', monto: 20000 },
            { id: 8, tipo: 'pago', descripcion: 'Tarjeta de Crédito', fecha: '03 Nov 2025', monto: -200000 },
            { id: 9, tipo: 'pago', descripcion: 'Cuenta de la Luz', fecha: '08 Nov 2025', monto: -45000 }
        ];

        // 2. FUNCIÓN PARA OBTENER TIPO ELEGIBLE
        const getTipoTransaccion = (tipo) => {
            switch(tipo) {
                case 'pago': return 'Pagos';
                case 'compra': return 'Compra';
                case 'deposito': return 'Depósito';
                case 'transferencia': return 'Transferencia Recibida';
                default: return 'Movimiento';
            }
        };

        // 3. FUNCIÓN PRINCIPAL PARA MOSTRAR LA LISTA
        const mostrarUltimosMovimientos = (filtro = 'todos') => {
            const contenedor = $('#lista_movimientos');
            contenedor.empty(); // Limpiamos la lista actual

            // Filtramos
            const movimientosFiltrados = listaTransacciones.filter(t => {
                if (filtro === 'todos') return true;
                return t.tipo === filtro;
            });

            // Si no hay resultados
            if (movimientosFiltrados.length === 0) {
                $('#mensaje_sin_movimientos').show();
                return;
            } else {
                $('#mensaje_sin_movimientos').hide();
            }

            // Generamos el HTML por cada movimiento
            movimientosFiltrados.forEach(mov => {
                // Definimos color: verde si es positivo (>0), rojo si es negativo
                const claseColor = mov.monto > 0 ? 'text-success' : 'text-danger';
                const simbolo = mov.monto > 0 ? '+' : ''; // Agregamos + solo si es positivo

                const itemHTML = `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="mb-0 fw-bold">${mov.descripcion}</h6>
                          <small class="text-muted d-block">${getTipoTransaccion(mov.tipo)}</small>
                          <small class="text-muted" style="font-size: 0.8rem;">${mov.fecha}</small>
                        </div>
                        <span class="${claseColor} fw-bold fs-5">
                            ${simbolo}$${mov.monto.toLocaleString('es-CL')}
                        </span>
                    </li>
                `;
                contenedor.append(itemHTML);
            });
        };

        // 4. INICIALIZACIÓN
        // Mostrar todos al cargar la página
        mostrarUltimosMovimientos();

        // 5. BUSQUEDA POR FILTRO (SELECT)
        $('#filtro_tipo').change(function() {
            const valorSeleccionado = $(this).val();
            mostrarUltimosMovimientos(valorSeleccionado);
        });
    }
});