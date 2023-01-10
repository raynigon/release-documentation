# release-documentation
GitHub Action to create a release documentation from the repository PRs

## Inputs

### `token`

**Required** The GitHub Access Token. Default `"${{ secrets.GITHUB_TOKEN }}"`.

### `latest`

**Required** The latest Tag for which this release should be build.

### `template`

The mustache template which will be rendered.

### `templateFile`

The path to a file in the repository, which will be used to render the release content.

## Outputs

### `content`

The rendered content.

## Example usage

### Simple Usage
```
uses: raynigon/release-documentation@v1.0.0
with:
  token: "${{ secrets.GITHUB_TOKEN }}"
  latest: "1.0.0"
```
could procduce something like:

```
# What's Changed
## 🚀 Features & Enhancements
* Automatic release, #4
```

### Advanced Usage

The mustache syntax can be used in the template.
Following properties are available:
* **pull_requests**: Map of pull Request
  * **_all**: All Pull Requests which were found
  * **_no_label**: All Pull Requests without a label
  * **`label`**: All Pull Requests which contain the given label

Every pull request has following properties on its own:
* **id**: Global GitHub Pull Request id
* **number**: Number of the Pull Request in this repository
* **title**: Title of the Pull Request
* **author**: Author of the Pull Request
* **labels**: List of labels of this Pull Request

```
- id: content
  name: Create Release Content
  uses: raynigon/release-documentation@v1.0.0
  with:
    token: "${{ secrets.BOT_ACCESS_TOKEN }}"
    latest: "1.2.3"
    template: |
      # What's Changed
      <!-- Features & Enhancements -->
      {{#pull_requests.enhancement.length}}
      ## 🚀 Features & Enhancements
      {{#pull_requests.enhancement}}
      * {{ title }} PR: #{{ number }} by {{ author }}
      {{/pull_requests.enhancement}}
      {{/pull_requests.enhancement.length}}
      <!-- Documentation -->
      {{#pull_requests.documentation.length}}
      ## 📖 Documentation
      {{#pull_requests.documentation}}
      * {{ title }} PR: #{{ number }} by {{ author }}
      {{/pull_requests.documentation}}
      {{/pull_requests.documentation.length}}
      <!-- Housekeeping -->
      {{#pull_requests.housekeeping.length}}
      ## 🧹 Housekeeping
      {{#pull_requests.housekeeping}}
      * {{ title }} PR: #{{ number }} by {{ author }}
      {{/pull_requests.housekeeping}}
      {{/pull_requests.housekeeping.length}}
      <!-- Dependency updates -->
      {{#pull_requests.dependencies.length}}
      ## 📦 Dependency updates
      {{#pull_requests.dependencies}}
      * {{ title }} PR: #{{ number }} by {{ author }}
      {{/pull_requests.dependencies}}
      {{/pull_requests.dependencies.length}}
- name: "Github Release"
  uses: softprops/action-gh-release@v1
  env:
    GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
  with:
    tag_name: "1.2.3"
    name: "1.2.3"
    body: ${{ steps.content.outputs.content }}
```
