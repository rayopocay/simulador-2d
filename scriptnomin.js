// Validaciones
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      const inputs = form.querySelectorAll('input');
      let soloNumeros = true;

      inputs.forEach(input => {
        const valor = input.value.trim();
        if (valor === '' || isNaN(valor)) {
          soloNumeros = false;
        }
      });

      if (!soloNumeros) {
        return false;
      }

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();

// Elementos del DOM
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const stopButton = document.getElementById('stopButton');
const pxInput = document.getElementById('px');
const pyInput = document.getElementById('py');
const vxInput = document.getElementById('vx');
const vyInput = document.getElementById('vy');
const formInputs = [pxInput, pyInput, vxInput, vyInput];

// Variables de simulación
let posicion = { x: 100, y: 100 };
let velocidad = { x: 0, y: 0 };
let animationId = null;
let animacionActiva = false;

// Bloquear/desbloquear inputs
function toggleInputs(disabled) {
  formInputs.forEach(input => {
    input.disabled = disabled;
  });
}

// Dibujar la pelota
function dibujarPelota() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(posicion.x, posicion.y, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#007bff";
  ctx.fill();
}

// Actualizar posición desde inputs (posición no negativa)
function actualizarPosicionDesdeInputs() {
  const nuevoX = parseFloat(pxInput.value);
  const nuevoY = parseFloat(pyInput.value);

  if (!isNaN(nuevoX)) {
    if (nuevoX >= 0) {
      posicion.x = nuevoX;
    } else {
      alert("No se permiten números negativos para posición X");
      pxInput.value = 100;
      posicion.x = 100;
    }
  }

  if (!isNaN(nuevoY)) {
    if (nuevoY >= 0) {
      posicion.y = nuevoY;
    } else {
      alert("No se permiten números negativos para posición Y");
      pyInput.value = 100;
      posicion.y = 100;
    }
  }

  dibujarPelota();
}

// Animación
function animar() {
  posicion.x += velocidad.x;
  posicion.y += velocidad.y;

  // Rebote en bordes
  if (posicion.x < 20 || posicion.x > canvas.width - 20) {
    velocidad.x *= -1;
  }
  if (posicion.y < 20 || posicion.y > canvas.height - 20) {
    velocidad.y *= -1;
  }

  pxInput.value = Math.round(posicion.x);
  pyInput.value = Math.round(posicion.y);

  dibujarPelota();

  if (animacionActiva) {
    animationId = requestAnimationFrame(animar);
  }
}

// Iniciar simulación
function iniciarSimulacion(event) {
  event.preventDefault();

  const valoresValidos = formInputs.every(input => {
    const valor = input.value.trim();
    return valor !== "" && !isNaN(parseFloat(valor));
  });

  if (!valoresValidos) {
    alert("Por favor, complete todos los campos con números válidos.");
    return false;
  }

  // Ahora sí permitimos velocidad negativa
  actualizarPosicionDesdeInputs();
  velocidad.x = parseFloat(vxInput.value) || 0;
  velocidad.y = parseFloat(vyInput.value) || 0;

  if (!animacionActiva) {
    animacionActiva = true;
    toggleInputs(true);
    document.getElementById("reflejar").disabled = true;
    animar();
  }

  return false;
}

// Detener animación
function detenerAnimacion() {
  animacionActiva = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  toggleInputs(false);
  document.getElementById("reflejar").disabled = false;
  dibujarPelota();
}

// Eventos para inputs manuales
pxInput.addEventListener('input', function() {
  if (!animacionActiva) {
    const valor = parseFloat(this.value);
    if (!isNaN(valor)) {
      posicion.x = valor;
      dibujarPelota();
    }
  }
});

pyInput.addEventListener('input', function() {
  if (!animacionActiva) {
    const valor = parseFloat(this.value);
    if (!isNaN(valor)) {
      posicion.y = valor;
      dibujarPelota();
    }
  }
});

pxInput.addEventListener('change', function() {
  if (!animacionActiva) actualizarPosicionDesdeInputs();
});

pyInput.addEventListener('change', function() {
  if (!animacionActiva) actualizarPosicionDesdeInputs();
});

// Botón detener
stopButton.addEventListener('click', detenerAnimacion);

// Inicializar
function inicializar() {
  pxInput.value = posicion.x;
  pyInput.value = posicion.y;
  vxInput.value = '';
  vyInput.value = '';

  function ajustarCanvas() {
    if (window.innerWidth <= 600) {
      canvas.height = 280;
      canvas.width = 280;
    } else if (window.innerWidth <= 440) {
      canvas.height = 198;
    } else if (window.innerWidth >= 600) {
      canvas.width = 280;
      canvas.height = 280;
    } else {
      canvas.height = 280;
    }
    dibujarPelota();
  }

  ajustarCanvas();
  window.addEventListener("resize", ajustarCanvas);
  dibujarPelota();
}

// --- CONTROL CON TECLADO ---
window.addEventListener("keydown", function (event) {
  if (!animacionActiva) return;

  const cambio = 1; // incremento o decremento por pulsación

  switch (event.key) {
    case "ArrowUp":
      velocidad.y -= cambio;
      break;
    case "ArrowDown":
      velocidad.y += cambio;
      break;
    case "ArrowLeft":
      velocidad.x -= cambio;
      break;
    case "ArrowRight":
      velocidad.x += cambio;
      break;
  }

  vxInput.value = velocidad.x;
  vyInput.value = velocidad.y;
});

inicializar();
