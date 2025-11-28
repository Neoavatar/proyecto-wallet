/* =======================================================
   CONFIGURACIÓN GENERAL
   ======================================================= */
const tiempo_espera = 2000;
const contenedor_alerta = document.getElementById('alert_placeholder');

// Obtiene la fecha actual formateada
const obtener_fecha_actual = () => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('es-ES', opciones);
};

//Guarda un movimiento en el historial (LocalStorage)
const registrar_movimiento = (tipo, descripcion, monto) => {
    let historial = JSON.parse(localStorage.getItem('historial_movimientos')) || [];
    const nuevo_movimiento = {
        tipo: tipo, // 'deposito', 'transferencia', 'compra', etc.
        descripcion: descripcion,
        fecha: obtener_fecha_actual(),
        monto: monto,
        id: Date.now() // Usamos la hora como ID único
    };
    historial.unshift(nuevo_movimiento);
    //Guardamos en localStorage
    localStorage.setItem('historial_movimientos', JSON.stringify(historial));
};

/* --- ALERTAS --- */
const mostrar_alerta = (mensaje, tipo) => {
    if(!contenedor_alerta) return;
    contenedor_alerta.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        <div>${mensaje}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>`;
};

const mostrar_alerta_redireccion = (mensaje) => {
    if(!contenedor_alerta) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-info" role="alert">${mensaje}</div>`;
    contenedor_alerta.innerHTML = '';
    contenedor_alerta.append(wrapper);
};

/* --- BOTONES DE NAVEGACIÓN --- */
const configurar_boton_redireccion = (id_boton, mensaje, url) => {
    const boton = document.getElementById(id_boton);
    if(boton){
        boton.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            mostrar_alerta_redireccion(mensaje);
            setTimeout(() => { window.location.href = url; }, tiempo_espera);
        });
    }
};

configurar_boton_redireccion('btn_deposito', 'Redirigiendo a Depositar...', './deposit.html');
configurar_boton_redireccion('btn_enviar', 'Redirigiendo a Enviar Dinero...', './sendmoney.html');
configurar_boton_redireccion('btn_transacciones', 'Redirigiendo a Últimos Movimientos...', './transactions.html');
configurar_boton_redireccion('btn_menu', 'Redirigiendo al Menú...', './menu.html');
configurar_boton_redireccion('btn_logout', 'Cerrando sesión...', './login.html');


/* =======================================================
   LÓGICA PRINCIPAL (JQUERY)
   ======================================================= */
