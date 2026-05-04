<script lang="ts">
	import { ramStore, symbolTableStore, messageFeedStore, codeEditorStore } from "../store/state"
	import { parseProgram } from "../util/programParser"
	import logger, { LogCategory } from "../util/logger"
	import ComponentLabel from "./labels/Component.svelte"
	import { onMount } from "svelte"

	function loadToRam() {
		try {
			if ($codeEditorStore.trim() === "") {
				$messageFeedStore.error("Kode tidak boleh kosong!")
				return
			}
			const program = parseProgram($codeEditorStore)
			symbolTableStore.get().import(program.symbolTable)
			ramStore.get().import(program.ram)
			logger.debug("Program loaded from Code Canvas", LogCategory.USER_INPUT)
			$messageFeedStore.success("Kode berhasil dimuat ke RAM!")
		} catch (error) {
			logger.handled_error(error, LogCategory.USER_INPUT)
			$messageFeedStore.error(error.message)
		}
	}

	// Event Listener untuk menerima kode Assembly dari React Parent (postMessage)
	onMount(() => {
		function handleMessageFromParent(event: MessageEvent) {
			if (event.data && event.data.type === 'LOAD_CODE') {
				const codeFromAI = event.data.code
				// Masukkan kode AI ke dalam editor
				$codeEditorStore = codeFromAI
				logger.debug("Assembly code received from AI and loaded to editor", LogCategory.USER_INPUT)
				$messageFeedStore.success("✨ Kode Assembly dari AI berhasil dimuat ke editor!")
			}
		}

		window.addEventListener('message', handleMessageFromParent)

		// Cleanup saat komponen unmount
		return () => {
			window.removeEventListener('message', handleMessageFromParent)
		}
	})
</script>

<div class="absolute top-[115px] left-[1395px] z-[5] flex flex-col items-center justify-start w-[340px] h-[570px]">
	<ComponentLabel text="EDITOR KODE" fontSize="LARGE" top="-30px" right="0" />
	
	<div class="w-full h-[490px] flex flex-col rounded-2xl shadow-cpu overflow-hidden border border-emerald/30 bg-navy-900/80 backdrop-filter backdrop-blur">
		<textarea
			bind:value={$codeEditorStore}
			class="w-full h-full p-4 bg-transparent text-emerald-light font-mono text-sm resize-none outline-none focus:outline-none"
			placeholder="; Ketik instruksi di sini...&#10;; (Satu baris untuk satu instruksi)&#10;&#10;MULAI: LOD #10&#10;ADD #5&#10;STO 20&#10;HLT"
			spellcheck="false"
		></textarea>
	</div>

	<div class="mt-4 flex w-full justify-center">
		<button
			class="
				px-6 py-2 
				rounded-md 
				bg-navy-800 
				text-emerald-light 
				border border-emerald/40 
				hover:bg-emerald/20 hover:text-white
				transition-all duration-300
				font-semibold tracking-wider
				shadow-glow-emerald
			"
			on:click={loadToRam}
		>
			MUAT KE RAM
		</button>
	</div>
</div>
