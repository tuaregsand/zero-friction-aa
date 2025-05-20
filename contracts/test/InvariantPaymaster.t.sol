// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../ZfaPaymaster.sol";

contract EntryPointMock is IEntryPoint {
    mapping(address => uint256) public deposits;
    function depositTo(address account) external payable override {
        deposits[account] += msg.value;
    }
    function getUserOpHash(UserOperation calldata userOp) external pure override returns (bytes32) {
        return keccak256(abi.encode(userOp.sender, userOp.nonce));
    }
    function simulateValidate(address paymaster, UserOperation calldata op, uint256 maxCost)
        external
        returns (bytes memory context, uint256 validationData)
    {
        return IPaymaster(paymaster).validatePaymasterUserOp(op, bytes32(0), maxCost);
    }
    function simulatePostOp(address paymaster, bytes calldata context, uint256 actualGasCost) external payable {
        IPaymaster(paymaster).postOp{value: msg.value}(IPaymaster.PostOpMode.opSucceeded, context, actualGasCost);
    }
}

contract InvariantPaymaster is Test {
    EntryPointMock private ep;
    ZfaPaymaster private paymaster;
    address private owner;
    address private constant DAPP = address(0x123);

    function setUp() public {
        owner = address(this);
        ep = new EntryPointMock();
        paymaster = new ZfaPaymaster(IEntryPoint(address(ep)), owner, 1 ether);
    }

    function testInvariantWhitelistRandomized(address attacker) public {
        attacker = address(uint160(uint256(uint160(attacker)) % type(uint160).max + 1));
        if (attacker == owner) return;
        vm.prank(attacker);
        vm.expectRevert();
        paymaster.addToWhitelist(DAPP);
        vm.prank(attacker);
        vm.expectRevert();
        paymaster.removeFromWhitelist(DAPP);
    }

    function testInvariantDepositWithdraw(uint256 depositAmount) public {
        depositAmount = depositAmount % (10 ether) + 1;
        uint256 before = address(paymaster).balance;
        paymaster.depositToEntryPoint{value: depositAmount}();
        assertEq(ep.deposits(address(paymaster)), depositAmount);
        // Simulate withdrawal
        // (Assume a withdraw function exists or is added for test purposes)
    }
} 