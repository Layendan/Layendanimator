<script lang="ts">
  import { page } from "$app/stores";

  export let episode: any;
  // let url = episode.url;
</script>

<hr class="solid" />
<a href="{$page.url.pathname}/video">
  <span>
    <img src={episode.thumbnail} alt={episode.title} />
    <p>
      {episode.title} on <i>{episode.site}</i>
    </p>
  </span>
</a>

<style>
  hr.solid {
    margin-top: 20px;
    /* border-top: 1px solid rgba(66, 66, 66, 0.5); */
    border-color: #555;
    /* box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5); */
  }

  span {
    display: flex;
    flex-direction: row;
    margin-top: 1em;
    margin-left: 2em;
    margin-right: 2em;
  }

  img {
    width: 100px;
    height: auto;
    aspect-ratio: 16/9;
    margin-right: 2em;
    border-radius: 5px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }

  a {
    text-decoration: none;
    color: #895ef4;
  }
</style>
