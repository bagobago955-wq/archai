/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./public/index.html", "./src/app/**/*.svelte", "./src/shared/**/*.svelte"],
	theme: {
		extend: {
			width: {
				app: "1750px"
			},
			height: {
				app: "800px"
			},
			boxShadow: {
				component: "0 0 10px rgba(14, 165, 233, 0.15)",
				cpu: "0 0 30px rgba(14, 165, 233, 0.2)",
				ramlabels: "inset 0 0 10px rgba(14, 165, 233, 0.1)",
				glow: "0 0 15px rgba(14, 165, 233, 0.3)",
				"glow-emerald": "0 0 15px rgba(16, 185, 129, 0.3)",
				"glow-amber": "0 0 15px rgba(245, 158, 11, 0.3)"
			},
			dropShadow: {
				component: "0 0 10px rgba(14, 165, 233, 0.2)"
			},
			colors: {
				navy: {
					950: "#020617",
					900: "#0f172a",
					800: "#1e293b",
					700: "#334155",
					600: "#475569"
				},
				arkon: {
					DEFAULT: "#0ea5e9",
					light: "#38bdf8",
					dark: "#0284c7"
				},
				emerald: {
					DEFAULT: "#10b981",
					light: "#34d399",
					dark: "#059669"
				},
				rose: {
					DEFAULT: "#f43f5e",
					light: "#fb7185",
					dark: "#e11d48"
				},
				amber: {
					DEFAULT: "#f59e0b",
					light: "#fbbf24",
					dark: "#d97706"
				},
				pink: {
					DEFAULT: "#ec4899",
					light: "#f472b6",
					dark: "#db2777"
				},
				indigo: {
					DEFAULT: "#818cf8",
					light: "#a5b4fc",
					dark: "#6366f1"
				},
				gray: {
					100: "#f8fafc",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b",
					600: "#475569",
					700: "#334155",
					800: "#1e293b"
				}
			},
			gridTemplateColumns: {
				tabgroup: "1.5fr 8fr"
			},
			fontFamily: {
				sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace']
			}
		}
	},
	plugins: []
}
