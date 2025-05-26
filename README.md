# folder-quickopen

A Visual Studio Code extension that lets you quickly open and focus any folder in your workspace using a fast, searchable quick pick menu.

## Features

- **Quick Folder Navigation:** Press <kbd>Ctrl+Shift+P</kbd> (or <kbd>Cmd+Shift+P</kbd> on Mac), run `Folder Quickopen: Open`, and instantly search for and select any folder in your workspace.
- **Explorer Focus:** The selected folder is revealed and focused in the VS Code Explorer.
- **Ignores Common Folders:** Automatically skips folders like `node_modules`, `dist`, `out`, and hidden folders for a cleaner experience.
- **Fast & Cached:** Folder list is cached and updated automatically when files or folders are created, deleted, or renamed.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Type `Folder Quickopen: Open` and select it.
3. Search for the folder you want and hit <kbd>Enter</kbd> to focus it in the Explorer.

## Requirements

No special requirements. Works out of the box in any VS Code workspace.

## Extension Settings

This extension does not contribute any settings.

## Known Issues

- Only supports single-root workspaces (the first workspace folder is used).
- Folders are detected based on files present; empty folders may not appear.

## Release Notes

### 0.0.1

- Initial release: Quickly open and focus folders in the workspace.

---

## Contributing

Pull requests and suggestions are welcome!

---
**Enjoy fast folder navigation in VS Code!**