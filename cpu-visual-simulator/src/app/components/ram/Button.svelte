<script lang="ts">
	export let disabled = false
</script>

<button
	class="
        font-medium
        border
        border-t-0
        px-2
        pb-1
        tracking-wider
        rounded-b-md
        disabled:opacity-40
        disabled:cursor-default
        transition-all
        duration-200
        text-emerald-light
        {$$restProps.class}
    "
	style="background: #1e293b; border-color: rgba(16, 185, 129, 0.3);"
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
		background: rgba(16, 185, 129, 0.15) !important;
		box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
	}
	button:active:not(:disabled) {
		background: rgba(16, 185, 129, 0.25) !important;
	}
</style>
