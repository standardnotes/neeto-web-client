# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.56.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.56.0...@standardnotes/models@1.56.1) (2024-05-07)

**Note:** Version bump only for package @standardnotes/models

# [1.56.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.55.3...@standardnotes/models@1.56.0) (2024-04-24)

### Features

* Switched editor appearance preferences to be local instead of synced ([#2870](https://github.com/standardnotes/app/issues/2870)) ([594a606](https://github.com/standardnotes/app/commit/594a6061b2af619c5f585d6327fd4c3f20dac740))

## [1.55.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.55.2...@standardnotes/models@1.55.3) (2024-04-10)

**Note:** Version bump only for package @standardnotes/models

## [1.55.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.55.1...@standardnotes/models@1.55.2) (2024-04-10)

**Note:** Version bump only for package @standardnotes/models

## [1.55.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.55.0...@standardnotes/models@1.55.1) (2024-04-08)

**Note:** Version bump only for package @standardnotes/models

# [1.55.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.54.0...@standardnotes/models@1.55.0) (2024-02-17)

### Features

* Themes and appeareance settings are now local to your device and not synced ([#2847](https://github.com/standardnotes/app/issues/2847)) ([bfbf9ab](https://github.com/standardnotes/app/commit/bfbf9ab8ceb6f1ecd3a0690bce3b5d1c5c52e84c))

# [1.54.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.53.0...@standardnotes/models@1.54.0) (2024-02-02)

### Features

* Added search bar to navigation panel for searching tags and smart views ([#2815](https://github.com/standardnotes/app/issues/2815)) ([b07abaa](https://github.com/standardnotes/app/commit/b07abaa5df9ad580355f8179bab616002a33af33))

# [1.53.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.52.0...@standardnotes/models@1.53.0) (2024-01-27)

### Features

* Added "Page size" option when exporting Super notes as PDF ([853fab5](https://github.com/standardnotes/app/commit/853fab53ab37567acc23d2f1c5bf8c8d0c4a573b))

# [1.52.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.51.0...@standardnotes/models@1.52.0) (2024-01-24)

### Features

* Super notes can now be exported as PDF ([#2776](https://github.com/standardnotes/app/issues/2776)) ([418d1a7](https://github.com/standardnotes/app/commit/418d1a7371d8fb981de80737a9d1ec4d7772476c))

# [1.51.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.50.2...@standardnotes/models@1.51.0) (2024-01-20)

### Features

* Editing large notes (greater than 1.5MB) will result in more optimized syncing, in which changes are saved locally immediately, but sync with the server less frequently (roughly every 30 seconds rather than after every change). ([#2768](https://github.com/standardnotes/app/issues/2768)) ([396ee3f](https://github.com/standardnotes/app/commit/396ee3f449c612600bbbe3294c61dc8be46ea365))

## [1.50.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.50.1...@standardnotes/models@1.50.2) (2023-12-28)

**Note:** Version bump only for package @standardnotes/models

## [1.50.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.50.0...@standardnotes/models@1.50.1) (2023-11-30)

**Note:** Version bump only for package @standardnotes/models

# [1.50.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.49.3...@standardnotes/models@1.50.0) (2023-11-29)

### Features

* Markdown, Rich text, Code, and Checklist note types have been moved to the new Plugins preferences pane. Previous notes created using these types will not experience any disruption. To create new notes using these types, you can reinstall them from the Plugins preferences screen. It is recommended to use the Super note type in place of these replaced note types. ([#2630](https://github.com/standardnotes/app/issues/2630)) ([c43b593](https://github.com/standardnotes/app/commit/c43b593c6098a1293d6e6f25fda184e592897f7c))
* You can now select an existing tag to automatically add imported notes to ([#2663](https://github.com/standardnotes/app/issues/2663)) ([eb75329](https://github.com/standardnotes/app/commit/eb75329fb43b3a00291983590c7a860e4352dd3e))

## [1.49.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.49.2...@standardnotes/models@1.49.3) (2023-11-27)

### Bug Fixes

* Fixed issue where checklist item text in Super notes wasn't aligned correctly ([#2656](https://github.com/standardnotes/app/issues/2656)) ([8ff0d20](https://github.com/standardnotes/app/commit/8ff0d208583fd0625682d481f8a065c6ccbd8b8e))

## [1.49.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.49.1...@standardnotes/models@1.49.2) (2023-11-24)

### Reverts

* Revert "fix: Fixed issue with checklist alignment in Super notes" ([305647a](https://github.com/standardnotes/app/commit/305647a4da62bd962c5d77989cdc6dcc9be40f78))

## [1.49.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.49.0...@standardnotes/models@1.49.1) (2023-11-24)

### Bug Fixes

* Fixed issue with checklist alignment in Super notes ([f6c2991](https://github.com/standardnotes/app/commit/f6c2991f460bf234b304f17929b0413282ff5fd5))

# [1.49.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.48.1...@standardnotes/models@1.49.0) (2023-10-30)

### Features

* When exporting a Super note, embedded files can be inlined in the note or exported along the note in a zip file. You can now also choose to include frontmatter when exporting to Markdown format. ([991de1d](https://github.com/standardnotes/app/commit/991de1ddf5dbb1016348d603d244699c676d9b5f)), closes [#2610](https://github.com/standardnotes/app/issues/2610)

## [1.48.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.48.0...@standardnotes/models@1.48.1) (2023-10-26)

**Note:** Version bump only for package @standardnotes/models

# [1.48.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.24...@standardnotes/models@1.48.0) (2023-10-25)

### Features

* Added preference to toggle Super note toolbar visibility. When toggled off, the toolbar will only be visible when text is selected as a floating toolbar. [skip e2e] ([a616750](https://github.com/standardnotes/app/commit/a616750aea3666079aa6ae301662ce4cd4d5c954))

## [1.47.24](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.23...@standardnotes/models@1.47.24) (2023-10-23)

**Note:** Version bump only for package @standardnotes/models

## [1.47.23](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.22...@standardnotes/models@1.47.23) (2023-10-17)

### Bug Fixes

* Fixed performance regression in Super notes and improved toolbar ([#2590](https://github.com/standardnotes/app/issues/2590)) ([9e35e2e](https://github.com/standardnotes/app/commit/9e35e2ecebfd43c135d1e480e0c0e4c9d0ef39d9))

## [1.47.22](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.21...@standardnotes/models@1.47.22) (2023-10-09)

**Note:** Version bump only for package @standardnotes/models

## [1.47.21](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.20...@standardnotes/models@1.47.21) (2023-10-05)

**Note:** Version bump only for package @standardnotes/models

## [1.47.20](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.19...@standardnotes/models@1.47.20) (2023-09-29)

**Note:** Version bump only for package @standardnotes/models

## [1.47.19](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.18...@standardnotes/models@1.47.19) (2023-09-28)

**Note:** Version bump only for package @standardnotes/models

## [1.47.18](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.17...@standardnotes/models@1.47.18) (2023-09-26)

**Note:** Version bump only for package @standardnotes/models

## [1.47.17](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.16...@standardnotes/models@1.47.17) (2023-09-22)

**Note:** Version bump only for package @standardnotes/models

## [1.47.16](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.15...@standardnotes/models@1.47.16) (2023-09-21)

**Note:** Version bump only for package @standardnotes/models

## [1.47.15](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.14...@standardnotes/models@1.47.15) (2023-09-20)

**Note:** Version bump only for package @standardnotes/models

## [1.47.14](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.13...@standardnotes/models@1.47.14) (2023-09-13)

**Note:** Version bump only for package @standardnotes/models

## [1.47.13](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.12...@standardnotes/models@1.47.13) (2023-09-07)

**Note:** Version bump only for package @standardnotes/models

## [1.47.12](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.11...@standardnotes/models@1.47.12) (2023-09-07)

**Note:** Version bump only for package @standardnotes/models

## [1.47.11](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.10...@standardnotes/models@1.47.11) (2023-09-06)

**Note:** Version bump only for package @standardnotes/models

## [1.47.10](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.9...@standardnotes/models@1.47.10) (2023-09-01)

**Note:** Version bump only for package @standardnotes/models

## [1.47.9](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.8...@standardnotes/models@1.47.9) (2023-08-23)

**Note:** Version bump only for package @standardnotes/models

## [1.47.8](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.7...@standardnotes/models@1.47.8) (2023-08-21)

**Note:** Version bump only for package @standardnotes/models

## [1.47.7](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.6...@standardnotes/models@1.47.7) (2023-08-12)

**Note:** Version bump only for package @standardnotes/models

## [1.47.6](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.5...@standardnotes/models@1.47.6) (2023-08-11)

**Note:** Version bump only for package @standardnotes/models

## [1.47.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.4...@standardnotes/models@1.47.5) (2023-08-08)

**Note:** Version bump only for package @standardnotes/models

## [1.47.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.3...@standardnotes/models@1.47.4) (2023-08-07)

**Note:** Version bump only for package @standardnotes/models

## [1.47.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.2...@standardnotes/models@1.47.3) (2023-08-06)

**Note:** Version bump only for package @standardnotes/models

## [1.47.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.1...@standardnotes/models@1.47.2) (2023-08-06)

**Note:** Version bump only for package @standardnotes/models

## [1.47.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.47.0...@standardnotes/models@1.47.1) (2023-08-06)

**Note:** Version bump only for package @standardnotes/models

# [1.47.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.21...@standardnotes/models@1.47.0) (2023-08-05)

### Features

* Added translucency effect to menus, dialogs and alerts. Can be turned off from Preferences > Appeareance ([#2387](https://github.com/standardnotes/app/issues/2387)) [skip e2e] ([ec309d6](https://github.com/standardnotes/app/commit/ec309d6fb54c6cbb28414d1fe9d6119db5943d9c))

## [1.46.21](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.20...@standardnotes/models@1.46.21) (2023-08-03)

**Note:** Version bump only for package @standardnotes/models

## [1.46.20](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.19...@standardnotes/models@1.46.20) (2023-08-02)

**Note:** Version bump only for package @standardnotes/models

## [1.46.19](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.18...@standardnotes/models@1.46.19) (2023-08-01)

**Note:** Version bump only for package @standardnotes/models

## [1.46.18](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.17...@standardnotes/models@1.46.18) (2023-07-28)

**Note:** Version bump only for package @standardnotes/models

## [1.46.17](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.16...@standardnotes/models@1.46.17) (2023-07-28)

**Note:** Version bump only for package @standardnotes/models

## [1.46.16](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.15...@standardnotes/models@1.46.16) (2023-07-27)

**Note:** Version bump only for package @standardnotes/models

## [1.46.15](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.14...@standardnotes/models@1.46.15) (2023-07-27)

**Note:** Version bump only for package @standardnotes/models

## [1.46.14](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.13...@standardnotes/models@1.46.14) (2023-07-26)

### Bug Fixes

* Fixes issue where lock screen would not use previously active theme ([#2372](https://github.com/standardnotes/app/issues/2372)) ([d268c02](https://github.com/standardnotes/app/commit/d268c02ab31beb5e2fd9e6547610f9a4dd61bed4))

## [1.46.13](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.12...@standardnotes/models@1.46.13) (2023-07-26)

**Note:** Version bump only for package @standardnotes/models

## [1.46.12](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.11...@standardnotes/models@1.46.12) (2023-07-23)

**Note:** Version bump only for package @standardnotes/models

## [1.46.11](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.10...@standardnotes/models@1.46.11) (2023-07-17)

**Note:** Version bump only for package @standardnotes/models

## [1.46.10](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.9...@standardnotes/models@1.46.10) (2023-07-13)

**Note:** Version bump only for package @standardnotes/models

## [1.46.9](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.8...@standardnotes/models@1.46.9) (2023-07-12)

**Note:** Version bump only for package @standardnotes/models

## [1.46.8](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.7...@standardnotes/models@1.46.8) (2023-07-12)

**Note:** Version bump only for package @standardnotes/models

## [1.46.7](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.6...@standardnotes/models@1.46.7) (2023-07-06)

**Note:** Version bump only for package @standardnotes/models

## [1.46.6](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.5...@standardnotes/models@1.46.6) (2023-07-05)

**Note:** Version bump only for package @standardnotes/models

## [1.46.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.4...@standardnotes/models@1.46.5) (2023-06-30)

**Note:** Version bump only for package @standardnotes/models

## [1.46.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.3...@standardnotes/models@1.46.4) (2023-06-29)

### Bug Fixes

* Fixed issue where Conflicts view is shown but the list is empty ([69de0e4](https://github.com/standardnotes/app/commit/69de0e448fc8098b89fa1382c27d0d88c99b6600))

## [1.46.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.2...@standardnotes/models@1.46.3) (2023-06-27)

**Note:** Version bump only for package @standardnotes/models

## [1.46.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.1...@standardnotes/models@1.46.2) (2023-06-25)

**Note:** Version bump only for package @standardnotes/models

## [1.46.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.46.0...@standardnotes/models@1.46.1) (2023-06-25)

**Note:** Version bump only for package @standardnotes/models

# [1.46.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.45.5...@standardnotes/models@1.46.0) (2023-06-25)

### Features

* Added a conflict resolution dialog and a Conflicts view for easier management of conflicts ([#2337](https://github.com/standardnotes/app/issues/2337)) ([e0e9249](https://github.com/standardnotes/app/commit/e0e92493342b18560e7e55ece22518e738824df0))

## [1.45.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.45.4...@standardnotes/models@1.45.5) (2023-05-22)

**Note:** Version bump only for package @standardnotes/models

## [1.45.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.45.3...@standardnotes/models@1.45.4) (2023-05-22)

**Note:** Version bump only for package @standardnotes/models

## [1.45.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.45.2...@standardnotes/models@1.45.3) (2023-05-12)

**Note:** Version bump only for package @standardnotes/models

## [1.45.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.45.1...@standardnotes/models@1.45.2) (2023-05-11)

**Note:** Version bump only for package @standardnotes/models

## [1.45.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.45.0...@standardnotes/models@1.45.1) (2023-05-08)

**Note:** Version bump only for package @standardnotes/models

# [1.45.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.44.3...@standardnotes/models@1.45.0) (2023-05-04)

### Features

* Replaced margin resizers with "Editor width" options. You can set it globally from Preferences > Appearance or per-note from the note options menu ([#2324](https://github.com/standardnotes/app/issues/2324)) ([9fbb845](https://github.com/standardnotes/app/commit/9fbb845b1d3b1ca6a4b064f3b63bdae1cf7777e8))

## [1.44.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.44.2...@standardnotes/models@1.44.3) (2023-04-26)

**Note:** Version bump only for package @standardnotes/models

## [1.44.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.44.1...@standardnotes/models@1.44.2) (2023-04-26)

**Note:** Version bump only for package @standardnotes/models

## [1.44.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.44.0...@standardnotes/models@1.44.1) (2023-04-26)

**Note:** Version bump only for package @standardnotes/models

# [1.44.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.16...@standardnotes/models@1.44.0) (2023-04-24)

### Features

* **clipper:** Added default tag setting to clipper ([2ce2b84](https://github.com/standardnotes/app/commit/2ce2b8410f5053f77d02b93dbb80aad5f33c728c))

## [1.43.16](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.15...@standardnotes/models@1.43.16) (2023-04-17)

**Note:** Version bump only for package @standardnotes/models

## [1.43.15](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.14...@standardnotes/models@1.43.15) (2023-04-15)

**Note:** Version bump only for package @standardnotes/models

## [1.43.14](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.13...@standardnotes/models@1.43.14) (2023-04-14)

**Note:** Version bump only for package @standardnotes/models

## [1.43.13](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.12...@standardnotes/models@1.43.13) (2023-04-11)

**Note:** Version bump only for package @standardnotes/models

## [1.43.12](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.11...@standardnotes/models@1.43.12) (2023-04-11)

**Note:** Version bump only for package @standardnotes/models

## [1.43.11](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.10...@standardnotes/models@1.43.11) (2023-03-15)

### Bug Fixes

* Disabled pane gesture navigation by default and moved it to Labs since it is unstable ([636de8f](https://github.com/standardnotes/app/commit/636de8fada2f8cb7ef0260de6b7301559147d682))

## [1.43.10](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.9...@standardnotes/models@1.43.10) (2023-03-10)

**Note:** Version bump only for package @standardnotes/models

## [1.43.9](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.8...@standardnotes/models@1.43.9) (2023-03-10)

**Note:** Version bump only for package @standardnotes/models

## [1.43.8](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.7...@standardnotes/models@1.43.8) (2023-03-09)

**Note:** Version bump only for package @standardnotes/models

## [1.43.7](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.6...@standardnotes/models@1.43.7) (2023-03-08)

**Note:** Version bump only for package @standardnotes/models

## [1.43.6](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.5...@standardnotes/models@1.43.6) (2023-03-01)

**Note:** Version bump only for package @standardnotes/models

## [1.43.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.4...@standardnotes/models@1.43.5) (2023-03-01)

**Note:** Version bump only for package @standardnotes/models

## [1.43.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.3...@standardnotes/models@1.43.4) (2023-02-15)

**Note:** Version bump only for package @standardnotes/models

## [1.43.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.2...@standardnotes/models@1.43.3) (2023-02-02)

**Note:** Version bump only for package @standardnotes/models

## [1.43.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.1...@standardnotes/models@1.43.2) (2023-02-01)

**Note:** Version bump only for package @standardnotes/models

## [1.43.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.43.0...@standardnotes/models@1.43.1) (2023-02-01)

### Bug Fixes

* **models:** filter out items with unknown content type ([#2192](https://github.com/standardnotes/app/issues/2192)) ([b3cfb87](https://github.com/standardnotes/app/commit/b3cfb87c7fa3521e9fae6987fdad97e43f28e965))

# [1.43.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.13...@standardnotes/models@1.43.0) (2023-01-31)

### Features

* Allow exporting multiple Super notes and select what format to export them to ([#2191](https://github.com/standardnotes/app/issues/2191)) ([506a1e8](https://github.com/standardnotes/app/commit/506a1e83f108ecb1f9a2d2e0acb55c4f21be50ae))

## [1.42.13](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.12...@standardnotes/models@1.42.13) (2023-01-31)

**Note:** Version bump only for package @standardnotes/models

## [1.42.12](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.11...@standardnotes/models@1.42.12) (2023-01-24)

**Note:** Version bump only for package @standardnotes/models

## [1.42.11](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.10...@standardnotes/models@1.42.11) (2023-01-23)

### Bug Fixes

* **models:** displaced dependencies ([9dc25cb](https://github.com/standardnotes/app/commit/9dc25cbb449cd45a3a34eb68fa5304f67f74b6c2))

## [1.42.10](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.9...@standardnotes/models@1.42.10) (2023-01-23)

### Bug Fixes

* **models:** dependency level ([981bf6a](https://github.com/standardnotes/app/commit/981bf6ac928a8d6d84fb25bbf608f76a1dc6304b))

## [1.42.9](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.8...@standardnotes/models@1.42.9) (2023-01-21)

**Note:** Version bump only for package @standardnotes/models

## [1.42.8](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.7...@standardnotes/models@1.42.8) (2023-01-20)

### Bug Fixes

* fixed issue with third party editors not loading ([#2174](https://github.com/standardnotes/app/issues/2174)) ([e7214ea](https://github.com/standardnotes/app/commit/e7214ea73ad5d3026d958c79022d2238a4d1cfdc))

## [1.42.7](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.6...@standardnotes/models@1.42.7) (2023-01-20)

### Bug Fixes

* **models:** dependency declaration ([beccfb1](https://github.com/standardnotes/app/commit/beccfb16b361ba70bd4f7c09d5840d73ed6e85da))
* **models:** dependency on utils declaration ([e9a1012](https://github.com/standardnotes/app/commit/e9a10123fed9e2883e3d2af38939b1608d7b2ffa))

## [1.42.6](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.5...@standardnotes/models@1.42.6) (2023-01-20)

**Note:** Version bump only for package @standardnotes/models

## [1.42.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.4...@standardnotes/models@1.42.5) (2023-01-20)

**Note:** Version bump only for package @standardnotes/models

## [1.42.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.3...@standardnotes/models@1.42.4) (2023-01-19)

**Note:** Version bump only for package @standardnotes/models

## [1.42.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.2...@standardnotes/models@1.42.3) (2023-01-19)

**Note:** Version bump only for package @standardnotes/models

## [1.42.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.1...@standardnotes/models@1.42.2) (2023-01-18)

**Note:** Version bump only for package @standardnotes/models

## [1.42.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.42.0...@standardnotes/models@1.42.1) (2023-01-12)

**Note:** Version bump only for package @standardnotes/models

# [1.42.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.41.1...@standardnotes/models@1.42.0) (2023-01-06)

### Features

* Added per-tag preference to use table layout and removed "Files Table View" from Labs ([dd8ccde](https://github.com/standardnotes/app/commit/dd8ccdeadc6c2fd7f7ccd66f2dc4b0081616fb2b))

## [1.41.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.41.0...@standardnotes/models@1.41.1) (2023-01-04)

**Note:** Version bump only for package @standardnotes/models

# [1.41.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.40.4...@standardnotes/models@1.41.0) (2023-01-03)

### Features

* improve initial load performance on mobile ([#2126](https://github.com/standardnotes/app/issues/2126)) ([3c332a3](https://github.com/standardnotes/app/commit/3c332a35f6024c46020a1d6ac68a5df989804142))

## [1.40.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.40.3...@standardnotes/models@1.40.4) (2023-01-03)

**Note:** Version bump only for package @standardnotes/models

## [1.40.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.40.2...@standardnotes/models@1.40.3) (2022-12-29)

**Note:** Version bump only for package @standardnotes/models

## [1.40.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.40.1...@standardnotes/models@1.40.2) (2022-12-28)

**Note:** Version bump only for package @standardnotes/models

## [1.40.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.40.0...@standardnotes/models@1.40.1) (2022-12-27)

**Note:** Version bump only for package @standardnotes/models

# [1.40.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.39.3...@standardnotes/models@1.40.0) (2022-12-27)

### Features

* Allow changing per-view display preferences for system views ([#2120](https://github.com/standardnotes/app/issues/2120)) ([dc33aef](https://github.com/standardnotes/app/commit/dc33aef6608a364107a884ad2f26c14bceea23b7))

## [1.39.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.39.2...@standardnotes/models@1.39.3) (2022-12-08)

**Note:** Version bump only for package @standardnotes/models

## [1.39.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.39.1...@standardnotes/models@1.39.2) (2022-12-05)

**Note:** Version bump only for package @standardnotes/models

## [1.39.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.39.0...@standardnotes/models@1.39.1) (2022-12-02)

**Note:** Version bump only for package @standardnotes/models

# [1.39.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.38.2...@standardnotes/models@1.39.0) (2022-12-02)

### Features

* Moments: your personal photo journal, now available in Labs ([#2079](https://github.com/standardnotes/app/issues/2079)) ([29368c5](https://github.com/standardnotes/app/commit/29368c51b801331dd73d8cbee9746abadf2e1120))

## [1.38.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.38.1...@standardnotes/models@1.38.2) (2022-12-01)

**Note:** Version bump only for package @standardnotes/models

## [1.38.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.38.0...@standardnotes/models@1.38.1) (2022-12-01)

**Note:** Version bump only for package @standardnotes/models

# [1.38.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.9...@standardnotes/models@1.38.0) (2022-11-28)

### Features

* display number of files for 'Files' view ([#2065](https://github.com/standardnotes/app/issues/2065)) ([767d354](https://github.com/standardnotes/app/commit/767d3547804bc98693dcc769baeed943c24426f3))

## [1.37.9](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.8...@standardnotes/models@1.37.9) (2022-11-28)

### Bug Fixes

* exclude files from being counted in 'Notes' view ([#2062](https://github.com/standardnotes/app/issues/2062)) ([2b0c9b1](https://github.com/standardnotes/app/commit/2b0c9b188cd75477c0c1611443daadb8ffa29306))

## [1.37.8](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.7...@standardnotes/models@1.37.8) (2022-11-27)

**Note:** Version bump only for package @standardnotes/models

## [1.37.7](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.6...@standardnotes/models@1.37.7) (2022-11-23)

**Note:** Version bump only for package @standardnotes/models

## [1.37.6](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.5...@standardnotes/models@1.37.6) (2022-11-23)

**Note:** Version bump only for package @standardnotes/models

## [1.37.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.4...@standardnotes/models@1.37.5) (2022-11-18)

**Note:** Version bump only for package @standardnotes/models

## [1.37.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.3...@standardnotes/models@1.37.4) (2022-11-18)

### Bug Fixes

* **snjs:** keep apply payload timestamp when using keep base conflict strategy ([#2031](https://github.com/standardnotes/app/issues/2031)) ([87f8669](https://github.com/standardnotes/app/commit/87f86693a67a36972f0e44a883b18a7129c36893))

## [1.37.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.2...@standardnotes/models@1.37.3) (2022-11-17)

**Note:** Version bump only for package @standardnotes/models

## [1.37.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.1...@standardnotes/models@1.37.2) (2022-11-17)

**Note:** Version bump only for package @standardnotes/models

## [1.37.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.37.0...@standardnotes/models@1.37.1) (2022-11-16)

**Note:** Version bump only for package @standardnotes/models

# [1.37.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.36.0...@standardnotes/models@1.37.0) (2022-11-16)

### Features

* edit smart view predicate as json ([#2012](https://github.com/standardnotes/app/issues/2012)) ([f3e4ba8](https://github.com/standardnotes/app/commit/f3e4ba87795b82cbd96663b441f87ab80f710d05))

# [1.36.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.35.0...@standardnotes/models@1.36.0) (2022-11-16)

### Features

* **labs:** super editor ([#2001](https://github.com/standardnotes/app/issues/2001)) ([59f8547](https://github.com/standardnotes/app/commit/59f8547a8de1c804cb2f01ac734c83268977fa28))

# [1.35.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.10...@standardnotes/models@1.35.0) (2022-11-14)

### Features

* GUI to create smart views ([#1997](https://github.com/standardnotes/app/issues/1997)) ([f656185](https://github.com/standardnotes/app/commit/f656185c167b3306d408dc486970836efa1d70c5))

## [1.34.10](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.9...@standardnotes/models@1.34.10) (2022-11-09)

**Note:** Version bump only for package @standardnotes/models

## [1.34.9](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.8...@standardnotes/models@1.34.9) (2022-11-07)

**Note:** Version bump only for package @standardnotes/models

## [1.34.8](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.7...@standardnotes/models@1.34.8) (2022-11-06)

**Note:** Version bump only for package @standardnotes/models

## [1.34.7](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.6...@standardnotes/models@1.34.7) (2022-11-04)

**Note:** Version bump only for package @standardnotes/models

## [1.34.6](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.5...@standardnotes/models@1.34.6) (2022-11-04)

**Note:** Version bump only for package @standardnotes/models

## [1.34.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.4...@standardnotes/models@1.34.5) (2022-11-04)

**Note:** Version bump only for package @standardnotes/models

## [1.34.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.34.0...@standardnotes/models@1.34.4) (2022-11-04)

**Note:** Version bump only for package @standardnotes/models

# [1.34.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.33.0...@standardnotes/models@1.34.0) (2022-11-02)

### Features

* dedicated files layout ([#1928](https://github.com/standardnotes/app/issues/1928)) ([dd821c9](https://github.com/standardnotes/app/commit/dd821c95e61c8cd82317ad9fb3788daff7241942))

# [1.33.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.32.0...@standardnotes/models@1.33.0) (2022-11-02)

### Features

* add sending user requests to process ([#1908](https://github.com/standardnotes/app/issues/1908)) ([b2faa81](https://github.com/standardnotes/app/commit/b2faa815e967a9e7052b3ce6955e967c6bc68864))

# [1.32.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.31.1...@standardnotes/models@1.32.0) (2022-10-27)

### Features

* daily notes (dev only) ([#1894](https://github.com/standardnotes/app/issues/1894)) ([69c3f2b](https://github.com/standardnotes/app/commit/69c3f2be837152a1f937559327021c2128234c69))

## [1.31.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.31.0...@standardnotes/models@1.31.1) (2022-10-25)

### Bug Fixes

* on mobile open links from editor in external browser ([#1860](https://github.com/standardnotes/app/issues/1860)) ([d9db73e](https://github.com/standardnotes/app/commit/d9db73ea056e2e6e2bde8e0c1de4a7090984ae9a))

# [1.31.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.30.0...@standardnotes/models@1.31.0) (2022-10-25)

### Features

* per-tag display preferences ([#1868](https://github.com/standardnotes/app/issues/1868)) ([ee7f11c](https://github.com/standardnotes/app/commit/ee7f11c933285234b20fa2d5db4fcf0d6a5dce9d))

# [1.30.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.29.1...@standardnotes/models@1.30.0) (2022-10-21)

### Features

* ability to favorite tags + customize icon ([#1858](https://github.com/standardnotes/app/issues/1858)) ([cbd0063](https://github.com/standardnotes/app/commit/cbd0063926a416c23225242a4a1796712b6b224e))

## [1.29.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.29.0...@standardnotes/models@1.29.1) (2022-10-19)

### Bug Fixes

* issue with not being able to unlink a file from a note ([#1836](https://github.com/standardnotes/app/issues/1836)) ([4030953](https://github.com/standardnotes/app/commit/4030953b00ad609dc2b0f5b66cfd971d449f6121))

# [1.29.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.28.0...@standardnotes/models@1.29.0) (2022-10-18)

### Features

* authorize notes for listed ([#1823](https://github.com/standardnotes/app/issues/1823)) ([9954bdc](https://github.com/standardnotes/app/commit/9954bdc29f9de2a42c4539d55749991d86a72943))

# [1.28.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.27.1...@standardnotes/models@1.28.0) (2022-10-17)

### Features

* starred notes ([#1813](https://github.com/standardnotes/app/issues/1813)) ([d52fdae](https://github.com/standardnotes/app/commit/d52fdae0b359b4768855ae030ac13d1c16f2312a))

## [1.27.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.27.0...@standardnotes/models@1.27.1) (2022-10-13)

**Note:** Version bump only for package @standardnotes/models

# [1.27.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.26.0...@standardnotes/models@1.27.0) (2022-10-11)

### Features

* item linking ([#1779](https://github.com/standardnotes/app/issues/1779)) ([e3f2842](https://github.com/standardnotes/app/commit/e3f28421ff042c635ad2ae645c102c27e3e3f9c7))

# [1.26.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.25.0...@standardnotes/models@1.26.0) (2022-10-11)

### Features

* **api:** add listing workspace users ([fb41f65](https://github.com/standardnotes/app/commit/fb41f651eca45dd62314609c2f389d5dc683c36e))

# [1.25.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.24.2...@standardnotes/models@1.25.0) (2022-10-11)

### Features

* **api:** add listing workspaces ([8376381](https://github.com/standardnotes/app/commit/837638198112df24c30e53803a7ddf5f841975b0))

## [1.24.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.24.1...@standardnotes/models@1.24.2) (2022-10-10)

**Note:** Version bump only for package @standardnotes/models

## [1.24.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.24.0...@standardnotes/models@1.24.1) (2022-10-10)

### Bug Fixes

* **api:** workspace creation arguments ([a275a45](https://github.com/standardnotes/app/commit/a275a45753abc4a29a89de5fe784260165297bbe))

# [1.24.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.23.0...@standardnotes/models@1.24.0) (2022-10-06)

### Features

* experimental 005 operator ([#1753](https://github.com/standardnotes/app/issues/1753)) ([cbbe913](https://github.com/standardnotes/app/commit/cbbe913cd6eb694dd27997927bd5c45e8a64cc09))

# [1.23.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.22.1...@standardnotes/models@1.23.0) (2022-10-05)

### Features

* add free dark mode ([#1748](https://github.com/standardnotes/app/issues/1748)) ([09b994f](https://github.com/standardnotes/app/commit/09b994f8f938ae0536f42742f7a221df536c4c4a))

## [1.22.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.22.0...@standardnotes/models@1.22.1) (2022-10-05)

**Note:** Version bump only for package @standardnotes/models

# [1.22.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.21.0...@standardnotes/models@1.22.0) (2022-09-30)

### Features

* add pref to disable note status updates ([#1702](https://github.com/standardnotes/app/issues/1702)) ([08b7096](https://github.com/standardnotes/app/commit/08b70968f255d5a72562610f08fe727ebcffa8bb))

# [1.21.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.20.0...@standardnotes/models@1.21.0) (2022-09-29)

### Features

* add line height & font size settings for plaintext editor ([#1700](https://github.com/standardnotes/app/issues/1700)) ([3c699ea](https://github.com/standardnotes/app/commit/3c699eaa4a92a47774d4762eeddd45e34925e53f))

# [1.20.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.19.0...@standardnotes/models@1.20.0) (2022-09-29)

### Features

* add custom note title format pref ([#1678](https://github.com/standardnotes/app/issues/1678)) ([11dd39c](https://github.com/standardnotes/app/commit/11dd39c126019c4295c03fb59b05ea5aa3adcd27))

# [1.19.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.18.4...@standardnotes/models@1.19.0) (2022-09-24)

### Features

* new note title format w/ prefs ([#1629](https://github.com/standardnotes/app/issues/1629)) ([d3621d7](https://github.com/standardnotes/app/commit/d3621d70b1a34537417b06830275467055b753cb))

## [1.18.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.18.3...@standardnotes/models@1.18.4) (2022-09-23)

### Bug Fixes

* **mobile:** adjust status bar color to match current theme ([#1624](https://github.com/standardnotes/app/issues/1624)) ([4d5429c](https://github.com/standardnotes/app/commit/4d5429cc89c15f870825f20e97844825102c6aec))

## [1.18.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.18.2...@standardnotes/models@1.18.3) (2022-09-20)

**Note:** Version bump only for package @standardnotes/models

## [1.18.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.18.1...@standardnotes/models@1.18.2) (2022-09-15)

### Bug Fixes

* **models:** make @standardnotes/models publishable as it is required on the server side ([174b384](https://github.com/standardnotes/app/commit/174b3845d184c9ee983cfc965f229bd7a5945ab2))

## [1.18.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.18.0...@standardnotes/models@1.18.1) (2022-09-13)

**Note:** Version bump only for package @standardnotes/models

# [1.18.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.17.0...@standardnotes/models@1.18.0) (2022-09-13)

### Features

* add subscription manager to handle subscription sharing ([#1517](https://github.com/standardnotes/app/issues/1517)) ([55b1409](https://github.com/standardnotes/app/commit/55b1409a805c21ada70bf482a02cfe718a4c6576))

# [1.17.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.16.2...@standardnotes/models@1.17.0) (2022-08-31)

### Features

* **api:** add subscription server and client services and interfaces ([#1470](https://github.com/standardnotes/app/issues/1470)) ([089d3a2](https://github.com/standardnotes/app/commit/089d3a2e669f5a24bb4a38fc7582b423980d2d22))

## [1.16.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.16.1...@standardnotes/models@1.16.2) (2022-08-23)

**Note:** Version bump only for package @standardnotes/models

## [1.16.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.16.0...@standardnotes/models@1.16.1) (2022-08-23)

### Bug Fixes

* **web:** archived and deleted counts on encryption panel ([#1423](https://github.com/standardnotes/app/issues/1423)) ([2bdd931](https://github.com/standardnotes/app/commit/2bdd931f6dcd876b1659c5d7d045effa26e18a20))

# [1.16.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.15.5...@standardnotes/models@1.16.0) (2022-08-05)

### Features

* **web:** extract ui-services package ([7e25126](https://github.com/standardnotes/app/commit/7e251262d770cfc9d791115b9c18b862c49e4e03))

## [1.15.5](https://github.com/standardnotes/app/compare/@standardnotes/models@1.15.4...@standardnotes/models@1.15.5) (2022-07-13)

### Bug Fixes

* upgrade jest with types to latest version ([09e08ca](https://github.com/standardnotes/app/commit/09e08ca899ba8694cf43292e918c4c204c0d2cb9))
* upgrade ts-jest in packages ([71e792d](https://github.com/standardnotes/app/commit/71e792da354ff90335b92758e196075a0f88d060))

## [1.15.4](https://github.com/standardnotes/app/compare/@standardnotes/models@1.15.3...@standardnotes/models@1.15.4) (2022-07-08)

### Bug Fixes

* subtag duplication ([#1227](https://github.com/standardnotes/app/issues/1227)) ([f349744](https://github.com/standardnotes/app/commit/f349744fdb51849778e88b643adb518b7ed82811))

## [1.15.3](https://github.com/standardnotes/app/compare/@standardnotes/models@1.15.2...@standardnotes/models@1.15.3) (2022-07-06)

**Note:** Version bump only for package @standardnotes/models

## [1.15.2](https://github.com/standardnotes/app/compare/@standardnotes/models@1.15.1...@standardnotes/models@1.15.2) (2022-07-06)

**Note:** Version bump only for package @standardnotes/models

## [1.15.1](https://github.com/standardnotes/app/compare/@standardnotes/models@1.15.0...@standardnotes/models@1.15.1) (2022-07-06)

**Note:** Version bump only for package @standardnotes/models

# [1.15.0](https://github.com/standardnotes/app/compare/@standardnotes/models@1.14.0...@standardnotes/models@1.15.0) (2022-07-06)

### Features

* add utils package ([aef4ceb](https://github.com/standardnotes/app/commit/aef4ceb7f85948f1f08b8b09a4db5d187daa371b))

# 1.14.0 (2022-07-05)

### Features

* add models package ([b614c71](https://github.com/standardnotes/app/commit/b614c71e79959a24379567a3b5cb3a3e66fde6ed))

# [1.12.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.14...@standardnotes/models@1.12.0) (2022-07-05)

### Features

* remove features package in favor of standardnotes/app repository ([bb8226b](https://github.com/standardnotes/snjs/commit/bb8226b77550707c2a981778a78fe3dccf1aaa03))

## [1.11.14](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.13...@standardnotes/models@1.11.14) (2022-07-04)

### Bug Fixes

* add missing reflect-metadata package to all packages ([ce3a5bb](https://github.com/standardnotes/snjs/commit/ce3a5bbf3f1d2276ac4abc3eec3c6a44c8c3ba9b))

## [1.11.13](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.12...@standardnotes/models@1.11.13) (2022-06-29)

**Note:** Version bump only for package @standardnotes/models

## [1.11.12](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.11...@standardnotes/models@1.11.12) (2022-06-27)

**Note:** Version bump only for package @standardnotes/models

## [1.11.11](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.10...@standardnotes/models@1.11.11) (2022-06-27)

**Note:** Version bump only for package @standardnotes/models

## [1.11.10](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.9...@standardnotes/models@1.11.10) (2022-06-16)

**Note:** Version bump only for package @standardnotes/models

## [1.11.9](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.8...@standardnotes/models@1.11.9) (2022-06-16)

**Note:** Version bump only for package @standardnotes/models

## [1.11.8](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.7...@standardnotes/models@1.11.8) (2022-06-15)

**Note:** Version bump only for package @standardnotes/models

## [1.11.7](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.6...@standardnotes/models@1.11.7) (2022-06-10)

**Note:** Version bump only for package @standardnotes/models

## [1.11.6](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.5...@standardnotes/models@1.11.6) (2022-06-09)

**Note:** Version bump only for package @standardnotes/models

## [1.11.5](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.4...@standardnotes/models@1.11.5) (2022-06-09)

**Note:** Version bump only for package @standardnotes/models

## [1.11.4](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.3...@standardnotes/models@1.11.4) (2022-06-06)

### Bug Fixes

* reverse title sort ([#757](https://github.com/standardnotes/snjs/issues/757)) ([dacee77](https://github.com/standardnotes/snjs/commit/dacee77488593ec71c670c1bfa62cc7f526c8b56))

## [1.11.3](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.2...@standardnotes/models@1.11.3) (2022-06-03)

### Bug Fixes

* define getters on items used in predicates so keypath lookups are not undefined ([#756](https://github.com/standardnotes/snjs/issues/756)) ([3297077](https://github.com/standardnotes/snjs/commit/32970774897a48fd9a12b329ca204ed6882a47ab))

## [1.11.2](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.1...@standardnotes/models@1.11.2) (2022-06-02)

**Note:** Version bump only for package @standardnotes/models

## [1.11.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.11.0...@standardnotes/models@1.11.1) (2022-05-30)

**Note:** Version bump only for package @standardnotes/models

# [1.11.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.10.3...@standardnotes/models@1.11.0) (2022-05-27)

### Features

* add 'name' and 'offlineOnly' setters to ComponentMutator ([#751](https://github.com/standardnotes/snjs/issues/751)) ([55b1f68](https://github.com/standardnotes/snjs/commit/55b1f687fb25facf925b081871152e4ea7723886))

## [1.10.3](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.10.2...@standardnotes/models@1.10.3) (2022-05-27)

**Note:** Version bump only for package @standardnotes/models

## [1.10.2](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.10.1...@standardnotes/models@1.10.2) (2022-05-24)

**Note:** Version bump only for package @standardnotes/models

## [1.10.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.10.0...@standardnotes/models@1.10.1) (2022-05-24)

**Note:** Version bump only for package @standardnotes/models

# [1.10.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.9.0...@standardnotes/models@1.10.0) (2022-05-22)

### Features

* optional files navigation ([#745](https://github.com/standardnotes/snjs/issues/745)) ([8512166](https://github.com/standardnotes/snjs/commit/851216615478b57b11a570173f94ee598bec31c0))

# [1.9.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.8...@standardnotes/models@1.9.0) (2022-05-21)

### Features

* display controllers ([#743](https://github.com/standardnotes/snjs/issues/743)) ([5fadce3](https://github.com/standardnotes/snjs/commit/5fadce37f1b3f2f51b8a90c257bc666ac7710074))

## [1.8.8](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.7...@standardnotes/models@1.8.8) (2022-05-20)

**Note:** Version bump only for package @standardnotes/models

## [1.8.7](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.6...@standardnotes/models@1.8.7) (2022-05-20)

**Note:** Version bump only for package @standardnotes/models

## [1.8.6](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.5...@standardnotes/models@1.8.6) (2022-05-17)

**Note:** Version bump only for package @standardnotes/models

## [1.8.5](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.4...@standardnotes/models@1.8.5) (2022-05-17)

**Note:** Version bump only for package @standardnotes/models

## [1.8.4](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.3...@standardnotes/models@1.8.4) (2022-05-16)

**Note:** Version bump only for package @standardnotes/models

## [1.8.3](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.2...@standardnotes/models@1.8.3) (2022-05-16)

**Note:** Version bump only for package @standardnotes/models

## [1.8.2](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.1...@standardnotes/models@1.8.2) (2022-05-16)

**Note:** Version bump only for package @standardnotes/models

## [1.8.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.8.0...@standardnotes/models@1.8.1) (2022-05-13)

**Note:** Version bump only for package @standardnotes/models

# [1.8.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.7.1...@standardnotes/models@1.8.0) (2022-05-12)

### Features

* file desktop backups ([#731](https://github.com/standardnotes/snjs/issues/731)) ([0dbce7d](https://github.com/standardnotes/snjs/commit/0dbce7dc9712fde848445b951079c81479c8bc11))

## [1.7.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.7.0...@standardnotes/models@1.7.1) (2022-05-12)

**Note:** Version bump only for package @standardnotes/models

# [1.7.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.10...@standardnotes/models@1.7.0) (2022-05-12)

### Features

* new mobile-specific pref keys ([#730](https://github.com/standardnotes/snjs/issues/730)) ([cbf86a3](https://github.com/standardnotes/snjs/commit/cbf86a310e48a238ec8d8a5fd3d5c79da9120bd3))

## [1.6.10](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.9...@standardnotes/models@1.6.10) (2022-05-09)

### Bug Fixes

* no conflict on files ([#728](https://github.com/standardnotes/snjs/issues/728)) ([9d1273d](https://github.com/standardnotes/snjs/commit/9d1273d21b299be826ff996fc97381242c13e8f1))

## [1.6.9](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.8...@standardnotes/models@1.6.9) (2022-05-09)

**Note:** Version bump only for package @standardnotes/models

## [1.6.8](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.7...@standardnotes/models@1.6.8) (2022-05-06)

### Bug Fixes

* update note count after remote delete ([#725](https://github.com/standardnotes/snjs/issues/725)) ([043edce](https://github.com/standardnotes/snjs/commit/043edcea9dfc7a8b234363910791f173880efdb9))

## [1.6.7](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.6...@standardnotes/models@1.6.7) (2022-05-06)

**Note:** Version bump only for package @standardnotes/models

## [1.6.6](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.5...@standardnotes/models@1.6.6) (2022-05-05)

**Note:** Version bump only for package @standardnotes/models

## [1.6.5](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.3...@standardnotes/models@1.6.5) (2022-05-04)

**Note:** Version bump only for package @standardnotes/models

## [1.6.4](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.3...@standardnotes/models@1.6.4) (2022-05-04)

**Note:** Version bump only for package @standardnotes/models

## [1.6.3](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.2...@standardnotes/models@1.6.3) (2022-05-03)

**Note:** Version bump only for package @standardnotes/models

## [1.6.2](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.1...@standardnotes/models@1.6.2) (2022-05-02)

**Note:** Version bump only for package @standardnotes/models

## [1.6.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.6.0...@standardnotes/models@1.6.1) (2022-04-28)

**Note:** Version bump only for package @standardnotes/models

# [1.6.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.5.1...@standardnotes/models@1.6.0) (2022-04-27)

### Features

* make files sortable using setDisplayOptions ([#713](https://github.com/standardnotes/snjs/issues/713)) ([b2088bf](https://github.com/standardnotes/snjs/commit/b2088bfa169ddea9aeddf9dfb20a098991aed875))

## [1.5.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.5.0...@standardnotes/models@1.5.1) (2022-04-27)

**Note:** Version bump only for package @standardnotes/models

# [1.5.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.9...@standardnotes/models@1.5.0) (2022-04-27)

### Features

* file upload and download progress ([#711](https://github.com/standardnotes/snjs/issues/711)) ([79fceed](https://github.com/standardnotes/snjs/commit/79fceeda4066dc66142f18c9c7b110757ca67e69))

## [1.4.9](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.8...@standardnotes/models@1.4.9) (2022-04-25)

**Note:** Version bump only for package @standardnotes/models

## [1.4.8](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.7...@standardnotes/models@1.4.8) (2022-04-22)

**Note:** Version bump only for package @standardnotes/models

## [1.4.7](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.6...@standardnotes/models@1.4.7) (2022-04-21)

### Bug Fixes

* abort key recovery after aborted challenge ([#703](https://github.com/standardnotes/snjs/issues/703)) ([a67fb7e](https://github.com/standardnotes/snjs/commit/a67fb7e8cde41a5c9fadf545933e35d525faeaf0))

## [1.4.6](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.5...@standardnotes/models@1.4.6) (2022-04-20)

**Note:** Version bump only for package @standardnotes/models

## [1.4.5](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.4...@standardnotes/models@1.4.5) (2022-04-20)

**Note:** Version bump only for package @standardnotes/models

## [1.4.4](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.3...@standardnotes/models@1.4.4) (2022-04-19)

### Bug Fixes

* better conflict errored items ([#699](https://github.com/standardnotes/snjs/issues/699)) ([1feaddd](https://github.com/standardnotes/snjs/commit/1feadddb79a4b39d08b6de979a380984fec6c689))

## [1.4.3](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.2...@standardnotes/models@1.4.3) (2022-04-19)

### Bug Fixes

* properly handle encrypted item changes in collections ([#698](https://github.com/standardnotes/snjs/issues/698)) ([8b23c65](https://github.com/standardnotes/snjs/commit/8b23c6555decbdc5099fc4228ff889f7e5c8eb85))

## [1.4.2](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.1...@standardnotes/models@1.4.2) (2022-04-19)

**Note:** Version bump only for package @standardnotes/models

## [1.4.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.4.0...@standardnotes/models@1.4.1) (2022-04-18)

### Bug Fixes

* make timestamps required in payload construction ([#695](https://github.com/standardnotes/snjs/issues/695)) ([b3326c0](https://github.com/standardnotes/snjs/commit/b3326c0a998cd9d44a76afc377f182885ef48275))

# [1.4.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.3.0...@standardnotes/models@1.4.0) (2022-04-15)

### Features

* introduce sync resolved payloads to ensure deltas always return up to date dirty state ([#694](https://github.com/standardnotes/snjs/issues/694)) ([e5278ba](https://github.com/standardnotes/snjs/commit/e5278ba0b2afa987c37f009a2101fb91949d44c6))

# [1.3.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.2.6...@standardnotes/models@1.3.0) (2022-04-15)

### Features

* no merge payloads in payload manager ([#693](https://github.com/standardnotes/snjs/issues/693)) ([68a577c](https://github.com/standardnotes/snjs/commit/68a577cb887fd2d5556dc9ddec461f6ae665fcb6))

## [1.2.6](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.2.5...@standardnotes/models@1.2.6) (2022-04-15)

**Note:** Version bump only for package @standardnotes/models

## [1.2.5](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.2.4...@standardnotes/models@1.2.5) (2022-04-14)

### Bug Fixes

* map ignored item timestamps so application remains in sync ([#692](https://github.com/standardnotes/snjs/issues/692)) ([966cbb0](https://github.com/standardnotes/snjs/commit/966cbb0c254d4d95c802bd8951488a499d1f8bef))

## [1.2.4](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.2.3...@standardnotes/models@1.2.4) (2022-04-13)

### Bug Fixes

* emit changed deleted items as removed ([#691](https://github.com/standardnotes/snjs/issues/691)) ([b12f257](https://github.com/standardnotes/snjs/commit/b12f257b02d46ad9c717e6c51d6e7ca7e9c06959))

## [1.2.3](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.2.2...@standardnotes/models@1.2.3) (2022-04-12)

**Note:** Version bump only for package @standardnotes/models

## [1.2.2](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.2.1...@standardnotes/models@1.2.2) (2022-04-11)

**Note:** Version bump only for package @standardnotes/models

## [1.2.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.2.0...@standardnotes/models@1.2.1) (2022-04-01)

**Note:** Version bump only for package @standardnotes/models

# [1.2.0](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.1.2...@standardnotes/models@1.2.0) (2022-04-01)

### Features

* content interfaces and model type strictness ([#685](https://github.com/standardnotes/snjs/issues/685)) ([e2450c5](https://github.com/standardnotes/snjs/commit/e2450c59e8309d7080efaa03905b2abc728d9403))

## [1.1.2](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.1.1...@standardnotes/models@1.1.2) (2022-04-01)

**Note:** Version bump only for package @standardnotes/models

## [1.1.1](https://github.com/standardnotes/snjs/compare/@standardnotes/models@1.1.0...@standardnotes/models@1.1.1) (2022-03-31)

**Note:** Version bump only for package @standardnotes/models

# 1.1.0 (2022-03-31)

### Features

* encryption and models packages ([#679](https://github.com/standardnotes/snjs/issues/679)) ([5e03d48](https://github.com/standardnotes/snjs/commit/5e03d48aba7e3dd266117201139ab869b1f70cc9))
