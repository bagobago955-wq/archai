<script lang="ts">
	import ComponentLabel from "../labels/Component.svelte"
	import InstructionRegister from "./InstructionRegister.svelte"
	import ControlUnit from "./ControlUnit.svelte"
	import Accumulator from "./Accumulator.svelte"
	import Increment from "./Increment.svelte"
	import StatusWord from "./StatusWord.svelte"
	import ProgramCounter from "./ProgramCounter.svelte"
	import Multiplexer from "./Multiplexer.svelte"
	import ArithmeticLogicUnit from "./ArithmeticLogicUnit.svelte"
	import { FlashableCpuComponent } from "../../execution/actions/cpu/animation/FlashCpu"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu
	export let animationsEnabled: boolean

	let ir: InstructionRegister
	let cu: ControlUnit
	let pc: ProgramCounter
	let inc: Increment
	let mux: Multiplexer
	let alu: ArithmeticLogicUnit
	let sw: StatusWord
	let acc: Accumulator

	export async function flash(component: FlashableCpuComponent) {
		if (!animationsEnabled) return
		switch (component) {
			case "IR":
				return Promise.all([ir.flashOpcode(), ir.flashOperand()])
			case "IR:OPC":
				return ir.flashOpcode()
			case "IR:OPR":
				return ir.flashOperand()
			case "PC":
				return pc.flash()
			case "INC":
				return inc.flash()
			case "MUX":
				return mux.flash()
			case "CU":
				return cu.flash()
			case "ALU:1":
				return alu.flashFirstOperand()
			case "ALU:2":
				return alu.flashSecondOperand()
			case "ALU:OPR":
				return alu.flashOperator()
			case "ACC":
				return acc.flash()
			case "SW:Z":
				return sw.flashZeroFlag()
			case "SW:N":
				return sw.flashNegativeFlag()
		}
	}
</script>

<div
	class="absolute left-[50px] top-[50px] w-[700px] h-[620px] z-[1] rounded-[30px] shadow-cpu"
	style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid rgba(14, 165, 233, 0.2);"
/>
<div class="absolute left-[50px] top-[50px] w-[700px] h-[620px] z-[3] rounded-[30px]"
	style="border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: inset 0 0 60px rgba(14, 165, 233, 0.05);"
>
	<ComponentLabel text="CPU" fontSize="LARGE" top="-30px" left="47%" />
	<InstructionRegister bind:this={ir} {cpu} {animationsEnabled} />
	<ControlUnit bind:this={cu} {animationsEnabled} />
	<ProgramCounter bind:this={pc} {cpu} {animationsEnabled} />
	<Increment bind:this={inc} {cpu} {animationsEnabled} />
	<Multiplexer bind:this={mux} {animationsEnabled} />
	<ArithmeticLogicUnit bind:this={alu} {cpu} {animationsEnabled} />
	<StatusWord bind:this={sw} {cpu} {animationsEnabled} />
	<Accumulator bind:this={acc} {cpu} {animationsEnabled} />
</div>
