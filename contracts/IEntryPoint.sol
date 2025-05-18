// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./UserOperation.sol";

interface IEntryPoint {
    function depositTo(address account) external payable;
    function getUserOpHash(UserOperation calldata userOp) external view returns (bytes32);
}
