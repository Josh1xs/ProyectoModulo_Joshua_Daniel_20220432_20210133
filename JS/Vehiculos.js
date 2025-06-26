const API_URL = 'https://retoolapi.dev/Pz0Vpi/Vehiculo'

//EndPoint de Imgbb
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=545bee52e1a73fb3043c583f43d3a296'

const form = document.getElementById('vehiculo-form'); 
const tipo = document.getElementById('nombre'); 
const marca = document.getElementById('marca'); 
const modelo = document.getElementById('modelo'); 
const color = document.getElementById('color');
const placa = document.getElementById('placa');
const anio = document.getElementById('anio');
const imagenFileEl = document.getElementById('imagen-file'); 
const imagenUrlEl = document.getElementById('imagen-url'); 
const idEl = document.getElementById('persona-id'); 
const cancelBtn = document.getElementById('btn-cancel'); 
const submitBtn = document.getElementById('btn-submit'); 
const tbody = document.getElementById('personas-tbody');

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
        <td>${vehiculo.tipo}</td>
        <td>${vehiculo.marca}</td>
        <td>${vehiculo.modelo}</td>
        <td>${vehiculo.color}</td>
        <td>${vehiculo.placa}</td>
        <td>${vehiculo.anio}</td>
        <td><img src="${vehiculo.imagen}" alt="Foto de ${vehiculo.nombre}" /></td>
        <td>
        <button onclick="CargarParaEditar('${persona.id}')">Editar</button>
        <button onclick="BorrarPersona('${persona.id})')">Eliminar</button>
        </td>
        </tr>
        `;
    });
}

window.addEventListener('DOMContentLoaded', CargarVehiculos);