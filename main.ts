import { Plugin } from 'obsidian';

/** 打开文件光标默认行数 */
const DEFAULT_LINE_NUM = 999;

export default class CursorGoaway extends Plugin {
	async onload() {
		this.app.workspace.on('file-open', (file) => {
			if (file?.extension === 'md') {
				const lastLineNum = this.app.workspace.activeEditor?.editor?.lineCount() || DEFAULT_LINE_NUM;
				const cursorPosition = this.app.workspace.activeEditor?.editor?.getCursor();
				this.app.workspace.activeEditor?.editor?.setCursor(cursorPosition?.line ? cursorPosition : lastLineNum)
			}
		})
	}
}
