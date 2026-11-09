// JavaScript Document
// Cierra la sesión del usuario después de 3 minutos sin actividad.
// Requiere islogin.js (función salir) cargado antes.
(function () {
	const LIMITE = 3 * 60 * 1000;   // 3 minutos en milisegundos
	const eventos = ['mousemove', 'mousedown', 'keydown', 'scroll', 'wheel', 'touchstart', 'click'];
	const lblInactividad = document.querySelector('#lblInactividad');
	let temporizador = null;
	let limite = 0;

	function reiniciar() {
		clearTimeout(temporizador);
		limite = Date.now() + LIMITE;
		temporizador = setTimeout(cerrarSesion, LIMITE);
	}

	function cerrarSesion() {
		eventos.forEach((e) => document.removeEventListener(e, reiniciar));
		salir('inactividad');
	}

	// contador visible en la barra de navegación
	function mostrarRestante() {
		if (!lblInactividad) return;
		const restante = Math.max(0, Math.ceil((limite - Date.now()) / 1000));
		const min = Math.floor(restante / 60);
		const seg = String(restante % 60).padStart(2, '0');
		lblInactividad.textContent = 'Sesión: ' + min + ':' + seg;
		lblInactividad.classList.remove('d-none');
		lblInactividad.classList.toggle('bg-danger', restante <= 30);
		lblInactividad.classList.toggle('bg-secondary', restante > 30);
	}

	eventos.forEach((e) => document.addEventListener(e, reiniciar, { passive: true }));
	reiniciar();
	mostrarRestante();
	setInterval(mostrarRestante, 1000);
})();
