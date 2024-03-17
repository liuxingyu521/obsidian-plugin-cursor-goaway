import { Plugin } from 'obsidian';

export default class CursorGoaway extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				let startTime: number;
				
				const blurEditor = () => {
					this.app.workspace.activeEditor?.editor?.blur();
					
					if (performance.now() - startTime < 500) {
						requestAnimationFrame(blurEditor)
					}
				}

				// when toggle to the md file, blur the page in 500ms to avoid break the preview style	
				if (file?.extension === 'md') {
					startTime = performance.now();
					requestAnimationFrame(blurEditor);
				}
			})
		)
		
	}
}
