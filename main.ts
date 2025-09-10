import { Plugin, Editor } from 'obsidian';

export default class CursorGoaway extends Plugin {
	private currentKeydownHandler?: (e: KeyboardEvent) => void;
	async onload() {
		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				let startTime: number;
				let isBlurring = false;
				
				const blurEditor = () => {
					this.app.workspace.activeEditor?.editor?.blur();
					
					if (performance.now() - startTime < 500) {
						requestAnimationFrame(blurEditor)
					} else {
						isBlurring = false;
					}
				}

				// Always cleanup any previous one-time handler when opening a new file
				this.cleanupKeydownHandler();

				// when toggle to the md file, blur the page in 500ms to avoid break the preview style	
				if (file?.extension === 'md') {
					startTime = performance.now();
					isBlurring = true;
					requestAnimationFrame(blurEditor);

					
					const onKeyDown = (e: KeyboardEvent) => {
						if (e.key !== 'ArrowDown') return;
						const activeFile = this.app.workspace.getActiveFile();
						// Only react if the same file is still active
						if (activeFile?.path !== file.path) return this.cleanupKeydownHandler();
						// Ignore ArrowDown while blur cycle is active
						if (isBlurring) return;
						e.preventDefault();
						const editor = this.app.workspace.activeEditor?.editor as Editor | undefined;
						if (editor) {
							try { editor.focus(); } catch (err) { console.debug('focus() failed', err); }
							editor.setCursor(0, 0);
						}
						this.cleanupKeydownHandler();
					};
					document.addEventListener('keydown', onKeyDown, true);
					this.currentKeydownHandler = onKeyDown;
				}
			})
		)
		
	}

	/**
	 * cleanup the keydown handler
	 */
	cleanupKeydownHandler() {
		if (this.currentKeydownHandler) {
			document.removeEventListener('keydown', this.currentKeydownHandler, true);
			this.currentKeydownHandler = undefined;
		}
	}

	onunload() {
		this.cleanupKeydownHandler();
	}
}
