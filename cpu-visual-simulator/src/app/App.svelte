<script lang="ts">
	import Stage from "./components/Stage.svelte"
	import MessageFeed from "./components/messages/Feed.svelte"
	import { controls, messageFeed, logger, menu, settings } from "./store/components"
	import { onMount } from "svelte"
	import LoggerComponent from "./components/debug/Logger.svelte"
	import Logger, { LogCategory } from "./util/logger"
	import Controls from "./components/controls/Controls.svelte"
	import Menu from "./components/menu/Menu.svelte"
	import Settings from "./components/settings/Settings.svelte"
	import Cpu from "./model/Cpu"
	import Ram from "./model/Ram"
	import SymbolTable from "./model/SymbolTable"
	import ProgramExecution from "./execution/ProgramExecution"
	import { animationsEnabled } from "./store/settings"

	export let cpu: Cpu
	export let ram: Ram
	export let symbolTable: SymbolTable
	export let programExecution: ProgramExecution
	export let onMountCallback: () => void

	let app: HTMLDivElement

	function scale() {
		const width = 1750
		const height = 800
		let widthRatio = window.innerWidth / width
		let heightRatio = window.innerHeight / height
		let scale = widthRatio < heightRatio ? widthRatio : heightRatio
		app.style.transform = `scale(${scale})`
	}

	function logError(event: Event) {
		event.preventDefault()
		Logger.unexpected_error((event as ErrorEvent).message, LogCategory.UNCAUGHT)
	}

	onMount(() => {
		scale()
		onMountCallback()
	})
</script>

<svelte:window on:resize={scale} on:error={logError} />
<div class="relative w-app h-app origin-top-left" bind:this={app}>
	<Stage {cpu} {ram} {symbolTable} animationsEnabled={$animationsEnabled} />
	<Controls bind:this={$controls} {cpu} {programExecution} />
	<Menu bind:this={$menu} />
</div>
<LoggerComponent bind:this={$logger} />
<MessageFeed bind:this={$messageFeed} />
<Settings bind:this={$settings} />

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	* {
		box-sizing: border-box;
	}

	body {
		color: #f8fafc;
		font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
	}

	::selection {
		background-color: rgba(14, 165, 233, 0.3);
		color: #f8fafc;
	}

	::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	::-webkit-scrollbar-track {
		background: #0f172a;
	}
	::-webkit-scrollbar-thumb {
		background: #334155;
		border-radius: 3px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #475569;
	}
</style>
