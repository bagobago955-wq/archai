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
	style="color: #10b981; border-color: #10b981; background: transparent;"
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
		background: #10b981 !important;
		box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
	}
	button:active:not(:disabled) {
		background: #059669 !important;
	}
</style>
