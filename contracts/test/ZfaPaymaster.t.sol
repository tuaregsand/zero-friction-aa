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

contract ZfaPaymasterTest is Test {
    EntryPointMock private ep;
    ZfaPaymaster private paymaster;
    address private dapp = address(0xAA);
    address private user = address(0xBB);
    address private originAddr;

    function setUp() public {
        ep = new EntryPointMock();
        paymaster = new ZfaPaymaster(IEntryPoint(address(ep)), address(this), 0.5 ether);
        originAddr = tx.origin;
    }

    function _buildOp() internal view returns (UserOperation memory op) {
        op = UserOperation({
            sender: user,
            nonce: 0,
            initCode: bytes(""),
            callData: bytes(""),
            callGasLimit: 0,
            verificationGasLimit: 0,
            preVerificationGas: 0,
            maxFeePerGas: 0,
            maxPriorityFeePerGas: 0,
            paymasterAndData: bytes(""),
            signature: bytes("")
        });
    }

    function testWhitelistedCallSponsored() public {
        paymaster.addToWhitelist(originAddr);
        UserOperation memory op = _buildOp();
        (bytes memory ctx,) = ep.simulateValidate(address(paymaster), op, 0);
        ep.simulatePostOp{value: 1 ether}(address(paymaster), ctx, 0.5 ether);
        assertEq(ep.deposits(address(paymaster)), 0.5 ether);
    }

    function testNonWhitelistedReverts() public {
        UserOperation memory op = _buildOp();
        vm.expectRevert();
        ep.simulateValidate(address(paymaster), op, 0);
    }

    function testGasSponsoredEvent() public {
        paymaster.addToWhitelist(originAddr);
        UserOperation memory op = _buildOp();
        (bytes memory ctx,) = ep.simulateValidate(address(paymaster), op, 0);
        ep.simulatePostOp{value: 0}(address(paymaster), ctx, 123);
        assertEq(paymaster.lastUser(), user);
        assertEq(paymaster.lastAmount(), 123);
    }

    function testDepositToEntryPoint() public {
        paymaster.depositToEntryPoint{value: 1 ether}();
        assertEq(ep.deposits(address(paymaster)), 1 ether);
    }

    function testRemoveFromWhitelist() public {
        paymaster.addToWhitelist(originAddr);
        paymaster.removeFromWhitelist(originAddr);
        UserOperation memory op = _buildOp();
        vm.expectRevert();
        ep.simulateValidate(address(paymaster), op, 0);
    }
}
