<script>
  import { onMount } from 'svelte'

  // import { africa } from '../data/africajson'

  export let number = 0
  export let title

  // $: if (number < 200) {
  //   number = +number.toFixed(1)
  // } else {
  //   number = formatMillions(+number)
  // }

  $: if (+number === 0) {
    number = +number
  } else if (number < 200) {
    number = +number.toFixed(1)
  } else {
    number = formatMillions(+number)
  }

  import { formatThousands, formatMillions } from './functions'

  onMount(async () => {
    // number = currentView['per100']
  })
</script>

<div class="indicator-wrap">
  <div class="indicator-number">{number}</div>
  <div class="indicator-label">{title}</div>
</div>

<style>
  .indicator-wrap {
    width: 100%;
    text-align: center;
  }
  .indicator-number {
    font-family: var(--sectionHead);
    color: var(--primaryHighlight);
    font-weight: 700;
    font-size: 1.5rem;
  }
  .indicator-label {
    color: var(--black);
    font-size: var(--blockBody);
    margin-top: 0.1rem;
    line-height: 1rem;
    margin-top: 5px;
  }

  @media only screen and (max-width: 700px) {
    .indicator-label {
      font-size: 0.8rem;
    }
  }
</style>
