<script>
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { notify } from '$lib/stores/notify.js';

  let themes = {
    danger: '#e95065',
    success: '#a82ffc',
    warning: '#f0ad4e',
    info: '#2492f9'
  };
</script>

<!--Bug scrollable editor overflow toast -->
<div class="notifications">
  {#each $notify as { type, message, id } (id)}
    <div
      animate:flip
      class="toast"
      style="background: {themes[type]};"
      transition:fly={{ y: 15, duration: '1200' }}
    >
      <p class="content">{message}</p>
      <!--{#if icon}<Icon src="icons/{ icon }.png" />{/if}-->
    </div>
  {/each}
</div>

<style lang="scss">
  .notifications {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    left: 0;
    margin: 0 auto;
    pointer-events: none;
    position: fixed;
    right: 0;
    top: 30px;
    z-index: $max-z-index;
  }

  .toast {
    border-radius: $base-radius;
    box-shadow: $base-shadow;
    flex: 0 0 auto;
    margin-bottom: 10px;
  }

  .content {
    font-weight: $fw-semibold;
    padding: 10px;
  }
</style>
