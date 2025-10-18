# Papilio

Papilio is another [Misskey](https://misskey.io/) client written in React.

Papilio is under active development, and new features are being added regularly. Feel free to explore the codebase and contribute to the project!

## Installation and Development

Papilio requires [Node.js](https://nodejs.org/) (version 22 or later) and [pnpm](https://pnpm.io/) to be installed on your system. You may also use [Bun](https://bun.sh/) as an alternative to Node.js and pnpm.

Clone the repository and install the dependencies by running:

```sh
pnpm install
```

To start the development server, run:

```sh
pnpm dev
```

And you can access the application at `http://localhost:5173`.

To build the project for production, run:

```sh
pnpm build
```

`dist/` directory will be created containing the built files. You can use a reverse proxy like [Caddy](https://caddyserver.com/) or [Nginx](https://nginx.org/) to serve the files.

## Vercel

Papilio is also deployed on [Vercel](https://vercel.com/) for easy access. You can visit the live version of Papilio at <https://papilio-ochre.vercel.app>

You may fork the repository and deploy your own version of Papilio on Vercel by connecting your forked repository to Vercel.