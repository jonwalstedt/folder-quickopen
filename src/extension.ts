import * as vscode from 'vscode';
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
      uri: vscode.Uri.joinPath(root, ...label.split('/').slice(1)
	)}))
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('folder-quickopen.open', async () => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No folder is open.');
      return;
    }

    const rootUri = workspaceFolder.uri;
    const folders = await collectFoldersFromFiles(rootUri);

    const quickPick = vscode.window.createQuickPick();
    quickPick.items = folders.map(folder => ({ label: folder.label, description: 'folder' }));
    quickPick.placeholder = 'Select a folder to focus in Explorer';
    quickPick.ignoreFocusOut = true;

    quickPick.onDidAccept(async () => {
      const selected = quickPick.selectedItems[0];
      const folder = folders.find(f => f.label === selected?.label);
      if (folder) {
        try {
          await vscode.commands.executeCommand('revealInExplorer', folder.uri);
        } catch (err) {
          vscode.window.showErrorMessage(`Could not access "${folder.label}": ${err}`);
        }

        quickPick.hide();
    }});

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
