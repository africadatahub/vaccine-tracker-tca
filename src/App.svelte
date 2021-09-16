<script>
  // import { onMount } from 'svelte'
  // import feather from 'feather-icons'
  import { countryCodes } from '../data/country-codes'
  import TopIndicator from './TopIndicator.svelte'
  import CountryBox from './CountryBox.svelte'
  import Map from './Map.svelte'
  import { tooltip } from 'leaflet'
  export let menu = false
  export let showMap = true
  export let africaDataUrl =
    'https://api.mediahack.co.za/adh/vaccine-tracker/africa-overview.php'
  export let flagUrl = 'https://hosted.mediahack.co.za/flags/'
  export let africaTalliesUrl =
    'https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-all-countries-new.php?id=1'

  export let vaxSourcesUrl =
    'https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-sources.php'
  export let vaxTypesUrl =
    'https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-types.php'

  export let vaxSourcesList = [
    'bought',
    'covax',
    'donated',
    'grand_total',
    'private',
    'sold',
  ]
  export let vaxTypesList = [
    'Covaxin',
    'Johnson_and_Johnson',
    'Moderna',
    'Oxford_AstraZeneca',
    'Pfizer_BioNTech',
    'Sinopharm',
    'Sinovac',
    'Sputnik_V',
  ]
  export let selectedCountry = 'Select Country'
  export let selectedFlag = 'https://hosted.mediahack.co.za/flags/africa.svg'
  export let africaOverview = []
  export let allCountries = []
  export let vaxSources = []
  export let vaxTypes = []
  export let africaSources = []
  export let africaTypes = []

  export let currentView = []
  export let currentIso = 'AFR'

  $: currentView = currentView
  $: if (currentIso !== 'AFR') {
    chooseCountry(currentIso)
  }

  function toggleMenu() {
    menu = !menu
  }

  function reset() {
    menu = false
    currentView['location'] = 'Africa'
    currentView['per100'] = +africaOverview.total_vaccinations_per_hundred
    currentView['total_vaccinations'] = +africaOverview.total_vaccinations
    currentView['population'] = +africaOverview.population
    currentView['date'] = africaOverview.date
    currentView['flag'] = `${flagUrl}africa.svg`
    currentView['iso_code'] = 'AFR'
  }

  function chooseCountry(code) {
    setTimeout(() => {
      menu = false
    }, 100)
    if (showMap) {
      document.querySelector('.tooltip').style.left = '-1000px'
    }

    if (allCountries.filter((c) => c.iso_code === code)[0]) {
      currentView['iso_code'] = code
      let cc = allCountries.filter((c) => c.iso_code === code)[0]

      currentView['population'] = cc.population
      currentView['date'] = cc.date
      currentView['location'] = cc.country
      currentView['per100'] = cc.per_100
      currentView['total_vaccinations'] = cc.total_doses
      currentView['flag'] = cc.flag
      currentView['iso_code'] = cc.iso_code

      selectedCountry = cc.country
      selectedFlag = cc.flag
    }

    // currentView['flag'] = cc.iso
  }
  async function getAllCountries() {
    await fetch(africaTalliesUrl)
      .then((response) => response.json())
      .then((response) => {
        // add iso_codes
        response.forEach((c) => {
          let code = c.iso_code
          let iso_2 = countryCodes.filter((cc) => cc.iso_3 === code)[0].iso_2
          c.iso_3 = code.toLowerCase()
          c.iso_2 = iso_2.toLowerCase()
          c.flag = `${flagUrl}${iso_2.toLowerCase()}.svg`
        })
        allCountries = response.sort((a, b) => (a.country > b.country ? 1 : -1))
      })
  }
  async function getAfricaOverview() {
    await fetch(africaDataUrl)
      .then((response) => response.json())
      .then((response) => {
        africaOverview = response[0]

        currentView['location'] = 'Africa'
        currentView['per100'] = +africaOverview.total_vaccinations_per_hundred
        currentView['total_vaccinations'] = +africaOverview.total_vaccinations
        currentView['population'] = +africaOverview.population
        currentView['date'] = africaOverview.date
        currentView['flag'] = `${flagUrl}africa.svg`
        currentView['total_vaccinations'] = africaOverview['total_vaccinations']
        currentView['iso_code'] = 'AFR'
      })
  }

  async function getVaxSources() {
    await fetch(vaxSourcesUrl)
      .then((response) => response.json())
      .then((response) => {
        vaxSources = response

        vaxSources.forEach((v) => {
          vaxSourcesList.forEach((d) => {
            v[d] = +v[d]
          })
        })

        vaxSourcesList.forEach((d) => {
          africaSources[d] = vaxSources.reduce((total, number) => {
            return total + +number[d]
          }, 0)
        })
      })
  }
  async function getVaxTypes() {
    await fetch(vaxTypesUrl)
      .then((response) => response.json())
      .then((response) => {
        vaxTypes = response
        vaxTypes.forEach((v) => {
          vaxTypesList.forEach((d) => {
            v[d] = +v[d]
          })
        })

        vaxTypesList.forEach((d) => {
          africaTypes[d] = vaxTypes.reduce((total, number) => {
            return total + +number[d]
          }, 0)
        })
      })
  }

  let promise = Promise.all([
    getAfricaOverview(),
    getAllCountries(),
    getVaxSources(),
    getVaxTypes(),
  ]).then(() => {})

  function hideMap() {
    showMap = !showMap
  }
