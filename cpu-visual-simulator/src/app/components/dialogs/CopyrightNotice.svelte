<script lang="ts">
	import CloseButton from "../../../shared/components/buttons/CloseButton.svelte"
	import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui"
	import { createEventDispatcher } from "svelte"
	import text from "../../store/text"

	export let open: boolean

	const dispatch = createEventDispatcher()

	function closeDialog(): void {
		dispatch("close")
	}
</script>

<Dialog {open} on:close={closeDialog}>
	<DialogOverlay class="fixed top-0 left-0 bg-black/60 w-screen h-screen" />
	<div
		class="
				fixed
				top-[50%]
				left-[50%]
				max-h-[90vh]
				max-w-[50vw]
				overflow-auto
				flex
				flex-col
				items-center
				justify-center
				gap-6
				p-10
				rounded-2xl
				shadow-lg
				-translate-x-2/4
				-translate-y-2/4
			"
		style="background: #0f172a; border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 0 40px rgba(14, 165, 233, 0.1);"
	>
		<CloseButton class="absolute top-3 right-3" on:click={closeDialog} size={30} />
		<div class="text-center">
			<h2 class="text-lg font-semibold mb-2 text-emerald-light">
				{$text.menu.overlays.copyright.subsections.copyright_notice.title}
			</h2>
			{#each $text.menu.overlays.copyright.subsections.copyright_notice.paragraphs as paragraph}
				<p class="text-indigo-light">{paragraph}</p>
			{/each}
			{#if $text.menu.overlays.copyright.subsections.copyright_notice.disclaimer}
				<p class="mt-2 text-indigo-light">
					{$text.menu.overlays.copyright.subsections.copyright_notice.disclaimer}
				</p>
			{/if}
		</div>
		{#if $text.menu.overlays.copyright.subsections.credits}
			<div class="text-center">
				<h2 class="text-lg font-semibold mb-2 text-emerald-light">{$text.menu.overlays.copyright.subsections.credits.title}</h2>
				{#each $text.menu.overlays.copyright.subsections.credits.paragraphs as paragraph}
					<p class="mb-4 text-indigo-light">{paragraph}</p>
				{/each}
			</div>
		{/if}
	</div>
</Dialog>
