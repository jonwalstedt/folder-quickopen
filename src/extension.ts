import * as vscode from 'vscode';
import { filter } from "fuzzaldrin-plus";
import * as path from 'node:path';

const exclude = [
  '**/node_modules/**',
  '**/dist/**',
  '**/out/**',
  '**/coverage/**',
  '**/build/**',
  '**/.*'
].join(',');

async function collectFoldersFromFiles(root: vscode.Uri): Promise<{ label: string, uri: vscode.Uri }[]> {
  const files = await vscode.workspace.findFiles('**/*', `{${exclude}}`, 40000);

  const folderSet = new Set<string>();

  for (const file of files) {
    const relative = vscode.workspace.asRelativePath(file, true);
    const parts = relative.split('/');
    for (let i = 1; i < parts.length; i++) {
      folderSet.add(parts.slice(0, i).join('/'));
    }
  }

  return Array.from(folderSet)
    .sort()
    .map(label => ({
      label,
      uri: vscode.Uri.joinPath(root, ...label.split('/').slice(1))
    }));
}

let cachedFolders: { label: string, uri: vscode.Uri }[] = [];
let cacheReady: Promise<void> = Promise.resolve();

export function activate(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return;

  const updateCache = async () => {
    const folders = await collectFoldersFromFiles(workspaceFolder.uri);
    cachedFolders = folders;
  };

  cacheReady = updateCache();

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(updateCache),
    vscode.workspace.onDidCreateFiles(updateCache),
    vscode.workspace.onDidDeleteFiles(updateCache),
    vscode.workspace.onDidRenameFiles(updateCache)
  );

  const disposable = vscode.commands.registerCommand('folder-quickopen.open', async () => {
    const config = vscode.workspace.getConfiguration("folderquickopen");
				const commandToExecute =
					config.get<string>("onEnterCommand") || "revealInExplorer";
				await cacheReady;
				const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
				if (!workspaceFolder) {
					vscode.window.showErrorMessage("No folder is open.");
					return;
				}

				const rootUri = workspaceFolder.uri;
				const folders = cachedFolders;

				const quickPick = vscode.window.createQuickPick();
				const allItems = folders.map((folder) => {
					return {
						label: folder.label.split("/").pop() || folder.label,
						detail: folder.label,
						description: folder.label,
						alwaysShow: true,
						folder,
						// Use 'description' as a hidden copy for better fuzzy matching if needed
					} as vscode.QuickPickItem & {
						folder: { label: string; uri: vscode.Uri };
					};
				});
				quickPick.placeholder = "Select a folder to focus in Explorer";
				quickPick.onDidChangeValue((value) => {
					quickPick.items = filter(allItems, value, { key: "description" });
				});

				quickPick.items = allItems;
				quickPick.onDidAccept(async () => {
					const selected = quickPick.selectedItems[0];
					const folder = (
						selected as (typeof quickPick.items)[0] & {
							folder: { label: string; uri: vscode.Uri };
						}
					)?.folder;
					if (folder) {
						try {
							const arg =
								typeof commandToExecute === "string" &&
								commandToExecute.startsWith("vsnetrw.")
									? folder.uri.fsPath
									: folder.uri;

							await vscode.commands.executeCommand(commandToExecute, arg);
						} catch (err) {
							vscode.window.showErrorMessage(
								`Could not access "${folder.label}": ${err}`,
							);
						}

						quickPick.hide();
					}
				});

				quickPick.onDidHide(() => quickPick.dispose());
				quickPick.show();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
