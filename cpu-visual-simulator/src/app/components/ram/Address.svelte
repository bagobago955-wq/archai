<script lang="ts">
	import { animationsEnabled, extAddressBusAnimationColor, extAddressBusColor } from "../../store/settings"

	import { displayAsBinary } from "../../store/settings"
	import { flash as flashComponent, highlight as highlightComponent, unhighlight as unhighlightComponent } from "../../util/animation"
	import BinaryValue from "../../model/BinaryValue"

	export let address: number

	let addressDiv: HTMLDivElement
	let isActive = false

	export function getAddress() {
		return address
	}

	export async function flash() {
		if (!$animationsEnabled) return
		isActive = true
		return new Promise(resolve => setTimeout(resolve, 300))
	}

	export function unhighlight() {
		isActive = false
	}
</script>

<div
	class="
		h-[30px]
		w-[100px]
		flex
		items-center
		justify-center
		border
		border-t-0
		font-mono
		text-emerald-light
		transition-colors
		duration-300
		{$$restProps.class}
	"
	style="background-color: {isActive ? $extAddressBusAnimationColor : `${$extAddressBusColor}20`}; border-color: rgba(16, 185, 129, 0.2);"
	bind:this={addressDiv}
>
	{$displayAsBinary ? new BinaryValue(8, address).toBinaryString() : address}
</div>

<style lang="scss">
	.first-address {
		border-radius: 16px 0 0 0;
		border-top-width: 1px;
	}

	.last-address {
		border-radius: 0 0 0 16px;
	}
</style>
