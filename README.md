# folder-quickopen

A Visual Studio Code extension for fast folder navigation. Quickly open and focus any folder in your workspace using a searchable quick pick menu.

## Features

- **Quick Folder Navigation:** Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac), run `Folder Quickopen: Open`, and instantly search for and select any folder in your workspace.
- **Explorer Focus:** The selected folder is revealed and focused in the VS Code Explorer.
- **Ignores Common Folders:** Skips folders like `node_modules`, `dist`, `out`, `coverage`, `build`, and hidden folders for a cleaner experience.
- **Fast & Cached:** Folder list is cached and updated automatically when files or folders are created, deleted, or renamed.
- **No Configuration Needed:** Works out of the box in any VS Code workspace.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Type `Folder Quickopen: Open` and select it.
3. Search for the folder you want and hit <kbd>Enter</kbd> to focus it in the Explorer.

## Requirements

No special requirements. Works in any VS Code workspace.

## Extension Settings

This extension contributes the following setting:

- `folderQuickopen.onEnterCommand`: (string, optional) The command to execute when you select a folder in the quick pick. Defaults to `revealInExplorer`. You can set this to any command ID, for example: `"folderQuickopen.onEnterCommand": "myCustom.commandId"`.

## Known Issues

- Only supports single-root workspaces (the first workspace folder is used).
- Folders are detected based on files present; empty folders may not appear.

## Release Notes

### 0.0.1

- Initial release: Quickly open and focus folders in the workspace.

---

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/jonwalstedt/folder-quickopen/blob/main/LICENSE) file for details.

## Contributing

Pull requests and suggestions are welcome!

---
**Enjoy fast folder navigation in VS Code!**