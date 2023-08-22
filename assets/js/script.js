const solicitudes = [
    { elementId: "solicitud1", contenidoId: "contenido", start: 1, end: 5, colorClass: "color-icon1" },
    { elementId: "solicitud2", contenidoId: "contenido2", start: 6, end: 10, colorClass: "color-icon2" },
    { elementId: "solicitud3", contenidoId: "contenido3", start: 12, end: 16, colorClass: "color-icon3" }
];

function fetchData(url) {
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data);
}

function createTimelineContent(data, colorClass) {
    return `
        <div>
            <div class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.5s">
                <div class="timeline-icon ${colorClass}"><i class="fa fa-address-card" aria-hidden="true"></i></div>
                <div class="timeline-text">
                    <h6>${data.name}</h6>
                    <p>Alt:${data.height}cm Peso:${data.mass} Kg</p>
                </div>
            </div>
        </div>`;
}

solicitudes.forEach((solicitud) => {
    const elementoSolicitud = document.getElementById(solicitud.elementId);
    const contenido = document.getElementById(solicitud.contenidoId);
    let mouseDentro = false;

    elementoSolicitud.addEventListener("mouseover", function () {
        if (!mouseDentro) {
            const generador = function* (start, end) {
                for (let i = start; i <= end; i++) {
                    yield fetchData(`https://swapi.dev/api/people/${i}/?format=json`);
                }
            };

            const procesos = generador(solicitud.start, solicitud.end);
            let cantidadUrl = solicitud.start;

            const impresion = setInterval(() => {
                const promesaData = procesos.next().value;

                if (!promesaData) {
                    clearInterval(impresion);
                    return;
                }

                promesaData.then((data) => {
                    contenido.innerHTML += createTimelineContent(data, solicitud.colorClass);
                });

                if (cantidadUrl >= solicitud.end) {
                    clearInterval(impresion);
                }

                cantidadUrl++;
            }, 1000);

            mouseDentro = true;
        }
    });
});
