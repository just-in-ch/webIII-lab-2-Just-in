// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// create local from webpage inputs
const txtNombre = document.querySelector('#txtNombre');
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const txtFechaCreacion = document.querySelector('#txtFechaCreacion');
const txtUltAcceso = document.querySelector('#txtUltAcceso');

// create local insert button
const btnInsUser = document.querySelector('#btnInsUser');

// muestra la fecha actual como referencia (la fecha real la pone el servidor)
function mostrarFechas(){
	const hoy = new Date().toLocaleString('es-CR');
	txtFechaCreacion.value = hoy;
	txtUltAcceso.value = hoy;
}
mostrarFechas();

// assign button listener
btnInsUser.addEventListener('click', function () {
	if (txtNombre.value.trim() === '' || txtEmail.value.trim() === '' || txtContra.value === '') {
		alert('Debe completar todos los campos');
		return;
	}

	auth.createUserWithEmailAndPassword(txtEmail.value.trim(), txtContra.value)
		.then((userCredential) => {
			const user = userCredential.user;
			const ahora = firebase.firestore.FieldValue.serverTimestamp();
			db.collection("datosUsuarios").add({
				"idemp": user.uid,
				"usuario": txtNombre.value.trim(),
				"email": user.email,
				"fechaCreacion": ahora,
				"ultAcceso": ahora
			}).then(function (docRef) {
				alert("Usuario agregado satisfactoriamente");
				limpiar();
				document.location.href = 'index.html';
			}).catch(function (FirebaseError) {
				alert("Error al registrar datos del usuario." + FirebaseError);
			});
		})
		.catch((error) => {
			alert("Error al agregar el nuevo usuario: " + error.message);
		});
});

function limpiar(){
	txtNombre.value = '';
	txtEmail.value = '';
	txtContra.value = '';
	mostrarFechas();
	txtNombre.focus();
}
