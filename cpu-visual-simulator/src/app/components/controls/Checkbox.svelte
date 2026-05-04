<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let disabled = false
	export let checked = false

	const dispatch = createEventDispatcher()

	function handleClick(e) {
		checked = !checked
		dispatch("click", e)
	}
</script>

<div
	class="       
        flex
        items-center
        justify-center
        gap-1
		select-none
        {disabled ? 'cursor-default' : 'cursor-pointer'}
        {$$restProps.class}
    "
	on:click={handleClick}
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	{disabled}
>
	<div
		class="
            w-4
            h-4
            border
            rounded-md
            transition-colors
            {disabled ? 'opacity-40' : ''}
        "
		style="border-color: rgba(16, 185, 129, 0.4); {checked ? 'background-color: #10b981;' : 'background-color: transparent;'}"
	/>
	<div class="font-medium pb-[3px] text-indigo-light"><slot /></div>
</div>
