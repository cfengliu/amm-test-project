# AMM Test Project

This is the smart contract where users can perform token swap.

## Usage

Before running any command, you need to create a .env file and set a BIP-39 compatible mnemonic as an environment variable. Follow the example in .env.example. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

### Deploy

```sh
$ npx hardhat run ./scripts/AMMSelector/deploy.ts --network kovan
```

### Edit address.json

copy and paste the contract address to address.json after contract deployment

### Approve the contract

```sh
$ npx hardhat run ./scripts/AMMSelector/approve.ts --network kovan
```

### Preview the amount

```sh
$ npx hardhat run ./scripts/AMMSelector/preview.ts --network kovan
```

### Swap token

```sh
$ npx hardhat run ./scripts/AMMSelector/swap.ts --network kovan
```
