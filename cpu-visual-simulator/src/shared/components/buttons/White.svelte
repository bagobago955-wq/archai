<script lang="ts">
	export let disabled = false
</script>

<button
	class="
        border-2
        px-2
        rounded-md
        transition-all
        duration-200
        disabled:opacity-40
        disabled:cursor-default
        {$$restProps.class}
    "
	style="color: #f8fafc; border-color: rgba(248, 250, 252, 0.5); background: transparent;"
	on:click
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	{disabled}
>
	<slot />
</button>

<style>
	button:hover:not(:disabled) {
		color: #020617 !important;
		background: #f8fafc !important;
	}
	button:active:not(:disabled) {
		background: #e2e8f0 !important;
	}
</style>
