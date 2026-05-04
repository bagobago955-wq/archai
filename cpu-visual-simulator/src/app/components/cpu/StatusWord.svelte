<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import { flash } from "../../util/animation"
	import logger, { LogCategory } from "../../util/logger"
	import Cpu from "../../model/Cpu"
	import { intDataBusAnimationColor } from "../../store/settings"
	import { Color } from "../../util/colors"

	export let cpu: Cpu
	export let animationsEnabled: boolean

	let swzDiv: HTMLDivElement
	let swnDiv: HTMLDivElement

	const negativeFlag = cpu.negativeFlag
	const zeroFlag = cpu.zeroFlag

	export async function flashZeroFlag() {
		if (!animationsEnabled) return
		return flash(swzDiv, "background-color", Color.GREEN)
	}

	export async function flashNegativeFlag() {
		if (!animationsEnabled) return
		return flash(swnDiv, "background-color", Color.GREEN)
	}

	function toggleZeroFlag() {
		logger.debug(`Toggled zero flag: "${!$zeroFlag}"`, LogCategory.USER_INPUT)
		$zeroFlag = !$zeroFlag
		flashZeroFlag()
	}

	function toggleNegativeFlag() {
		logger.debug(`Toggled negative flag: "${!$negativeFlag}"`, LogCategory.USER_INPUT)
		$negativeFlag = !$negativeFlag
		flashNegativeFlag()
	}
</script>

<div
	class="
	absolute
	top-[550px]
	left-[540px]
	w-[120px]
	h-[30px]
	rounded-md
	shadow-component
	flex
	items-center
	justify-center
	font-mono
	text-pink-light
"
	style="background: #1e293b;"
>
	<ComponentLabel text="SW" top="-25px" left="0" />
	<div
		class="
			relative
			h-full
			flex items-center
			justify-center
			w-[19%] border
			rounded-l-md
			cursor-pointer
			select-none
		"
		style="background: #1e293b; border-color: rgba(16, 185, 129, 0.3);"
		bind:this={swzDiv}
		on:click={toggleZeroFlag}
	>
		<ComponentLabel text="Z" bottom="-21px" left="25%" />
		{$zeroFlag ? "1" : "0"}
	</div>
	<div
		class="
			relative
			h-full
			flex
			items-center
			justify-center
			w-[19%]
			cursor-pointer
			select-none
			text-indigo-light
		"
		style="background: #1e293b;"
		bind:this={swnDiv}
		on:click={toggleNegativeFlag}
	>
		<ComponentLabel text="N" bottom="-21px" left="25%" />
		{$negativeFlag ? "1" : "0"}
	</div>
	<div
		class="
			relative
			h-full
			flex
			items-center
			justify-center
			w-[62%]
			border
			rounded-r-md
			select-none
			text-gray-500
		"
		style="border-color: rgba(16, 185, 129, 0.3);"
	>
		------
	</div>
</div>
<div
	class="
		absolute
		top-[550px]
		left-[540px]
		w-[120px]
		h-[30px]
		rounded-md
		border
		pointer-events-none
	"
	style="border-color: rgba(16, 185, 129, 0.3);"
/>
<!-- the purpose of this last div is to give a border to the component. The border was buggy when given directly to the component -->
