# Subgraph Template

## Getting started: 

### Installation:
Run `yarn install` - make sure you have installed `yarn` globally (`npm i -g yarn`)

### Hosted Subgraphs:

Create an [The Graph](https://thegraph.com) account and and [create a new Subgraph](https://thegraph.com/docs/en/).

## Running Local Graph Node

Open the `docker-compose.yml` file and edit the `ethereum` node url you want to use.

- After cloning the repository and making sure you have `Docker` installed and running,
open the `docker-compose.yml` file and edit the `ethereum` node url you want to use. (ex: alchemy)
```sh
docker-compose build # building all the necessary images
```

- Run the Local Graph Node via:
```sh
docker-compose up
```

Note: In order to sync the graph node from scratch on subsequent runs the `data/` directory has to be manually deleted.

## Development

There are `npm scripts` for all the stages of subgraph development.

### Building the subgraph (code generation + creating the subgraph):
`yarn build`

### Deploy the Subgraph:
`CONFIG=<CONFIG_FILE_NAME> NETWORK=<NETWORK> TARGET=<TARGET> yarn deploy`

- CONFIG: `mainnet.json`, `goerli.json`
- NETWORK: `local`, `mainnet`, `goerli`
- TARGET: `local`, `remote`, `studio`, `hosted-service` (optional)

In order to deploy to a remote node the `IPFS_NODE` and `GRAPH_NODE` has to be set:

`IPFS_NODE=<IPFS_NODE_URL> GRAPH_NODE=<GRAPH_NODE_URL CONFIG=<CONFIG_FILE_NAME> NETWORK=<NETWORK> yarn deploy`

In order to deploy to the hosted service the `ACCESS_TOKEN` has to be set:

`ACCESS_TOKEN=<THE_GRAPH_ACCESS_TOKEN> CONFIG=<CONFIG_FILE_NAME> NETWORK=<NETWORK> yarn deploy`
