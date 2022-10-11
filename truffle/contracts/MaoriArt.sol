// SPDX-License-Identifier: MIT
pragma solidity 0.8.17; // ^0.4.18, the ^ says use this exact version of solidity

contract MaoriArt {
  string ipfsHash;

  // set
  function write(string memory newValue) public {
    ipfsHash = newValue; 
  }

  // get
  function read() public view returns (string memory) {
    return ipfsHash;
  }
}
