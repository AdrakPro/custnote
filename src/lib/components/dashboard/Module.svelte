<script>
  import { redirectTo } from '$lib/utils/redirect.js';

  export let name;
  export let lastEdit;

  function redirectToModule() {
    const moduleName = name.toLowerCase();

    redirectTo(`/module/${moduleName}`);
  }
</script>

<div class="module" on:click={() => redirectToModule()}>
  <h1 class="title">{name}</h1>
  <p class="sub-text">Last edit: {lastEdit}</p>
</div>

<style lang="scss">
  .module {
    border: 4px $blue solid;
    border-left: 3px $blue solid;
    border-radius: $base-radius;
    border-top: 3px $blue solid;
    box-shadow: $base-shadow;
    cursor: pointer;
    height: 160px;
    margin: $s-16;
    max-width: 440px;
    min-width: 280px;
    padding: $s-16;
    user-select: none;

    .title {
      font-size: $fs-32;
      font-weight: $fw-semibold;
      padding-bottom: $s-64;
      text-align: center;
    }

    .sub-text {
      font-weight: $fw-light;
      text-align: end;
    }
  }
</style>
