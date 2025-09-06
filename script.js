const API_KEY = "f7e7a7e2b149460d8e70038a06485d1a"; // substitua pela sua chave real

// Inicializa o mapa Leaflet centrado em São Paulo
let map = L.map('map').setView([-23.55052, -46.633308], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
let marker;

async function buscar() {
  const endereco = document.getElementById("endereco").value.trim();
  if (!endereco) {
    document.getElementById("resultado").textContent = "";
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    return;
  }
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(endereco)}&key=${API_KEY}&language=pt&pretty=1`;
  
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    
    if (dados.results.length > 0) {
      const loc = dados.results[0];
      document.getElementById("resultado").textContent =
        `Endereço formatado: ${loc.formatted}
Latitude: ${loc.geometry.lat}
Longitude: ${loc.geometry.lng}`;
      
      // Adiciona marcador no mapa
      if (marker) map.removeLayer(marker);
      marker = L.marker([loc.geometry.lat, loc.geometry.lng]).addTo(map)
        .bindPopup(`<b>${loc.formatted}</b>`).openPopup();
      map.setView([loc.geometry.lat, loc.geometry.lng], 16);
    } else {
      document.getElementById("resultado").textContent = "Local não encontrado.";
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    document.getElementById("resultado").textContent = "Erro na requisição.";
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
  }
  
}

