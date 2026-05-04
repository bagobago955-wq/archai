<script lang="ts">
	import text from "../../store/text"
	import { showSettings } from "../../store/settings"
	import logger, { LogCategory } from "../../util/logger"
	import CloseButton from "../../../shared/components/buttons/CloseButton.svelte"
	import { fade } from "svelte/transition"
	import TabGroup from "../../../shared/components/tabs/TabGroup.svelte"
	import Tab from "../../../shared/components/tabs/Tab.svelte"
	import TabList from "../../../shared/components/tabs/TabList.svelte"
	import TabPanels from "../../../shared/components/tabs/TabPanels.svelte"
	import TabPanel from "../../../shared/components/tabs/TabPanel.svelte"
	import General from "./sections/General.svelte"
	import Tts from "./sections/Tts.svelte"
	import Busses from "./sections/Busses.svelte"

	function closeSettings() {
		$showSettings = false
		logger.debug("Settings closed", LogCategory.USER_INPUT)
	}
</script>

{#if $showSettings}
	<div
		class="fixed w-screen h-screen top-0 left-0 overflow-y-auto"
		style="background: #020617; color: #f8fafc;"
		transition:fade={{ duration: 75 }}
	>
		<div class="w-full flex flex-row items-center justify-between pt-3 pb-5 px-9" style="border-bottom: 1px solid rgba(16, 185, 129, 0.2);">
			<h1 class="text-[2.8rem] font-bold text-emerald-light">{$text.settings.title}</h1>
			<CloseButton on:click={closeSettings} />
		</div>
		<TabGroup class="p-5">
			<TabList class="mt-4">
				<Tab class="border-t" style="border-color: rgba(16, 185, 129, 0.2);">{$text.settings.sections_titles.general}</Tab>
				<Tab>{$text.settings.sections_titles.tts}</Tab>
				<Tab>{$text.settings.sections_titles.busses}</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>
					<General />
				</TabPanel>
				<TabPanel>
					<Tts />
				</TabPanel>
				<TabPanel>
					<Busses />
				</TabPanel>
			</TabPanels>
		</TabGroup>
	</div>
{/if}
