<script lang="ts">
	export let title = ""
	export let description = ""
</script>

<div class="w-full flex flex-row items-center justify-between p-3 pl-11 pr-24" style="border-bottom: 1px solid rgba(16, 185, 129, 0.15);">
	<div class="flex flex-col">
		<h2 class="text-2xl font-bold text-pink-light">{title}</h2>
		<p class="text-sm text-indigo-light">{description}</p>
	</div>
	<slot />
</div>
