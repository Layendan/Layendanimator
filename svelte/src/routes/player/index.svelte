<script>
	// Import required packages
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import loadingFailure from '$lib/components/loading_failure.jpeg';

	// read queries from link
	let link = $page.query.get('link');
	let name = $page.query.get('name');
	let thumbnail =
		$page.query.get('thumbnail') != 'null' ? $page.query.get('thumbnail') : loadingFailure;
	let banner = $page.query.get('banner');
	let description =
		$page.query.get('description') != 'null'
			? $page.query.get('description')
			: 'Failed to load description';

	// Page scroll
	let y = 0;
</script>

<svelte:window bind:scrollY={y} />

<svelte:head>
	<title>{name}</title>
</svelte:head>

<section transition:fade>
	{#if banner != 'null'}
		<div class="banner" transition:fade>
			<img
				src={banner}
				alt={name}
				style="transform: scale({y < 345 ? 0.005 * y + 1 : 0.005 * 345 + 1}); filter: blur({y < 345
					? 0.05 * y
					: 0.05 * 345}px) brightness({y < 345 ? -y / 345 + 1 : 0});"
			/>
		</div>
	{/if}
	<div in:fade out:fade class="text">
		<div class="container">
			<div class="important-info">
				<div>
					<img
						src={thumbnail}
						transition:fade
						on:error={() => (thumbnail = loadingFailure)}
						class:overlap={banner != 'null'}
						class="thumbnail"
						alt={name}
					/>
				</div>
				<div>
					<a href={link} class="title">{name}</a>
					<p transition:fade class="description">
						{@html description}
					</p>
				</div>
			</div>
		</div>
	</div>
	<div class="episodes">
		<p transition:fade>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Habitant morbi tristique senectus et netus et malesuada.
			Ultrices tincidunt arcu non sodales neque sodales. Non diam phasellus vestibulum lorem sed
			risus ultricies tristique nulla. Et ultrices neque ornare aenean euismod. Condimentum lacinia
			quis vel eros donec ac. Massa tincidunt nunc pulvinar sapien et. Quis viverra nibh cras
			pulvinar mattis nunc sed blandit libero. Quis ipsum suspendisse ultrices gravida dictum fusce
			ut. Cursus euismod quis viverra nibh cras. Velit aliquet sagittis id consectetur purus ut
			faucibus pulvinar elementum. Aliquam ut porttitor leo a diam sollicitudin. Quis lectus nulla
			at volutpat diam. Libero volutpat sed cras ornare arcu dui vivamus arcu. Nulla pellentesque
			dignissim enim sit amet venenatis urna cursus. Amet nisl suscipit adipiscing bibendum est
			ultricies integer. Fermentum leo vel orci porta. Gravida in fermentum et sollicitudin ac orci
			phasellus egestas. Erat pellentesque adipiscing commodo elit at imperdiet. Nec feugiat in
			fermentum posuere urna nec tincidunt praesent. Sit amet risus nullam eget felis eget. Ligula
			ullamcorper malesuada proin libero nunc consequat interdum varius sit. Sagittis aliquam
			malesuada bibendum arcu vitae. Mi bibendum neque egestas congue quisque egestas diam. Varius
			vel pharetra vel turpis nunc. Vestibulum lorem sed risus ultricies tristique nulla. Non tellus
			orci ac auctor. Phasellus vestibulum lorem sed risus. Ut porttitor leo a diam. Ipsum a arcu
			cursus vitae congue mauris. Integer enim neque volutpat ac. Facilisis mauris sit amet massa
			vitae. Ut morbi tincidunt augue interdum velit euismod. Nulla posuere sollicitudin aliquam
			ultrices sagittis orci a scelerisque purus. Cursus risus at ultrices mi tempus. At lectus urna
			duis convallis convallis tellus id. Tellus cras adipiscing enim eu turpis egestas pretium
			aenean. Aliquam etiam erat velit scelerisque in dictum non consectetur a. Ullamcorper
			dignissim cras tincidunt lobortis feugiat. Integer quis auctor elit sed vulputate. Pharetra
			convallis posuere morbi leo urna molestie at. Et netus et malesuada fames ac. Nam libero justo
			laoreet sit. Egestas sed sed risus pretium quam. Ultrices eros in cursus turpis massa
			tincidunt dui ut. Non enim praesent elementum facilisis. Lectus proin nibh nisl condimentum
			id. Non diam phasellus vestibulum lorem sed risus ultricies. Diam sit amet nisl suscipit
			adipiscing bibendum. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit
			aliquam. Sagittis vitae et leo duis. Enim ut tellus elementum sagittis vitae. Habitant morbi
			tristique senectus et netus et malesuada fames ac. Amet volutpat consequat mauris nunc congue.
			Diam vulputate ut pharetra sit. Pellentesque id nibh tortor id aliquet lectus proin nibh nisl.
			Vel facilisis volutpat est velit egestas dui id ornare arcu. Id interdum velit laoreet id
			donec. At imperdiet dui accumsan sit amet nulla facilisi. Habitant morbi tristique senectus
			et. Purus non enim praesent elementum facilisis leo. Etiam non quam lacus suspendisse faucibus
			interdum. Tellus in metus vulputate eu scelerisque felis imperdiet proin. Laoreet suspendisse
			interdum consectetur libero. Tempus egestas sed sed risus. Tempus imperdiet nulla malesuada
			pellentesque elit eget. Purus sit amet luctus venenatis lectus magna fringilla urna. Dolor
			morbi non arcu risus quis varius quam. Bibendum ut tristique et egestas quis ipsum suspendisse
			ultrices gravida. Eget duis at tellus at urna condimentum mattis pellentesque. Nisl suscipit
			adipiscing bibendum est. Vestibulum mattis ullamcorper velit sed ullamcorper morbi. Non
			blandit massa enim nec dui nunc mattis. Consectetur adipiscing elit duis tristique
			sollicitudin. Arcu cursus vitae congue mauris. Pellentesque eu tincidunt tortor aliquam nulla
			facilisi cras fermentum odio. Tristique nulla aliquet enim tortor at auctor urna. Amet luctus
			venenatis lectus magna. Rutrum tellus pellentesque eu tincidunt tortor. Arcu cursus vitae
			congue mauris rhoncus aenean vel. Sed viverra ipsum nunc aliquet. Dictumst vestibulum rhoncus
			est pellentesque elit ullamcorper dignissim cras. Mi bibendum neque egestas congue quisque
			egestas diam in. Enim sit amet venenatis urna. Ultrices eros in cursus turpis massa tincidunt
			dui ut ornare. Eget nunc scelerisque viverra mauris in aliquam. Aliquet bibendum enim
			facilisis gravida neque convallis a. Aliquam ultrices sagittis orci a scelerisque purus semper
			eget duis. Ornare arcu dui vivamus arcu felis bibendum ut tristique. Fringilla phasellus
			faucibus scelerisque eleifend donec pretium vulputate sapien. Amet consectetur adipiscing elit
			pellentesque habitant. Vestibulum lectus mauris ultrices eros in cursus turpis. Viverra nibh
			cras pulvinar mattis nunc sed blandit libero volutpat. Consequat interdum varius sit amet
			mattis vulputate enim. Ultricies leo integer malesuada nunc vel risus commodo viverra. Id
			aliquet lectus proin nibh nisl condimentum id venenatis. Sit amet nulla facilisi morbi tempus.
			Fermentum dui faucibus in ornare quam viverra orci sagittis. Quam pellentesque nec nam aliquam
			sem et tortor consequat. Lectus magna fringilla urna porttitor rhoncus dolor. Nisl vel pretium
			lectus quam id leo in vitae. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper
			dignissim. Sit amet dictum sit amet justo donec. Eget nunc lobortis mattis aliquam faucibus.
			Porttitor eget dolor morbi non arcu risus quis. Nisl pretium fusce id velit ut. Proin sagittis
			nisl rhoncus mattis rhoncus urna neque viverra. Mauris in aliquam sem fringilla ut morbi
			tincidunt augue interdum. Suspendisse in est ante in nibh mauris cursus. Consectetur libero id
			faucibus nisl tincidunt eget nullam. Volutpat blandit aliquam etiam erat velit scelerisque.
			Nisl suscipit adipiscing bibendum est. Nibh tellus molestie nunc non blandit massa enim nec.
			Feugiat nisl pretium fusce id velit ut tortor pretium viverra. Volutpat commodo sed egestas
			egestas fringilla. Leo duis ut diam quam nulla porttitor massa id. Eu augue ut lectus arcu
			bibendum at varius. Faucibus a pellentesque sit amet porttitor eget dolor. Neque ornare aenean
			euismod elementum nisi quis eleifend quam adipiscing. Elit scelerisque mauris pellentesque
			pulvinar. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Sed
			velit dignissim sodales ut eu sem. Dignissim diam quis enim lobortis scelerisque fermentum
			dui. Quis varius quam quisque id diam vel quam elementum. Id velit ut tortor pretium viverra.
			Lacus viverra vitae congue eu. Odio ut sem nulla pharetra diam sit. Viverra ipsum nunc aliquet
			bibendum enim. Aenean pharetra magna ac placerat vestibulum lectus. Nec ullamcorper sit amet
			risus nullam eget. Vitae turpis massa sed elementum tempus. Dolor sit amet consectetur
			adipiscing elit duis tristique sollicitudin nibh. Egestas maecenas pharetra convallis posuere
			morbi leo urna. Tellus in metus vulputate eu scelerisque felis. Amet aliquam id diam maecenas
			ultricies mi. Sit amet facilisis magna etiam tempor orci. Mattis aliquam faucibus purus in
			massa tempor. Tellus mauris a diam maecenas sed enim. In hendrerit gravida rutrum quisque non
			tellus. Tincidunt vitae semper quis lectus nulla. Quisque sagittis purus sit amet. Pretium
			quam vulputate dignissim suspendisse in. Feugiat sed lectus vestibulum mattis ullamcorper
			velit sed ullamcorper. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed.
			Imperdiet nulla malesuada pellentesque elit eget gravida. Donec ac odio tempor orci dapibus
			ultrices in. Eget sit amet tellus cras adipiscing. Vestibulum lectus mauris ultrices eros.
			Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Mi tempus imperdiet nulla
			malesuada pellentesque elit eget gravida. Facilisis leo vel fringilla est ullamcorper. Turpis
			egestas pretium aenean pharetra magna ac placerat. Neque vitae tempus quam pellentesque nec.
			Id diam vel quam elementum. Euismod quis viverra nibh cras. Viverra adipiscing at in tellus
			integer. Pharetra pharetra massa massa ultricies mi quis hendrerit. Metus dictum at tempor
			commodo ullamcorper a lacus vestibulum. Massa ultricies mi quis hendrerit dolor magna eget est
			lorem. Vitae nunc sed velit dignissim sodales ut eu. Pharetra vel turpis nunc eget lorem.
			Cursus mattis molestie a iaculis at erat pellentesque adipiscing commodo. Elit pellentesque
			habitant morbi tristique. Id leo in vitae turpis massa sed elementum. Volutpat consequat
			mauris nunc congue nisi vitae suscipit tellus. Nisl condimentum id venenatis a condimentum
			vitae sapien. Felis eget nunc lobortis mattis aliquam faucibus purus in. Turpis massa sed
			elementum tempus egestas sed. Quisque egestas diam in arcu cursus euismod quis viverra. Quis
			enim lobortis scelerisque fermentum dui faucibus. Vel pretium lectus quam id leo in. Cursus
			metus aliquam eleifend mi. Porttitor massa id neque aliquam vestibulum morbi blandit cursus.
			Placerat in egestas erat imperdiet sed euismod. Malesuada proin libero nunc consequat interdum
			varius sit amet. Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Vitae purus
			faucibus ornare suspendisse sed nisi lacus sed. Dui id ornare arcu odio ut. Nec dui nunc
			mattis enim ut tellus elementum sagittis vitae. Lectus magna fringilla urna porttitor rhoncus
			dolor purus. Elit pellentesque habitant morbi tristique senectus et netus. A scelerisque purus
			semper eget. Diam quam nulla porttitor massa id neque. Phasellus vestibulum lorem sed risus
			ultricies tristique. Sit amet consectetur adipiscing elit ut aliquam purus. Vitae nunc sed
			velit dignissim sodales ut eu sem. Tempor id eu nisl nunc mi ipsum faucibus vitae aliquet.
			Vitae aliquet nec ullamcorper sit amet risus nullam eget felis. Ut tristique et egestas quis
			ipsum suspendisse ultrices gravida dictum. Vitae purus faucibus ornare suspendisse sed nisi
			lacus. At tempor commodo ullamcorper a lacus vestibulum sed. Egestas integer eget aliquet nibh
			praesent tristique magna sit. Tristique risus nec feugiat in fermentum posuere. Id faucibus
			nisl tincidunt eget nullam non nisi. Sodales ut eu sem integer vitae justo. Risus nullam eget
			felis eget nunc. Et netus et malesuada fames ac turpis egestas maecenas. Viverra tellus in hac
			habitasse platea dictumst vestibulum rhoncus. Accumsan tortor posuere ac ut consequat semper
			viverra nam. In est ante in nibh mauris. Felis eget velit aliquet sagittis id consectetur
			purus ut faucibus. At consectetur lorem donec massa sapien faucibus et. Viverra mauris in
			aliquam sem fringilla ut. Consectetur a erat nam at lectus urna duis convallis convallis.
			Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Ullamcorper dignissim cras
			tincidunt lobortis. Suscipit tellus mauris a diam maecenas sed. Accumsan lacus vel facilisis
			volutpat est velit egestas dui id. Nulla at volutpat diam ut venenatis tellus in metus. Magna
			fermentum iaculis eu non diam phasellus vestibulum lorem sed. A pellentesque sit amet
			porttitor eget dolor morbi non. In eu mi bibendum neque egestas congue. Mi in nulla posuere
			sollicitudin aliquam ultrices. Sed nisi lacus sed viverra tellus in hac. Ut consequat semper
			viverra nam libero justo laoreet. Massa ultricies mi quis hendrerit dolor magna. Sit amet
			dictum sit amet justo. Faucibus interdum posuere lorem ipsum. Sit amet consectetur adipiscing
			elit ut aliquam purus sit amet. Enim praesent elementum facilisis leo. Quis enim lobortis
			scelerisque fermentum dui faucibus. Quam vulputate dignissim suspendisse in est ante. Vitae et
			leo duis ut diam quam nulla porttitor. Cras ornare arcu dui vivamus arcu felis bibendum ut.
			Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. In massa tempor nec feugiat
			nisl. Tortor dignissim convallis aenean et tortor at. Sit amet venenatis urna cursus eget nunc
			scelerisque. Faucibus purus in massa tempor. Porttitor rhoncus dolor purus non. Est ultricies
			integer quis auctor elit sed vulputate. Malesuada bibendum arcu vitae elementum curabitur
			vitae nunc sed. Senectus et netus et malesuada. Vitae purus faucibus ornare suspendisse sed.
			Et leo duis ut diam quam nulla porttitor massa. Non diam phasellus vestibulum lorem sed risus.
			Id eu nisl nunc mi ipsum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
			Nunc consequat interdum varius sit amet mattis vulputate enim nulla. Adipiscing elit
			pellentesque habitant morbi tristique. Sit amet volutpat consequat mauris nunc congue nisi
			vitae. Dui ut ornare lectus sit amet. Est sit amet facilisis magna etiam tempor orci eu
			lobortis. Scelerisque fermentum dui faucibus in. Magna fermentum iaculis eu non diam phasellus
			vestibulum. Nullam vehicula ipsum a arcu cursus vitae congue. Sed ullamcorper morbi tincidunt
			ornare massa eget. Odio aenean sed adipiscing diam donec adipiscing tristique risus nec.
			Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Id donec ultrices tincidunt
			arcu non. Tortor consequat id porta nibh venenatis. Hac habitasse platea dictumst vestibulum
			rhoncus. Ac odio tempor orci dapibus ultrices in iaculis nunc sed. Facilisis leo vel fringilla
			est ullamcorper eget nulla. Semper viverra nam libero justo laoreet sit. Neque ornare aenean
			euismod elementum nisi quis eleifend quam. A arcu cursus vitae congue mauris rhoncus aenean
			vel. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec. Aliquam nulla facilisi
			cras fermentum odio eu feugiat pretium. Ac felis donec et odio pellentesque diam volutpat.
			Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Ac turpis egestas
			maecenas pharetra convallis posuere morbi leo urna. Id cursus metus aliquam eleifend mi in
			nulla posuere. Sed blandit libero volutpat sed cras. Ante metus dictum at tempor commodo
			ullamcorper. Lectus arcu bibendum at varius. Integer vitae justo eget magna fermentum iaculis
			eu non. In fermentum posuere urna nec tincidunt praesent. In nibh mauris cursus mattis
			molestie a iaculis at. In metus vulputate eu scelerisque felis imperdiet. Gravida quis blandit
			turpis cursus in hac habitasse. Cursus in hac habitasse platea. Consectetur purus ut faucibus
			pulvinar elementum integer enim neque volutpat. Nullam ac tortor vitae purus faucibus. In arcu
			cursus euismod quis viverra nibh. Interdum posuere lorem ipsum dolor sit. Justo nec ultrices
			dui sapien eget mi proin sed. Enim neque volutpat ac tincidunt vitae semper quis lectus. Arcu
			dui vivamus arcu felis bibendum ut tristique et egestas. Tincidunt augue interdum velit
			euismod in pellentesque. Sit amet nulla facilisi morbi tempus iaculis. Mi sit amet mauris
			commodo quis. Quis lectus nulla at volutpat diam ut venenatis. Viverra suspendisse potenti
			nullam ac tortor vitae purus faucibus. Sed vulputate odio ut enim blandit volutpat. Semper
			quis lectus nulla at volutpat. Diam maecenas ultricies mi eget mauris pharetra et ultrices.
			Accumsan tortor posuere ac ut. Viverra ipsum nunc aliquet bibendum enim facilisis gravida
			neque convallis. Faucibus et molestie ac feugiat sed lectus vestibulum mattis. Amet aliquam id
			diam maecenas ultricies. Massa eget egestas purus viverra accumsan in nisl. Purus sit amet
			luctus venenatis lectus. Lacinia quis vel eros donec. Libero volutpat sed cras ornare.
			Porttitor massa id neque aliquam vestibulum morbi blandit cursus. Varius sit amet mattis
			vulputate enim. Quis viverra nibh cras pulvinar mattis. Dignissim enim sit amet venenatis urna
			cursus eget. Et odio pellentesque diam volutpat commodo sed egestas. Sapien faucibus et
			molestie ac feugiat sed lectus vestibulum. Vel fringilla est ullamcorper eget nulla facilisi
			etiam dignissim. Etiam tempor orci eu lobortis. Imperdiet nulla malesuada pellentesque elit
			eget gravida. Magna etiam tempor orci eu lobortis elementum. Condimentum mattis pellentesque
			id nibh tortor. Et egestas quis ipsum suspendisse ultrices gravida dictum fusce. Elementum
			curabitur vitae nunc sed velit. Eleifend mi in nulla posuere sollicitudin aliquam. Tellus id
			interdum velit laoreet id donec. Porttitor lacus luctus accumsan tortor posuere ac. Sit amet
			consectetur adipiscing elit. In nibh mauris cursus mattis. Mus mauris vitae ultricies leo
			integer malesuada nunc vel risus. Gravida neque convallis a cras. Sagittis purus sit amet
			volutpat consequat mauris. Luctus accumsan tortor posuere ac ut consequat semper viverra.
			Sollicitudin ac orci phasellus egestas tellus rutrum. Odio aenean sed adipiscing diam donec
			adipiscing tristique. Aliquam sem et tortor consequat id porta nibh. Sed sed risus pretium
			quam vulputate dignissim suspendisse. Est pellentesque elit ullamcorper dignissim cras
			tincidunt lobortis feugiat vivamus. Elementum tempus egestas sed sed risus. Euismod nisi porta
			lorem mollis aliquam ut porttitor leo. Tincidunt lobortis feugiat vivamus at augue eget arcu.
			Vitae turpis massa sed elementum tempus. Egestas integer eget aliquet nibh praesent tristique
			magna sit amet. In est ante in nibh mauris cursus mattis. Nibh ipsum consequat nisl vel
			pretium lectus quam id. Id diam vel quam elementum. Augue neque gravida in fermentum et. Et
			tortor at risus viverra. In eu mi bibendum neque egestas congue quisque egestas. Elit duis
			tristique sollicitudin nibh sit. Est pellentesque elit ullamcorper dignissim cras. Id volutpat
			lacus laoreet non curabitur. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Vitae
			congue eu consequat ac felis donec et odio. Sed elementum tempus egestas sed. Ultrices in
			iaculis nunc sed augue lacus viverra. Consectetur purus ut faucibus pulvinar elementum
			integer. Aliquam id diam maecenas ultricies mi eget. Quis risus sed vulputate odio ut. Luctus
			venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Quis hendrerit dolor
			magna eget est. Cursus risus at ultrices mi. Pellentesque id nibh tortor id aliquet lectus
			proin nibh. Lacinia at quis risus sed vulputate. Ultricies integer quis auctor elit sed
			vulputate mi sit. Ullamcorper a lacus vestibulum sed arcu non odio euismod. Id aliquet risus
			feugiat in ante metus dictum at tempor. Ornare aenean euismod elementum nisi. Egestas quis
			ipsum suspendisse ultrices gravida dictum fusce ut placerat. Amet aliquam id diam maecenas.
			Nunc vel risus commodo viverra maecenas accumsan lacus vel. Pellentesque habitant morbi
			tristique senectus et netus et malesuada. Lacus sed turpis tincidunt id aliquet. Eget arcu
			dictum varius duis at consectetur. Non nisi est sit amet. Donec ultrices tincidunt arcu non
			sodales. Ac turpis egestas maecenas pharetra. Sed euismod nisi porta lorem mollis aliquam ut
			porttitor. Amet consectetur adipiscing elit ut. Mi ipsum faucibus vitae aliquet nec
			ullamcorper sit amet. Fermentum posuere urna nec tincidunt praesent. Pellentesque eu tincidunt
			tortor aliquam. Ligula ullamcorper malesuada proin libero nunc. Tempus imperdiet nulla
			malesuada pellentesque elit. Purus sit amet volutpat consequat mauris nunc. Porttitor leo a
			diam sollicitudin tempor id eu nisl. Sem fringilla ut morbi tincidunt augue interdum velit.
			Interdum velit euismod in pellentesque. Mollis nunc sed id semper. Odio pellentesque diam
			volutpat commodo sed egestas. Elementum tempus egestas sed sed risus pretium quam. Elit
			ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Vel risus commodo viverra
			maecenas accumsan lacus vel facilisis volutpat. Facilisis magna etiam tempor orci eu lobortis
			elementum nibh. Mauris a diam maecenas sed enim. Sed odio morbi quis commodo odio aenean sed.
			Elementum nisi quis eleifend quam adipiscing. Nulla pharetra diam sit amet nisl. Nulla
			pharetra diam sit amet. Arcu ac tortor dignissim convallis aenean et. Orci a scelerisque purus
			semper eget duis at tellus. Ac tincidunt vitae semper quis lectus nulla. Diam volutpat commodo
			sed egestas. In massa tempor nec feugiat nisl. Risus feugiat in ante metus. Platea dictumst
			vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Vitae turpis massa sed
			elementum. Eu lobortis elementum nibh tellus molestie nunc non blandit massa. Dictum at tempor
			commodo ullamcorper a lacus vestibulum sed. Vel facilisis volutpat est velit. Dui id ornare
			arcu odio ut sem nulla pharetra. Amet dictum sit amet justo donec enim. Suspendisse interdum
			consectetur libero id. A scelerisque purus semper eget duis at tellus. Fermentum dui faucibus
			in ornare. Ornare arcu dui vivamus arcu felis. Semper risus in hendrerit gravida rutrum.
			Scelerisque eu ultrices vitae auctor. Mi tempus imperdiet nulla malesuada pellentesque elit.
			Ullamcorper malesuada proin libero nunc. Vitae ultricies leo integer malesuada nunc vel risus
			commodo. Id nibh tortor id aliquet lectus proin nibh nisl condimentum. Senectus et netus et
			malesuada fames ac. Sit amet venenatis urna cursus eget nunc scelerisque. Ullamcorper eget
			nulla facilisi etiam. Dolor sit amet consectetur adipiscing elit pellentesque habitant.
			Adipiscing tristique risus nec feugiat in fermentum. Quis viverra nibh cras pulvinar mattis
			nunc sed. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Donec et odio
			pellentesque diam volutpat commodo. A pellentesque sit amet porttitor eget dolor morbi non. In
			ante metus dictum at tempor. Eu mi bibendum neque egestas congue quisque. Ac tincidunt vitae
			semper quis lectus nulla at volutpat. Turpis cursus in hac habitasse platea. Libero enim sed
			faucibus turpis in eu mi bibendum. Dapibus ultrices in iaculis nunc sed augue lacus. Tempus
			urna et pharetra pharetra massa massa ultricies mi. In hac habitasse platea dictumst
			vestibulum rhoncus.
		</p>
	</div>
