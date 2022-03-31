# 3 ERC-721, ERC-1155
Sample contracts

Links:
- [images storage](https://bafybeibvvwa2epl6ndnnvjhbrkx7evo4pxmuijnwst4jagotni7obsfsey.ipfs.nftstorage.link/images)
- [metadata storage](https://bafybeigbjiopxipuzpj72lvbcrj7pbgezs4pmty2fpljgfhz65im6whlly.ipfs.nftstorage.link/metadata)
- [etherscan ERC721](https://rinkeby.etherscan.io/address/0x680AD8A84881B332d458E1Dd626B0aEd06158E3b)
- [opensea ERC721 1](https://testnets.opensea.io/assets/0x680ad8a84881b332d458e1dd626b0aed06158e3b/1)
- [opensea ERC721 2](https://testnets.opensea.io/assets/0x680ad8a84881b332d458e1dd626b0aed06158e3b/2)
- [etherscan ERC1155](https://rinkeby.etherscan.io/address/0xbdb6e71e05a4829feee5e73096744251c0afebc8)


```shell
npx hardhat accounts
npx hardhat mint721
npx hardhat mint1155
npx hardhat mintBatch1155
npx hardhat updateURI1155

npx hardhat run --network rinkeby scripts/erc721.deploy.ts
npx hardhat run --network rinkeby scripts/erc1155.deploy.ts
npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS <arg>

npx hardhat test
npx hardhat coverage
npx hardhat size-contracts

npx hardhat help
npx hardhat node
npx hardhat compile
npx hardhat clean
```
