<script lang="ts">
  export let href: string;
</script>

<a target="_blank" rel="noreferrer" {href}>
  <slot />
</a>

<style>
  a {
    display: inline-flexbox;
    width: max-content;
    column-gap: 0.25rem;
    font-size: 14;
    font-weight: 500;
    vertical-align: center;
    cursor: pointer;
  }
</style>
