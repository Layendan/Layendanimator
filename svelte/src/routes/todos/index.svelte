<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	type Todo = {
		uid: string;
		created_at: Date;
		text: string;
		done: boolean;
	};

	const fileName = 'todos.json';
	export let todos: Todo[] = [];
	let todo: string;

	function saveNewTodo() {
		if (todo && todo.trim().length > 0) {
			let newTodo: Todo = {
				uid: Math.random().toString(),
				created_at: new Date(),
				text: todo,
				done: false
			};
			todos = [newTodo, ...todos];
			todo = '';
			saveTodos();
		}
	}

	function toggleDone(uid: string) {
		todos = todos.map((t) => {
			if (t.uid === uid) {
				return { ...t, done: !t.done };
			}
			return t;
		});

		saveTodos();
	}

	function deleteTodo(uid: string) {
		todos = todos.filter((t) => t.uid !== uid);
		saveTodos();
	}

	function updateTodo(uid: string, text: string) {
		todos = todos.map((t) => {
			if (t.uid === uid) {
				return { ...t, text };
			}
			return t;
		});

		saveTodos();
	}

	function saveTodos() {
		const data = {
			fileName: fileName,
			todo: JSON.stringify(todos)
		};
	}
</script>

<svelte:head>
	<title>Todos</title>
</svelte:head>

<div class="todos" transition:slide>
	<h1>Todos</h1>

	<form class="new" on:submit|preventDefault={saveNewTodo}>
		<input name="text" aria-label="Add todo" placeholder="+ tap to add a todo" bind:value={todo} />
	</form>
	{#each todos as todo (todo.uid)}
		<div class="todo" class:done={todo.done} transition:slide animate:flip={{ duration: 400 }}>
			<form on:submit|preventDefault on:click={() => toggleDone(todo.uid)}>
				<input type="hidden" name="done" value={todo.done ? '' : 'true'} />
				<button class="toggle" aria-label="Mark todo as {todo.done ? 'not done' : 'done'}" />
			</form>

			<form on:submit|preventDefault class="text" />

			<form on:submit|preventDefault on:click={() => deleteTodo(todo.uid)}>
				<button class="delete" aria-label="Delete todo" />
			</form>
		</div>
	{/each}
</div>

<style>
	.todos {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
		line-height: 1;
	}

	.new {
		margin: 0 0 0.5rem 0;
	}

	input {
		border: 1px solid transparent;
	}

	input:focus-visible {
		box-shadow: inset 1px 1px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid #ff3e00 !important;
		outline: none;
	}

	.new input {
		font-size: 28px;
		width: 100%;
		padding: 0.5em 1em 0.3em 1em;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		text-align: center;
	}

	.todo {
		display: grid;
		grid-template-columns: 2rem 1fr 2rem;
		grid-gap: 0.5rem;
		align-items: center;
		margin: 0 0 0.5rem 0;
		padding: 0.5rem;
		background-color: white;
		border-radius: 8px;
		filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
		transform: translate(-1px, -1px);
		transition: filter 0.2s, transform 0.2s;
	}

	.done {
		transform: none;
		opacity: 0.4;
		filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.1));
	}

	form.text {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
	}

	.todo input {
		flex: 1;
		padding: 0.5em 2em 0.5em 0.8em;
		border-radius: 3px;
	}

	.todo button {
		width: 2em;
		height: 2em;
		border: none;
		background-color: transparent;
		background-position: 50% 50%;
		background-repeat: no-repeat;
	}

	button.toggle {
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 50%;
		box-sizing: border-box;
		background-size: 1em auto;
	}

	.done .toggle {
		background-image: url("data:image/svg+xml,%3Csvg width='22' height='16' viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.5 1.5L7.4375 14.5L1.5 8.5909' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
	}

	.delete {
		background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.5 5V22H19.5V5H4.5Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M10 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M2 5H22' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8 5L9.6445 2H14.3885L16 5H8Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
		opacity: 0.2;
	}

	.delete:hover,
	.delete:focus {
		transition: opacity 0.2s;
		opacity: 1;
	}

	.todo input:focus {
		transition: opacity 0.2s;
		opacity: 1;
	}
</style>