</script>

<header class="shadow">
  <div class="header-inner">
    <h2>Vaccines & Vaccinations in Africa</h2>
    <div class="subhead">
      Select a country from the list below to see details
    </div>

    <div class="dropdown">
      <div class="dropdown-home" on:click={toggleMenu}>
        Choose a Country
        <div class="menu-arrow">
          <img src="./images/down-arrow-white.svg" />
        </div>
        {#if menu}
          <div class="dropdown-menu shadow">
            {#each allCountries as country}
              <div
                class="dropdown-item"
                on:click={chooseCountry(country.iso_code)}
              >
                {country.country}
              </div>
            {/each}
          </div>
        {/if}
      </div>
      {#if currentView.location !== 'Africa'}
        <div class="selected">
          <div
            class="selected-flag"
            style="background-image: url({selectedFlag});"
          />
          {selectedCountry}
          <div class="close">
            <img src="./images/close-circle.svg" on:click={reset} />
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>
<figure>
  <main>
    <div class="block block1 shadow">
      {#await promise}
        ...
      {:then}
        <TopIndicator
          bind:number={currentView['per100']}
          title="Vaccinations per 100"
        />
      {/await}
    </div>
    <div class="block block2 shadow">
      {#await promise}
        ...
      {:then}
        <TopIndicator
          bind:number={currentView['total_vaccinations']}
          title="Total Vaccinations"
        />
      {/await}
    </div>
    <div class="block block3 shadow">
      {#await promise}
        ...
      {:then}
        <CountryBox
          bind:currentView
          bind:africaSources
          bind:africaTypes
          bind:vaxSources
          bind:vaxTypes
        />
      {/await}
    </div>
    <div class="block block4 shadow">
      <div class="map-controls" on:click={hideMap}>
        {#if showMap}Hide Map{/if}
        {#if !showMap}Show Map{/if}
      </div>
      {#await promise}
        ...
      {:then}
        {#if showMap}
          <Map bind:allCountries bind:currentIso />
        {/if}
      {/await}
      <div class="notes notes-desktop">
        <p>
          Disclaimer: Africa Data Hub and Media Hack Collective collect the data
          for this dashboard from multiple sources – such as national health
          ministries, WHO, Gavi, Unicef and reputable news agencies, among
          others – and although we do our best to bring you updated data, this
          dashboard may not reflect the actual figures. We have noted that
          Rwanda has administered more vaccines than it has received and we are
          working on sourcing up-to-date data.
        </p>
      </div>
    </div>
    <div class="block block5 shadow">
      <div class="credits-block">
        <div class="logo"><img src="images/adh.png" /></div>
        <div class="credits-text">
          Data: <a href="https://africadatahub.co.za" target="_blank"
            >Africa Data Hub</a
          >
          &<br />
          <a href="https://mediahack.co.za" target="_blank">Media Hack</a>
        </div>
        <div class="logo logo-right"><img src="images/mhc.png" /></div>
      </div>
    </div>
    <div class="block block6 shadow">
      <div class="notes notes-mobile">
        Disclaimer: Africa Data Hub and Media Hack Collective collect the data
        for this dashboard from multiple sources – such as national health
        ministries, WHO, Gavi, Unicef and reputable news agencies, among others
        – and although we do our best to bring you updated data, this dashboard
        may not reflect the actual figures. We have noted that Rwanda has
        administered more vaccines than it has received and we are working on
        sourcing up-to-date data.
      </div>
    </div>
  </main>
</figure>

<style>
  .block {
    position: relative;
  }
  main {
    margin-top: 30px;
  }
  .dropdown-home,
  .selected {
    padding: 5px 20px 8px 20px;
    background: var(--primaryHighlight);
    color: #fff;
    border-radius: 10px;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .selected {
    cursor: default;
    padding: 5px 20px;
  }
  .dropdown-home:hover {
    /* background: var(--secondaryHighlight); */
  }
  .dropdown {
    margin-top: 20px;
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(10rem, 2fr));
    grid-gap: 10px;
  }

  .dropdown-menu {
    position: absolute;
    z-index: 10000;
    top: 40px;
    left: 0px;
    background: #ffff;
    width: 100%;
    max-width: 323px;
    font-size: 0.8rem;
    border: solid 1px lightgray;
    max-height: 300px;
    overflow-y: auto;
  }
  .dropdown-item {
    border-bottom: solid 1px lightgray;
    cursor: pointer;
    padding: 5px 20px;
    color: var(--black);
  }
  .dropdown-item:hover {
    background: var(--primaryHighlight);
    color: #fff;
  }
  .menu-arrow,
  .close {
    display: inline-block;
    float: right;
  }
  .close img {
    width: 20px;
    transform: translate(0, 4px);
    cursor: pointer;
  }
  .credits-block {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    font-size: 0.8rem;
    text-align: center;
    font-weight: 700;
  }
  .credits-block img {
    width: 80px;
  }
  .logo-right {
    text-align: right;
  }
  .logo-right img {
    margin-top: 5px;
    width: 100px;
  }
  .block5 {
    padding-bottom: 5px;
  }
  .credits-text {
    padding-top: 5px;
    line-height: 1rem;
  }
  .notes {
    font-size: 0.7rem;
    line-height: 1rem;
    margin-top: 20px;
    padding-top: 20px;
    border-top: solid 1px lightgray;
    color: gray;
  }
  img.selected-flag {
    width: 20px;
    transform: translate(0px, 5px);
    margin: 0px;
    padding: 0px;
    margin-right: 5px;
  }
  .selected-flag {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    margin-right: 10px;
    float: left;

    margin-top: 4px;
    /* border: solid 3px #f2716a; */
  }
  .map-controls {
    font-size: 70%;
    text-transform: uppercase;
    /* position: absolute; */
    /* position: absolute;
    top: 0px;
    left: 0px; */
    /* padding: 10px 20px; */
    cursor: pointer;
    display: none;
    /* background: red; */
    max-width: 70px;
    margin: 0px;
    border: solid 1px lightgray;
    text-align: center;
    border-radius: 5px;
  }

  @media only screen and (max-width: 700px) {
    .map-controls {
      display: block;
    }
    .dropdown {
      grid-template-columns: 1fr;
    }
    .dropdown-menu,
    .selected,
    .dropdown-home {
      max-width: 100%;
    }
    .selected {
      margin-top: 10px;
    }
    .notes {
      margin-top: 0px;
      padding-top: 0px;
      border-top: none;
    }
  }
</style>
