<script lang="ts">
	import text from "../../../store/text"
	import { Menu, MenuButton, MenuItems, MenuItem } from "@rgossiaux/svelte-headlessui"
	import MenuItemIcon from "../MenuItem.svelte"
	import SaveToFileDialog from "../../dialogs/SaveProgramToFile.svelte"
	import SaveToUrlDialog from "../../dialogs/SaveProgramToUrl.svelte"

	let showSaveToFileDialog = false
	let showSaveToUrlDialog = false

	function openSaveToFileDialog(): void {
		showSaveToFileDialog = true
	}

	function closeSaveToFileDialog(): void {
		showSaveToFileDialog = false
	}

	function openSaveToUrlDialog(): void {
		showSaveToUrlDialog = true
	}

	function closeSaveToUrlDialog(): void {
		showSaveToUrlDialog = false
	}
</script>

<Menu>
	<MenuButton>
		<MenuItemIcon text={$text.menu.buttons.save.text} title={$text.menu.buttons.save.title} icon="save" />
	</MenuButton>
	<MenuItems
		class="absolute flex flex-col mt-1 shadow-lg rounded-md"
		style="background: #0f172a; border: 1px solid rgba(16, 185, 129, 0.3);"
	>
		<MenuItem
			class="
				text-sm
				py-1
				px-2
				first:rounded-t-md
				last:rounded-b-md
			"
			style="color: #a5b4fc; border-bottom: 1px solid rgba(16, 185, 129, 0.15);"
			title={$text.menu.buttons.save.save_to_file.title}
		>
			<button class="text-base leading-none hover:text-emerald-light transition-colors" on:click={openSaveToFileDialog}>
				{$text.menu.buttons.save.save_to_file.text}
			</button>
		</MenuItem>
		<MenuItem
			class="
				text-sm
				py-1
				px-2
				first:rounded-t-md
				last:rounded-b-md
			"
			style="color: #a5b4fc;"
			title={$text.menu.buttons.save.save_to_url.title}
		>
			<button class="text-base leading-none hover:text-emerald-light transition-colors" on:click={openSaveToUrlDialog}>
				{$text.menu.buttons.save.save_to_url.text}
			</button>
		</MenuItem>
	</MenuItems>
</Menu>

<SaveToFileDialog open={showSaveToFileDialog} on:close={closeSaveToFileDialog} />
<SaveToUrlDialog open={showSaveToUrlDialog} on:close={closeSaveToUrlDialog} />
