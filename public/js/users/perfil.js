// JavaScript Document
// muestra los datos del usuario autenticado en index.html
var db = firebase.apps[0].firestore();

function formatoFecha(valor){
	if (!valor) return 'Sin registrar';
	// Timestamp de Firestore, Date o texto (usuarios viejos)
	const fecha = (typeof valor.toDate === 'function') ? valor.toDate() : new Date(valor);
	return isNaN(fecha) ? String(valor) : fecha.toLocaleString('es-CR');
}

firebase.apps[0].auth().onAuthStateChanged((user) => {
	if (!user) return;
	document.querySelector('#lblEmail').textContent = user.email;
	db.collection('datosUsuarios').where('idemp', '==', user.uid).get()
		.then((query) => {
			query.forEach((doc) => {
				const d = doc.data();
				document.querySelector('#lblNombre').textContent = d.usuario || '';
				document.querySelector('#lblCreacion').textContent = formatoFecha(d.fechaCreacion);
				document.querySelector('#lblAcceso').textContent = formatoFecha(d.ultAcceso);
			});
		})
		.catch((error) => console.log('Error al leer el usuario: ' + error));
});
