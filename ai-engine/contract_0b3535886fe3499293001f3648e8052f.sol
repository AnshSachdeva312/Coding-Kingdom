// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "No funds to withdraw");

        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");  // ⚠️ Reentrancy
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    function destroy() public {
        selfdestruct(payable(msg.sender));  // ⚠️ No access control
    }
}