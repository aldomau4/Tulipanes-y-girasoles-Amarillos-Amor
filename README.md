# Tulipanes y Girasoles Amarillos

Experiencia interactiva de flores amarillas con animaciones, estrellas, corazones, dedicatorias, fotografías, video y música.

## Caracteristicas

- Flores centrales animadas y girasoles ilustrados con movimiento organico.
- Cielo de estrellas y constelacion de corazones.
- Dedicatorias flotantes configurables.
- Fotografias y videos que pueden abrirse al tocarlos.
- Musica integrada con reproduccion automatica cuando el navegador lo permite.
- Configurador local para preparar el regalo sin editar el codigo principal.
- Diseño responsive para navegador y telefono.

## Uso Rapido

1. Descarga o clona el repositorio.
2. Abre `Configurar regalo.bat` para editar la dedicatoria.
3. Selecciona destinatario, remitente, mensajes, fotos, video y musica.
4. Guarda la configuracion.
5. Abre `index.html` en el navegador.

El configurador necesita Python 3 con Tkinter.

## Configuracion Manual

La configuracion publica se encuentra en `site-config.js`:

```js
window.FLOWERS_CONFIG = {
    recipient: 'Nombre de la persona',
    sender: 'Tu nombre',
    intro: 'Texto de introduccion.',
    messages: [
        { text: 'Una dedicatoria.', label: 'para ti' },
    ],
    media: [
        { type: 'image', src: 'media/foto.jpg', text: 'Un recuerdo.', label: 'nuestro momento' },
        { type: 'video', src: 'media/video.mp4', text: 'Un instante.', label: 'para recordar' },
    ],
    song: {
        src: 'media/cancion.mp3',
    },
};
```

Los archivos multimedia deben estar dentro de `media/` y sus rutas deben coincidir con `site-config.js`.

## Archivos Principales

- `index.html`: estructura de la experiencia.
- `main.css`: animacion original de las flores centrales.
- `romance.css`: universo visual, responsive y estilos de recuerdos.
- `main.js`: animaciones, tarjetas, visor multimedia y musica.
- `site-config.js`: mensajes y contenido visible de la dedicatoria.
- `configurar.py`: editor local de contenido y multimedia.
- `Configurar regalo.bat`: acceso rapido al editor local en Windows.

## Privacidad

`configuracion-privada.json` se excluye del repositorio porque puede contener rutas locales. La pagina no depende de ese archivo: usa `site-config.js` para mostrar los mensajes y archivos publicados.
