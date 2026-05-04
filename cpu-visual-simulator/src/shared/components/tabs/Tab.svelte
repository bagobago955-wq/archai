<script lang="ts">
	import { Tab } from "@rgossiaux/svelte-headlessui"
</script>

<Tab let:selected>
	<div
		class="
            pl-4
            py-2
            border-l-4
            border-b
            text-left
            transition-colors
            duration-200
            {selected ? 'font-bold' : 'border-l-transparent'}
            {$$props.class}
        "
		style="border-bottom-color: rgba(16, 185, 129, 0.15); {selected ? 'border-left-color: #10b981; color: #10b981;' : 'color: #94a3b8;'}"
	>
		<slot />
	</div>
</Tab>

<style>
	div:hover {
		color: #10b981 !important;
	}
</style>
