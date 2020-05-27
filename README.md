# GADI Example

## Prerequisites

* [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* [DAML SDK](https://docs.daml.com/getting-started/installation.html)

## Quick Start

Build DAML and UI:

    daml build
    daml codegen js -o daml2js .daml/dist/*.dar
    cd ui && yarn install --force --frozen-lockfile

Start the sandbox:

    daml start --start-navigator 'no'

Start the development server:

    cd ui && yarn start

Use the following parties to log into the app: ISSUER, SP, DAP, GADI, Alice, Bob

Note that the development server serves content via http and should not be exposed as is to a public-facing network.
