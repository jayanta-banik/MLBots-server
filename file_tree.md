# File Tree

```text
MLBots-server/
|-- .github/
|   |-- README.md
|   `-- workflows/
|       |-- README.md
|       `-- frontend-build.yml
|-- README.md
|-- __setup__.sh
|-- app.js
|-- app.py
|-- architecture.md
|-- file_tree.md
|-- package.json
|-- requirements.txt
|-- wsgi.py
|-- frontend/
|   |-- README.md
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   `-- src/
|       |-- README.md
|       |-- App.jsx
|       |-- main.jsx
|       |-- components/
|       |   |-- README.md
|       |   `-- status_panel.jsx
|       |-- styles/
|       |   |-- README.md
|       |   `-- app.css
|       `-- utils/
|           |-- README.md
|           `-- api_client.js
|-- node_backend/
|   |-- README.md
|   |-- middleware/
|   |   |-- README.md
|   |   |-- index.js
|   |   `-- request_logger.js
|   |-- models/
|   |   |-- README.md
|   |   `-- health_model.js
|   |-- routes/
|   |   |-- README.md
|   |   |-- health_routes.js
|   |   `-- index.js
|   |-- services/
|   |   |-- README.md
|   |   `-- health_service.js
|   `-- utils/
|       |-- README.md
|       `-- time_utils.js
|-- python_backend/
|   |-- README.md
|   |-- __init__.py
|   |-- auths/
|   |   `-- README.md
|   |-- database/
|   |   |-- README.md
|   |   `-- models/
|   |       `-- README.md
|   |-- dropbox/
|   |   `-- README.md
|   |-- legacy/
|   |   `-- README.md
|   |-- libs/
|   |   `-- README.md
|   |-- middleware/
|   |   |-- README.md
|   |   |-- __init__.py
|   |   `-- requestLogger.py
|   |-- models/
|   |   |-- README.md
|   |   |-- __init__.py
|   |   `-- healthModel.py
|   |-- res/
|   |   `-- README.md
|   |-- routes/
|   |   |-- README.md
|   |   |-- __init__.py
|   |   `-- healthRoutes.py
|   |-- services/
|   |   |-- README.md
|   |   |-- __init__.py
|   |   `-- healthService.py
|   |-- template/
|   |   `-- README.md
|   `-- utils/
|       |-- README.md
|       |-- __init__.py
|       `-- jsonResponse.py
|-- static/
|   |-- README.md
|   |-- frontend/
|   |   `-- README.md
|   |-- script/
|   |   `-- README.md
|   `-- style/
|       `-- README.md
`-- temp/
    `-- README.md
```

`static/frontend/build` is created by the GitHub Actions workflow and populated from the Vite build output.

Existing workspace tooling folders such as `.specify`, `.vscode`, `.github/agents`, and `.github/prompts` are present in the repo but are omitted above to keep the tree focused on the application architecture.
