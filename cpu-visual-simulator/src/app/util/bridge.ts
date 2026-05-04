/**
 * Mengirimkan pesan ke parent window (React App) jika sedang berjalan dalam iframe.
 * @param type Jenis pesan yang dikirim.
 * @param payload Data payload untuk parent.
 */
export function sendToParent(type: string, payload: any): void {
	if (typeof window === "undefined") {
		return
	}
	if (window.parent !== window) {
		window.parent.postMessage(
			{
				type,
				payload,
			},
			"*"
		)
	}
}

/**
 * Mendengarkan pesan yang dikirim dari parent window (React App).
 * Berguna untuk menerima kode Assembly yang di-generate oleh AI.
 * @param callback Fungsi yang dipanggil saat menerima pesan. Menerima event.data berisi { type, code, ... }
 * @returns Fungsi untuk menghapus event listener (cleanup)
 */
export function listenFromParent(callback: (data: any) => void): () => void {
	if (typeof window === "undefined") {
		return () => {}
	}

	function handleMessage(event: MessageEvent) {
		// Validasi asal pesan (opsional, untuk security)
		if (event.data) {
			callback(event.data)
		}
	}

	window.addEventListener('message', handleMessage)

	// Return cleanup function
	return () => {
		window.removeEventListener('message', handleMessage)
	}
}
