// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable {
    mapping(address => uint) balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        (bool success, ) = msg.sender.call{
            value: balances[msg.sender]
        }("");
        require(success);
        balances[msg.sender] = 0; // Reentrancy vulnerability
    }
}