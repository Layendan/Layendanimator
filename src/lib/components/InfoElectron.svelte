<script lang="ts">
  let chrome = "-";
  let node = "-";
  let electron = "-";

  globalThis.api.systemInfo.send("requestSystemInfo", null);
  globalThis.api.systemInfo.receive("getSystemInfo", (data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
  });
</script>

<div>
  <p>We are using</p>
  <ul>
    <li>Node.js <span class="version">{node}</span></li>
    <li>Chromium <span class="version">{chrome}</span></li>
    <li>Electron <span class="version">{electron}</span></li>
  </ul>
</div>

<style>
  .version {
    color: #ff3e00;
  }
</style>
