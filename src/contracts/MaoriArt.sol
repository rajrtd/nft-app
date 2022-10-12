// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract MaoriArt {
    string artHash;
    string artName;
    string artistName;

    function writeToBlockchain(string memory _artHash, string memory _artName, string memory _artistName) public {
        artHash = _artHash;
        artName = _artName;
        artistName = _artistName;
    }

    function readFromBlockchain() view public returns (string memory) {
        string memory art = string.concat(string.concat(artHash, ' '), string.concat(artName, ' '), artistName);
        return art;
    }
}
 