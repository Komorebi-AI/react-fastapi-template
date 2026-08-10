# Backend sync from python-copier-template

`backend/` is not hand-written: it is rendered from
[python-copier-template](https://github.com/Komorebi-AI/python-copier-template), the
same way [python-template](https://github.com/Komorebi-AI/python-template) is. A CI job
in python-copier-template re-renders it and opens a PR here whenever the template
changes, replacing `backend/` **wholesale** — which is why backend files must never be
edited in this repo.

## Deterministic render recipe

The sync renders with the answers recorded in `backend/.copier-answers.yml` and applies
three post-render adjustments:

1. **Drop the rendered `.github/`** — workflows are repo-owned here
   (`.github/workflows/backend.yml` + `contract.yml`), because the rendered ones assume
   the project sits at the repository root.
2. **Set `[tool.setuptools_scm] root = ".."`** in `backend/pyproject.toml` — the
   backend's pyproject is not at the git root, so the version must be derived from this
   repo's metadata. (Cleaner long-term fix: an `scm_root` question in the template.)
3. **Point `_src_path`** in `.copier-answers.yml` at the template's GitHub URL and keep
   the file — projects created from react-fastapi-template use it to run `copier update` on
   their own backends.

Then `uv lock` (with `SETUPTOOLS_SCM_PRETEND_VERSION`) and `uvx sync-with-uv`, exactly
like the python-template sync.

## Known temporary deviations (pending upstream fixes)

> **Status**: both fixes (plus the sync workflow below and a rendered `docker.yml`
> smoke-test workflow) are in
> [python-copier-template#41](https://github.com/Komorebi-AI/python-copier-template/pull/41).
> Merge order matters: land **this repo's PR first**, then #41 — its first sync run
> renders `backend/` against this repo's `main`, which must already contain it.

Two bugs were found in the rendered output while building this repo; both are patched
locally in `backend/` with `TEMPORARY` comments and must be fixed in
python-copier-template **before** the sync workflow is enabled (a sync would revert the
local patches and break this repo):

1. **Dockerfile base images**: the pinned `uv:<ver>-python3.14-bookworm-slim` tag does
   not exist upstream (Python 3.14 uv images ship on trixie). Patched to
   `...-trixie-slim` (builder and runtime). Affects python-template as well — its
   Docker image cannot build.
2. **PyYAML missing**: uvicorn needs PyYAML to load `log_conf.yaml` via `--log-config`,
   but it is not in the rendered dependencies — the Docker CMD and the
   `python app/api.py` dev entrypoint both crash. Patched by adding `pyyaml` to
   dependencies (plus the deptry DEP002 ignore). Affects python-template as well.

## Safety

Auto-merge relies on branch protection requiring the **Backend** and **Contract**
checks. The Contract workflow boots the rendered backend and exercises the endpoints
the frontend depends on, so a template change that breaks the API contract produces a
red PR instead of a silent break.

## Workflow for python-copier-template

Ready to drop in as `.github/workflows/sync-react-fastapi-template.yml` (mirrors the existing
`sync-template.yml`; requires the same `GH_TOKEN` secret):

```yaml
name: sync-react-fastapi-template

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: true

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout copier template
        uses: actions/checkout@v6

      - name: Install uv
        uses: astral-sh/setup-uv@v7

      - name: Install copier
        run: uv tool install copier

      - name: Render template
        run: |
          copier copy --defaults --vcs-ref=HEAD \
            --data project_name="React Template Backend" \
            --data project_description="FastAPI backend for react-fastapi-template" \
            --data package_name="app" \
            --data github_repo="react-fastapi-template" \
            --data project_type="application" \
            --data python_version="3.14" \
            --data include_api=true \
            --data include_cli=false \
            --data include_docker=true \
            . /tmp/rendered

      # backend/ is a subdirectory of react-fastapi-template, not a repo root: its
      # workflows are owned by react-fastapi-template (rendered ones assume repo root)
      # and its version must derive from react-fastapi-template's git metadata.
      # Keep .copier-answers.yml (pointed at this repo's URL) so projects
      # created from react-fastapi-template can `copier update` their backends.
      - name: Adjust render for subdirectory embedding
        run: |
          rm -rf /tmp/rendered/.github
          sed -i 's|^\[tool.setuptools_scm\]$|[tool.setuptools_scm]\n# Backend lives in a subdirectory of the react-fastapi-template repo; version comes\n# from the repo root git metadata (applied by the template sync job)\nroot = ".."|' \
            /tmp/rendered/pyproject.toml
          sed -i 's|^_src_path:.*|_src_path: https://github.com/Komorebi-AI/python-copier-template.git|' \
            /tmp/rendered/.copier-answers.yml

      - name: Generate lock file
        run: uv lock
        working-directory: /tmp/rendered
        env:
          SETUPTOOLS_SCM_PRETEND_VERSION: "0.0.0"

      - name: Sync pre-commit hook revs with uv.lock
        run: uvx sync-with-uv
        working-directory: /tmp/rendered

      - name: Checkout react-fastapi-template
        uses: actions/checkout@v6
        with:
          repository: Komorebi-AI/react-fastapi-template
          token: ${{ secrets.GH_TOKEN }}
          path: react-fastapi-template

      - name: Replace backend/
        run: |
          rm -rf react-fastapi-template/backend
          mkdir react-fastapi-template/backend
          cp -r /tmp/rendered/. react-fastapi-template/backend/

      - name: Check for changes
        id: changes
        working-directory: react-fastapi-template
        run: |
          git add -A
          if git diff --cached --quiet; then
            echo "has_changes=false" >> "$GITHUB_OUTPUT"
          else
            echo "has_changes=true" >> "$GITHUB_OUTPUT"
          fi

      - name: Create pull request
        if: steps.changes.outputs.has_changes == 'true'
        working-directory: react-fastapi-template
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          BRANCH="sync/copier-template-backend"
          git checkout -B "$BRANCH"
          git commit -m "sync: update backend/ from python-copier-template"

          git push -u origin "$BRANCH" --force

          if ! gh pr list --head "$BRANCH" --json number --jq '.[0].number' | grep -q .; then
            gh pr create \
              --title "sync: update backend/ from python-copier-template" \
              --body "Automated sync of backend/ from [python-copier-template](https://github.com/Komorebi-AI/python-copier-template)."
          fi

          # Requires react-fastapi-template branch protection with the Backend and
          # Contract checks required, and "Allow auto-merge" enabled.
          gh pr merge "$BRANCH" --auto --squash
```
