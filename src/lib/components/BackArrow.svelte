<script lang="ts">
  import { afterNavigate } from "$app/navigation";

  let href: string = "./";

  afterNavigate((nav) => {
    (nav.from?.routeId?.match(/\//g) || []).length >=
    (nav.to?.routeId?.match(/\//g) || []).length
      ? (href = "./")
      : (href = nav.from?.url.toString() ?? "./");
  });
</script>

<a {href}><slot /></a>
