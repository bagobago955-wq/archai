<script lang="ts">
	import { ramStore, symbolTableStore, messageFeedStore, codeEditorStore } from "../../../store/state"
	import { parseProgram } from "../../../util/programParser"
	import logger, { LogCategory } from "../../../util/logger"
	import { upload } from "../../../../shared/util/file"
	import MenuItemIcon from "../MenuItem.svelte"
	import text from "../../../store/text"

	async function loadProgram(): Promise<void> {
		try {
			const file = (await upload(".cpuvs"))[0]
			const fileText = await file.text()
			const program = parseProgram(fileText)
			symbolTableStore.get().import(program.symbolTable)
			ramStore.get().import(program.ram)
			codeEditorStore.set(fileText)
			logger.debug("Program loaded from file", LogCategory.USER_INPUT)
		} catch (error) {
			logger.handled_error(error, LogCategory.USER_INPUT)
			$messageFeedStore.error(error.message)
		}
	}
</script>

<button on:click={loadProgram}>
	<MenuItemIcon text={$text.menu.buttons.load.text} title={$text.menu.buttons.load.title} icon="open" />
</button>
