# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.71.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.71.2...@standardnotes/services@1.71.3) (2024-09-20)

### Bug Fixes

* trim/lowercase email on email change ([#2886](https://github.com/standardnotes/app/issues/2886)) ([98304cc](https://github.com/standardnotes/app/commit/98304cc57df59f3d18061f97427f811f336b268f))

## [1.71.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.71.1...@standardnotes/services@1.71.2) (2024-05-07)

**Note:** Version bump only for package @standardnotes/services

## [1.71.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.71.0...@standardnotes/services@1.71.1) (2024-05-06)

**Note:** Version bump only for package @standardnotes/services

# [1.71.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.11...@standardnotes/services@1.71.0) (2024-04-24)

### Features

* Switched editor appearance preferences to be local instead of synced ([#2870](https://github.com/standardnotes/app/issues/2870)) ([594a606](https://github.com/standardnotes/app/commit/594a6061b2af619c5f585d6327fd4c3f20dac740))

## [1.70.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.10...@standardnotes/services@1.70.11) (2024-04-20)

**Note:** Version bump only for package @standardnotes/services

## [1.70.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.9...@standardnotes/services@1.70.10) (2024-04-19)

**Note:** Version bump only for package @standardnotes/services

## [1.70.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.8...@standardnotes/services@1.70.9) (2024-04-13)

### Bug Fixes

* Fixes an issue where importing an encrypted backup file may not successfully complete in some cases ([7f1baf5](https://github.com/standardnotes/app/commit/7f1baf52c1d2ddd5112438b936d22ad99bc403a5))

## [1.70.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.7...@standardnotes/services@1.70.8) (2024-04-10)

**Note:** Version bump only for package @standardnotes/services

## [1.70.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.6...@standardnotes/services@1.70.7) (2024-04-10)

**Note:** Version bump only for package @standardnotes/services

## [1.70.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.5...@standardnotes/services@1.70.6) (2024-04-08)

**Note:** Version bump only for package @standardnotes/services

## [1.70.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.4...@standardnotes/services@1.70.5) (2024-03-22)

### Bug Fixes

* Fixed issue with system color scheme not being applied correctly on start ([7967dde](https://github.com/standardnotes/app/commit/7967ddead790d89478554cd6a96429fd06958590))

## [1.70.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.3...@standardnotes/services@1.70.4) (2024-03-14)

**Note:** Version bump only for package @standardnotes/services

## [1.70.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.2...@standardnotes/services@1.70.3) (2024-03-07)

### Bug Fixes

* use API v0 on iOS ([#2858](https://github.com/standardnotes/app/issues/2858)) [skip e2e] ([3b2f761](https://github.com/standardnotes/app/commit/3b2f76166126a5b11f35b64aacefa37618622c3d))

## [1.70.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.1...@standardnotes/services@1.70.2) (2024-03-05)

**Note:** Version bump only for package @standardnotes/services

## [1.70.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.70.0...@standardnotes/services@1.70.1) (2024-02-22)

**Note:** Version bump only for package @standardnotes/services

# [1.70.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.69.0...@standardnotes/services@1.70.0) (2024-02-17)

### Features

* Themes and appeareance settings are now local to your device and not synced ([#2847](https://github.com/standardnotes/app/issues/2847)) ([bfbf9ab](https://github.com/standardnotes/app/commit/bfbf9ab8ceb6f1ecd3a0690bce3b5d1c5c52e84c))

# [1.69.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.68.3...@standardnotes/services@1.69.0) (2024-02-02)

### Features

* Added search bar to navigation panel for searching tags and smart views ([#2815](https://github.com/standardnotes/app/issues/2815)) ([b07abaa](https://github.com/standardnotes/app/commit/b07abaa5df9ad580355f8179bab616002a33af33))

## [1.68.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.68.2...@standardnotes/services@1.68.3) (2024-01-27)

**Note:** Version bump only for package @standardnotes/services

## [1.68.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.68.1...@standardnotes/services@1.68.2) (2024-01-24)

**Note:** Version bump only for package @standardnotes/services

## [1.68.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.68.0...@standardnotes/services@1.68.1) (2024-01-23)

**Note:** Version bump only for package @standardnotes/services

# [1.68.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.11...@standardnotes/services@1.68.0) (2024-01-20)

### Features

* Editing large notes (greater than 1.5MB) will result in more optimized syncing, in which changes are saved locally immediately, but sync with the server less frequently (roughly every 30 seconds rather than after every change). ([#2768](https://github.com/standardnotes/app/issues/2768)) ([396ee3f](https://github.com/standardnotes/app/commit/396ee3f449c612600bbbe3294c61dc8be46ea365))

## [1.67.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.10...@standardnotes/services@1.67.11) (2024-01-11)

**Note:** Version bump only for package @standardnotes/services

## [1.67.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.9...@standardnotes/services@1.67.10) (2024-01-05)

**Note:** Version bump only for package @standardnotes/services

## [1.67.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.8...@standardnotes/services@1.67.9) (2024-01-02)

**Note:** Version bump only for package @standardnotes/services

## [1.67.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.7...@standardnotes/services@1.67.8) (2023-12-28)

**Note:** Version bump only for package @standardnotes/services

## [1.67.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.6...@standardnotes/services@1.67.7) (2023-12-28)

**Note:** Version bump only for package @standardnotes/services

## [1.67.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.5...@standardnotes/services@1.67.6) (2023-12-22)

**Note:** Version bump only for package @standardnotes/services

## [1.67.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.4...@standardnotes/services@1.67.5) (2023-12-11)

**Note:** Version bump only for package @standardnotes/services

## [1.67.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.3...@standardnotes/services@1.67.4) (2023-12-05)

**Note:** Version bump only for package @standardnotes/services

## [1.67.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.2...@standardnotes/services@1.67.3) (2023-12-04)

**Note:** Version bump only for package @standardnotes/services

## [1.67.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.1...@standardnotes/services@1.67.2) (2023-12-04)

**Note:** Version bump only for package @standardnotes/services

## [1.67.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.67.0...@standardnotes/services@1.67.1) (2023-12-04)

**Note:** Version bump only for package @standardnotes/services

# [1.67.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.66.1...@standardnotes/services@1.67.0) (2023-11-30)

### Features

* New one-click Home Server, now in Labs. Launch your own self-hosted server instance with just 1 click from the Preferences window. ([#2645](https://github.com/standardnotes/app/issues/2645)) ([17039cb](https://github.com/standardnotes/app/commit/17039cbb80416b84f7fca3b8388f073dd24c6227))

## [1.66.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.66.0...@standardnotes/services@1.66.1) (2023-11-30)

**Note:** Version bump only for package @standardnotes/services

# [1.66.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.65.6...@standardnotes/services@1.66.0) (2023-11-29)

### Features

* Markdown, Rich text, Code, and Checklist note types have been moved to the new Plugins preferences pane. Previous notes created using these types will not experience any disruption. To create new notes using these types, you can reinstall them from the Plugins preferences screen. It is recommended to use the Super note type in place of these replaced note types. ([#2630](https://github.com/standardnotes/app/issues/2630)) ([c43b593](https://github.com/standardnotes/app/commit/c43b593c6098a1293d6e6f25fda184e592897f7c))

## [1.65.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.65.5...@standardnotes/services@1.65.6) (2023-11-27)

**Note:** Version bump only for package @standardnotes/services

## [1.65.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.65.4...@standardnotes/services@1.65.5) (2023-11-24)

**Note:** Version bump only for package @standardnotes/services

## [1.65.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.65.3...@standardnotes/services@1.65.4) (2023-11-24)

**Note:** Version bump only for package @standardnotes/services

## [1.65.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.65.2...@standardnotes/services@1.65.3) (2023-11-08)

**Note:** Version bump only for package @standardnotes/services

## [1.65.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.65.1...@standardnotes/services@1.65.2) (2023-11-04)

**Note:** Version bump only for package @standardnotes/services

## [1.65.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.65.0...@standardnotes/services@1.65.1) (2023-11-03)

**Note:** Version bump only for package @standardnotes/services

# [1.65.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.38...@standardnotes/services@1.65.0) (2023-10-30)

### Features

* When exporting a Super note, embedded files can be inlined in the note or exported along the note in a zip file. You can now also choose to include frontmatter when exporting to Markdown format. ([991de1d](https://github.com/standardnotes/app/commit/991de1ddf5dbb1016348d603d244699c676d9b5f)), closes [#2610](https://github.com/standardnotes/app/issues/2610)

## [1.64.38](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.37...@standardnotes/services@1.64.38) (2023-10-26)

**Note:** Version bump only for package @standardnotes/services

## [1.64.37](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.36...@standardnotes/services@1.64.37) (2023-10-25)

**Note:** Version bump only for package @standardnotes/services

## [1.64.36](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.35...@standardnotes/services@1.64.36) (2023-10-23)

**Note:** Version bump only for package @standardnotes/services

## [1.64.35](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.34...@standardnotes/services@1.64.35) (2023-10-17)

**Note:** Version bump only for package @standardnotes/services

## [1.64.34](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.33...@standardnotes/services@1.64.34) (2023-10-09)

**Note:** Version bump only for package @standardnotes/services

## [1.64.33](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.32...@standardnotes/services@1.64.33) (2023-10-05)

**Note:** Version bump only for package @standardnotes/services

## [1.64.32](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.31...@standardnotes/services@1.64.32) (2023-10-02)

**Note:** Version bump only for package @standardnotes/services

## [1.64.31](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.30...@standardnotes/services@1.64.31) (2023-09-29)

**Note:** Version bump only for package @standardnotes/services

## [1.64.30](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.29...@standardnotes/services@1.64.30) (2023-09-28)

**Note:** Version bump only for package @standardnotes/services

## [1.64.29](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.28...@standardnotes/services@1.64.29) (2023-09-26)

**Note:** Version bump only for package @standardnotes/services

## [1.64.28](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.27...@standardnotes/services@1.64.28) (2023-09-26)

**Note:** Version bump only for package @standardnotes/services

## [1.64.27](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.26...@standardnotes/services@1.64.27) (2023-09-22)

**Note:** Version bump only for package @standardnotes/services

## [1.64.26](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.25...@standardnotes/services@1.64.26) (2023-09-22)

**Note:** Version bump only for package @standardnotes/services

## [1.64.25](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.24...@standardnotes/services@1.64.25) (2023-09-22)

**Note:** Version bump only for package @standardnotes/services

## [1.64.24](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.23...@standardnotes/services@1.64.24) (2023-09-22)

**Note:** Version bump only for package @standardnotes/services

## [1.64.23](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.22...@standardnotes/services@1.64.23) (2023-09-21)

**Note:** Version bump only for package @standardnotes/services

## [1.64.22](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.21...@standardnotes/services@1.64.22) (2023-09-20)

**Note:** Version bump only for package @standardnotes/services

## [1.64.21](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.20...@standardnotes/services@1.64.21) (2023-09-20)

**Note:** Version bump only for package @standardnotes/services

## [1.64.20](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.19...@standardnotes/services@1.64.20) (2023-09-18)

**Note:** Version bump only for package @standardnotes/services

## [1.64.19](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.18...@standardnotes/services@1.64.19) (2023-09-15)

**Note:** Version bump only for package @standardnotes/services

## [1.64.18](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.17...@standardnotes/services@1.64.18) (2023-09-15)

**Note:** Version bump only for package @standardnotes/services

## [1.64.17](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.16...@standardnotes/services@1.64.17) (2023-09-15)

**Note:** Version bump only for package @standardnotes/services

## [1.64.16](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.15...@standardnotes/services@1.64.16) (2023-09-13)

**Note:** Version bump only for package @standardnotes/services

## [1.64.15](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.14...@standardnotes/services@1.64.15) (2023-09-12)

**Note:** Version bump only for package @standardnotes/services

## [1.64.14](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.13...@standardnotes/services@1.64.14) (2023-09-12)

**Note:** Version bump only for package @standardnotes/services

## [1.64.13](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.12...@standardnotes/services@1.64.13) (2023-09-07)

**Note:** Version bump only for package @standardnotes/services

## [1.64.12](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.11...@standardnotes/services@1.64.12) (2023-09-07)

**Note:** Version bump only for package @standardnotes/services

## [1.64.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.10...@standardnotes/services@1.64.11) (2023-09-06)

**Note:** Version bump only for package @standardnotes/services

## [1.64.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.9...@standardnotes/services@1.64.10) (2023-09-05)

**Note:** Version bump only for package @standardnotes/services

## [1.64.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.8...@standardnotes/services@1.64.9) (2023-09-04)

**Note:** Version bump only for package @standardnotes/services

## [1.64.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.7...@standardnotes/services@1.64.8) (2023-09-01)

**Note:** Version bump only for package @standardnotes/services

## [1.64.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.6...@standardnotes/services@1.64.7) (2023-08-31)

**Note:** Version bump only for package @standardnotes/services

## [1.64.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.5...@standardnotes/services@1.64.6) (2023-08-24)

**Note:** Version bump only for package @standardnotes/services

## [1.64.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.4...@standardnotes/services@1.64.5) (2023-08-23)

**Note:** Version bump only for package @standardnotes/services

## [1.64.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.3...@standardnotes/services@1.64.4) (2023-08-23)

**Note:** Version bump only for package @standardnotes/services

## [1.64.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.2...@standardnotes/services@1.64.3) (2023-08-21)

**Note:** Version bump only for package @standardnotes/services

## [1.64.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.1...@standardnotes/services@1.64.2) (2023-08-21)

**Note:** Version bump only for package @standardnotes/services

## [1.64.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.64.0...@standardnotes/services@1.64.1) (2023-08-21)

**Note:** Version bump only for package @standardnotes/services

# [1.64.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.38...@standardnotes/services@1.64.0) (2023-08-18)

### Features

* Added Super & HTML import options in Import modal. Google Keep notes will now also be imported as Super notes, with attachments if importing from HTML ([#2433](https://github.com/standardnotes/app/issues/2433)) ([ca9895c](https://github.com/standardnotes/app/commit/ca9895cac117aad16cd2f89633d7613ed54b67bf))

## [1.63.38](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.37...@standardnotes/services@1.63.38) (2023-08-12)

**Note:** Version bump only for package @standardnotes/services

## [1.63.37](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.36...@standardnotes/services@1.63.37) (2023-08-11)

**Note:** Version bump only for package @standardnotes/services

## [1.63.36](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.35...@standardnotes/services@1.63.36) (2023-08-10)

**Note:** Version bump only for package @standardnotes/services

## [1.63.35](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.34...@standardnotes/services@1.63.35) (2023-08-09)

**Note:** Version bump only for package @standardnotes/services

## [1.63.34](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.33...@standardnotes/services@1.63.34) (2023-08-09)

**Note:** Version bump only for package @standardnotes/services

## [1.63.33](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.32...@standardnotes/services@1.63.33) (2023-08-09)

**Note:** Version bump only for package @standardnotes/services

## [1.63.32](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.31...@standardnotes/services@1.63.32) (2023-08-09)

**Note:** Version bump only for package @standardnotes/services

## [1.63.31](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.30...@standardnotes/services@1.63.31) (2023-08-08)

**Note:** Version bump only for package @standardnotes/services

## [1.63.30](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.29...@standardnotes/services@1.63.30) (2023-08-08)

**Note:** Version bump only for package @standardnotes/services

## [1.63.29](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.28...@standardnotes/services@1.63.29) (2023-08-07)

**Note:** Version bump only for package @standardnotes/services

## [1.63.28](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.27...@standardnotes/services@1.63.28) (2023-08-07)

**Note:** Version bump only for package @standardnotes/services

## [1.63.27](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.26...@standardnotes/services@1.63.27) (2023-08-06)

**Note:** Version bump only for package @standardnotes/services

## [1.63.26](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.25...@standardnotes/services@1.63.26) (2023-08-06)

**Note:** Version bump only for package @standardnotes/services

## [1.63.25](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.24...@standardnotes/services@1.63.25) (2023-08-06)

**Note:** Version bump only for package @standardnotes/services

## [1.63.24](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.23...@standardnotes/services@1.63.24) (2023-08-05)

**Note:** Version bump only for package @standardnotes/services

## [1.63.23](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.22...@standardnotes/services@1.63.23) (2023-08-04)

**Note:** Version bump only for package @standardnotes/services

## [1.63.22](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.21...@standardnotes/services@1.63.22) (2023-08-03)

**Note:** Version bump only for package @standardnotes/services

## [1.63.21](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.20...@standardnotes/services@1.63.21) (2023-08-03)

**Note:** Version bump only for package @standardnotes/services

## [1.63.20](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.19...@standardnotes/services@1.63.20) (2023-08-02)

**Note:** Version bump only for package @standardnotes/services

## [1.63.19](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.18...@standardnotes/services@1.63.19) (2023-08-01)

### Bug Fixes

* Fixes issue where selecting a third-party editor/note-type as default for a tag would not correctly apply editor ([73609ca](https://github.com/standardnotes/app/commit/73609ca7e31c6cc628f46319f0b9502f7b8afcd3))

## [1.63.18](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.17...@standardnotes/services@1.63.18) (2023-07-31)

**Note:** Version bump only for package @standardnotes/services

## [1.63.17](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.16...@standardnotes/services@1.63.17) (2023-07-28)

**Note:** Version bump only for package @standardnotes/services

## [1.63.16](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.15...@standardnotes/services@1.63.16) (2023-07-28)

**Note:** Version bump only for package @standardnotes/services

## [1.63.15](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.14...@standardnotes/services@1.63.15) (2023-07-27)

### Bug Fixes

* handle bad access when accessing paths ([#2375](https://github.com/standardnotes/app/issues/2375)) ([804a39d](https://github.com/standardnotes/app/commit/804a39dabc595579aba3643ef6d6ef0c10263f9c))

## [1.63.14](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.13...@standardnotes/services@1.63.14) (2023-07-27)

**Note:** Version bump only for package @standardnotes/services

## [1.63.13](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.12...@standardnotes/services@1.63.13) (2023-07-27)

**Note:** Version bump only for package @standardnotes/services

## [1.63.12](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.11...@standardnotes/services@1.63.12) (2023-07-26)

### Bug Fixes

* Fixes issue where lock screen would not use previously active theme ([#2372](https://github.com/standardnotes/app/issues/2372)) ([d268c02](https://github.com/standardnotes/app/commit/d268c02ab31beb5e2fd9e6547610f9a4dd61bed4))

## [1.63.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.10...@standardnotes/services@1.63.11) (2023-07-26)

**Note:** Version bump only for package @standardnotes/services

## [1.63.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.9...@standardnotes/services@1.63.10) (2023-07-26)

**Note:** Version bump only for package @standardnotes/services

## [1.63.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.8...@standardnotes/services@1.63.9) (2023-07-25)

**Note:** Version bump only for package @standardnotes/services

## [1.63.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.7...@standardnotes/services@1.63.8) (2023-07-24)

**Note:** Version bump only for package @standardnotes/services

## [1.63.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.6...@standardnotes/services@1.63.7) (2023-07-24)

**Note:** Version bump only for package @standardnotes/services

## [1.63.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.5...@standardnotes/services@1.63.6) (2023-07-23)

**Note:** Version bump only for package @standardnotes/services

## [1.63.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.4...@standardnotes/services@1.63.5) (2023-07-17)

**Note:** Version bump only for package @standardnotes/services

## [1.63.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.3...@standardnotes/services@1.63.4) (2023-07-14)

**Note:** Version bump only for package @standardnotes/services

## [1.63.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.2...@standardnotes/services@1.63.3) (2023-07-13)

**Note:** Version bump only for package @standardnotes/services

## [1.63.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.1...@standardnotes/services@1.63.2) (2023-07-12)

**Note:** Version bump only for package @standardnotes/services

## [1.63.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.63.0...@standardnotes/services@1.63.1) (2023-07-12)

**Note:** Version bump only for package @standardnotes/services

# [1.63.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.62.6...@standardnotes/services@1.63.0) (2023-07-11)

### Features

* On Android, you can now share text & files from other apps directly into Standard Notes ([#2352](https://github.com/standardnotes/app/issues/2352)) ([3dc179c](https://github.com/standardnotes/app/commit/3dc179c7b0779ef0f2857b7f9c994ea9d5385720))

## [1.62.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.62.5...@standardnotes/services@1.62.6) (2023-07-11)

**Note:** Version bump only for package @standardnotes/services

## [1.62.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.62.4...@standardnotes/services@1.62.5) (2023-07-11)

**Note:** Version bump only for package @standardnotes/services

## [1.62.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.62.3...@standardnotes/services@1.62.4) (2023-07-07)

**Note:** Version bump only for package @standardnotes/services

## [1.62.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.62.2...@standardnotes/services@1.62.3) (2023-07-06)

**Note:** Version bump only for package @standardnotes/services

## [1.62.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.62.1...@standardnotes/services@1.62.2) (2023-07-05)

**Note:** Version bump only for package @standardnotes/services

## [1.62.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.62.0...@standardnotes/services@1.62.1) (2023-07-05)

**Note:** Version bump only for package @standardnotes/services

# [1.62.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.61.2...@standardnotes/services@1.62.0) (2023-07-04)

### Features

* New one-click Home Server, now in Labs. Launch your own self-hosted server instance with just 1 click from the Preferences window.  ([#2345](https://github.com/standardnotes/app/issues/2345)) ([0552878](https://github.com/standardnotes/app/commit/05528782a4e9684dbd86fd12b77eb86727d6c414))

## [1.61.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.61.1...@standardnotes/services@1.61.2) (2023-07-04)

**Note:** Version bump only for package @standardnotes/services

## [1.61.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.61.0...@standardnotes/services@1.61.1) (2023-07-03)

**Note:** Version bump only for package @standardnotes/services

# [1.61.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.7...@standardnotes/services@1.61.0) (2023-07-03)

### Features

* New one-click Home Server, now in Labs. Launch your own self-hosted server instance with just 1 click from the Preferences window. ([#2341](https://github.com/standardnotes/app/issues/2341)) ([96f4264](https://github.com/standardnotes/app/commit/96f42643a98586052bfb5262ca797fd029c1e925))

## [1.60.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.6...@standardnotes/services@1.60.7) (2023-06-30)

**Note:** Version bump only for package @standardnotes/services

## [1.60.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.5...@standardnotes/services@1.60.6) (2023-06-29)

**Note:** Version bump only for package @standardnotes/services

## [1.60.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.4...@standardnotes/services@1.60.5) (2023-06-27)

**Note:** Version bump only for package @standardnotes/services

## [1.60.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.3...@standardnotes/services@1.60.4) (2023-06-26)

**Note:** Version bump only for package @standardnotes/services

## [1.60.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.2...@standardnotes/services@1.60.3) (2023-06-25)

**Note:** Version bump only for package @standardnotes/services

## [1.60.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.1...@standardnotes/services@1.60.2) (2023-06-25)

**Note:** Version bump only for package @standardnotes/services

## [1.60.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.60.0...@standardnotes/services@1.60.1) (2023-06-25)

**Note:** Version bump only for package @standardnotes/services

# [1.60.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.12...@standardnotes/services@1.60.0) (2023-06-25)

### Features

* Added a conflict resolution dialog and a Conflicts view for easier management of conflicts ([#2337](https://github.com/standardnotes/app/issues/2337)) ([e0e9249](https://github.com/standardnotes/app/commit/e0e92493342b18560e7e55ece22518e738824df0))

## [1.59.12](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.11...@standardnotes/services@1.59.12) (2023-06-06)

**Note:** Version bump only for package @standardnotes/services

## [1.59.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.10...@standardnotes/services@1.59.11) (2023-05-31)

### Bug Fixes

* **desktop:** Fixed issue where local backup location would default to "[object Promise]" ([7d691aa](https://github.com/standardnotes/app/commit/7d691aa409af3636ad795491b8b817d9eb7a980d))

## [1.59.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.9...@standardnotes/services@1.59.10) (2023-05-22)

**Note:** Version bump only for package @standardnotes/services

## [1.59.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.8...@standardnotes/services@1.59.9) (2023-05-22)

**Note:** Version bump only for package @standardnotes/services

## [1.59.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.7...@standardnotes/services@1.59.8) (2023-05-12)

**Note:** Version bump only for package @standardnotes/services

## [1.59.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.6...@standardnotes/services@1.59.7) (2023-05-11)

**Note:** Version bump only for package @standardnotes/services

## [1.59.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.5...@standardnotes/services@1.59.6) (2023-05-08)

**Note:** Version bump only for package @standardnotes/services

## [1.59.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.4...@standardnotes/services@1.59.5) (2023-05-08)

**Note:** Version bump only for package @standardnotes/services

## [1.59.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.3...@standardnotes/services@1.59.4) (2023-05-04)

**Note:** Version bump only for package @standardnotes/services

## [1.59.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.2...@standardnotes/services@1.59.3) (2023-05-04)

### Bug Fixes

* workspace names now default to account email after signing in. It can later be changed from the workspace switcher menu. ([8385b4e](https://github.com/standardnotes/app/commit/8385b4e89fa0fc3204532adda9d085d9c0fd7996))

## [1.59.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.1...@standardnotes/services@1.59.2) (2023-05-03)

**Note:** Version bump only for package @standardnotes/services

## [1.59.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.59.0...@standardnotes/services@1.59.1) (2023-05-02)

### Bug Fixes

* automatically convert Super notes to Markdown for the Plaintext Backups feature ([75ecf4c](https://github.com/standardnotes/app/commit/75ecf4c393a6bc0ab2d6bf50dcbee21cef520746))

# [1.59.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.58.5...@standardnotes/services@1.59.0) (2023-05-02)

### Features

* Automatic plaintext backup option in Preferences > Backups will backup your notes and tags into plaintext, unencrypted folders on your computer. In addition, automatic encrypted text backups preference management has moved from the top-level menu in the desktop app to Preferences > Backups. ([#2322](https://github.com/standardnotes/app/issues/2322)) ([7e3db49](https://github.com/standardnotes/app/commit/7e3db49322034aa644c3c99ccf9a5f1b508583aa))

## [1.58.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.58.4...@standardnotes/services@1.58.5) (2023-04-26)

**Note:** Version bump only for package @standardnotes/services

## [1.58.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.58.3...@standardnotes/services@1.58.4) (2023-04-26)

**Note:** Version bump only for package @standardnotes/services

## [1.58.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.58.2...@standardnotes/services@1.58.3) (2023-04-26)

**Note:** Version bump only for package @standardnotes/services

## [1.58.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.58.1...@standardnotes/services@1.58.2) (2023-04-24)

**Note:** Version bump only for package @standardnotes/services

## [1.58.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.58.0...@standardnotes/services@1.58.1) (2023-04-20)

**Note:** Version bump only for package @standardnotes/services

# [1.58.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.15...@standardnotes/services@1.58.0) (2023-04-17)

### Features

* **mobile:** add U2F support for Android devices ([#2311](https://github.com/standardnotes/app/issues/2311)) ([725f55f](https://github.com/standardnotes/app/commit/725f55fca794b86c245742837af7e4370cebd68c))

## [1.57.15](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.14...@standardnotes/services@1.57.15) (2023-04-15)

**Note:** Version bump only for package @standardnotes/services

## [1.57.14](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.13...@standardnotes/services@1.57.14) (2023-04-14)

**Note:** Version bump only for package @standardnotes/services

## [1.57.13](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.12...@standardnotes/services@1.57.13) (2023-04-11)

**Note:** Version bump only for package @standardnotes/services

## [1.57.12](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.11...@standardnotes/services@1.57.12) (2023-04-11)

**Note:** Version bump only for package @standardnotes/services

## [1.57.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.10...@standardnotes/services@1.57.11) (2023-03-26)

**Note:** Version bump only for package @standardnotes/services

## [1.57.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.9...@standardnotes/services@1.57.10) (2023-03-15)

**Note:** Version bump only for package @standardnotes/services

## [1.57.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.8...@standardnotes/services@1.57.9) (2023-03-10)

**Note:** Version bump only for package @standardnotes/services

## [1.57.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.7...@standardnotes/services@1.57.8) (2023-03-10)

**Note:** Version bump only for package @standardnotes/services

## [1.57.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.6...@standardnotes/services@1.57.7) (2023-03-09)

**Note:** Version bump only for package @standardnotes/services

## [1.57.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.5...@standardnotes/services@1.57.6) (2023-03-08)

**Note:** Version bump only for package @standardnotes/services

## [1.57.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.4...@standardnotes/services@1.57.5) (2023-03-03)

**Note:** Version bump only for package @standardnotes/services

## [1.57.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.3...@standardnotes/services@1.57.4) (2023-03-01)

**Note:** Version bump only for package @standardnotes/services

## [1.57.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.2...@standardnotes/services@1.57.3) (2023-03-01)

**Note:** Version bump only for package @standardnotes/services

## [1.57.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.1...@standardnotes/services@1.57.2) (2023-02-23)

**Note:** Version bump only for package @standardnotes/services

## [1.57.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.57.0...@standardnotes/services@1.57.1) (2023-02-15)

**Note:** Version bump only for package @standardnotes/services

# [1.57.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.18...@standardnotes/services@1.57.0) (2023-02-03)

### Features

* **dev:** add u2f ui for managing devices and signing in ([#2182](https://github.com/standardnotes/app/issues/2182)) ([9414774](https://github.com/standardnotes/app/commit/9414774e89c5c21b0c2178652ded72033065e8d2))

## [1.56.18](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.17...@standardnotes/services@1.56.18) (2023-02-03)

### Bug Fixes

* **web:** disable subscription sharing on demo ([de5973e](https://github.com/standardnotes/app/commit/de5973e15f21fcaff0225834f1c09f295ad83368))

## [1.56.17](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.16...@standardnotes/services@1.56.17) (2023-02-02)

**Note:** Version bump only for package @standardnotes/services

## [1.56.16](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.15...@standardnotes/services@1.56.16) (2023-02-01)

**Note:** Version bump only for package @standardnotes/services

## [1.56.15](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.14...@standardnotes/services@1.56.15) (2023-02-01)

**Note:** Version bump only for package @standardnotes/services

## [1.56.14](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.13...@standardnotes/services@1.56.14) (2023-01-31)

**Note:** Version bump only for package @standardnotes/services

## [1.56.13](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.12...@standardnotes/services@1.56.13) (2023-01-31)

**Note:** Version bump only for package @standardnotes/services

## [1.56.12](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.11...@standardnotes/services@1.56.12) (2023-01-24)

**Note:** Version bump only for package @standardnotes/services

## [1.56.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.10...@standardnotes/services@1.56.11) (2023-01-24)

**Note:** Version bump only for package @standardnotes/services

## [1.56.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.9...@standardnotes/services@1.56.10) (2023-01-23)

**Note:** Version bump only for package @standardnotes/services

## [1.56.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.8...@standardnotes/services@1.56.9) (2023-01-23)

**Note:** Version bump only for package @standardnotes/services

## [1.56.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.7...@standardnotes/services@1.56.8) (2023-01-21)

**Note:** Version bump only for package @standardnotes/services

## [1.56.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.6...@standardnotes/services@1.56.7) (2023-01-20)

**Note:** Version bump only for package @standardnotes/services

## [1.56.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.5...@standardnotes/services@1.56.6) (2023-01-20)

**Note:** Version bump only for package @standardnotes/services

## [1.56.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.4...@standardnotes/services@1.56.5) (2023-01-20)

**Note:** Version bump only for package @standardnotes/services

## [1.56.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.3...@standardnotes/services@1.56.4) (2023-01-20)

### Bug Fixes

* **snjs:** bring back history tests and fix handlinf of error with revisions ([cb9c160](https://github.com/standardnotes/app/commit/cb9c16047ebea7134c1aadaf89a8023497358a8e))

## [1.56.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.2...@standardnotes/services@1.56.3) (2023-01-20)

**Note:** Version bump only for package @standardnotes/services

## [1.56.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.1...@standardnotes/services@1.56.2) (2023-01-19)

**Note:** Version bump only for package @standardnotes/services

## [1.56.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.56.0...@standardnotes/services@1.56.1) (2023-01-19)

**Note:** Version bump only for package @standardnotes/services

# [1.56.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.55.2...@standardnotes/services@1.56.0) (2023-01-18)

### Bug Fixes

* **snjs:** notify http service of refresh session ([271db1c](https://github.com/standardnotes/app/commit/271db1c3dcf663633cb23465c24e1aeef1a9d829))

### Features

* **snjs:** add revisions api v2 ([#2154](https://github.com/standardnotes/app/issues/2154)) ([880a537](https://github.com/standardnotes/app/commit/880a537774ddcefaedb0d4e5dc50b363f4b93e01))

## [1.55.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.55.1...@standardnotes/services@1.55.2) (2023-01-12)

**Note:** Version bump only for package @standardnotes/services

## [1.55.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.55.0...@standardnotes/services@1.55.1) (2023-01-11)

### Bug Fixes

* **snjs:** simplify authenticator api for generating options ([#2147](https://github.com/standardnotes/app/issues/2147)) ([5d20a53](https://github.com/standardnotes/app/commit/5d20a53e6ea9ec08fdc1403a36a1b371ffaf9cd2))

# [1.55.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.54.0...@standardnotes/services@1.55.0) (2023-01-11)

### Features

* **snjs:** add authenticator use cases ([#2145](https://github.com/standardnotes/app/issues/2145)) ([5864ea8](https://github.com/standardnotes/app/commit/5864ea84e719a5ac26db6ff93e80f51b46751c54))

# [1.54.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.53.2...@standardnotes/services@1.54.0) (2023-01-10)

### Features

* recovery codes UI (recovery sign in + get recovery codes) ([#2139](https://github.com/standardnotes/app/issues/2139)) ([5e6c901](https://github.com/standardnotes/app/commit/5e6c901c21e7e9df77cad79d1738124130c3a6cb))

## [1.53.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.53.1...@standardnotes/services@1.53.2) (2023-01-10)

**Note:** Version bump only for package @standardnotes/services

## [1.53.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.53.0...@standardnotes/services@1.53.1) (2023-01-09)

**Note:** Version bump only for package @standardnotes/services

# [1.53.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.52.2...@standardnotes/services@1.53.0) (2023-01-09)

### Features

* **snjs:** add sign in with recovery codes use case ([#2130](https://github.com/standardnotes/app/issues/2130)) ([be028ff](https://github.com/standardnotes/app/commit/be028ff87bb5306fc266b70567cbea8a13547e7e))

## [1.52.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.52.1...@standardnotes/services@1.52.2) (2023-01-06)

**Note:** Version bump only for package @standardnotes/services

## [1.52.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.52.0...@standardnotes/services@1.52.1) (2023-01-04)

**Note:** Version bump only for package @standardnotes/services

# [1.52.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.51.1...@standardnotes/services@1.52.0) (2023-01-03)

### Features

* improve initial load performance on mobile ([#2126](https://github.com/standardnotes/app/issues/2126)) ([3c332a3](https://github.com/standardnotes/app/commit/3c332a35f6024c46020a1d6ac68a5df989804142))

## [1.51.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.51.0...@standardnotes/services@1.51.1) (2023-01-03)

**Note:** Version bump only for package @standardnotes/services

# [1.51.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.14...@standardnotes/services@1.51.0) (2022-12-29)

### Features

* **api:** add authenticators api ([#2124](https://github.com/standardnotes/app/issues/2124)) ([59e8b5c](https://github.com/standardnotes/app/commit/59e8b5c8b5b61ef1cd8f291798c45860736a1296))

## [1.50.14](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.13...@standardnotes/services@1.50.14) (2022-12-29)

**Note:** Version bump only for package @standardnotes/services

## [1.50.13](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.12...@standardnotes/services@1.50.13) (2022-12-28)

**Note:** Version bump only for package @standardnotes/services

## [1.50.12](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.11...@standardnotes/services@1.50.12) (2022-12-27)

**Note:** Version bump only for package @standardnotes/services

## [1.50.11](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.10...@standardnotes/services@1.50.11) (2022-12-27)

**Note:** Version bump only for package @standardnotes/services

## [1.50.10](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.9...@standardnotes/services@1.50.10) (2022-12-27)

**Note:** Version bump only for package @standardnotes/services

## [1.50.9](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.8...@standardnotes/services@1.50.9) (2022-12-21)

**Note:** Version bump only for package @standardnotes/services

## [1.50.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.7...@standardnotes/services@1.50.8) (2022-12-20)

**Note:** Version bump only for package @standardnotes/services

## [1.50.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.6...@standardnotes/services@1.50.7) (2022-12-19)

**Note:** Version bump only for package @standardnotes/services

## [1.50.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.5...@standardnotes/services@1.50.6) (2022-12-19)

**Note:** Version bump only for package @standardnotes/services

## [1.50.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.4...@standardnotes/services@1.50.5) (2022-12-08)

**Note:** Version bump only for package @standardnotes/services

## [1.50.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.3...@standardnotes/services@1.50.4) (2022-12-05)

**Note:** Version bump only for package @standardnotes/services

## [1.50.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.2...@standardnotes/services@1.50.3) (2022-12-04)

### Bug Fixes

* **mobile:** Fixed issue where pressing the back button on editor screen wouldn't switch back to the items list on Android ([07cb00a](https://github.com/standardnotes/app/commit/07cb00a81505ed880a2b8033b3e69c53dd9b48b2))

## [1.50.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.1...@standardnotes/services@1.50.2) (2022-12-02)

### Bug Fixes

* fixes issue where Moments camera wouldn't properly start on desktop app ([#2084](https://github.com/standardnotes/app/issues/2084)) ([8c41f0e](https://github.com/standardnotes/app/commit/8c41f0ecc30662c5e2fef72e5685056a8cddce62))

## [1.50.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.50.0...@standardnotes/services@1.50.1) (2022-12-02)

### Bug Fixes

* fixes issue where files imported from another account could not be deleted ([#2082](https://github.com/standardnotes/app/issues/2082)) ([b5b6192](https://github.com/standardnotes/app/commit/b5b6192b603b5ce60b913cc7138d30e46aafbe14))

# [1.50.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.49.0...@standardnotes/services@1.50.0) (2022-12-02)

### Features

* Moments: your personal photo journal, now available in Labs ([#2079](https://github.com/standardnotes/app/issues/2079)) ([29368c5](https://github.com/standardnotes/app/commit/29368c51b801331dd73d8cbee9746abadf2e1120))

# [1.49.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.48.1...@standardnotes/services@1.49.0) (2022-12-01)

### Features

* download and preview files from local backups automatically, if a local backup is available ([#2076](https://github.com/standardnotes/app/issues/2076)) ([28e43d3](https://github.com/standardnotes/app/commit/28e43d37c00c5cd97129c4b83266f7a234bd9857))

## [1.48.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.48.0...@standardnotes/services@1.48.1) (2022-12-01)

**Note:** Version bump only for package @standardnotes/services

# [1.48.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.47.2...@standardnotes/services@1.48.0) (2022-11-28)

### Features

* display number of files for 'Files' view ([#2065](https://github.com/standardnotes/app/issues/2065)) ([767d354](https://github.com/standardnotes/app/commit/767d3547804bc98693dcc769baeed943c24426f3))

## [1.47.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.47.1...@standardnotes/services@1.47.2) (2022-11-28)

**Note:** Version bump only for package @standardnotes/services

## [1.47.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.47.0...@standardnotes/services@1.47.1) (2022-11-27)

**Note:** Version bump only for package @standardnotes/services

# [1.47.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.46.1...@standardnotes/services@1.47.0) (2022-11-24)

### Features

* New 'What's New' section in Preferences ([#2049](https://github.com/standardnotes/app/issues/2049)) (skip e2e) ([0a01ddb](https://github.com/standardnotes/app/commit/0a01ddb430154fa4518985458c15c644855c80ea))

## [1.46.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.46.0...@standardnotes/services@1.46.1) (2022-11-23)

**Note:** Version bump only for package @standardnotes/services

# [1.46.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.45.6...@standardnotes/services@1.46.0) (2022-11-23)

### Features

* display file backup status in file context menu ([#2044](https://github.com/standardnotes/app/issues/2044)) (skip e2e) ([7c2e832](https://github.com/standardnotes/app/commit/7c2e832065d45676f1b69b7c386e789e2f76775e))

## [1.45.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.45.5...@standardnotes/services@1.45.6) (2022-11-18)

**Note:** Version bump only for package @standardnotes/services

## [1.45.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.45.4...@standardnotes/services@1.45.5) (2022-11-18)

**Note:** Version bump only for package @standardnotes/services

## [1.45.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.45.3...@standardnotes/services@1.45.4) (2022-11-17)

**Note:** Version bump only for package @standardnotes/services

## [1.45.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.45.2...@standardnotes/services@1.45.3) (2022-11-17)

**Note:** Version bump only for package @standardnotes/services

## [1.45.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.45.1...@standardnotes/services@1.45.2) (2022-11-16)

**Note:** Version bump only for package @standardnotes/services

## [1.45.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.45.0...@standardnotes/services@1.45.1) (2022-11-16)

**Note:** Version bump only for package @standardnotes/services

# [1.45.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.44.0...@standardnotes/services@1.45.0) (2022-11-16)

### Features

* **labs:** super editor ([#2001](https://github.com/standardnotes/app/issues/2001)) ([59f8547](https://github.com/standardnotes/app/commit/59f8547a8de1c804cb2f01ac734c83268977fa28))

# [1.44.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.43.0...@standardnotes/services@1.44.0) (2022-11-14)

### Features

* GUI to create smart views ([#1997](https://github.com/standardnotes/app/issues/1997)) ([f656185](https://github.com/standardnotes/app/commit/f656185c167b3306d408dc486970836efa1d70c5))

# [1.43.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.8...@standardnotes/services@1.43.0) (2022-11-13)

### Features

* iap ([#1996](https://github.com/standardnotes/app/issues/1996)) ([d519aca](https://github.com/standardnotes/app/commit/d519aca685b32f4b6f7079ba9562ecaf1a18aecb))

## [1.42.8](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.7...@standardnotes/services@1.42.8) (2022-11-09)

**Note:** Version bump only for package @standardnotes/services

## [1.42.7](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.6...@standardnotes/services@1.42.7) (2022-11-09)

**Note:** Version bump only for package @standardnotes/services

## [1.42.6](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.5...@standardnotes/services@1.42.6) (2022-11-07)

**Note:** Version bump only for package @standardnotes/services

## [1.42.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.4...@standardnotes/services@1.42.5) (2022-11-06)

**Note:** Version bump only for package @standardnotes/services

## [1.42.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.3...@standardnotes/services@1.42.4) (2022-11-04)

**Note:** Version bump only for package @standardnotes/services

## [1.42.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.2...@standardnotes/services@1.42.3) (2022-11-04)

**Note:** Version bump only for package @standardnotes/services

## [1.42.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.1...@standardnotes/services@1.42.2) (2022-11-04)

**Note:** Version bump only for package @standardnotes/services

## [1.42.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.42.0...@standardnotes/services@1.42.1) (2022-11-04)

**Note:** Version bump only for package @standardnotes/services

# [1.42.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.41.0...@standardnotes/services@1.42.0) (2022-11-03)

### Features

* add sending user requests from UI ([#1927](https://github.com/standardnotes/app/issues/1927)) ([7ead0f6](https://github.com/standardnotes/app/commit/7ead0f655bb2572e5805dd26c297d520949d661a))

# [1.41.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.40.1...@standardnotes/services@1.41.0) (2022-11-02)

### Features

* prioritize loading latest selected items ([#1930](https://github.com/standardnotes/app/issues/1930)) ([a6ef658](https://github.com/standardnotes/app/commit/a6ef658daef9a01f5ddacc967fe30d22f580799a))

## [1.40.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.40.0...@standardnotes/services@1.40.1) (2022-11-02)

**Note:** Version bump only for package @standardnotes/services

# [1.40.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.39.2...@standardnotes/services@1.40.0) (2022-11-02)

### Features

* add sending user requests to process ([#1908](https://github.com/standardnotes/app/issues/1908)) ([b2faa81](https://github.com/standardnotes/app/commit/b2faa815e967a9e7052b3ce6955e967c6bc68864))

## [1.39.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.39.1...@standardnotes/services@1.39.2) (2022-11-01)

### Bug Fixes

* **mobile:** increase font sizes and other mobile-centric improvements ([#1907](https://github.com/standardnotes/app/issues/1907)) ([994f824](https://github.com/standardnotes/app/commit/994f824757e1143a4547c975b154fd84e3ebeedf))

## [1.39.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.39.0...@standardnotes/services@1.39.1) (2022-10-28)

### Bug Fixes

* color scheme handling on mobile ([#1902](https://github.com/standardnotes/app/issues/1902)) ([6071ebf](https://github.com/standardnotes/app/commit/6071ebffeb55c78eac79f39aecca07f6ebdbed93))

# [1.39.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.38.0...@standardnotes/services@1.39.0) (2022-10-27)

### Features

* daily notes (dev only) ([#1894](https://github.com/standardnotes/app/issues/1894)) ([69c3f2b](https://github.com/standardnotes/app/commit/69c3f2be837152a1f937559327021c2128234c69))

# [1.38.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.37.1...@standardnotes/services@1.38.0) (2022-10-26)

### Features

* auto-activate biometrics prompt when mobile regains focus ([#1891](https://github.com/standardnotes/app/issues/1891)) ([3bd1ad3](https://github.com/standardnotes/app/commit/3bd1ad38ad05ba6ea0e99911693ed7b25e2f8380))

## [1.37.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.37.0...@standardnotes/services@1.37.1) (2022-10-25)

### Bug Fixes

* on mobile open links from editor in external browser ([#1860](https://github.com/standardnotes/app/issues/1860)) ([d9db73e](https://github.com/standardnotes/app/commit/d9db73ea056e2e6e2bde8e0c1de4a7090984ae9a))

# [1.37.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.36.0...@standardnotes/services@1.37.0) (2022-10-25)

### Features

* per-tag display preferences ([#1868](https://github.com/standardnotes/app/issues/1868)) ([ee7f11c](https://github.com/standardnotes/app/commit/ee7f11c933285234b20fa2d5db4fcf0d6a5dce9d))

# [1.36.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.35.0...@standardnotes/services@1.36.0) (2022-10-24)

### Features

* add preference on android to not confirm when exiting ([#1870](https://github.com/standardnotes/app/issues/1870)) ([28ef905](https://github.com/standardnotes/app/commit/28ef9054fad5236bc9f1fc87768d3c17059da4fb))

# [1.35.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.34.4...@standardnotes/services@1.35.0) (2022-10-24)

### Features

* **web:** add accepting subscription invites from UI ([0c44ad6](https://github.com/standardnotes/app/commit/0c44ad6c8eace6d5fe957fa75c205c66c5f590b4))

## [1.34.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.34.3...@standardnotes/services@1.34.4) (2022-10-21)

**Note:** Version bump only for package @standardnotes/services

## [1.34.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.34.2...@standardnotes/services@1.34.3) (2022-10-21)

**Note:** Version bump only for package @standardnotes/services

## [1.34.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.34.1...@standardnotes/services@1.34.2) (2022-10-21)

**Note:** Version bump only for package @standardnotes/services

## [1.34.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.34.0...@standardnotes/services@1.34.1) (2022-10-19)

### Bug Fixes

* issue with not being able to unlink a file from a note ([#1836](https://github.com/standardnotes/app/issues/1836)) ([4030953](https://github.com/standardnotes/app/commit/4030953b00ad609dc2b0f5b66cfd971d449f6121))

# [1.34.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.33.1...@standardnotes/services@1.34.0) (2022-10-18)

### Features

* authorize notes for listed ([#1823](https://github.com/standardnotes/app/issues/1823)) ([9954bdc](https://github.com/standardnotes/app/commit/9954bdc29f9de2a42c4539d55749991d86a72943))

## [1.33.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.33.0...@standardnotes/services@1.33.1) (2022-10-17)

**Note:** Version bump only for package @standardnotes/services

# [1.33.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.32.3...@standardnotes/services@1.33.0) (2022-10-13)

### Features

* soft biometrics lock ([#1793](https://github.com/standardnotes/app/issues/1793)) ([1a2dde2](https://github.com/standardnotes/app/commit/1a2dde2e0ea406b9818571ab71d38442f9c9fb50))

## [1.32.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.32.2...@standardnotes/services@1.32.3) (2022-10-13)

**Note:** Version bump only for package @standardnotes/services

## [1.32.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.32.1...@standardnotes/services@1.32.2) (2022-10-12)

**Note:** Version bump only for package @standardnotes/services

## [1.32.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.32.0...@standardnotes/services@1.32.1) (2022-10-12)

**Note:** Version bump only for package @standardnotes/services

# [1.32.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.31.0...@standardnotes/services@1.32.0) (2022-10-12)

### Features

* **api:** add keyshare initiation for workspaces ([fabce1f](https://github.com/standardnotes/app/commit/fabce1f7aca5c9caaa5bb3908b2dc68063c690d0))

# [1.31.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.30.0...@standardnotes/services@1.31.0) (2022-10-11)

### Features

* item linking ([#1779](https://github.com/standardnotes/app/issues/1779)) ([e3f2842](https://github.com/standardnotes/app/commit/e3f28421ff042c635ad2ae645c102c27e3e3f9c7))

# [1.30.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.29.0...@standardnotes/services@1.30.0) (2022-10-11)

### Features

* **api:** add listing workspace users ([fb41f65](https://github.com/standardnotes/app/commit/fb41f651eca45dd62314609c2f389d5dc683c36e))

# [1.29.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.28.0...@standardnotes/services@1.29.0) (2022-10-11)

### Features

* **api:** add access level to invitation requests ([49b3d27](https://github.com/standardnotes/app/commit/49b3d2714fbe4ac9f9242097b8df6b4e3d604513))

# [1.28.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.27.1...@standardnotes/services@1.28.0) (2022-10-11)

### Features

* **api:** add accepting invites to workspace ([15e2c82](https://github.com/standardnotes/app/commit/15e2c82e654ce3f983cd42b01f14d18435b3e939))
* **api:** add listing workspaces ([8376381](https://github.com/standardnotes/app/commit/837638198112df24c30e53803a7ddf5f841975b0))

## [1.27.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.27.0...@standardnotes/services@1.27.1) (2022-10-10)

### Bug Fixes

* dark mode not working in editors ([#1773](https://github.com/standardnotes/app/issues/1773)) ([27d2c95](https://github.com/standardnotes/app/commit/27d2c95b5b82645bf6c0372979f05236c83a10f6))

# [1.27.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.26.0...@standardnotes/services@1.27.0) (2022-10-10)

### Bug Fixes

* **api:** workspace creation arguments ([a275a45](https://github.com/standardnotes/app/commit/a275a45753abc4a29a89de5fe784260165297bbe))
* linter issues ([e2e7605](https://github.com/standardnotes/app/commit/e2e76054142e8d67cac69280e2a3efcb15cf67f1))

### Features

* **api:** add inviting to workspace ([158ca6a](https://github.com/standardnotes/app/commit/158ca6ac6a428e082c8f984791f80fcaadcb3e34))

# [1.26.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.25.0...@standardnotes/services@1.26.0) (2022-10-07)

### Features

* **api:** add workspaces api ([#1765](https://github.com/standardnotes/app/issues/1765)) ([01ba715](https://github.com/standardnotes/app/commit/01ba715eba987a7da1ee062fec0b3593a7a453ed))

# [1.25.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.24.3...@standardnotes/services@1.25.0) (2022-10-06)

### Features

* experimental 005 operator ([#1753](https://github.com/standardnotes/app/issues/1753)) ([cbbe913](https://github.com/standardnotes/app/commit/cbbe913cd6eb694dd27997927bd5c45e8a64cc09))

## [1.24.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.24.2...@standardnotes/services@1.24.3) (2022-10-05)

**Note:** Version bump only for package @standardnotes/services

## [1.24.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.24.1...@standardnotes/services@1.24.2) (2022-10-05)

**Note:** Version bump only for package @standardnotes/services

## [1.24.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.24.0...@standardnotes/services@1.24.1) (2022-10-03)

**Note:** Version bump only for package @standardnotes/services

# [1.24.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.23.0...@standardnotes/services@1.24.0) (2022-10-02)

### Features

* use native preview for pdf in mobile webview ([#1728](https://github.com/standardnotes/app/issues/1728)) ([a90e4a5](https://github.com/standardnotes/app/commit/a90e4a50e820aa13b6af1f76ee9b2f935d12f211))

# [1.23.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.22.4...@standardnotes/services@1.23.0) (2022-09-30)

### Features

* sync android status bar bg with theme bg color ([#1727](https://github.com/standardnotes/app/issues/1727)) ([47106fd](https://github.com/standardnotes/app/commit/47106fdf83ec89e67444e84a94350870645993cf))

## [1.22.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.22.3...@standardnotes/services@1.22.4) (2022-09-30)

**Note:** Version bump only for package @standardnotes/services

## [1.22.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.22.2...@standardnotes/services@1.22.3) (2022-09-29)

**Note:** Version bump only for package @standardnotes/services

## [1.22.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.22.1...@standardnotes/services@1.22.2) (2022-09-29)

**Note:** Version bump only for package @standardnotes/services

## [1.22.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.22.0...@standardnotes/services@1.22.1) (2022-09-28)

**Note:** Version bump only for package @standardnotes/services

# [1.22.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.21.5...@standardnotes/services@1.22.0) (2022-09-28)

### Features

* handle android back button on android ([#1656](https://github.com/standardnotes/app/issues/1656)) ([981d8a7](https://github.com/standardnotes/app/commit/981d8a7497ea2600e1535ad9170cb5559550ca4d))

## [1.21.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.21.4...@standardnotes/services@1.21.5) (2022-09-27)

### Bug Fixes

* export/sharing notes on mobile webview ([#1644](https://github.com/standardnotes/app/issues/1644)) ([6d5ebde](https://github.com/standardnotes/app/commit/6d5ebdeaa1777f31878b6e7d4dfc33fe83abc9fc))

## [1.21.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.21.3...@standardnotes/services@1.21.4) (2022-09-24)

**Note:** Version bump only for package @standardnotes/services

## [1.21.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.21.2...@standardnotes/services@1.21.3) (2022-09-23)

### Bug Fixes

* **mobile:** adjust status bar color to match current theme ([#1624](https://github.com/standardnotes/app/issues/1624)) ([4d5429c](https://github.com/standardnotes/app/commit/4d5429cc89c15f870825f20e97844825102c6aec))

## [1.21.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.21.1...@standardnotes/services@1.21.2) (2022-09-20)

### Bug Fixes

* move wrapped storage to unwrapped if not encrypted ([#1603](https://github.com/standardnotes/app/issues/1603)) ([c5e225d](https://github.com/standardnotes/app/commit/c5e225d335537257f44168b8ad05222afccb508a))

## [1.21.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.21.0...@standardnotes/services@1.21.1) (2022-09-20)

**Note:** Version bump only for package @standardnotes/services

# [1.21.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.20.2...@standardnotes/services@1.21.0) (2022-09-19)

### Features

* mobile web bridge ([#1597](https://github.com/standardnotes/app/issues/1597)) ([c4d7761](https://github.com/standardnotes/app/commit/c4d776149677269bc766f24da6adc5ec816dbcfb))

## [1.20.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.20.1...@standardnotes/services@1.20.2) (2022-09-15)

### Bug Fixes

* biometrics input on mobile webview challenge modal ([#1572](https://github.com/standardnotes/app/issues/1572)) ([3a15142](https://github.com/standardnotes/app/commit/3a15142940ef9391868442e1997c3d9d5eec33be))

## [1.20.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.20.0...@standardnotes/services@1.20.1) (2022-09-15)

**Note:** Version bump only for package @standardnotes/services

# [1.20.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.19.1...@standardnotes/services@1.20.0) (2022-09-14)

### Features

* mobile security prefs ([#1496](https://github.com/standardnotes/app/issues/1496)) ([d7aca2c](https://github.com/standardnotes/app/commit/d7aca2c13a99b81c2ee9d36a09f670b0a4c61bd1))

## [1.19.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.19.0...@standardnotes/services@1.19.1) (2022-09-13)

**Note:** Version bump only for package @standardnotes/services

# [1.19.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.18.0...@standardnotes/services@1.19.0) (2022-09-13)

### Features

* add subscription manager to handle subscription sharing ([#1517](https://github.com/standardnotes/app/issues/1517)) ([55b1409](https://github.com/standardnotes/app/commit/55b1409a805c21ada70bf482a02cfe718a4c6576))

# [1.18.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.17.4...@standardnotes/services@1.18.0) (2022-09-09)

### Features

* **mobile:** add setting to always open web view on launch ([#1500](https://github.com/standardnotes/app/issues/1500)) ([320fc3f](https://github.com/standardnotes/app/commit/320fc3fd9630731aabc9ecf30999afa7b74c277f))

## [1.17.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.17.3...@standardnotes/services@1.17.4) (2022-09-01)

**Note:** Version bump only for package @standardnotes/services

## [1.17.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.17.2...@standardnotes/services@1.17.3) (2022-08-31)

**Note:** Version bump only for package @standardnotes/services

## [1.17.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.17.1...@standardnotes/services@1.17.2) (2022-08-23)

### Bug Fixes

* **services:** counting trashed and archived items ([7bff3de](https://github.com/standardnotes/app/commit/7bff3dee24d058be91cb278b09692b4ff4396106))

## [1.17.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.17.0...@standardnotes/services@1.17.1) (2022-08-23)

### Bug Fixes

* **web:** archived and deleted counts on encryption panel ([#1423](https://github.com/standardnotes/app/issues/1423)) ([2bdd931](https://github.com/standardnotes/app/commit/2bdd931f6dcd876b1659c5d7d045effa26e18a20))

# [1.17.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.16.5...@standardnotes/services@1.17.0) (2022-08-05)

### Features

* **encryption:** refactor circular dependencies on services ([ffb2193](https://github.com/standardnotes/app/commit/ffb21939246eb81eba3230ff8c0d68e7a6cb2bcb))
* **files:** refactor circular deps ([696b82b](https://github.com/standardnotes/app/commit/696b82b9d392e146db5894462aeb56d91ac2a92c))
* **web:** extract ui-services package ([7e25126](https://github.com/standardnotes/app/commit/7e251262d770cfc9d791115b9c18b862c49e4e03))

## [1.16.5](https://github.com/standardnotes/app/compare/@standardnotes/services@1.16.4...@standardnotes/services@1.16.5) (2022-07-13)

### Bug Fixes

* upgrade jest with types to latest version ([09e08ca](https://github.com/standardnotes/app/commit/09e08ca899ba8694cf43292e918c4c204c0d2cb9))
* upgrade ts-jest in packages ([71e792d](https://github.com/standardnotes/app/commit/71e792da354ff90335b92758e196075a0f88d060))

## [1.16.4](https://github.com/standardnotes/app/compare/@standardnotes/services@1.16.3...@standardnotes/services@1.16.4) (2022-07-08)

**Note:** Version bump only for package @standardnotes/services

## [1.16.3](https://github.com/standardnotes/app/compare/@standardnotes/services@1.16.2...@standardnotes/services@1.16.3) (2022-07-06)

**Note:** Version bump only for package @standardnotes/services

## [1.16.2](https://github.com/standardnotes/app/compare/@standardnotes/services@1.16.1...@standardnotes/services@1.16.2) (2022-07-06)

**Note:** Version bump only for package @standardnotes/services

## [1.16.1](https://github.com/standardnotes/app/compare/@standardnotes/services@1.16.0...@standardnotes/services@1.16.1) (2022-07-06)

**Note:** Version bump only for package @standardnotes/services

# [1.16.0](https://github.com/standardnotes/app/compare/@standardnotes/services@1.15.0...@standardnotes/services@1.16.0) (2022-07-06)

### Bug Fixes

* not supported auth dependency ([46fe662](https://github.com/standardnotes/app/commit/46fe66256b4cddd70c5401958d29e879a42e431d))

### Features

* add utils package ([aef4ceb](https://github.com/standardnotes/app/commit/aef4ceb7f85948f1f08b8b09a4db5d187daa371b))

# 1.15.0 (2022-07-05)

### Features

* add services package ([fbfed0a](https://github.com/standardnotes/app/commit/fbfed0a05cd5eb6ec4d5579012971e4495e04a30))

## [1.13.25](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.24...@standardnotes/services@1.13.25) (2022-07-05)

**Note:** Version bump only for package @standardnotes/services

## [1.13.24](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.23...@standardnotes/services@1.13.24) (2022-07-04)

### Bug Fixes

* add missing reflect-metadata package to all packages ([ce3a5bb](https://github.com/standardnotes/snjs/commit/ce3a5bbf3f1d2276ac4abc3eec3c6a44c8c3ba9b))

## [1.13.23](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.22...@standardnotes/services@1.13.23) (2022-06-29)

**Note:** Version bump only for package @standardnotes/services

## [1.13.22](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.21...@standardnotes/services@1.13.22) (2022-06-27)

**Note:** Version bump only for package @standardnotes/services

## [1.13.21](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.20...@standardnotes/services@1.13.21) (2022-06-27)

**Note:** Version bump only for package @standardnotes/services

## [1.13.20](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.19...@standardnotes/services@1.13.20) (2022-06-22)

### Bug Fixes

* mobile keychain types ([#769](https://github.com/standardnotes/snjs/issues/769)) ([1fa6fb5](https://github.com/standardnotes/snjs/commit/1fa6fb57e398e60c27041b826540b6a1a6de5e91))

## [1.13.19](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.18...@standardnotes/services@1.13.19) (2022-06-20)

**Note:** Version bump only for package @standardnotes/services

## [1.13.18](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.17...@standardnotes/services@1.13.18) (2022-06-16)

**Note:** Version bump only for package @standardnotes/services

## [1.13.17](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.16...@standardnotes/services@1.13.17) (2022-06-16)

**Note:** Version bump only for package @standardnotes/services

## [1.13.16](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.15...@standardnotes/services@1.13.16) (2022-06-15)

**Note:** Version bump only for package @standardnotes/services

## [1.13.15](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.14...@standardnotes/services@1.13.15) (2022-06-10)

**Note:** Version bump only for package @standardnotes/services

## [1.13.14](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.13...@standardnotes/services@1.13.14) (2022-06-09)

**Note:** Version bump only for package @standardnotes/services

## [1.13.13](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.12...@standardnotes/services@1.13.13) (2022-06-09)

**Note:** Version bump only for package @standardnotes/services

## [1.13.12](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.11...@standardnotes/services@1.13.12) (2022-06-09)

**Note:** Version bump only for package @standardnotes/services

## [1.13.11](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.10...@standardnotes/services@1.13.11) (2022-06-06)

**Note:** Version bump only for package @standardnotes/services

## [1.13.10](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.9...@standardnotes/services@1.13.10) (2022-06-03)

**Note:** Version bump only for package @standardnotes/services

## [1.13.9](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.8...@standardnotes/services@1.13.9) (2022-06-02)

**Note:** Version bump only for package @standardnotes/services

## [1.13.8](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.7...@standardnotes/services@1.13.8) (2022-06-02)

**Note:** Version bump only for package @standardnotes/services

## [1.13.7](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.6...@standardnotes/services@1.13.7) (2022-06-01)

**Note:** Version bump only for package @standardnotes/services

## [1.13.6](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.5...@standardnotes/services@1.13.6) (2022-05-30)

**Note:** Version bump only for package @standardnotes/services

## [1.13.5](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.4...@standardnotes/services@1.13.5) (2022-05-27)

**Note:** Version bump only for package @standardnotes/services

## [1.13.4](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.3...@standardnotes/services@1.13.4) (2022-05-27)

**Note:** Version bump only for package @standardnotes/services

## [1.13.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.2...@standardnotes/services@1.13.3) (2022-05-24)

**Note:** Version bump only for package @standardnotes/services

## [1.13.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.1...@standardnotes/services@1.13.2) (2022-05-24)

**Note:** Version bump only for package @standardnotes/services

## [1.13.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.13.0...@standardnotes/services@1.13.1) (2022-05-22)

**Note:** Version bump only for package @standardnotes/services

# [1.13.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.12.2...@standardnotes/services@1.13.0) (2022-05-21)

### Features

* display controllers ([#743](https://github.com/standardnotes/snjs/issues/743)) ([5fadce3](https://github.com/standardnotes/snjs/commit/5fadce37f1b3f2f51b8a90c257bc666ac7710074))

## [1.12.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.12.1...@standardnotes/services@1.12.2) (2022-05-20)

**Note:** Version bump only for package @standardnotes/services

## [1.12.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.12.0...@standardnotes/services@1.12.1) (2022-05-20)

**Note:** Version bump only for package @standardnotes/services

# [1.12.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.9...@standardnotes/services@1.12.0) (2022-05-20)

### Features

* authentication with PKCE mechanism ([#719](https://github.com/standardnotes/snjs/issues/719)) ([1bc19b7](https://github.com/standardnotes/snjs/commit/1bc19b79decf83a563d1cf095ee2e56f738152d1))

## [1.11.9](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.8...@standardnotes/services@1.11.9) (2022-05-18)

**Note:** Version bump only for package @standardnotes/services

## [1.11.8](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.7...@standardnotes/services@1.11.8) (2022-05-17)

### Bug Fixes

* workspace signout all ([0ac4501](https://github.com/standardnotes/snjs/commit/0ac45019428946016ef02384b07b8190378008fc))

## [1.11.7](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.6...@standardnotes/services@1.11.7) (2022-05-17)

**Note:** Version bump only for package @standardnotes/services

## [1.11.6](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.5...@standardnotes/services@1.11.6) (2022-05-17)

**Note:** Version bump only for package @standardnotes/services

## [1.11.5](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.4...@standardnotes/services@1.11.5) (2022-05-16)

**Note:** Version bump only for package @standardnotes/services

## [1.11.4](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.3...@standardnotes/services@1.11.4) (2022-05-16)

**Note:** Version bump only for package @standardnotes/services

## [1.11.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.2...@standardnotes/services@1.11.3) (2022-05-16)

**Note:** Version bump only for package @standardnotes/services

## [1.11.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.1...@standardnotes/services@1.11.2) (2022-05-13)

**Note:** Version bump only for package @standardnotes/services

## [1.11.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.11.0...@standardnotes/services@1.11.1) (2022-05-12)

**Note:** Version bump only for package @standardnotes/services

# [1.11.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.11...@standardnotes/services@1.11.0) (2022-05-12)

### Features

* file desktop backups ([#731](https://github.com/standardnotes/snjs/issues/731)) ([0dbce7d](https://github.com/standardnotes/snjs/commit/0dbce7dc9712fde848445b951079c81479c8bc11))

## [1.10.11](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.10...@standardnotes/services@1.10.11) (2022-05-12)

**Note:** Version bump only for package @standardnotes/services

## [1.10.10](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.9...@standardnotes/services@1.10.10) (2022-05-12)

**Note:** Version bump only for package @standardnotes/services

## [1.10.9](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.8...@standardnotes/services@1.10.9) (2022-05-09)

**Note:** Version bump only for package @standardnotes/services

## [1.10.8](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.7...@standardnotes/services@1.10.8) (2022-05-09)

**Note:** Version bump only for package @standardnotes/services

## [1.10.7](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.6...@standardnotes/services@1.10.7) (2022-05-06)

**Note:** Version bump only for package @standardnotes/services

## [1.10.6](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.5...@standardnotes/services@1.10.6) (2022-05-06)

**Note:** Version bump only for package @standardnotes/services

## [1.10.5](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.4...@standardnotes/services@1.10.5) (2022-05-05)

**Note:** Version bump only for package @standardnotes/services

## [1.10.4](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.2...@standardnotes/services@1.10.4) (2022-05-04)

### Bug Fixes

* config package missing dependencies ([3dec12f](https://github.com/standardnotes/snjs/commit/3dec12fa4a83a8aed8419819eafb7c34795cb09f))

## [1.10.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.2...@standardnotes/services@1.10.3) (2022-05-04)

### Bug Fixes

* config package missing dependencies ([3dec12f](https://github.com/standardnotes/snjs/commit/3dec12fa4a83a8aed8419819eafb7c34795cb09f))

## [1.10.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.1...@standardnotes/services@1.10.2) (2022-05-03)

**Note:** Version bump only for package @standardnotes/services

## [1.10.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.10.0...@standardnotes/services@1.10.1) (2022-05-02)

**Note:** Version bump only for package @standardnotes/services

# [1.10.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.15...@standardnotes/services@1.10.0) (2022-04-29)

### Features

* service diagnostics ([#718](https://github.com/standardnotes/snjs/issues/718)) ([17cf40f](https://github.com/standardnotes/snjs/commit/17cf40f4489c8f1915b19c0318d252cf83bc050d))

## [1.9.15](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.14...@standardnotes/services@1.9.15) (2022-04-28)

**Note:** Version bump only for package @standardnotes/services

## [1.9.14](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.13...@standardnotes/services@1.9.14) (2022-04-27)

**Note:** Version bump only for package @standardnotes/services

## [1.9.13](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.12...@standardnotes/services@1.9.13) (2022-04-27)

**Note:** Version bump only for package @standardnotes/services

## [1.9.12](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.11...@standardnotes/services@1.9.12) (2022-04-27)

**Note:** Version bump only for package @standardnotes/services

## [1.9.11](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.10...@standardnotes/services@1.9.11) (2022-04-25)

**Note:** Version bump only for package @standardnotes/services

## [1.9.10](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.9...@standardnotes/services@1.9.10) (2022-04-22)

**Note:** Version bump only for package @standardnotes/services

## [1.9.9](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.8...@standardnotes/services@1.9.9) (2022-04-22)

**Note:** Version bump only for package @standardnotes/services

## [1.9.8](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.7...@standardnotes/services@1.9.8) (2022-04-21)

### Bug Fixes

* abort key recovery after aborted challenge ([#703](https://github.com/standardnotes/snjs/issues/703)) ([a67fb7e](https://github.com/standardnotes/snjs/commit/a67fb7e8cde41a5c9fadf545933e35d525faeaf0))

## [1.9.7](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.6...@standardnotes/services@1.9.7) (2022-04-20)

**Note:** Version bump only for package @standardnotes/services

## [1.9.6](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.5...@standardnotes/services@1.9.6) (2022-04-20)

**Note:** Version bump only for package @standardnotes/services

## [1.9.5](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.4...@standardnotes/services@1.9.5) (2022-04-19)

**Note:** Version bump only for package @standardnotes/services

## [1.9.4](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.3...@standardnotes/services@1.9.4) (2022-04-19)

**Note:** Version bump only for package @standardnotes/services

## [1.9.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.2...@standardnotes/services@1.9.3) (2022-04-19)

**Note:** Version bump only for package @standardnotes/services

## [1.9.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.1...@standardnotes/services@1.9.2) (2022-04-18)

### Bug Fixes

* make timestamps required in payload construction ([#695](https://github.com/standardnotes/snjs/issues/695)) ([b3326c0](https://github.com/standardnotes/snjs/commit/b3326c0a998cd9d44a76afc377f182885ef48275))

## [1.9.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.9.0...@standardnotes/services@1.9.1) (2022-04-15)

**Note:** Version bump only for package @standardnotes/services

# [1.9.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.8.6...@standardnotes/services@1.9.0) (2022-04-15)

### Features

* no merge payloads in payload manager ([#693](https://github.com/standardnotes/snjs/issues/693)) ([68a577c](https://github.com/standardnotes/snjs/commit/68a577cb887fd2d5556dc9ddec461f6ae665fcb6))

## [1.8.6](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.8.5...@standardnotes/services@1.8.6) (2022-04-15)

**Note:** Version bump only for package @standardnotes/services

## [1.8.5](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.8.4...@standardnotes/services@1.8.5) (2022-04-14)

**Note:** Version bump only for package @standardnotes/services

## [1.8.4](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.8.3...@standardnotes/services@1.8.4) (2022-04-13)

**Note:** Version bump only for package @standardnotes/services

## [1.8.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.8.2...@standardnotes/services@1.8.3) (2022-04-12)

**Note:** Version bump only for package @standardnotes/services

## [1.8.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.8.1...@standardnotes/services@1.8.2) (2022-04-11)

**Note:** Version bump only for package @standardnotes/services

## [1.8.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.8.0...@standardnotes/services@1.8.1) (2022-04-01)

**Note:** Version bump only for package @standardnotes/services

# [1.8.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.7.2...@standardnotes/services@1.8.0) (2022-04-01)

### Features

* content interfaces and model type strictness ([#685](https://github.com/standardnotes/snjs/issues/685)) ([e2450c5](https://github.com/standardnotes/snjs/commit/e2450c59e8309d7080efaa03905b2abc728d9403))

## [1.7.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.7.1...@standardnotes/services@1.7.2) (2022-04-01)

**Note:** Version bump only for package @standardnotes/services

## [1.7.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.7.0...@standardnotes/services@1.7.1) (2022-03-31)

**Note:** Version bump only for package @standardnotes/services

# [1.7.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.14...@standardnotes/services@1.7.0) (2022-03-31)

### Features

* encryption and models packages ([#679](https://github.com/standardnotes/snjs/issues/679)) ([5e03d48](https://github.com/standardnotes/snjs/commit/5e03d48aba7e3dd266117201139ab869b1f70cc9))

## [1.6.14](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.13...@standardnotes/services@1.6.14) (2022-03-31)

**Note:** Version bump only for package @standardnotes/services

## [1.6.13](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.12...@standardnotes/services@1.6.13) (2022-03-30)

**Note:** Version bump only for package @standardnotes/services

## [1.6.12](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.11...@standardnotes/services@1.6.12) (2022-03-25)

**Note:** Version bump only for package @standardnotes/services

## [1.6.11](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.10...@standardnotes/services@1.6.11) (2022-03-24)

**Note:** Version bump only for package @standardnotes/services

## [1.6.10](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.9...@standardnotes/services@1.6.10) (2022-03-23)

**Note:** Version bump only for package @standardnotes/services

## [1.6.9](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.8...@standardnotes/services@1.6.9) (2022-03-23)

**Note:** Version bump only for package @standardnotes/services

## [1.6.8](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.7...@standardnotes/services@1.6.8) (2022-03-22)

**Note:** Version bump only for package @standardnotes/services

## [1.6.7](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.6...@standardnotes/services@1.6.7) (2022-03-21)

**Note:** Version bump only for package @standardnotes/services

## [1.6.6](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.5...@standardnotes/services@1.6.6) (2022-03-21)

**Note:** Version bump only for package @standardnotes/services

## [1.6.5](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.4...@standardnotes/services@1.6.5) (2022-03-21)

**Note:** Version bump only for package @standardnotes/services

## [1.6.4](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.3...@standardnotes/services@1.6.4) (2022-03-18)

**Note:** Version bump only for package @standardnotes/services

## [1.6.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.2...@standardnotes/services@1.6.3) (2022-03-16)

**Note:** Version bump only for package @standardnotes/services

## [1.6.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.0...@standardnotes/services@1.6.2) (2022-03-16)

**Note:** Version bump only for package @standardnotes/services

## [1.6.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.6.0...@standardnotes/services@1.6.1) (2022-03-16)

**Note:** Version bump only for package @standardnotes/services

# [1.6.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.12...@standardnotes/services@1.6.0) (2022-03-14)

### Features

* move vault into applications package ([#653](https://github.com/standardnotes/snjs/issues/653)) ([3d320eb](https://github.com/standardnotes/snjs/commit/3d320eb51ac74729ab8864f1c4c4f24d8fb794d5))

## [1.5.12](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.11...@standardnotes/services@1.5.12) (2022-03-11)

**Note:** Version bump only for package @standardnotes/services

## [1.5.11](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.10...@standardnotes/services@1.5.11) (2022-03-11)

**Note:** Version bump only for package @standardnotes/services

## [1.5.10](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.9...@standardnotes/services@1.5.10) (2022-03-11)

**Note:** Version bump only for package @standardnotes/services

## [1.5.9](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.8...@standardnotes/services@1.5.9) (2022-03-10)

**Note:** Version bump only for package @standardnotes/services

## [1.5.8](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.7...@standardnotes/services@1.5.8) (2022-03-10)

**Note:** Version bump only for package @standardnotes/services

## [1.5.7](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.6...@standardnotes/services@1.5.7) (2022-03-10)

**Note:** Version bump only for package @standardnotes/services

## [1.5.6](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.5...@standardnotes/services@1.5.6) (2022-03-09)

**Note:** Version bump only for package @standardnotes/services

## [1.5.5](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.4...@standardnotes/services@1.5.5) (2022-03-09)

**Note:** Version bump only for package @standardnotes/services

## [1.5.4](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.3...@standardnotes/services@1.5.4) (2022-03-08)

**Note:** Version bump only for package @standardnotes/services

## [1.5.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.2...@standardnotes/services@1.5.3) (2022-03-08)

**Note:** Version bump only for package @standardnotes/services

## [1.5.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.1...@standardnotes/services@1.5.2) (2022-03-08)

**Note:** Version bump only for package @standardnotes/services

## [1.5.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.5.0...@standardnotes/services@1.5.1) (2022-03-07)

**Note:** Version bump only for package @standardnotes/services

# [1.5.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.4.0...@standardnotes/services@1.5.0) (2022-03-07)

### Features

* integrity service ([#626](https://github.com/standardnotes/snjs/issues/626)) ([c5854fb](https://github.com/standardnotes/snjs/commit/c5854fb912dbe585516eeac3dde73573586c4e67))

# [1.4.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.3.0...@standardnotes/services@1.4.0) (2022-03-02)

### Features

* inject internal event bus to services for seamless event publishing ([#624](https://github.com/standardnotes/snjs/issues/624)) ([24b1e5c](https://github.com/standardnotes/snjs/commit/24b1e5c3e5ffe3c8ff228b97e91b83cb6c4077a5))

# [1.3.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.2.3...@standardnotes/services@1.3.0) (2022-03-02)

### Features

* add internal events handling between services ([#620](https://github.com/standardnotes/snjs/issues/620)) ([d982e36](https://github.com/standardnotes/snjs/commit/d982e365eda5268b6df339e9e0fe926a4808d86f))

## [1.2.3](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.2.1...@standardnotes/services@1.2.3) (2022-02-28)

### Bug Fixes

* add pseudo change to get lerna to trigger ([41e6817](https://github.com/standardnotes/snjs/commit/41e6817bbf726b0932cdf16f58622328b9e42803))

## [1.2.2](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.2.1...@standardnotes/services@1.2.2) (2022-02-28)

### Bug Fixes

* add pseudo change to get lerna to trigger ([41e6817](https://github.com/standardnotes/snjs/commit/41e6817bbf726b0932cdf16f58622328b9e42803))

## [1.2.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.2.0...@standardnotes/services@1.2.1) (2022-02-27)

**Note:** Version bump only for package @standardnotes/services

# [1.2.0](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.1.1...@standardnotes/services@1.2.0) (2022-02-25)

### Features

* extract core functionalities to separate packages ([#610](https://github.com/standardnotes/snjs/issues/610)) ([801547a](https://github.com/standardnotes/snjs/commit/801547a71614ad51a92fb249eaa184ed46a44aac))

## [1.1.1](https://github.com/standardnotes/snjs/compare/@standardnotes/services@1.1.0...@standardnotes/services@1.1.1) (2022-02-24)

**Note:** Version bump only for package @standardnotes/services

# 1.1.0 (2022-02-22)

### Features

* extract services package ([#605](https://github.com/standardnotes/snjs/issues/605)) ([3966b10](https://github.com/standardnotes/snjs/commit/3966b10745c10ef5bb92871abb13ceb4ea631362))
