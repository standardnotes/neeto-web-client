# Standard Notes

#### Table of Contents
- [Why Standard Notes?](#why-standard-notes)
- [Creating your private notes account](#creating-your-private-notes-account)
- [Publish a Blog](#publish-a-blog)
- [Community](#community)
- [FAQ's](#faqs)
- [Docker setup](#docker-setup)
- [Running Web App in Development Mode](#running-web-app-in-development-mode)

Standard Notes is an end-to-end encrypted note-taking app for digitalists and professionals. Capture your notes, files, and life’s work all in one secure place.

[![latest release version](https://img.shields.io/github/v/release/standardnotes/app)](https://github.com/standardnotes/app/releases)
[![Discord](https://img.shields.io/badge/discord-standardnotes-CC2B5E.svg?style=flat&logo=discord)](https://standardnotes.com/discord)
[![Twitter Follow](https://img.shields.io/badge/follow-%40standardnotes-blue.svg?style=flat&logo=twitter)](https://twitter.com/standardnotes)

### Why Standard Notes?

Security without compromise. [Features.](https://standardnotes.com/features)

- End-to-end encrypted sync. Only you can read your notes.
- Fast, free, and encrypted cross-platform sync on unlimited devices.
- Public source code with ability to self-host your own server in a [few easy steps](https://standardnotes.com/help/self-hosting/getting-started).
- A strong focus on longevity and sustainability. [Learn more](https://standardnotes.com/longevity).

---

### Creating your private notes account

1. Launch the web app at [app.standardnotes.com](https://app.standardnotes.com).
2. Click Register to create your private notes account.
3. Download Standard Notes on your devices.
	- [Mac](https://standardnotes.com/download)
	- [Windows](https://standardnotes.com/download)
	- [Linux](https://standardnotes.com/download)
	- [iOS](https://itunes.apple.com/us/app/standard-notes/id1285392450?mt=8)
	- [Android](https://play.google.com/store/apps/details?id=com.standardnotes)
4. You're all set. Standard Notes comes out of the box with end-to-end encrypted sync on all your devices.

---

### Publish a Blog

Standard Notes is a dependable environment to do your most important work, including publishing your ideas to the world. Listed allows you to create an online publication with automatic email newsletters delivered to your readers, directly from Standard Notes.

[Learn more about Listed.](https://listed.to/)

---

### Community

Join us on

- [Discord](https://standardnotes.com/discord)
- [Twitter](https://twitter.com/StandardNotes)
- [Forum](https://standardnotes.com/forum)

Developers can create and publish their own extensions. Visit the [documentation hub](https://standardnotes.com/help/plugins/intro) to learn more.

---

### FAQ's

Questions? Find answers on our [Help page](https://standardnotes.com/help).

General - [I've forgotten my password. What should I do?](https://standardnotes.com/help/6/i-ve-forgotten-my-password-what-should-i-do)

Privacy & Longevity - [Who can read my private notes?](https://standardnotes.com/help/1/who-can-read-my-private-notes)

Usage - [What are note types and editors?](https://standardnotes.com/help/77/what-are-editors)

Subscription Account - [How do I manage/modify my subscription?](https://standardnotes.com/help/13/how-do-i-manage-modify-my-extended-subscription)

Two-factor Authentication - [How do I enable two-factor authentication for my account?](https://standardnotes.com/help/25/how-do-i-enable-two-factor-authentication-for-my-account)

Note History & Backups - [How do I enable note version history?](https://standardnotes.com/help/26/how-do-i-enable-note-version-history)

Self-hosting - [Can I self-host Standard Notes?](https://standardnotes.com/help/47/can-i-self-host-standard-notes)

Listed - [Creating a Blog From Your Notes with Listed and Standard Notes](https://standardnotes.com/help/60/creating-a-blog-from-your-notes-with-listed-and-standard-notes)

Plugins - [Introduction to plugins](https://standardnotes.com/help/plugins/intro)

---

### Self-hosting the web app

Our web app is compiled into a folder of static HTML, JS, and CSS files. You can serve these files behind a web server to get started:

1. `git clone https://github.com/standardnotes/app.git`
2. `cd app`
3. `yarn install`
4. `yarn build:web`
5. `cd packages/web`
6. You can then use Python to serve this folder over http: `python -m http.server 8080`

You can now access the app at `http://localhost:8080`.

[Learn more about Docker](https://standardnotes.com/help/self-hosting/docker).

### Running Web App in Development Mode

2. Clone the repo
3. `yarn install`
4. `yarn build:web`
5. `cd packages/web && yarn start`
6. Open your browser to `http://localhost:3001`.

---

You can configure the `DEFAULT_SYNC_SERVER` environment variable to set the default server for login and registration.

```
DEFAULT_SYNC_SERVER=https://sync.myserver
```
