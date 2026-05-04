<script lang="ts">
	import { Switch } from "@rgossiaux/svelte-headlessui"

	export let checked: boolean = false
	export let disabled: boolean = false
</script>

<Switch
	bind:checked
	bind:disabled
	on:change={e => (checked = !checked)}
	class="
        w-14
        h-6
        flex
        items-center
        flex-shrink-0
        rounded-2xl
        transition-colors
        duration-200
        {disabled ? 'cursor-default' : 'cursor-pointer'}
        {disabled ? 'opacity-40' : ''}
        {$$restProps.class}
    "
	style="background: {checked ? '#10b981' : '#334155'};"
>
	<span
		class="
            h-7
            w-7
            rounded-[50%]
            transition-transform
            shadow-lg
            {checked ? 'translate-x-8' : ''}
        "
		style="background: {checked ? '#f8fafc' : '#94a3b8'};"
	/>
</Switch>
