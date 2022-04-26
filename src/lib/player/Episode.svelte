<script lang="ts">
  import { page } from "$app/stores";

  export let episode: any;
  // let url = episode.url;
</script>

<div class="episode">
  <a
    class="link"
    href="{$page.url
      .pathname}/video?url={episode.url}&poster={episode.thumbnail}"
  >
    <img class="bg" src={episode.thumbnail} alt="" />
    <div class="bg progress" style="width: {Math.random() * 100}%;" />
    <span>
      <img class="image" src={episode.thumbnail} alt={episode.title} />
      <p>
        {episode.title} on <i>{episode.site}</i>
      </p>
    </span>
  </a>
</div>

<style>
  .bg {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 75px;
    object-fit: cover;
    object-position: center;
    filter: blur(10px) brightness(75%);
    transition: opacity 0.5s ease-in-out;
  }

  .progress {
    background: #895ef4;
    filter: none;
    transition: width 0.5s ease-in-out, opacity 0.1s ease-in-out;
  }

  .image {
    position: relative;
    display: block;
    width: 100px;
    height: auto;
    aspect-ratio: 16/9;
    margin-right: 2em;
    border-radius: 5px;
    opacity: 1;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }

  .episode {
    background-color: #555;
    border-radius: 5px;
    margin-left: 2em;
    margin-right: 2em;
    padding-bottom: 10px;
    padding-top: 10px;
    margin-top: 5px;
    overflow: hidden;
    position: relative;
    transition: background-color 0.1s ease-in-out;
  }

  .episode:hover {
    background-color: #444;
  }

  .episode:hover .bg {
    opacity: 0.2;
  }

  .episode:hover .progress {
    opacity: 0.5;
  }

  .episode:hover p {
    color: white;
  }

  p {
    transition: color 0.2s ease-in-out;
  }

  span {
    display: flex;
    flex-direction: row;
    position: relative;
    margin-left: 2em;
    margin-right: 2em;
  }

  a {
    text-decoration: none;
    color: #895ef4;
  }
</style>
