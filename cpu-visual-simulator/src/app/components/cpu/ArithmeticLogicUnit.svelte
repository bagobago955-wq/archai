<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash } from "../../util/animation"
	import { displayAsBinary } from "../../store/settings"
	import Cpu from "../../model/Cpu"
	import { Color } from "../../util/colors"

	export let cpu: Cpu
	export let animationsEnabled: boolean

	let operand1Div: HTMLDivElement
	let operand2Div: HTMLDivElement
	let operatorDiv: HTMLDivElement

	const alu1 = cpu.alu1
	const alu2 = cpu.alu2
	const aluOperation = cpu.aluOperation

	export async function flashFirstOperand() {
		if (!animationsEnabled) return
		return flash(operand1Div, "background-color", Color.GREEN)
	}

	export async function flashSecondOperand() {
		if (!animationsEnabled) return
		return flash(operand2Div, "background-color", Color.GREEN)
	}

	export async function flashOperator() {
		if (!animationsEnabled) return
		return flash(operatorDiv, "background-color", Color.GREEN)
	}

	function splitBinString(bin: string): string {
		return [bin.slice(0, 8), bin.slice(8)].join(" ")
	}
</script>

<div class="absolute top-[380px] left-[210px] w-[300px] h-fit">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="w-full h-full drop-shadow-component"
		style="stroke: #f59e0b; stroke-width: 1.6px; fill: rgba(245, 158, 11, 0.08);"
		viewBox="-1 -1 450 162"
	>
		<path d="m 0 0 l 192 0 l 32 32 l 32 -32 l 192 0 l -96 160 l -256 0 z" />
	</svg>
	<ComponentLabel text="ALU" top="-25px" left="45%" />
	<div
		class="
			absolute
			flex
			items-center
			justify-center
			top-[15%]
			left-[15%]
			w-[90px] 
			{$displayAsBinary ? 'top-[15%] h-[50px]' : 'top-[20%] h-[30px]'}
			text-center
			leading-tight
			rounded-lg
			font-mono
			text-amber-light
		"
		style="background: rgba(245, 158, 11, 0.1);"
		bind:this={operand1Div}
	>
		{$displayAsBinary ? splitBinString($alu1.toBinaryString()) : $alu1.signed()}
	</div>
	<div
		class="
			absolute
			flex
			items-center
			justify-center
			top-[50%]
			left-[50%]
			-translate-x-1/2
			w-[30px]
			h-[30px]
			rounded-lg
			font-bold
			text-2xl
			leading-[30px]
			text-amber
		"
		style="background: rgba(245, 158, 11, 0.15);"
		bind:this={operatorDiv}
	>
		{$aluOperation}
	</div>
	<div
		class="
			absolute
			flex
			items-center
			justify-center
			top-[15%]
			right-[15%]
			w-[90px]
			{$displayAsBinary ? 'top-[15%] h-[50px]' : 'top-[20%] h-[30px]'}
			text-center
			leading-tight
			rounded-lg
			font-mono
			text-amber-light
		"
		style="background: rgba(245, 158, 11, 0.1);"
		bind:this={operand2Div}
	>
		{$displayAsBinary ? splitBinString($alu2.toBinaryString()) : $alu2.signed()}
	</div>
</div>
