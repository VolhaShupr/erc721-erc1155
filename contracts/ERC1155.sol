//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Sample is ERC1155, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    string public name = "NFTSample1155";
    string public symbol = "S1155";

    constructor() ERC1155(
        "https://bafybeigbjiopxipuzpj72lvbcrj7pbgezs4pmty2fpljgfhz65im6whlly.ipfs.nftstorage.link/metadata/{id}.json"
    ) {}

    function updateURI(string memory newURI) external onlyOwner {
        _setURI(newURI);
    }

    function mint(address recipient, uint256 amount) external onlyOwner {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();

        _mint(recipient, newItemId, amount, "");
    }

    function mintBatch(address recipient, uint256[] memory amounts) external onlyOwner {
        uint256[] memory ids = new uint256[](amounts.length);
        for (uint256 i = 0; i < ids.length; i++) {
            currentTokenId.increment();
            ids[i] = currentTokenId.current();
        }

        _mintBatch(recipient, ids, amounts, "");
    }


}
