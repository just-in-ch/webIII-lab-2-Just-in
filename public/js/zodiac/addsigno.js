// JavaScript Document
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtPosic    = document.querySelector('#txtPosic');
const txtSigno    = document.querySelector('#txtSigno');
const txtRango    = document.querySelector('#txtRango');
const cboElemento = document.querySelector('#cboElemento');
const txtAstro    = document.querySelector('#txtAstro');
const txtPiedra   = document.querySelector('#txtPiedra');
const txtArchi    = document.querySelector('#txtArchi');
const btnLoad     = document.querySelector('#btnLoad');

btnLoad.addEventListener('click', function(){
	const archivo = txtArchi.files[0];
	const posic = parseInt(txtPosic.value);

	if (isNaN(posic) || posic < 1 || posic > 12) {
		alert('La posición debe ser un número entre 1 y 12');
		return;
	}
	if (txtSigno.value.trim() === '' || cboElemento.value === '' ||
		txtAstro.value.trim() === '' || txtPiedra.value.trim() === '') {
		alert('Debe completar todos los campos');
		return;
	}
	if (archivo == null) {
		alert('Debe seleccionar una imagen');
		return;
	}

	btnLoad.disabled = true;
	const metadata = {
		contentType : archivo.type
	}
	const subir = container.child('zodiaco/' + archivo.name).put(archivo, metadata);
	subir
		.then(snapshot => snapshot.ref.getDownloadURL())
		.then(url => {
			return db.collection("datosZodiaco").add({
				"posic"    : posic,
				"signo"    : txtSigno.value.trim(),
				"rango"    : txtRango.value.trim(),
				"elemento" : cboElemento.value,
				"astro"    : txtAstro.value.trim(),
				"piedra"   : txtPiedra.value.trim(),
				"url"      : url
			});
		})
		.then(function(docRef) {
			alert("ID del registro: " + docRef.id);
			limpiar();
		})
		.catch(function(FirebaseError) {
			alert("Error al guardar el signo: " + FirebaseError);
		})
		.finally(() => btnLoad.disabled = false);
});

function limpiar(){
	txtPosic.value = '';
	txtSigno.value = '';
	txtRango.value = '';
	cboElemento.value = '';
	txtAstro.value = '';
	txtPiedra.value = '';
	txtArchi.value = '';
	txtPosic.focus();
}
