<script lang="ts">
	import { messageFeedStore } from "../../../store/state"
	import text from "../../../store/text"
	import { ramStore, symbolTableStore } from "../../../store/state"
	import logger, { LogCategory } from "../../../util/logger"
	import { parseProgram } from "../../../util/programParser"
	import { Menu, MenuButton, MenuItems, MenuItem } from "@rgossiaux/svelte-headlessui"
	import MenuItemIcon from "../MenuItem.svelte"

	const examples = [
		{
			id: "if_then_else",
			url: "resources/examples/if_then_else.cpuvs"
		},
		{
			id: "while_do",
			url: "resources/examples/while_do.cpuvs"
		},
		{
			id: "array_sum",
			url: "resources/examples/array_sum.cpuvs"
		}
	] as const

	async function loadExample(exampleUrl: string): Promise<void> {
		try {
			const example = await fetch(exampleUrl).then(res => res.text())
			const program = parseProgram(example)
			symbolTableStore.get().import(program.symbolTable)
			ramStore.get().import(program.ram)
			logger.debug(`Example ${exampleUrl} loaded`, LogCategory.USER_INPUT)
		} catch (error) {
			logger.handled_error(error.message, LogCategory.USER_INPUT)
			$messageFeedStore.error(error.message)
		}
	}
</script>

<Menu>
	<MenuButton>
		<MenuItemIcon
			text={$text.menu.buttons.examples.text}
			title={$text.menu.buttons.examples.title}
			icon="examples"
		/>
	</MenuButton>
	<MenuItems
		class="absolute flex flex-col mt-1 shadow-lg rounded-md"
		style="background: #0f172a; border: 1px solid rgba(16, 185, 129, 0.3);"
	>
		{#each examples as example}
			<MenuItem
				class="
					text-sm
					py-1
					px-2
					first:rounded-t-md
					last:rounded-b-md
				"
				style="color: #a5b4fc; border-bottom: 1px solid rgba(16, 185, 129, 0.15);"
				title={$text.menu.buttons.examples.examples[example.id].title}
			>
				<button class="text-base leading-none hover:text-emerald-light transition-colors" on:click={() => loadExample(example.url)}>
					{$text.menu.buttons.examples.examples[example.id].text}
				</button>
			</MenuItem>
		{/each}
	</MenuItems>
</Menu>
