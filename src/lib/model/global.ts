/**
 * Capitalize the first letter of a string.
 * @param str String to capitalize.
 * @returns Capitalized string.
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getIframe(path: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.sandbox.add("allow-scripts");
  iframe.srcdoc = `
  <script type="text/javascript" src="${path}"></script>
  <script>window.addEventListener("message", async (event) => {
  switch (event.data.command) {
    case "getRecentEpisodes":
      event.source.postMessage(
        {
          command: "getRecentEpisodes",
          data: await getRecentEpisodes(),
        },
        "*"
      );
      break;
    case "getTopAiring":
      event.source.postMessage(
        {
          command: "getTopAiring",
          data: await getTopAiring(),
        },
        "*"
      );
      break;
    case "searchAnime":
      event.source.postMessage(
        {
          command: "searchAnime",
          data: await searchAnime(event.data.query),
        },
        "*"
      );
      break;
    case "getAnime":
      event.source.window.postMessage(
        {
          response: "getAnime",
          data: await getAnime(event.data.id),
        },
        "*"
      );
      break;
    case "getStreamingLinks":
      event.source.postMessage(
        {
          command: "getStreamingLinks",
          data: await getStreamingLinks(event.data.id),
        },
        "*"
      );
      break;
  }
});</script>`;
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  return iframe;
}
