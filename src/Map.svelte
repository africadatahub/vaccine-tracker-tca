<script>
  import chroma from 'chroma-js'
  export let scale = chroma.scale(['ffffff', 'd8352a'])
  import { onMount } from 'svelte'
  import L from 'leaflet'
  import { africa } from '../data/africajson'
  import { countryCodes } from '../data/country-codes'
  import { formatMillions } from './functions'
  let tooltip
  let flagUrl = 'https://hosted.mediahack.co.za/flags/'
  export let allCountries
  export let currentIso

  onMount(async () => {
    addCodes()
    addMap()
    tooltip = document.querySelector('.tooltip')
  })

  function addCodes() {
    africa.features.forEach((f) => {
      let iso_2 = countryCodes.filter(
        (c) => c.iso_3 === f.properties.ADM0_A3
      )[0].iso_2
      f.properties.iso_3 = f.properties.ADM0_A3
      f.properties.iso_2 = iso_2
      f.properties.flag = `${iso_2.toLowerCase()}.svg`
    })
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: hover,
      mousemove: move,
      mouseout: out,
      click: click,
    })
  }

  function hover(feature) {
    let target = feature.target.feature.properties

    let extraInfo = allCountries.filter(
      (d) => d.iso_3 === target.iso_3.toLowerCase()
    )[0]

    let tt = `<div class="tt-title"><div>
      <div class="tt-flag" style="background-image: url('${
        flagUrl + target.flag
      }');"></div>
      ${target.NAME_LONG}</div></div>`
    if (extraInfo) {
      tt += `<div class="tt-row">
      <div class="tt-row-title">Vaccinations per 100</div><div class="tt-row-text">${extraInfo.per_100.toFixed(
        1
      )}</div></div>`
      tt += `<div class="tt-row">
      <div class="tt-row-title">Total Vaccinations</div><div class="tt-row-text">${formatMillions(
        +extraInfo.total_doses
      )}</div></div>`
    }

    tooltip.innerHTML = tt

    tooltip.style.display = 'block'
  }
  function move(feature) {
    tooltip.style.left = feature.originalEvent.clientX + 10 + 'px'
    tooltip.style.top = feature.originalEvent.clientY - 5 + 'px'
  }
  function out(feature) {
    tooltip.style.display = 'none'
  }

  function click(feature) {
    currentIso = feature.target.feature.properties.ADM0_A3
  }

  function mapStyle(feature) {
    let iso = feature.properties.ADM0_A3

    // let fillOpacity = 0
    let c = allCountries.filter((ac) => ac.iso_code === iso)

    // if (c[0]) {
    //   fillOpacity = +c[0]['per_100'] / 100
    // }
    let fillColor = '#ffffff'
    if (c[0]) {
      fillColor = scale(+c[0]['per_100'] / 100)
    }

    // let fillColor = '#094151'

    let borderColor = 'gray'
    return {
      color: borderColor,
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
      apiUrl: '',
      className: feature.properties.ADM0_A3 + ' country',
    }
  }

  function addMap() {
    // console.log(africa)

    let map = L.map('map', {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      zoomSnap: 0.1,
    }).setView([0, 0], 14)

    let africaMap = L.geoJSON(africa, {
      onEachFeature: onEachFeature,
      style: mapStyle,
    }).addTo(map)

    map.fitBounds(africaMap.getBounds())
  }
</script>

<div class="tooltip shadow">Tooltip</div>

<div id="map">
  <div class="map-legend-detail">
    <div class="map-legend-title">Vaccinations per 100</div>
    <div class="map-legend">
      <div class="map-legend-label">0</div>
      <div class="map-legend-bucket" style="background:{scale(0)};" />
      <div class="map-legend-bucket" style="background:{scale(0.25)};" />
      <div class="map-legend-bucket" style="background:{scale(0.5)};" />
      <div class="map-legend-bucket" style="background:{scale(0.75)};" />
      <div class="map-legend-bucket" style="background:{scale(1)};" />
      <div class="map-legend-label">100</div>
    </div>
  </div>
</div>

<style>
  .tooltip {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
    width: 200px;
    /* display: block; */
  }
  #map {
    position: relative;
    width: 100%;
    min-height: 450px;
    /* border: solid 1px gray; */
  }
  .map-legend {
    font-size: 0.9rem;
    display: grid;
    grid-template-columns: auto repeat(5, 1fr) auto;
    width: 100%;
  }

  .map-legend-label {
    color: gray;
    /* background: red; */
    margin: 0px;
    padding: 0px;
    line-height: 80%;
    font-size: 70%;
    padding: 5px 5px;
  }
  .map-legend-bucket {
    width: 100%;
    height: 15px;
    border: solid 1px #fff;
    /* border: solid 1px gray; */
  }
  .map-legend-detail {
    position: absolute;
    top: 0px;
    right: 0px;
    line-height: 200%;
    text-align: center;
    font-size: 80%;
    text-transform: uppercase;
    /* background: lightgray; */
    /* border: solid 1px gray; */
    /* padding: 10px; */
    /* color: #fff; */
    border-radius: 5px;
    /* transform: translate(10px, -10px); */
  }
</style>
