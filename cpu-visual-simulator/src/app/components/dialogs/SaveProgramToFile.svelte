<script lang="ts">
	import { Dialog, DialogOverlay, DialogTitle } from "@rgossiaux/svelte-headlessui"
	import { createEventDispatcher } from "svelte"
	import BlueButton from "../../../shared/components/buttons/Blue.svelte"
	import GrayButton from "../../../shared/components/buttons/Gray.svelte"
	import { download } from "../../../shared/util/file"
	import { ramStore, symbolTableStore } from "../../store/state"
	import text from "../../store/text"
	import { exportProgram } from "../../util/programParser"
	import logger, { LogCategory } from "../../util/logger"

	const dispatch = createEventDispatcher()

	export let open: boolean

	let filename = ""

	function onSave(): void {
		if (filename === "") {
			return
		}
		download(exportProgram($ramStore, $symbolTableStore), `${filename}.cpuvs`)
		filename = ""
		logger.debug("Program saved to file", LogCategory.USER_INPUT)
		dispatch("close")
	}

	function onCancel(): void {
		filename = ""
		dispatch("close")
	}

	function onClose(): void {
		filename = ""
		dispatch("close")
	}
</script>

<Dialog {open} on:close={onClose}>
	<DialogOverlay class="fixed top-0 left-0 bg-black/60 w-screen h-screen" />
	<div
		class="
			fixed
			top-[50vh]
			left-[50vw]
			-translate-x-2/4
			-translate-y-2/4
			flex
			flex-col
			items-center
			justify-center
			gap-4
			p-6
			rounded-lg
			shadow-lg
		"
		style="background: #0f172a; border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 0 40px rgba(14, 165, 233, 0.1);"
	>
		<DialogTitle class="text-emerald-light font-bold text-lg">{$text.menu.overlays.save_to_file.title}</DialogTitle>
		<div class="flex items-center justify-center">
			<input
				type="text"
				placeholder={$text.menu.overlays.save_to_file.inputs.filename.placeholder}
				class="rounded-md px-2 py-1 font-mono outline-none"
				style="background: #1e293b; border: 1px solid rgba(16, 185, 129, 0.3); color: #f8fafc;"
				bind:value={filename}
			/>
			<span class="ml-1 text-indigo-light">.cpuvs</span>
		</div>
		<div class="flex items-center justify-center gap-2">
			<BlueButton title={$text.menu.overlays.save_to_file.buttons.save.title} on:click={onSave}>
				{$text.menu.overlays.save_to_file.buttons.save.text}
			</BlueButton>
			<GrayButton title={$text.menu.overlays.save_to_file.buttons.cancel.title} on:click={onCancel}>
				{$text.menu.overlays.save_to_file.buttons.cancel.text}
			</GrayButton>
		</div>
	</div>
</Dialog>
