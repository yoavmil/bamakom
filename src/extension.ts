// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path from "path";
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: "file" },
      {
        provideHover(document, position, cancelToken) {
          var hover = provideMarkdownHover(document, position);
          return hover;
        },
      }
    )
  );
}

function getFolderUri(fileUri: vscode.Uri): vscode.Uri {
  // Get the file path from the Uri
  const filePath = fileUri.fsPath;

  // Get the folder path using path.dirname
  const folderPath = path.dirname(filePath);

  // Create a new Uri from the folder path
  const folderUri = vscode.Uri.file(folderPath);

  return folderUri;
}

function provideMarkdownHover(
  document: vscode.TextDocument,
  position: vscode.Position
): vscode.Hover | null {
  const openTag = "<markdown>";
  const closeTag = "</markdown>";

  const line = document.lineAt(position.line).text;

  // Check if the line contains a <markdown> tag
  const markdownTagIndex = line.indexOf(openTag);
  if (markdownTagIndex === -1) {
    return null;
  }

  const text = document.getText();

  // search for the end of the opening <markdown> tag
  const lineStartPos = new vscode.Position(position.line, 0);
  let openningTagOffset = document.offsetAt(lineStartPos);
  openningTagOffset = text.indexOf(openTag, openningTagOffset) + openTag.length;

  // search for the closing </markdown> tag
  const closingTagOffset = text.indexOf(closeTag, openningTagOffset);

  const markdownContent = text.substring(openningTagOffset, closingTagOffset);

  // Create and return the hover
  const markdownString = new vscode.MarkdownString(markdownContent);

  markdownString.isTrusted = true;
  markdownString.baseUri = getFolderUri(document.uri);
  markdownString.supportHtml = true;
  markdownString.supportThemeIcons = true;

  return new vscode.Hover(markdownString);
}

// This method is called when your extension is deactivated
export function deactivate() {}
