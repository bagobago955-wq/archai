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
	style="color: #94a3b8; border-color: #475569; background: transparent;"
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
		background: #475569 !important;
	}
	button:active:not(:disabled) {
		background: #334155 !important;
	}
</style>
