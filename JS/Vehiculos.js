const API_URL = 'https://retoolapi.dev/Pz0Vpi/Vehiculo'

//EndPoint de Imgbb
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=b5b4da814644c515b4bd40840a18e373'

const form = document.getElementById('vehiculo-form'); 
const tipo = document.getElementById('tipo'); 
const marca = document.getElementById('marca'); 
const modelo = document.getElementById('modelo'); 
const color = document.getElementById('color');
const placa = document.getElementById('placa');
const anio = document.getElementById('anio');
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
    const confirmacion = confirm('¿Eliminar este vehiculo?');

    if (confirmacion) {
        await fetch(`${API_URL}/${id}`, {method: 'DELETE' });
        CargarVehiculos();
        alert("El registro fue eliminado");
    }else{
        alert("Se cancelo la accion");
        return;
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
        Imagen : imagenUrl
    };
    if (idEl.value){
        await fetch(`${API_URL}/${idEl.value}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        alert("Registro Actualizado");
    }
    else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert("Registro agregado");
    }
    form.reset();
    cancelBtn.hidden = true;
    submitBtn.textContent = "Agregar";
    idEl.value = "";
    CargarVehiculos();
});
