# obsidian-plugin-cursor-goaway

make cursor goaway after open a text file

## before vs after

### before 😑

When the file is opened, the cursor is automatically positioned in the first line and enters the editing mode, which affects the display effect of the first line

![cursor-goaway-before](./screenshots/cursor-goaway-before.gif)

### after 😀

![cursor-goaway-after](./screenshots/cursor-goaway-after.gif)

## Usage

- When a Markdown file is opened, the plugin temporarily removes the editor focus (about 500 ms) to hide the cursor and prevent the first line's style from being affected.
- To immediately show the cursor and start editing, press ArrowDown (↓).
  - Focus will return to the editor and the cursor will be placed at the beginning of the first line.
  - This is a one-time trigger: it works on the first press after each file open/switch. It resets after you switch or reopen the file.
  - If it doesn't take effect, wait ~0.5 s and press it again (the key is ignored while the defocus window is active).

## Local Dev

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.
