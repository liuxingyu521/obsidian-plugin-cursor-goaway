import { Plugin } from 'obsidian';

export default class CursorGoaway extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				if (file?.extension === 'md') {
					// when toggle to the md file, blur the page to avoid break the preview style
					this.app.workspace.activeEditor?.editor?.blur();
				}
			})
		)
		
	}
}
