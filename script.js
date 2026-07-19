// ============ Mobile nav ============
function initNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }));
}

// ============ Scroll reveal ============
function initReveal(){
  const targets = document.querySelectorAll(
    '.section-head, .research-card, .pub-list li, .team-card, .news-list li, .cta-inner'
  );
  targets.forEach(t => t.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.12 });

  targets.forEach(t => io.observe(t));
}

// ============ Live AQI widget ============
// Fallback location: IISER Kolkata, Mohanpur campus
const FALLBACK_LOCATION = { lat: 22.9587, lon: 88.5236, label: 'IISER Kolkata (default)' };

// US EPA AQI breakpoints
const AQI_LEVELS = [
  { max: 50,  label: 'Good',                             varName: '--aqi-good' },
  { max: 100, label: 'Moderate',                         varName: '--aqi-moderate' },
  { max: 150, label: 'Unhealthy for Sensitive Groups',    varName: '--aqi-sensitive' },
  { max: 200, label: 'Unhealthy',                         varName: '--aqi-unhealthy' },
  { max: 300, label: 'Very Unhealthy',                    varName: '--aqi-very-unhealthy' },
  { max: Infinity, label: 'Hazardous',                    varName: '--aqi-hazardous' },
];

function categorizeAqi(value){
  return AQI_LEVELS.find(level => value <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

async function fetchAqi(lat, lon){
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=auto`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('AQI request failed');
  const data = await res.json();
  return data.current;
}

function renderAqi(current, locationLabel){
  const valueEl = document.getElementById('aqiValue');
  const catEl = document.getElementById('aqiCategory');
  const locEl = document.getElementById('aqiLocation');
  const pollutantsEl = document.getElementById('aqiPollutants');
  const dotEl = document.getElementById('aqiDot');

  if(current == null || current.us_aqi == null){
    valueEl.textContent = '—';
    catEl.textContent = 'Data unavailable';
    locEl.textContent = locationLabel;
    pollutantsEl.innerHTML = '';
    return;
  }

  const aqi = Math.round(current.us_aqi);
  const level = categorizeAqi(aqi);
  const color = getComputedStyle(document.documentElement).getPropertyValue(level.varName).trim();

  valueEl.textContent = aqi;
  valueEl.style.color = color;
  catEl.textContent = level.label;
  catEl.style.color = color;
  locEl.textContent = locationLabel;
  dotEl.style.background = color;

  const pm25 = current.pm2_5 != null ? current.pm2_5.toFixed(1) : '—';
  const pm10 = current.pm10 != null ? current.pm10.toFixed(1) : '—';
  pollutantsEl.innerHTML = `<span>PM2.5 <b>${pm25}</b></span><span>PM10 <b>${pm10}</b></span>`;
}

function setAqiLoading(message){
  document.getElementById('aqiValue').textContent = '--';
  document.getElementById('aqiCategory').textContent = message;
  document.getElementById('aqiCategory').style.color = '';
  document.getElementById('aqiValue').style.color = '';
}

async function loadAqiFor(lat, lon, label){
  setAqiLoading('Loading…');
  try{
    const current = await fetchAqi(lat, lon);
    renderAqi(current, label);
  }catch(err){
    document.getElementById('aqiCategory').textContent = 'Unable to load';
    document.getElementById('aqiLocation').textContent = 'Check your connection and retry';
  }
}

function initAqiWidget(){
  const locateBtn = document.getElementById('aqiLocate');
  const refreshBtn = document.getElementById('aqiRefresh');
  let current = { lat: FALLBACK_LOCATION.lat, lon: FALLBACK_LOCATION.lon, label: FALLBACK_LOCATION.label };

  function tryGeolocation(){
    if(!navigator.geolocation){
      loadAqiFor(current.lat, current.lon, current.label);
      locateBtn.hidden = true;
      return;
    }
    setAqiLoading('Locating…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        current = { lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' };
        loadAqiFor(current.lat, current.lon, current.label);
        locateBtn.hidden = true;
      },
      () => {
        // permission denied or unavailable — fall back
        loadAqiFor(current.lat, current.lon, current.label);
        locateBtn.hidden = false;
      },
      { timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  }

  refreshBtn.addEventListener('click', () => loadAqiFor(current.lat, current.lon, current.label));
  locateBtn.addEventListener('click', tryGeolocation);

  tryGeolocation();
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initAqiWidget();
});