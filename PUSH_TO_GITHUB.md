# Push This Handoff Bundle to GitHub

Run from PowerShell or Codex terminal:

```powershell
cd "C:\Users\Main\Documents\New project 2\rocket-site-factory-handoff"
git init
git add .
git commit -m "Create Rocket Site Factory Lovable handoff"
```

Private repo, safer:

```powershell
gh repo create rocket-site-factory-handoff --private --source . --remote origin --push
```

Public repo, easier for Lovable to read directly:

```powershell
gh repo create rocket-site-factory-handoff --public --source . --remote origin --push
```

After GitHub prints the URL, replace this placeholder in `LOVABLE_MASTER_PROMPT.md`:

```text
REPLACE_WITH_GITHUB_REPO_URL
```

with your real repo URL.

Recommended: start private. If Lovable cannot read it cleanly, flip it public temporarily only after confirming no secrets exist.
