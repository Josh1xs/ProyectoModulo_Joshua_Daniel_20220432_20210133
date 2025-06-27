const API_URL = 'https://retoolapi.dev/bAyRhX/data'

//EndPoint de Imgbb
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=b5b4da814644c515b4bd40840a18e373'

const form = document.getElementById('vehiculo-form'); 
const tipo = document.getElementById('tipo'); 
const marca = document.getElementById('marca'); 
const modelo = document.getElementById('modelo'); 
const color = document.getElementById('color');
const placa = document.getElementById('placa');
const anio = document.getElementById('anio');
const precio = document.getElementById('precio');
const imagenFileEl = document.getElementById('imagen-file'); 
const imagenUrlEl = document.getElementById('imagen-url'); 
const idEl = document.getElementById('vehiculo-id'); 
const cancelBtn = document.getElementById('btn-cancel'); 
const submitBtn = document.getElementById('btn-submit'); 
const tbody = document.getElementById('vehiculos-tbody');

async function CargarVehiculos() {
    const res = await fetch(API_URL)
    const data = await res.json();
    CargarTabla(data);
}

function CargarTabla(vehiculos){
    tbody.innerHTML = '';
    vehiculos.forEach(vehiculo => {
        tbody.innerHTML += `
        <tr>
            <td>${vehiculo.id}</td>
            <td>${vehiculo.Tipo}</td>
            <td>${vehiculo.Marca}</td>
            <td>${vehiculo.Modelo}</td>
            <td>${vehiculo.Color}</td>
            <td>${vehiculo.Placa}</td>
            <td>${vehiculo.Anio}</td>
           <td>${vehiculo.precio}</td>
            <td><img src="${vehiculo.Imagen}" alt="Foto de ${vehiculo.Tipo}" /></td>
            <td>
                <button onclick="CargarParaEditar('${vehiculo.id}')">Editar</button>
                <button onclick="BorrarVehiculo('${vehiculo.id}')">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

window.addEventListener('DOMContentLoaded', CargarVehiculos);

async function BorrarVehiculo(id) {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el vehículo de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (resultado.isConfirmed) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await CargarVehiculos();
  
        Swal.fire('¡Eliminado!', 'El vehículo fue eliminado con éxito.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el vehículo.', 'error');
      }
    } else {
      Swal.fire('Cancelado', 'La acción fue cancelada.', 'info');
    }
  }

async function CargarParaEditar(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    tipo.value = p.Tipo;
    marca.value = p.Marca;
    modelo.value = p.Modelo;
    color.value = p.Color;
    placa.value = p.Placa;
    anio.value = p.Anio;
    precio.value = p.precio;
    imagenUrlEl.value = p.Imagen;
    imagenFileEl.value = '';
    idEl.value = p.id;

    submitBtn.textContent = 'Actualizar';
    cancelBtn.hidden = false;
}
cancelBtn.addEventListener('click', () =>{
    form.reset();
    idEl.value = '';
    submitBtn.textContent = 'Agregar';
    cancelBtn.hidden = true;
});

async function subirImagen(file) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(IMG_API_URL,{method: "POST", body: fd});
    const obj = await res.json();
    return obj.data.url;
}

form.addEventListener('submit',async (e) =>{
    e.preventDefault();

    //Validaciones de los campos del formulario
const soloLetras = /^[A-Za-z\s]+$/;
const formatoPlaca = /^[A-Z]{1}\d{3}-\d{3}$/;
const anioNumero = Number(anio.value);
const palabrasTipo = tipo.value.trim().split(/\s+/).length;
const palabrasMarca = marca.value.trim().split(/\s+/).length;


    if (!soloLetras.test(tipo.value) || palabrasTipo > 100){
        return Swal.fire('Error', 'El campo Tipo solo debe contener letras y hasta 100 palabras.','error');
    }
    if (!soloLetras.test(marca.value)|| palabrasMarca > 100){
        return Swal.fire('Error', 'El campo Marca solo debe contener letras y hasta 100 palabras.','error');
    }
     if (!soloLetras.test(color.value)) {
        return Swal.fire('Error', 'El campo Color solo debe contener letras.', 'error');
    }
    if (!formatoPlaca.test(placa.value)) {
    return Swal.fire('Error', 'La placa debe tener el formato: P222-111 (una letra, tres números, guion y tres números).', 'error');
}


    let imagenUrl = imagenUrlEl.value;
    if (imagenFileEl.files.length > 0){
        imagenUrl = await subirImagen(imagenFileEl.files[0]);
    }
    const payload = {
        Tipo : tipo.value,
        Marca : marca.value,
        Modelo : modelo.value,
        Color : color.value,
        Placa : placa.value,
        Anio : anio.value,
        precio : precio.value,
        Imagen : imagenUrl
    };
    if (idEl.value){
        await fetch(`${API_URL}/${idEl.value}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        Swal.fire('¡Actualizado!', 'El vehículo fue modificado correctamente.', 'success');
    }
    else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        Swal.fire('¡Hecho!', 'Vehículo agregado con éxito', 'success');
    }
    form.reset();
    cancelBtn.hidden = true;
    submitBtn.textContent = "Agregar";
    idEl.value = "";
    CargarVehiculos();
});
