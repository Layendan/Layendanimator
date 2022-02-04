<div>
	<h3>Command</h3>
	<p>For development purpose:</p>

	<ul>
		<li><code>nodemon</code>: auto restart Electron on change</li>
		<li>
			<code>npm run svelte:build</code>: build Svelte code (and copy in <code>dist/www</code>)
		</li>
	</ul>

	You can configure settings in<code>index.ts</code>. Change <code>developerOptions</code>:

	<ul>
		<li><code>isInProduction</code>: true if is in production</li>
		<li><code>serveSvelteDev</code>: true when you want to watch svelte</li>
		<li><code>buildSvelteDev</code>: true when you want to build svelte</li>
		<li><code>watchSvelteBuild</code>: true when you want to watch build svelte</li>
	</ul>

	<p>For publish purpose:</p>

	<ul>
		<li><code>npm run out:win</code>: create an exe file for Windows</li>
		<li><code>npm run publish:win</code>: publish the app on GitHub</li>
	</ul>
</div>

<style>
	code {
		background-color: var(--primary-color);
		color: var(--accent-color);
	}
</style>
