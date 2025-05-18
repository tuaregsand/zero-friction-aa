// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IAccount.sol";
import "./IEntryPoint.sol";
import "./UserOperation.sol";

abstract contract BaseAccount is IAccount {
    IEntryPoint private immutable _entryPoint;

    constructor(IEntryPoint entryPoint_) {
        _entryPoint = entryPoint_;
    }

    function entryPoint() public view returns (IEntryPoint) {
        return _entryPoint;
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external override returns (uint256 validationData) {
        require(msg.sender == address(_entryPoint), "BA:not entrypoint");
        validationData = _validateAndUpdateNonce(userOp);
        if (validationData == 0) {
            validationData = _validateSignature(userOp, userOpHash);
        }
        if (missingAccountFunds != 0) {
            _entryPoint.depositTo{value: missingAccountFunds}(address(this));
        }
    }

    function _validateAndUpdateNonce(UserOperation calldata userOp)
        internal
        virtual
        returns (uint256 validationData);

    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal
        view
        virtual
        returns (uint256 validationData);
}
