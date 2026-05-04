<script lang="ts">
	import { onMount } from "svelte"
	import { download } from "../../../shared/util/file"
	import { showLogsExplorer } from "../../store/settings"
	import { Readable } from "../../util/customStores"
	import logger, { Log, LogCategory, LogLevel } from "../../util/logger"

	const logsStore: Readable<Log[]> = logger.logs
	let logsDiv: HTMLDivElement
	let logs: Log[] = []
	let logLevels: LogLevel[] = [...(Object.keys(LogLevel) as LogLevel[])]
	let logCategories: LogCategory[] = [...(Object.keys(LogCategory) as LogCategory[])]
	let keyword = ""
	let showLogLevel = false
	let showLogCategories = false
	let showTimestamp = false
	let lockScrollToBottom = true

	onMount(() => {
		const toggleShortcutListener = (e: KeyboardEvent) => {
			if (e.altKey && e.shiftKey && e.key.toLowerCase() === "l") {
				toggle()
			}
		}
		window.addEventListener("keydown", toggleShortcutListener)
		return () => window.removeEventListener("keydown", toggleShortcutListener)
	})

	$: {
		if (logsDiv) {
			logs = $logsStore.filter(
				log =>
					logLevels.includes(log.level) &&
					log.categories.every(c => logCategories.includes(c)) &&
					log.message.toLowerCase().includes(keyword)
			)
			if (lockScrollToBottom) {
				logsDiv.scrollTop = logsDiv.scrollHeight
			}
		}
	}

	function toggle() {
		showLogsExplorer.update(oldValue => !oldValue)
	}

	function exportLogs() {
		download(JSON.stringify($logsStore), `cpu-visual-simultor-logs-${new Date().toDateString()}.json`)
	}
</script>

{#if $showLogsExplorer}
	<div class="fixed top-0 left-0 w-screen h-screen z-[1000] text-white" style="background: rgba(2, 6, 23, 0.95);">
		<div class="flex flex-wrap items-center justify-around gap-4 p-4">
			<h2 class="text-2xl text-emerald-light font-bold">Logs</h2>
			<div class="flex items-center flex-wrap gap-4 p-2">
				<label for="keyword" class="text-indigo-light">
					Keyword:
					<input type="text" bind:value={keyword} class="px-1 py-0.5 rounded" style="background: #1e293b; color: #f8fafc; border: 1px solid rgba(16, 185, 129, 0.3);" />
				</label>
				<label for="level" class="text-indigo-light">
					Level:
					<select id="level" bind:value={logLevels} class="px-1 py-0.5 rounded" style="background: #1e293b; color: #f8fafc;" multiple>
						{#each Object.keys(LogLevel) as level}
							<option value={level}>{level}</option>
						{/each}
					</select>
				</label>
				<label for="categories" class="text-indigo-light">
					Categories:
					<select id="categories" bind:value={logCategories} class="px-1 py-0.5 rounded" style="background: #1e293b; color: #f8fafc;" multiple>
						{#each Object.keys(LogCategory) as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</label>
			</div>
			<div class="flex items-center flex-wrap gap-4 p-2 text-indigo-light">
				<label for="lock-scroll-to-bottom">
					Lock scroll to bottom
					<input type="checkbox" id="lock-scroll-to-bottom" bind:checked={lockScrollToBottom} />
				</label>
				<label for="show-timestamp">
					Show timestamp
					<input type="checkbox" id="show-timestamp" bind:checked={showTimestamp} />
				</label>
				<label for="show-level">
					Show log level
					<input type="checkbox" id="show-level" bind:checked={showLogLevel} />
				</label>
				<label for="show-categories">
					Show log categories
					<input type="checkbox" id="show-categories" bind:checked={showLogCategories} />
				</label>
			</div>
			<div class="flex items-center flex-wrap gap-4 p-2">
				<button on:click={exportLogs} class="border px-2 py-1 rounded text-emerald-light transition-colors hover:bg-emerald/20" style="border-color: rgba(16, 185, 129, 0.4);">Export</button>
			</div>
			<button on:click={toggle} title="Close logs">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-7 w-7 fill-white hover:fill-rose transition-colors">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
		<div class="w-full h-[90%] overflow-y-auto" bind:this={logsDiv}>
			{#each logs as log}
				<p class="m-2 whitespace-pre-line {log.level}">
					{#if showTimestamp}{log.timestamp} - {/if}
					{log.message}
				</p>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.UNEXPECTED_ERROR {
		color: #f43f5e;
		background-color: rgba(244, 63, 94, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
	}

	.HANDLED_ERROR {
		color: #f59e0b;
		background-color: rgba(245, 158, 11, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
	}

	.DEBUG {
		color: #94a3b8;
	}
</style>
