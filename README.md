# release-documentation
GitHub Action to create a release documentation from the repository PRs

## Inputs

### `token`

**Required** The GitHub Access Token. Default `"${{ secrets.GITHUB_TOKEN }}"`.

### `latest`

**Required** The latest Tag for which this release should be build.

### `template`

The mustache template which will be rendered.

## Outputs

### `content`

The rendered content.

## Example usage

```
uses: raynigon/release-documentation@main
with:
  token: "${{ secrets.GITHUB_TOKEN }}"
  latest: "1.0.0"
```
could procduce something like:

```
# What's Changed
## 🚀 Features & Enhancements
* Automatic release, #4 by @raynigon
```

