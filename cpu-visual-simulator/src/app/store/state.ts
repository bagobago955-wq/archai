import { writable } from "../util/customStores"
import Cpu from "../model/Cpu"
import Ram from "../model/Ram"
import SymbolTable from "../model/SymbolTable"
import Wires from "../model/Wires"
import ProgramExecution from "../execution/ProgramExecution"
import NonBlockingLoop from "../execution/NonBlockingLoop"
import MessageFeed from "../model/MessageFeed"

export const cpuStore = writable<Cpu>()
export const ramStore = writable<Ram>()
export const symbolTableStore = writable<SymbolTable>()
export const wiresStore = writable<Wires>()
export const programExecutionStore = writable<ProgramExecution>()
export const programExecutionLoopStore = writable<NonBlockingLoop>()
export const messageFeedStore = writable<MessageFeed>()
export const codeEditorStore = writable<string>("; Ketik instruksi di sini...\n; (Satu baris untuk satu instruksi)\n\nMULAI: LOD #10\nADD #5\nSTO 20\nHLT")
