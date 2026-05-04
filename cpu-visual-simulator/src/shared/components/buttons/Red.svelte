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
	style="color: #f43f5e; border-color: #f43f5e; background: transparent;"
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
		color: #f8fafc !important;
		background: #f43f5e !important;
		box-shadow: 0 0 12px rgba(244, 63, 94, 0.4);
	}
	button:active:not(:disabled) {
		background: #e11d48 !important;
	}
</style>
