// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BasePaymaster.sol";

contract ZfaPaymaster is BasePaymaster {
    mapping(address => bool) public whitelistedDapps;
    address public owner;
    uint256 public immutable maxRefundWei;
    address public lastUser;
    uint256 public lastAmount;

    event GasSponsored(address user, uint256 amountWei);

    modifier onlyOwner() {
        require(msg.sender == owner, "ZP:not owner");
        _;
    }

    constructor(IEntryPoint entryPoint, address _owner, uint256 _maxRefundWei) BasePaymaster(entryPoint) {
        owner = _owner;
        maxRefundWei = _maxRefundWei;
    }

    function addToWhitelist(address dapp) external onlyOwner {
        whitelistedDapps[dapp] = true;
    }

    function removeFromWhitelist(address dapp) external onlyOwner {
        whitelistedDapps[dapp] = false;
    }

    function depositToEntryPoint() external payable onlyOwner {
        entryPoint().depositTo{value: msg.value}(address(this));
    }

    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32, uint256) internal override returns (bytes memory context, uint256 validationData) {
        require(whitelistedDapps[tx.origin], "ZP:not whitelisted");
        return (abi.encode(userOp.sender), 0);
    }

    function _postOp(PostOpMode, bytes calldata context, uint256 actualGasCost) internal override {
        uint256 refund = msg.value > maxRefundWei ? maxRefundWei : msg.value;
        if (refund > 0) {
            entryPoint().depositTo{value: refund}(address(this));
        }
        address user = abi.decode(context, (address));
        lastUser = user;
        lastAmount = actualGasCost;
        emit GasSponsored(user, actualGasCost);
    }

    receive() external payable {}
}
