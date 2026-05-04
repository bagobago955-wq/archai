<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash as flashComponent } from "../../util/animation"
	import { Color } from "../../util/colors"

	export let animationsEnabled: boolean

	let cuDiv: HTMLDivElement

	export async function flash() {
		if (!animationsEnabled) return
		return flashComponent(cuDiv, "background-color", Color.GREEN)
	}
</script>

<div
	class="
		absolute
		top-[230px]
		left-[100px]
		w-[120px]
		h-[60px]
		border
		border-emerald/30
		rounded-md
		shadow-glow-emerald
		flex
		items-center
		justify-center
		text-center
		text-indigo-light
	"
	style="background: #1e293b;"
	bind:this={cuDiv}
>
	<ComponentLabel text="Control Unit / Decoder" />
</div>
