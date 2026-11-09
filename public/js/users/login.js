// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// create local from webpage inputs
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');

// create local insert button
const btnLogin = document.querySelector('#btnLogin');

// mensaje cuando la sesión se cerró por inactividad
if (new URLSearchParams(location.search).get('motivo') === 'inactividad') {
	document.querySelector('#msgInactividad').classList.remove('d-none');
}

// assign button listener
btnLogin.addEventListener('click', function () {
	auth.signInWithEmailAndPassword(txtEmail.value.trim(), txtContra.value)
		.then((userCredential) => {
			const user = userCredential.user;
			// actualiza la fecha de último acceso (hora del servidor)
			return db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
				.then(function (docRef) {
					const cambios = [];
					docRef.forEach(function (doc){
						cambios.push(doc.ref.update({
							ultAcceso: firebase.firestore.FieldValue.serverTimestamp()
						}));
					});
					return Promise.all(cambios);
				})
				.then(function (){
					document.location.href = 'index.html';
				})
				.catch(function (FirebaseError) {
					alert("Error al actualizar el último acceso: " + FirebaseError);
				});
		})
		.catch((error) => {
			alert("Error user access: " + error.message);
		});
});
