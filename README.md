Installation
Clone the repo

```
git clone https://github.com/yourusername/your-repo-name.git
```

Install dependencies

```
npm install
```
Note: This step is crucial because the node_modules directory is excluded from the repository to keep it lightweight and avoid OS-specific conflicts.

🛠 Development Workflow
To maintain a stable production environment, we adhere to a strict branching strategy. The main branch is protected and contains only benign, production-ready code.

1. Syncing with the Team
Before starting any task, always pull the latest changes from the remote main branch.

```
git checkout main
git pull origin main
```
2. Feature Branching
Create an isolated branch for your specific task to avoid any predicaments with overlapping code.

```
git checkout -b feature/your-feature-name
```
3. Committing Changes
Once your feature is stable, stage and commit your changes with descriptive messages.

```
git add .
git commit -m "Add [Feature Name]: Brief description of changes"
```
4. Sharing & Peer Review
Push your branch to the remote repository and open a Pull Request (PR) on GitHub.

```
git push -u origin feature/your-feature-name
```
