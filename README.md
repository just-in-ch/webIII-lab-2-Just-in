# Laboratorio Firebase – Zodiaco (ITI-621)

Proyecto web en Firebase Hosting + Authentication + Cloud Firestore + Storage.

## Datos de la entrega

| | |
|---|---|
| Sitio web (Firebase Hosting) | https://zodiaco-justin.web.app |
| Repositorio GitHub | https://github.com/just-in-ch/webIII-lab-2-Just-in |
| Proyecto Firebase | `zodiaco-justin` |
| Usuario de prueba | `justinchavarria8592@gmail.com` / `85927755` |

## ⚠️ Inconveniente: Cloud Storage no está activado

Desde octubre de 2024, Firebase solo permite activar **Cloud Storage** en proyectos nuevos si el proyecto está en el **plan Blaze** (pago por uso, requiere tarjeta de crédito). No pude cambiar el proyecto a ese plan, así que el proyecto `zodiaco-justin` está en el plan gratuito **Spark** y **no tiene Storage**.

Qué funciona y qué no en el sitio publicado:

| Función | Estado |
|---|---|
| Registro de usuarios con `fechaCreacion` y `ultAcceso` (Authentication + Firestore) | ✅ Funciona |
| Inicio de sesión y actualización de `ultAcceso` | ✅ Funciona |
| Cierre de sesión por inactividad (3 min) | ✅ Funciona |
| Reglas de Firestore (`firestore.rules`) | ✅ Publicadas |
| **Agregar signo** (`agregar.html`) | ❌ Falla al subir la imagen: el bucket de Storage no existe (error 404) |
| Lista y edición de signos | ⚠️ El código está completo, pero no hay signos cargados porque agregar requiere la imagen |
| Reglas de Storage (`storage.rules`) | ⚠️ Escritas en el repositorio, pero no se pudieron publicar |

El código de la parte de signos (`addsigno.js`, `lstzodiaco.js`, `editsigno.js`, `storage.rules`) está completo. Si se activa Storage en el proyecto (plan Blaze), basta con ejecutar `firebase deploy --only storage` y cargar los 12 signos de la tabla de abajo para que todo funcione sin cambiar código.

El sitio se publicó sin Storage con:
```bash
firebase deploy --only hosting,firestore
```

## Qué cambió respecto a la guía

| # | Requisito | Archivos |
|---|-----------|----------|
| 1 | Usuarios con **fecha de creación** y **último acceso** (hora del servidor) | `registrar.html`, `js/users/signup.js`, `js/users/login.js`, `index.html`, `js/users/perfil.js`, `firestore.rules` |
| 2 | Signo con **elemento** (Fuego/Tierra/Aire/Agua), **astro** y **piedra** | `agregar.html`, `js/zodiac/addsigno.js`, `firestore.rules` |
| 3 | Tarjeta con los nuevos datos y color según el elemento | `js/zodiac/lstzodiaco.js`, `css/style.css` |
| 4 | Página de edición al hacer clic en una tarjeta | `editar.html`, `js/zodiac/editsigno.js`, `firestore.rules`, `storage.rules` |
| 5 | Cierre de sesión tras **3 min sin actividad** en lista/agregar/editar | `js/users/inactividad.js` (con contador en la barra) |

Correcciones al código de la guía:
- Las reglas usaban `match /{datosUsuarios}/...`; con llaves eso es un **comodín** que aplica a cualquier colección. Ahora es `match /datosUsuarios/{docId}`.
- `addsigno.js` leía `archivo.name` antes de validar si había archivo (error si no se elegía imagen).
- `login.js` solo redirigía si encontraba el documento del usuario; ahora siempre entra.
- `storage.rules` ahora permite subir imágenes a `zodiaco/` solo a usuarios autenticados.

## Instalación (sobre tu carpeta `test01` ya inicializada)

