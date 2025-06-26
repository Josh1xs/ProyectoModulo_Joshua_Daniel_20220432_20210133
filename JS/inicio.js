const API_URL = 'https://retoolapi.dev/Pz0Vpi/Vehiculo'
const container = document.getElementById('cards-container')

async function CargarVehiculos(params) {
    try {
        const res = await fetch(API_URL)
        const data = await res.json();
        CargarTarjetas(data);
    } catch (error) {
        console.error('Error al cargar datos: ', error)
        container.innerHTML = '<p>Error al cargar las personas.</p>'
    }
}

function CargarTarjetas(vehiculos){
    container.innerHTML = '';
    if(vehiculos.length == 0){
        container.innerHTML = "<p>No hay personas registradas</p>";
        return;
    }
    vehiculos.forEach(vehiculos => {
        container.innerHTML += `
        <div class="card">
        <h2>${vehiculos.marca}</h2>
        <img src="${vehiculos.imagen}" alt= "Foto de perfil">
        <p>${vehiculos.placa}</p>
        </div>
         `;
    });
}

window.addEventListener('DOMContentLoaded',CargarVehiculos);