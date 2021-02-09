# Workers [![Build Status][travis-image]][travis-url]
Main repository for Workers web-site. You can see instructions down here.

---

_Don't delete these files:_
_`.editorconfig`, `.gitattributes`, `.gitignore`, `package.json`._

---

## Installation
Use the package manager [npm](https://nodejs.org/en/download/) to install dependencies.
```bash
npm install

cd client/
npm install
cd ../
```

## Usage
To run dev server use. It will open server (api) and client (react) on ports 5000 and 8080.
```bash
npm run dev
```

Use tests before commits. Travis will check all commits.
```bash
npm test
```

[travis-image]: https://travis-ci.com/victormuryn/workers.svg?token=NyzPg9MpZbzo7JxssNTA&branch=main
[travis-url]: https://travis-ci.com/victormuryn/workers
