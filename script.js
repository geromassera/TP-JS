// Clase Estudiante
class Estudiante {
  constructor(nombre, edad, nota) {
    this.nombre = nombre;
    this.edad = edad;
    this.nota = nota;
  }

  presentarse() {
    return `${this.nombre} (${this.edad} años) - Nota: ${this.nota}`;
  }
}

// Clase Curso
class Curso {
  constructor(nombre, profesor) {
    this.nombre = nombre;
    this.profesor = profesor;
    this.estudiantes = [];
  }

  agregarEstudiante(estudiante) {
    this.estudiantes.push(estudiante);

  }

  listarEstudiantes() {
    return this.estudiantes.map((est) => est.presentarse()).join("<br>");
  }

  obtenerPromedio() {
    let totalNotas = this.estudiantes.reduce(
      (total, est) => total + est.nota,
      0
    );
    return this.estudiantes.length > 0
      ? (totalNotas / this.estudiantes.length).toFixed(2)
      : "N/A";
  }
}

// Arreglo para almacenar los cursos
let cursos = [];

// DOM elements
const formCurso = document.getElementById("form-curso");
const formEstudiante = document.getElementById("form-estudiante");
const cursoEstudianteSelect = document.getElementById("curso-estudiante");
const listaCursos = document.getElementById("lista");

// Evento para agregar un curso
formCurso.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombreCurso = document.getElementById("nombre-curso").value;
  const profesorCurso = document.getElementById("profesor-curso").value;

  const nuevoCurso = new Curso(nombreCurso, profesorCurso);
  cursos.push(nuevoCurso);

  formCurso.reset();

  actualizarCursosSelect();

  mostrarCursos();
  calcularEstadisticas();
});

// Evento para agregar un estudiante
formEstudiante.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombreEstudiante = document.getElementById("nombre-estudiante").value;
  const edadEstudiante = parseInt(
    document.getElementById("edad-estudiante").value
  );
  const notaEstudiante = parseFloat(
    document.getElementById("nota-estudiante").value
  );
  const cursoIndex = cursoEstudianteSelect.value;

  const nuevoEstudiante = new Estudiante(
    nombreEstudiante,
    edadEstudiante,
    notaEstudiante
  );

  if (validarEdadYNota(edadEstudiante, notaEstudiante)) {
    cursos[cursoIndex].agregarEstudiante(nuevoEstudiante);

    formEstudiante.reset();

    mostrarCursos();
    calcularEstadisticas();
  }
});

// Función para actualizar el select de cursos
function actualizarCursosSelect() {
  cursoEstudianteSelect.innerHTML = "";
  cursos.forEach((curso, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.textContent = curso.nombre;
    cursoEstudianteSelect.appendChild(option);
  });
}

// Función para mostrar los cursos y estudiantes
function mostrarCursos() {
  listaCursos.innerHTML = "";
  cursos.forEach((curso, index) => {
    let cursoDiv = document.createElement("div");
    cursoDiv.classList.add("curso");
    cursoDiv.id = `curso-${curso.nombre}`;

    cursoDiv.innerHTML = `
      <h3>Curso: ${curso.nombre} (Profesor: ${curso.profesor})</h3>
      <p><strong>Promedio:</strong> ${curso.obtenerPromedio()}</p>
      <div id="estudiantes-${curso.nombre}">
        <strong>Estudiantes:</strong><br>
        ${
          curso.estudiantes.length > 0
            ? curso.estudiantes
                .map(
                  (est, estudianteIndex) => `
          <div id="estudiante-${curso.nombre}-${est.nombre.toLowerCase()}">
            ${est.presentarse()}
            <button class="editar-estudiante" data-curso-index="${index}" data-estudiante-index="${estudianteIndex}">Editar Estudiante</button>
            <button class="eliminar-estudiante" data-curso-index="${index}" data-estudiante-index="${estudianteIndex}">Eliminar Estudiante</button>
          </div>
        `
                )
                .join("")
            : "No hay estudiantes en este curso."
        }
      </div>
      <button class="eliminar-curso" data-index="${index}">Eliminar Curso</button>
      <button class="editar-curso" data-index="${index}">Editar Curso</button>
    `;

    listaCursos.appendChild(cursoDiv);
  });

  // Agregar evento de eliminar curso
  listaCursos.querySelectorAll(".eliminar-curso").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      eliminarCurso(index);
    });
  });

  // Agregar evento de editar curso
  listaCursos.querySelectorAll(".editar-curso").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      editarCurso(index);
    });
  });

  // Evento de editar estudiante
  listaCursos.querySelectorAll(".editar-estudiante").forEach((button) => {
    button.addEventListener("click", (e) => {
      const cursoIndex = parseInt(e.target.getAttribute("data-curso-index"));
      const estudianteIndex = parseInt(
        e.target.getAttribute("data-estudiante-index")
      );
      editarEstudiante(cursoIndex, estudianteIndex);
    });
  });

  // Evento de eliminar estudiante
  listaCursos.querySelectorAll(".eliminar-estudiante").forEach((button) => {
    button.addEventListener("click", (e) => {
      const cursoIndex = parseInt(e.target.getAttribute("data-curso-index"));
      const estudianteIndex = parseInt(
        e.target.getAttribute("data-estudiante-index")
      );
      eliminarEstudiante(cursoIndex, estudianteIndex);
    });
  });
}

