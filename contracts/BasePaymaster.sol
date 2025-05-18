// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IPaymaster.sol";
import "./IEntryPoint.sol";
import "./UserOperation.sol";

abstract contract BasePaymaster is IPaymaster {
    IEntryPoint private immutable _entryPoint;

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
    }

    function entryPoint() public view returns (IEntryPoint) {
        return _entryPoint;
    }

    function deposit() external payable {
        _entryPoint.depositTo{value: msg.value}(address(this));
    }

    modifier onlyEntryPoint() {
        require(msg.sender == address(_entryPoint), "BP:not entrypoint");
        _;
    }

    function validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
        external
        override
        onlyEntryPoint
        returns (bytes memory context, uint256 validationData)
    {
        return _validatePaymasterUserOp(userOp, userOpHash, maxCost);
    }

    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
        internal
        virtual
        returns (bytes memory context, uint256 validationData);

    function postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost)
        external
        payable
        override
        onlyEntryPoint
    {
        _postOp(mode, context, actualGasCost);
    }

    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal virtual;
}
