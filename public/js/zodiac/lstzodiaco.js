var db = firebase.apps[0].firestore();

const tabla = document.querySelector('#tabla');

const iconos = {
	Fuego : 'fa-fire',
	Tierra: 'fa-mountain',
	Aire  : 'fa-wind',
	Agua  : 'fa-droplet'
};

// evita que un texto guardado rompa el HTML de la tarjeta
function esc(texto){
	return String(texto ?? '').replace(/[&<>"']/g, c => (
		{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function cargarSignos(){
	db.collection("datosZodiaco").orderBy('posic', 'asc').get().then(function(query){
		tabla.innerHTML = "";
		var salida = "";
		query.forEach(function(doc){
			const d = doc.data();
			const elemento = d.elemento || '';
			const clase = elemento ? 'elem-' + elemento.toLowerCase() : 'elem-ninguno';
			const icono = iconos[elemento] || 'fa-circle-question';

			salida += '<div class="divAnuncio ' + clase + ' m-3" title="Modificar ' + esc(d.signo) + '" '
					+ 'onclick="editarSigno(\'' + doc.id + '\')">';
				salida += '<div class="imgBlock"><img src="' + esc(d.url) + '" width="100%" alt="' + esc(d.signo) + '"/></div>';
				salida += '<div class="signo">' + esc(d.signo) + '</div>';
				salida += '<div class="rango">' + esc(d.rango) + '</div>';
				salida += '<span class="badgeElemento"><i class="fa-solid ' + icono + '"></i> ' + esc(elemento || 'Sin elemento') + '</span>';
				salida += '<ul class="datos">';
					salida += '<li><i class="fa-solid fa-sun"></i> <b>Astro:</b> ' + esc(d.astro || '-') + '</li>';
					salida += '<li><i class="fa-solid fa-gem"></i> <b>Piedra:</b> ' + esc(d.piedra || '-') + '</li>';
				salida += '</ul>';
				salida += '<span class="editar"><i class="fa-solid fa-pen"></i> Clic para editar</span>';
			salida += '</div>';
		});
		tabla.innerHTML = salida;
	}).catch(function(error){
		tabla.innerHTML = '<div class="alert alert-danger">Error al cargar los signos: ' + esc(error.message) + '</div>';
	});
}

function editarSigno(id){
	document.location.href = 'editar.html?id=' + encodeURIComponent(id);
}

// espera a que Firebase confirme la sesión antes de consultar
firebase.apps[0].auth().onAuthStateChanged((user) => {
	if (user) cargarSignos();
});
