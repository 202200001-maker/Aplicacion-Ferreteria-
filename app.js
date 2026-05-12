//Obtenemos el contenerdor principal donde se van a cargar las vistas (pantallas)
//Ejemplo: home, tutorial, settings, etc.
const viewContainer = document.getElementById("view-container");

//Creamos un objeto cache para guardar las vistas ya cargadas
//Esto evita volver a descargarlas y mejora el rendimiento (menos lag)
const viewCache = {};

//Funcion asincrona para cargar una vista dinamica por su nombre
//viewName = nombre del archivo HTML dentro de /views/
async function loadView(viewName) {
      try {

        //Si la vista ya fue cargada anteriormente,
        //usamos el cache en lugar de hacer otra peticion fetch (mas rapido)
        if (viewCache[viewName]) {

            //Insertamos el HTML guardado en el contenedor principal 
            viewContainer.innerHTML = viewCache[viewName];

            //Ejecutamos los scripts especificos de esa vista 
            ejecutarScriptsDeVista(viewName);

            //Salimos de la funcion para no volver a cargarla desde el servidor 
            return;
        }

        //Hacemos una peticion para obtener el archivo HTML de la vista 
        //Ejemplo: ./views/home.html o ./views/tutorial.html
        const response = await fetch('./views/${viewName }.html');

        //Si la respuesta falla (archivo  no existe o error),
        //lanzamos un error personalizado 
        if (!response.ok) {

            throw new Error('No se pudo cargar la vista: ${viewName}');
        }

        //Convertimos la respuesta en el texto (HTML)
        const html = await response.text();

        //Guardamos la vista en cache para futuras cargas 
        //Esto evita recargas innecesarias y mejora el rendimiento 
        viewCache[viewName] = html;

        //Insertamos el HTML de la vista dentro del contenedor principal 
        viewContainer.innerHTML = html;

        //Ejecutamos los scripts especificos de la vista cargada 
        // (por ejemplo: logica del tutorial, dashboard, etc.)

        ejecutarScriptsDeVista(viewName);
        
    }catch (error) {

    // Si ocurre un error, lo mostramos en la consola (debug)
    console.error("Error cargado vista:", error);

    //Mostramos un mensaje visual de error en la interfaz (usando Bootstrap)

    viewContainer.innerHTML = `
    
    <div class="alert alert-danger">
        Error cargando la visita: ${viewName}
    (/div)
    `;
    }
}

//Funcion que inicializa scripts dependiendo de la vista activa
//Sirve para ejecutar logica especifica sin cargar todo el JS global

function ejecutarScriptsDeVista(viewName) {

    //Si la vista cargada es "tutorial"

    if(viewName === "tutorial") {

        //Cargamos dinamicamente su archivo JS que queremos cargar

        cargarScript("js/tutorial.js");
    }
}

//Funcion para cargar archivos JS dinamicamente sin duplicarlos
// src = ruta del archivo JS que queremos cargar

function cargarScript(src) {

    //Verificamos si el script ya fue cargada antes
    //Esto evita duplicar scripts y errores de ejecucion doble
    if(document.querySelector(`script[src="${src}"]`)) return;

    //Creamos una etiqueta <script> nueva
    const script = document.createElement("script");

    //Asignamos la ruta del arcivo JS
    script.src = src;
}

function cargarScript(src){

    const script = document.createElement("script");

    //Asignamos la ruta del archivo JS

    script.src = src;

    //defer = el script al body del documento
    //Esto hace que el navegador lo cargue y ejecute
    
    document.body.appendChild(script);
}

//Evento que se ejecuta cuando el html termina de cargar completamente
document.addEventListener("DOMContentLoaded", () => {

    //Cargamos la vista inicial de la aplicacion
    //IMPORTANTE: esto define que pantalla se ve al abrir la app
    loadView("home");
})


















