1. Copia `public/`, `firestore.rules`, `storage.rules`, `firestore.indexes.json` y `firebase.json` dentro de tu carpeta del proyecto (la que tiene `.firebaserc`). Reemplaza los archivos.
2. `firebase deploy`
3. Registra un usuario nuevo en `registrar.html` (los usuarios viejos funcionan, pero no tienen fecha de creación).
4. Usa `agregar.html` con las imágenes de `imaZodiaco/` y la tabla de abajo.

## Datos para cargar

| Pos | Signo | Rango | Elemento | Astro | Piedra | Imagen |
|----|-------|-------|----------|-------|--------|--------|
| 1 | Acuario | Ene/20 - Feb/18 | Aire | Urano | Amatista | 01_Acuario.png |
| 2 | Piscis | Feb/19 - Mar/20 | Agua | Neptuno | Aguamarina | 02_Piscis.png |
| 3 | Aries | Mar/21 - Abr/19 | Fuego | Marte | Diamante | 03_Aries.png |
| 4 | Tauro | Abr/20 - May/20 | Tierra | Venus | Esmeralda | 04_Tauro.png |
| 5 | Géminis | May/21 - Jun/20 | Aire | Mercurio | Ágata | 05_Geminis.png |
| 6 | Cáncer | Jun/21 - Jul/22 | Agua | Luna | Perla | 06_Cancer.png |
| 7 | Leo | Jul/23 - Ago/22 | Fuego | Sol | Rubí | 07_Leo.png |
| 8 | Virgo | Ago/23 - Sep/22 | Tierra | Mercurio | Zafiro | 08_Virgo.png |
| 9 | Libra | Sep/23 - Oct/22 | Aire | Venus | Ópalo | 09_Libra.png |
| 10 | Escorpio | Oct/23 - Nov/21 | Agua | Plutón | Topacio | 10_Escorpio.png |
| 11 | Sagitario | Nov/22 - Dic/21 | Fuego | Júpiter | Turquesa | 11_Sagitario.png |
| 12 | Capricornio | Dic/22 - Ene/19 | Tierra | Saturno | Granate | 12_Capricornio.png |

Si ya tenías signos cargados en clase, abre cada tarjeta en `lista.html` y completa elemento, astro y piedra desde la página de edición.

## Pruebas rápidas
- **Usuarios:** registra un usuario → en Firestore `datosUsuarios` debe tener `fechaCreacion` y `ultAcceso` (tipo timestamp). Cierra sesión, entra otra vez → `ultAcceso` cambia y `fechaCreacion` no.
- **Edición:** clic en una tarjeta → se abre `editar.html?id=...` con los datos → cambia la piedra → guarda → la tarjeta muestra el cambio.
- **Reglas:** en Firestore intenta guardar un elemento distinto de los 4 válidos (p. ej. desde la consola del navegador) → debe dar `permission-denied`.
- **Inactividad:** quédate en `lista.html` sin tocar nada 3 minutos → te manda a `login.html` con el aviso. El contador está en la barra superior.

## Subir a GitHub
```bash
git init
git add .
git commit -m "Laboratorio Firebase Zodiaco"
git branch -M main
git remote add origin https://github.com/just-in-ch/webIII-lab-2-Just-in.git
git push -u origin main
```
Después: Settings → Collaborators → agregar al profesor.

## Texto para entregar en el campus
```
Estudiante: Justin Chavarría
Curso: ITI-621 - Tecnologías y Sistemas Web III
Laboratorio de Firebase

Repositorio GitHub: https://github.com/just-in-ch/webIII-lab-2-Just-in
Sitio web (Firebase Hosting): https://zodiaco-justin.web.app
Usuario de prueba: justinchavarria8592@gmail.com / 85927755

Nota: Cloud Storage no está activado porque Firebase exige el plan Blaze
(con tarjeta) para usarlo en proyectos nuevos. Por eso no se pueden subir
imágenes ni agregar signos. El detalle está en el README del repositorio.
```
