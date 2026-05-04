<script lang="ts">
	import { flash as flashElement } from "../../util/animation"
	import { displayAsBinary } from "../../store/settings"
	import Cpu from "../../model/Cpu"
	import { Color } from "../../util/colors"

	export let cpu: Cpu
	export let animationsEnabled: boolean

	let element: HTMLDivElement

	const increment = cpu.increment

	export async function flash() {
		if (!animationsEnabled) return
		return flashElement(element, "background-color", Color.GREEN)
	}
</script>

<div
	class="
	absolute
	top-[130px]
	left-[570px]
	w-[100px]
	h-[30px]
	leading-[30px]
	text-center
	border
	border-emerald/30
	rounded-md
	shadow-component
	font-mono
	text-emerald-light
"
	style="background: #1e293b;"
	bind:this={element}
>
	+{$displayAsBinary ? $increment.toBinaryString() : $increment.unsigned()}
</div>
