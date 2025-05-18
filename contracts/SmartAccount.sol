// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseAccount.sol";
import "./ECDSA.sol";

contract SmartAccount is BaseAccount {
    using ECDSA for bytes32;

    address public owner;
    address public recovery;
    uint256 public nonce;

    constructor(address _owner, address _recovery, IEntryPoint _entryPoint) BaseAccount(_entryPoint) {
        owner = _owner;
        recovery = _recovery;
    }

    function execute(address to, uint256 value, bytes calldata data) external {
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "SA:not authorized");
        (bool ok,) = to.call{value: value}(data);
        require(ok, "SA:call failed");
    }

    function changeOwner(address newOwner) external {
        require(msg.sender == recovery, "SA:not recovery");
        owner = newOwner;
    }

    function _validateAndUpdateNonce(UserOperation calldata userOp)
        internal
        override
        returns (uint256 validationData)
    {
        if (userOp.nonce != nonce) {
            return 1;
        }
        nonce++;
        return 0;
    }

    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal
        view
        override
        returns (uint256 validationData)
    {
        address signer = userOpHash.toEthSignedMessageHash().recover(userOp.signature);
        if (signer != owner) {
            return 1;
        }
        return 0;
    }
}
