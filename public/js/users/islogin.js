// JavaScript Document
// validate that user is log-in
var auth = firebase.apps[0].auth();

function validar() {
	var uid = -1
	auth.onAuthStateChanged((user) => {
		if (user) {
			uid = user.uid;
		} else {
			document.location.href = 'login.html';
		}
	});
	return uid;
}

// close current session
function salir(motivo){
	auth.signOut().then(() => {
		document.location.href = motivo ? 'login.html?motivo=' + motivo : 'login.html';
	}).catch((error)=>{
	   alert('Error al cerrar la sesión: ' + error.message);
	});
}