// Función editar estudiante
function editarEstudiante(cursoIndex, estudianteIndex) {
  const curso = cursos[cursoIndex];
  const estudiante = curso.estudiantes[estudianteIndex];
  const nombre = prompt('Ingrese el nuevo nombre del estudiante:', estudiante.nombre);
  const edad = prompt('Ingrese la nueva edad del estudiante:', estudiante.edad);
  const nota = prompt('Ingrese la nueva nota del estudiante:', estudiante.nota);
  
  if (nombre && edad && nota && validarEdadYNota(edad, nota)) {
    estudiante.nombre = nombre;
    estudiante.edad = parseInt(edad);
    estudiante.nota = parseFloat(nota);
    mostrarCursos();
    calcularEstadisticas();

  }
}

// Función eliminar estudiante
function eliminarEstudiante(cursoIndex, estudianteIndex) {
  const curso = cursos[cursoIndex];
  curso.estudiantes.splice(estudianteIndex, 1);
  mostrarCursos();
  calcularEstadisticas();
}

// Función para eliminar un curso
function eliminarCurso(index) {
  cursos.splice(index, 1);
  actualizarCursosSelect();
  mostrarCursos();
  calcularEstadisticas();
}

// Función para editar un curso
function editarCurso(index) {
  const curso = cursos[index];
  const nombre = prompt("Ingrese el nuevo nombre del curso:", curso.nombre);
  const profesor = prompt(
    "Ingrese el nuevo profesor del curso:",
    curso.profesor
  );

  if (nombre && profesor) {
    curso.nombre = nombre;
    curso.profesor = profesor;
    mostrarCursos();
    calcularEstadisticas();

  }
}

// Estadisticas
function calcularEstadisticas() {
  const totalCursos = cursos.length;
  let totalEstudiantes = 0;
  let sumaNotas = 0;
  let numeroTotalNotas = 0;
  let mejorCurso = null;
  let mejorPromedio = -1;

  cursos.forEach((curso) => {
    totalEstudiantes += curso.estudiantes.length;

    if (curso.estudiantes.length > 0) {
      const promedioCurso = parseFloat(curso.obtenerPromedio());

      curso.estudiantes.forEach((est) => {
        sumaNotas += est.nota;
        numeroTotalNotas++;
      });

      if (promedioCurso > mejorPromedio) {
        mejorPromedio = promedioCurso;
        mejorCurso = curso.nombre;
      }
    }
  });

  const promedioGeneral =
    numeroTotalNotas > 0 ? (sumaNotas / numeroTotalNotas).toFixed(2) : 0;

  document.getElementById("total-cursos").textContent = totalCursos;
  document.getElementById("total-estudiantes").textContent = totalEstudiantes;
  document.getElementById("promedio-general").textContent = promedioGeneral;

  document.getElementById("mejor-curso").textContent = mejorCurso
    ? `${mejorCurso} (Promedio: ${mejorPromedio.toFixed(2)})`
    : "N/A";
}

// Exportar a JSON
function exportarJSON() {
  const dataStr = JSON.stringify(cursos, null, 2); // Convertir a JSON
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "cursos-estudiantes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Evento exportar a JSON
document.getElementById("export-json").addEventListener("click", exportarJSON);

// Validar edad y nota
function validarEdadYNota(edad, nota) {
  let errorText = document.getElementById("errorText");
  let errorCartel = document.getElementById("mensajeError");
  if (edad <= 0) {
    errorText.textContent =
      "La edad debe ser mayor a 0. Por favor, ingrese una edad válida.";
    errorCartel.classList.add("mostrar");
    return false;
  }
  if (nota < 0 || nota > 10) {
    errorText.textContent =
      "La nota debe estar entre 0 y 10. Por favor, ingrese una nota válida.";
    errorCartel.classList.add("mostrar");
    return false;
  }
  return true;
}

// Función para buscar estudiantes por nombre
document.getElementById("busqueda-estudiante").addEventListener("input", () => {
  const busquedaEstudiante = document
    .getElementById("busqueda-estudiante")
    .value.trim()
    .toLowerCase();

  // Filtrar cursos y mostrar solo los que coincidan con la búsqueda
  cursos.forEach((curso) => {
    curso.estudiantes.forEach((estudiante) => {
      const nombreEstudiante = estudiante.nombre.toLowerCase();
      const elementoEstudiante = document.getElementById(
        `estudiante-${curso.nombre}-${nombreEstudiante}`
      );

      if (nombreEstudiante.includes(busquedaEstudiante)) {
        elementoEstudiante.style.display = "block";
      } else {
        elementoEstudiante.style.display = "none";
      }
    });
  });
});

// Función para filtrar cursos por profesor
document.getElementById("busqueda-curso").addEventListener("input", () => {
  const busquedaProfesor = document
    .getElementById("busqueda-curso")
    .value.trim()
    .toLowerCase();

  cursos.forEach((curso) => {
    const nombreProfesor = curso.profesor.toLowerCase();
    const elementoCurso = document.getElementById(`curso-${curso.nombre}`);

    if (nombreProfesor.includes(busquedaProfesor)) {
      elementoCurso.style.display = "block";
    } else {
      elementoCurso.style.display = "none";
    }
  });
});
