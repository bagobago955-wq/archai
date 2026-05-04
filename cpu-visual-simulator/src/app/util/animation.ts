import { get } from "svelte/store"
import { animationSpeed } from "../store/settings"
import { Color } from "./colors"

//https://stackoverflow.com/a/11293378
export function lerp(a, b, u) {
	return (1 - u) * a + u * b
}

//https://stackoverflow.com/a/11293378 - customized
export async function fade(element: HTMLElement | SVGSVGElement, property: string, start: Color, end: Color) {
	return new Promise<void>((resolve, reject) => {
		const baseDuration = 300
		let u = 0.0
		let animationStart
		const frame = (timestamp: DOMHighResTimeStamp) => {
			if (!animationStart) {
				animationStart = timestamp
			}
			if (u >= 1.0) {
				resolve()
				element.style.setProperty(property, `rgb(${end.r}, ${end.g}, ${end.b})`)
				return
			}
			const r = Math.round(lerp(start.r, end.r, u))
			const g = Math.round(lerp(start.g, end.g, u))
			const b = Math.round(lerp(start.b, end.b, u))
			const a = Math.round(lerp(start.a, end.a, u))
			element.style.setProperty(property, `rgba(${r}, ${g}, ${b}, ${a})`)
			const elapsed = timestamp - animationStart
			u = elapsed / (baseDuration / get(animationSpeed))
			requestAnimationFrame(frame)
		}
		requestAnimationFrame(frame)
	})
}

export async function highlight(element: HTMLElement | SVGSVGElement, property: string, highlightColor: Color) {
	if ((element as any)._isFlashing) return Promise.resolve();
	(element as any)._isFlashing = true;
	const startColor = Color.fromString(window.getComputedStyle(element, null).getPropertyValue(property))
	
	if ((element as any)._originalStyleAttribute === undefined) {
		(element as any)._originalStyleAttribute = element.getAttribute("style") || ""
	}
	
	return fade(element, property, startColor, highlightColor).then(() => {
		element.style.setProperty(property, `rgb(${highlightColor.r}, ${highlightColor.g}, ${highlightColor.b})`, "important")
		;(element as any)._isFlashing = false
	})
}

export function unhighlight(element: HTMLElement | SVGSVGElement, property: string) {
	if ((element as any)._originalStyleAttribute !== undefined) {
		element.setAttribute("style", (element as any)._originalStyleAttribute)
	} else {
		element.style.removeProperty(property)
	}
	;(element as any)._isFlashing = false
}

export async function flash(element: HTMLElement | SVGSVGElement, property: string, flashColor: Color) {
	if ((element as any)._isFlashing) return Promise.resolve();
	(element as any)._isFlashing = true;

	const startColor = Color.fromString(window.getComputedStyle(element, null).getPropertyValue(property))
	const originalStyle = element.style.getPropertyValue(property)

	return fade(element, property, startColor, flashColor).then(() =>
		fade(element, property, flashColor, startColor)
	).then(() => {
		element.style.setProperty(property, originalStyle)
			; (element as any)._isFlashing = false
	}).catch(() => {
		element.style.setProperty(property, originalStyle)
			; (element as any)._isFlashing = false
	})
}