$(document).ready(function() {

    /* --- 0. INICIALIZACIÓN DE DATOS (Solo la primera vez) --- */
    // Si no hay saldo, ponemos uno inicial
    if (!localStorage.getItem("saldo")) {
        localStorage.setItem("saldo", 0);
    }
    // Si no hay historial, creamos unos datos de prueba para que no se vea vacío
    if (!localStorage.getItem("historial_movimientos")) {
        const datos_iniciales = [
            { tipo: 'compra', descripcion: 'Suscripción Netflix', fecha: '20 Nov 2024', monto: -5500, id: 1 },
            { tipo: 'deposito', descripcion: 'Carga Inicial', fecha: '18 Nov 2024', monto: 50000, id: 2 }
        ];
        localStorage.setItem("historial_movimientos", JSON.stringify(datos_iniciales));
    }

    /* --- 1. GESTIÓN DEL SALDO VISUAL --- */
    let saldo_guardado = parseInt(localStorage.getItem("saldo")) || 0;
    if ($('#saldo_actual').length) {
        $('#saldo_actual').text("$" + saldo_guardado.toLocaleString('es-CL'));
    }

    /* --- 2. PANTALLA DE LOGIN (login.html) --- */
    $('#login_form').submit(function(evento) {        
        evento.preventDefault(); 
        const email_correcto = "user@test.com";
        const pass_correcto = "pass123";
        const email_usuario = $('#email').val().trim();
        const pass_usuario = $('#password').val().trim();

        if (email_usuario === "" || pass_usuario === "") {
            mostrar_alerta('Por favor, completa todos los campos.', 'warning');
            return;
        }

        if (email_usuario === email_correcto && pass_usuario === pass_correcto) {
            mostrar_alerta('Inicio de sesión exitoso. Redirigiendo...', 'success');
            setTimeout(() => { window.location.href = './menu.html'; }, tiempo_espera);
        } else {
            mostrar_alerta('Email o contraseña incorrectos.', 'danger');
        }
    });

    /* --- 3. PANTALLA DE DEPÓSITO (deposit.html) --- */
    $('#btn_realizar_deposito').click(function(evento) {
        evento.preventDefault();
        let monto_ingresado = parseInt($('#monto_deposito').val());
        let saldo_actual = parseInt(localStorage.getItem("saldo")) || 0;

        if (isNaN(monto_ingresado) || monto_ingresado <= 0) {
            mostrar_alerta("Por favor ingresa un monto válido mayor a 0.", "danger");
            return;
        }

        // A. Actualizamos saldo
        let nuevo_saldo = saldo_actual + monto_ingresado;
        localStorage.setItem("saldo", nuevo_saldo);

        // B. Registramos el movimiento en LocalStorage
        registrar_movimiento('deposito', 'Depósito en efectivo', monto_ingresado);

        // C. Feedback Visual
        $('#leyenda_deposito')
            .text(`Has depositado: $${monto_ingresado.toLocaleString('es-CL')}`)
            .fadeIn(); 
        $('#saldo_actual').text("$" + nuevo_saldo.toLocaleString('es-CL'));
        mostrar_alerta("¡Depósito Exitoso!", "success");
        $('#monto_deposito').val('');

        setTimeout(function() { window.location.href = './menu.html'; }, tiempo_espera);
    });

    /* --- 4. PANTALLA DE ENVIAR DINERO (sendmoney.html) --- */
    if ($('#lista_contactos').length) {
        
        // Cargar contactos
        const crear_html_contacto = (nombre, cbu, banco, alias) => {
            return `
                <a href="#" class="list-group-item list-group-item-action contacto_item border-0 border-bottom py-3">
                    <div class="d-flex w-100 justify-content-between align-items-center">
                      <div>
                        <h6 class="mb-1 fw-bold nombre_contacto">${nombre}</h6>
                        <small class="text-muted d-block">Banco: ${banco}</small>
                      </div>
                      <div class="text-end">
                        <small class="text-muted d-block" style="font-size: 0.75rem;">CBU: ${cbu}</small>
                        <span class="badge bg-light text-dark rounded-pill border">${alias}</span>
                      </div>
                    </div>
                </a>`;
        };

        const agenda_contactos = JSON.parse(localStorage.getItem('agenda_contactos')) || [];
        agenda_contactos.forEach(c => {
            $('#lista_contactos').append(crear_html_contacto(c.nombre, c.cbu, c.banco, c.alias));
        });

        // Toggle Formulario
        $('#btn_mostrar_form_contacto').click(function() {
            $('#form_nuevo_contacto').slideDown();
            $(this).hide();
        });
        $('#btn_cancelar_contacto').click(function() {
            $('#form_nuevo_contacto').slideUp();
            $('#btn_mostrar_form_contacto').fadeIn();
            $('#form_agregar_contacto')[0].reset();
        });

        // Agregar Contacto
        $('#form_agregar_contacto').submit(function(evento) {
            evento.preventDefault();
            let nombre = $('#info_nombre').val().trim();
            let apellido = $('#info_apellido').val().trim();
            let cbu = $('#info_cbu').val().trim();
            let alias = $('#info_alias').val().trim();
            let banco = $('#info_banco').val().trim();

            if (nombre === "" || cbu === "" || alias === "" || banco === "") {
                mostrar_alerta("Todos los campos son obligatorios.", "warning");
                return;
            }
            let nombre_completo = nombre + (apellido ? " " + apellido : "");
            
            // Guardar
            const agenda = JSON.parse(localStorage.getItem('agenda_contactos')) || [];
            agenda.push({ nombre: nombre_completo, cbu: cbu, banco: banco, alias: alias });
            localStorage.setItem('agenda_contactos', JSON.stringify(agenda));

            $('#lista_contactos').append(crear_html_contacto(nombre_completo, cbu, banco, alias));
            mostrar_alerta("Contacto agregado.", "success");
            $('#btn_cancelar_contacto').click(); 
        });

        // Buscador
        $('#buscar_contacto').on('keyup', function() {
            let valor = $(this).val().toLowerCase();
            $('.contacto_item').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(valor) > -1);
            });
        });

        // Seleccionar Contacto
        $('#lista_contactos').on('click', '.contacto_item', function(evento) {
            evento.preventDefault();
            $('.contacto_item').removeClass('active bg-light'); 
            $(this).addClass('active bg-light'); 

            let nombre_seleccionado = $(this).find('.nombre_contacto').text();
            $('#nombre_contacto_seleccionado').text(nombre_seleccionado);
            
            if ($('#seccion_envio').is(':hidden')) $('#seccion_envio').fadeIn();
            $('#monto_envio').focus();
        });

        // REALIZAR ENVÍO (Lógica de transacción)
        $('#btn_realizar_envio').click(function() {
            let monto_a_enviar = parseInt($('#monto_envio').val());
            let saldo_actual = parseInt(localStorage.getItem("saldo")) || 0;
            let destinatario = $('#nombre_contacto_seleccionado').text();

            if (isNaN(monto_a_enviar) || monto_a_enviar <= 0) {
                mostrar_alerta("Ingresa un monto válido.", "danger");
                return;
            }
            if (monto_a_enviar > saldo_actual) {
                mostrar_alerta("Fondos insuficientes.", "danger");
                return;
            }

            // A. Restar saldo
            let nuevo_saldo = saldo_actual - monto_a_enviar;
            localStorage.setItem("saldo", nuevo_saldo);

            // B. Guardar Transacción (Monto negativo para indicar egreso)
            registrar_movimiento('transferencia', `Envío a ${destinatario}`, -monto_a_enviar);

            // C. Finalizar
            $('#seccion_envio').slideUp();
            $('#lista_contactos').slideUp();
            $('#mensaje_confirmacion').fadeIn();
            
            setTimeout(function() { window.location.href = './menu.html'; }, tiempo_espera);
        });
    }

    /* --- 5. PANTALLA DE MOVIMIENTOS (transactions.html) --- */
    if ($('#lista_movimientos').length) {
        
        // A. Cargar lista desde LocalStorage (Ya no es una lista fija falsa)
        const lista_transacciones = JSON.parse(localStorage.getItem('historial_movimientos')) || [];

        const mostrar_movimientos = (filtro = 'todos') => {
            $('#lista_movimientos').empty(); 

            const movimientos_filtrados = lista_transacciones.filter(t => {
                return filtro === 'todos' ? true : t.tipo === filtro;
            });

            if (movimientos_filtrados.length === 0) {
                $('#mensaje_sin_movimientos').show();
            } else {
                $('#mensaje_sin_movimientos').hide();
            }

            movimientos_filtrados.forEach(mov => {
                const color_monto = mov.monto > 0 ? 'text-success' : 'text-danger';
                const simbolo = mov.monto > 0 ? '+' : '';
                // Capitalizar primera letra del tipo
                let etiqueta_tipo = mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1);

                const item_html = `
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded-circle bg-light d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                <i class="bi bi-receipt text-muted"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold text-dark">${mov.descripcion}</h6>
                                <small class="text-muted">${etiqueta_tipo} • ${mov.fecha}</small>
                            </div>
                        </div>
                        <span class="${color_monto} fw-bold fs-6">
                            ${simbolo}$${Math.abs(mov.monto).toLocaleString('es-CL')}
                        </span>
                    </li>`;
                
                $('#lista_movimientos').append(item_html);
            });
        };

        // B. Inicializar vista
        mostrar_movimientos();

        // C. Filtros
        $('#filtro_tipo').change(function() {
            mostrar_movimientos($(this).val());
        });
    }
});

function sumarMonto(valor) {
    let input = document.getElementById('monto_deposito');
    let actual = parseInt(input.value) || 0;
    input.value = actual + valor;
}