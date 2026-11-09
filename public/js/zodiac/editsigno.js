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
const imgActual   = document.querySelector('#imgActual');
const btnGuardar  = document.querySelector('#btnGuardar');

const idSigno = new URLSearchParams(location.search).get('id');
let urlActual = '';

if (!idSigno) {
	alert('No se indicó el signo a modificar');
	document.location.href = 'lista.html';
}

// carga los datos del signo seleccionado
function cargarSigno(){
	db.collection('datosZodiaco').doc(idSigno).get()
		.then((doc) => {
			if (!doc.exists) {
				alert('El signo seleccionado no existe');
				document.location.href = 'lista.html';
				return;
			}
			const d = doc.data();
			txtPosic.value    = d.posic ?? '';
			txtSigno.value    = d.signo ?? '';
			txtRango.value    = d.rango ?? '';
			cboElemento.value = d.elemento ?? '';
			txtAstro.value    = d.astro ?? '';
			txtPiedra.value   = d.piedra ?? '';
			urlActual         = d.url ?? '';
			imgActual.src     = urlActual;
		})
		.catch((error) => alert('Error al cargar el signo: ' + error.message));
}

// vista previa de la nueva imagen
txtArchi.addEventListener('change', () => {
	const archivo = txtArchi.files[0];
	imgActual.src = archivo ? URL.createObjectURL(archivo) : urlActual;
});

btnGuardar.addEventListener('click', function(){
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

	btnGuardar.disabled = true;
	const archivo = txtArchi.files[0];

	// si se eligió una imagen nueva se sube; si no, se conserva la URL actual
	const obtenerUrl = archivo
		? container.child('zodiaco/' + archivo.name)
			.put(archivo, { contentType: archivo.type })
			.then(snapshot => snapshot.ref.getDownloadURL())
		: Promise.resolve(urlActual);

	obtenerUrl
		.then((url) => {
			return db.collection('datosZodiaco').doc(idSigno).update({
				"posic"    : posic,
				"signo"    : txtSigno.value.trim(),
				"rango"    : txtRango.value.trim(),
				"elemento" : cboElemento.value,
				"astro"    : txtAstro.value.trim(),
				"piedra"   : txtPiedra.value.trim(),
				"url"      : url
			});
		})
		.then(() => {
			alert('Signo modificado correctamente');
			document.location.href = 'lista.html';
		})
		.catch((error) => alert('Error al modificar el signo: ' + error.message))
		.finally(() => btnGuardar.disabled = false);
});

firebase.apps[0].auth().onAuthStateChanged((user) => {
	if (user && idSigno) cargarSigno();
});
