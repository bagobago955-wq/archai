from pathlib import Path

path = Path(r'd:\A\arch-ai-web\cpu-visual-simulator\src\app\execution\ProgramExecution.ts')
text = path.read_text(encoding='utf-8')
old = '                    } else {\r\n                        this.cyclePhase = "ENQUEUEING_PC_INCREMENT"\r\n                \tthis.sendExecutionUpdate("STEP_EXECUTED")\r\n                    }\r\n'
new = '                    } else {\r\n                        this.cyclePhase = "ENQUEUEING_PC_INCREMENT"\r\n                    }\r\n                    this.sendExecutionUpdate("STEP_EXECUTED")\r\n'
if old not in text:
    print('old pattern not found')
    print('--- start ---')
    idx = text.find('ENQUEUEING_PC_INCREMENT')
    print(f'index: {idx}')
    print(repr(text[idx-80:idx+120]))
    raise SystemExit('pattern not found')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
print('patched')
