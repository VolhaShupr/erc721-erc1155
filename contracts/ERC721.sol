//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Sample is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    constructor() ERC721("NFTSample721", "S721") {}

    function safeMint(address recipient, string memory tokenURI) external returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();

        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

}
