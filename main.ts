import { Plugin, Editor } from 'obsidian';

export default class CursorGoaway extends Plugin {
    private currentKeydownHandler?: (e: KeyboardEvent) => void;
    private blurFrameId?: number;

    async onload() {
        this.registerEvent(
            this.app.workspace.on('file-open', (file) => {
                // Always cleanup any previous one-time handler when opening a new file
                this.cleanup();

                // Return early if not Markdown
                if (file?.extension !== 'md') return;

                // When toggle to the Markdown file, blur the page in 500ms to avoid break the preview style
                let startTime = performance.now();
                let isBlurring = true;

                const blurEditor = () => {
                    this.app.workspace.activeEditor?.editor?.blur();
                    if (performance.now() - startTime < 500) {
                        this.blurFrameId = requestAnimationFrame(blurEditor);
                    } else {
                        isBlurring = false;
                        this.blurFrameId = undefined;
                    }
                };
                
                this.blurFrameId = requestAnimationFrame(blurEditor);

                const onKeyDown = (e: KeyboardEvent) => {
                    if (e.key !== 'ArrowDown') return;
                    
                    const activeFile = this.app.workspace.getActiveFile();
                    // Only react if the same file is still active
                    if (activeFile?.path !== file.path) return this.cleanup();
                    
                    // Ignore ArrowDown while blur cycle is active
                    if (isBlurring) return;

                    // Check if editor already has focus (user is already editing)
                    const editor = this.app.workspace.activeEditor?.editor as Editor | undefined;
                    if (editor) {
                        // Try to access the CodeMirror instance to check focus state
                        // @ts-ignore - accessing internal cm property
                        const cm = editor.cm;
                        if (cm && (typeof cm.hasFocus === "function" ? cm.hasFocus() : cm.hasFocus)) {
                            // Editor already has focus, don't jump to top
                            return this.cleanup();
                        }
                    }

                    // Fallback: check if activeElement is within the editor container
                    const activeElement = document.activeElement;
                    const editorContainer = activeElement?.closest('.cm-editor, .cm-content, .markdown-source-view');
                    if (editorContainer) {
                        // Editor already focused, don't jump to top
                        return this.cleanup();
                    }

                    // Editor not focused yet, jump to top and focus
                    e.preventDefault();
                    if (editor) {
                        try { editor.focus(); } catch (err) { console.debug('focus() failed', err); }
                        editor.setCursor(0, 0);
                    }
                    this.cleanup();
                };

                document.addEventListener('keydown', onKeyDown, true);
                this.currentKeydownHandler = onKeyDown;
            })
        );
    }

    /**
     * cleanup the keydown handler and animation frame
     */
    cleanup() {
        if (this.currentKeydownHandler) {
            document.removeEventListener('keydown', this.currentKeydownHandler, true);
            this.currentKeydownHandler = undefined;
        }
        if (this.blurFrameId !== undefined) {
            cancelAnimationFrame(this.blurFrameId);
            this.blurFrameId = undefined;
        }
    }

    onunload() {
        this.cleanup();
    }
}