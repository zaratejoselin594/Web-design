document.getElementById('registroForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let esValido = true;

  // Validación de nombre y apellido (solo letras)
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const soloNumeros = /^\d+$/;

  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const telefono = document.getElementById('telefono');
  const dni = document.getElementById('dni');
  const cbu = document.getElementById('cbu');

  // Validar nombre
  if (!soloLetras.test(nombre.value)) {
    document.getElementById('errorNombre').textContent = 'Ingrese solo letras.';
    esValido = false;
  } else {
    document.getElementById('errorNombre').textContent = '';
  }

  // Validar apellido
  if (!soloLetras.test(apellido.value)) {
    document.getElementById('errorApellido').textContent = 'Ingrese solo letras.';
    esValido = false;
  } else {
    document.getElementById('errorApellido').textContent = '';
  }

  // Validar teléfono, DNI y CBU (solo números)
  if (!soloNumeros.test(telefono.value)) {
    document.getElementById('errorTelefono').textContent = 'Ingrese solo números.';
    esValido = false;
  } else {
    document.getElementById('errorTelefono').textContent = '';
  }

  if (!soloNumeros.test(dni.value)) {
    document.getElementById('errorDni').textContent = 'Ingrese solo números.';
    esValido = false;
  } else {
    document.getElementById('errorDni').textContent = '';
  }

  if (!soloNumeros.test(cbu.value)) {
    document.getElementById('errorCbu').textContent = 'Ingrese solo números.';
    esValido = false;
  } else {
    document.getElementById('errorCbu').textContent = '';
  }

  if (esValido) {
    alert('Formulario enviado correctamente.');
    document.getElementById('registroForm').reset();
  }
});