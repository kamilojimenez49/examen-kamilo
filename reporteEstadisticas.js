const session = JSON.parse(sessionStorage.getItem("acme_Session"));
if (!session) {
    window.location.href = "/HTML/login.html";
}

const btnSalir = document.getElementById("btn-salir");
btnSalir.addEventListener("click", function(e) {
    e.preventDefault();
    sessionStorage.removeItem("acme_Session");
    window.location.href = "/HTML/login.html";
});

const tablaReporte = document.getElementById("tablaReporte");
const contador = document.getElementById("contador");

const examenes = JSON.parse(localStorage.getItem("acme_examenes")) || [];
const resultados = JSON.parse(localStorage.getItem("acme_resultados")) || [];

function obtenerEstadisticas(codigoExamen) {
    const resultadosExamen = resultados.filter(r => r.codigoExamen === codigoExamen);
    const totalEstudiantes = resultadosExamen.length;

    if (totalEstudiantes === 0) {
        return { totalEstudiantes: 0, promedio: null };
    }

    const suma = resultadosExamen.reduce((acc, r) => acc + r.porcentaje, 0);
    const promedio = Math.round(suma / totalEstudiantes);

    return { totalEstudiantes, promedio };
}

function clasePromedio(promedio, porcentajeAprobacion) {
    if (promedio === null) return "";
    if (promedio >= porcentajeAprobacion) return "promedio-alto";
    if (promedio >= porcentajeAprobacion * 0.7) return "promedio-medio";
    return "promedio-bajo";
}

function mostrarReporte() {
    tablaReporte.innerHTML = "";

    examenes.forEach(examen => {
        const { totalEstudiantes, promedio } = obtenerEstadisticas(examen.codigo);

        const tr = document.createElement("tr");

        const tdCodigo = document.createElement("td");
        tdCodigo.classList.add("td-codigo");
        tdCodigo.textContent = examen.codigo;

        const tdTitulo = document.createElement("td");
        tdTitulo.textContent = examen.titulo;

        const tdAprobacion = document.createElement("td");
        tdAprobacion.textContent = examen.porcentaje + "%";

        const tdEstudiantes = document.createElement("td");
        tdEstudiantes.textContent = totalEstudiantes;

        const tdPromedio = document.createElement("td");
        tdPromedio.classList.add("td-promedio");
        if (promedio === null) {
            tdPromedio.textContent = "Sin datos";
            tdPromedio.classList.add("sin-datos");
        } else {
            tdPromedio.textContent = promedio + "%";
            tdPromedio.classList.add(clasePromedio(promedio, examen.porcentaje));
        }

        tr.appendChild(tdCodigo);
        tr.appendChild(tdTitulo);
        tr.appendChild(tdAprobacion);
        tr.appendChild(tdEstudiantes);
        tr.appendChild(tdPromedio);

        tablaReporte.appendChild(tr);
    });

    contador.textContent = examenes.length + " registros";
}

mostrarReporte();
