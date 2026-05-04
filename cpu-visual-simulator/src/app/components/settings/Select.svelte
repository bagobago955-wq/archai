<script lang="ts">
	export let value = ""
	export let placeholder = ""
	export let disabled = false
	export let options: string[] = []
</script>

<select
	class="
        cursor-pointer
        bg-transparent
        border
        rounded-md
        px-1
        disabled:opacity-40
        w-fit
        text-emerald-light
        {$$restProps.class}
    "
	style="border-color: rgba(16, 185, 129, 0.4); background: #1e293b;"
	on:input
	on:change
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	bind:value
	{disabled}
>
	{#if placeholder !== ""}
		<option style="color: #f8fafc; background: #1e293b;" value="" selected disabled>{placeholder}</option>
	{/if}
	{#each options as option}
		<option style="color: #f8fafc; background: #1e293b;" value={option}>{option}</option>
	{/each}
</select>
