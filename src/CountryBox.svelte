<script>
  export let vaxSources
  export let vaxTypes
  export let africaSources
  export let africaTypes
  export let currentView
  import { formatThousands, formatMillions } from './functions'

  export let currentSources = africaSources
  export let currentTypes = africaTypes
  export let currentIso
  export let maxSources = 0
  export let maxTypes = 0

  $: currentIso = currentView.iso_code
  $: if (currentIso !== 'AFR') {
    currentSources = vaxSources.filter((d) => d.iso_code === currentIso)[0]
    currentTypes = vaxTypes.filter((d) => d.iso_code === currentIso)[0]
  } else {
    currentSources = africaSources
    currentTypes = africaTypes
  }

  $: setMax(currentSources)

  function setMax(currentSources) {
    maxSources = 0
    maxTypes = 0
    if (currentSources.bought > maxSources) {
      maxSources = currentSources.bought
    }
    if (currentSources.covax > maxSources) {
      maxSources = currentSources.covax
    }
    if (currentSources.donated > maxSources) {
      maxSources = currentSources.donated
    }
    // set max types
    if (currentTypes.Covaxin > maxTypes) {
      maxTypes = currentTypes.Covaxin
    }
    if (currentTypes.Johnson_and_Johnson > maxTypes) {
      maxTypes = currentTypes.Johnson_and_Johnson
    }
    if (currentTypes.Moderna > maxTypes) {
      maxTypes = currentTypes.Moderna
    }
    if (currentTypes.Oxford_AstraZeneca > maxTypes) {
      maxTypes = currentTypes.Oxford_AstraZeneca
    }
    if (currentTypes.Pfizer_BioNTech > maxTypes) {
      maxTypes = currentTypes.Pfizer_BioNTech
    }
    if (currentTypes.Sinopharm > maxTypes) {
      maxTypes = currentTypes.Sinopharm
    }
    if (currentTypes.Sinovac > maxTypes) {
      maxTypes = currentTypes.Sinovac
    }
    if (currentTypes.Sputnik_V > maxTypes) {
      maxTypes = currentTypes.Sputnik_V
    }
  }

  // work out max

  // work out max types
</script>

<div class="indicator-wrap">
  <div class="box-title">
    <div class="box-flag" style="background-image: url({currentView.flag});" />
    {currentView['location']}
  </div>
  <div class="box-wrap">
    <div class="row box-label">Last updated</div>
    <div class="row box-value">{currentView.date}</div>
    <div class="row box-label">Population</div>
    <div class="row box-value">{formatMillions(currentView.population)}</div>
    <div class="row box-label">Total Vaccinations</div>
    <div class="row box-value">
      {currentView.total_vaccinations}
    </div>
  </div>
  <div class="box-title-two">Vaccine Sources</div>
  <div class="box-wrap">
    <div class="row box-label">Bought</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentSources.bought / maxSources) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentSources.bought > 0
          ? formatMillions(currentSources.bought)
          : currentSources.bought.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Covax</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentSources.covax / maxSources) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {formatMillions(currentSources.covax)}
      </div>
    </div>
    <div class="row box-label">Donated</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentSources.donated / maxSources) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {formatMillions(currentSources.donated)}
      </div>
    </div>
  </div>

  <div class="box-title-two">Vaccine Types</div>
  <div class="box-wrap">
    <div class="row box-label">Covaxin</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Covaxin / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        <!-- {formatMillions(currentTypes.Covaxin)} -->
        {currentTypes.Covaxin > 0
          ? formatMillions(currentTypes.Covaxin)
          : currentTypes.Covaxin.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Johnson & Johnson</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Johnson_and_Johnson / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentTypes.Johnson_and_Johnson > 0
          ? formatMillions(currentTypes.Johnson_and_Johnson)
          : currentTypes.Johnson_and_Johnson.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Moderna</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Moderna / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentTypes.Moderna > 0
          ? formatMillions(currentTypes.Moderna)
          : currentTypes.Moderna.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Oxford AstraZeneca</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Oxford_AstraZeneca / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentTypes.Oxford_AstraZeneca > 0
          ? formatMillions(currentTypes.Oxford_AstraZeneca)
          : currentTypes.Oxford_AstraZeneca.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Pfizer BioNTech</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Pfizer_BioNTech / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentTypes.Pfizer_BioNTech > 0
          ? formatMillions(currentTypes.Pfizer_BioNTech)
          : currentTypes.Pfizer_BioNTech.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Sinopharm</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Sinopharm / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentTypes.Sinopharm > 0
          ? formatMillions(currentTypes.Sinopharm)
          : currentTypes.Sinopharm.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Sinovac</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Sinovac / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentTypes.Sinovac > 0
          ? formatMillions(currentTypes.Sinovac.toFixed(0))
          : currentTypes.Sinovac.toFixed(0)}
      </div>
    </div>
    <div class="row box-label">Sputnik V</div>
    <div class="row box-value">
      <div
        class="bar"
        style="width: {(currentTypes.Sputnik_V / maxTypes) * 100}%;"
      />
      <div class="bar-label" style="position: relative; ">
        {currentTypes.Sputnik_V > 0
          ? formatMillions(currentTypes.Sputnik_V)
          : currentTypes.Sputnik_V.toFixed(0)}
      </div>
    </div>
  </div>
</div>

<style>
  .box-title {
    font-family: var(--sectionHead);
    font-weight: 700;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .box-wrap {
    display: grid;
    grid-template-columns: 1fr 2fr;
    font-size: var(--blockBody);
    margin-top: 0.1rem;
  }

  .box-value {
    position: relative;
    text-align: right;
    padding-right: 5px;
    z-index: 3000;
    font-weight: 700;
  }
  .box-flag,
  .selected-flag {
    display: inline-block;
    width: 25px;
    height: 25px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    margin-right: 10px;
  }
  .box-title-two {
    font-size: 1.15rem;
    font-weight: 700;
    margin-top: 20px;
  }
  .row {
    border-bottom: solid 1px #eee;
    padding-bottom: 3px;
    padding-top: 3px;
  }
  .bar-label {
    /* text-shadow: 3px 1px 10px rgba(255, 255, 255, 1); */
    /* color: #fff; */
  }
  .bar {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 100%;
    min-height: 26px;
    margin-top: 4px;
    background: #eee;
    /* border: solid 1px var(--primaryHighlight); */
    transition: width 0.5s;
    /* -webkit-border-top-left-radius: 5px;
    -webkit-border-bottom-left-radius: 5px;
    -moz-border-radius-topleft: 5px;
    -moz-border-radius-bottomleft: 5px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px; */
  }
</style>