</section>

<style>
	a {
		color: white;
	}

	a:hover {
		text-decoration: none;
	}
	.banner {
		width: 100%;
		/* height: 348px; */
		z-index: 0;
		display: block;
		overflow: hidden;
		position: relative;
	}

	.banner img {
		width: 100%;
		height: 348px;
		object-fit: cover;
		object-position: center;
		position: relative;
	}

	.banner::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(to bottom, rgba(31, 31, 31, 0.2) 50%, rgba(31, 31, 31, 1) 100%);
	}

	.text {
		z-index: 1;
		overflow: visible;
		position: relative;
		display: block;
		margin-top: 0;
		background-color: rgb(31, 31, 31);
		padding: 1rem;
	}

	.overlap {
		margin-top: -125px;
	}

	.thumbnail {
		z-index: inherit;
		position: relative;
		border-radius: 5px;
		/* aspect-ratio: initial; */
		height: fit-content;
		max-height: 305px;
	}

	.important-info {
		display: grid;
		grid-column-gap: 30px;
		grid-template-columns: 215px auto;
		min-width: 320px;
	}

	.container {
		display: table;
		margin: 0 auto;
	}

	.title {
		font-size: x-large;
		font-weight: 300;
	}
	.description {
		max-width: 900px;
		font-size: small;
		font-weight: 300;
		line-height: 1.5;
		height: min-content;
	}
</style>
