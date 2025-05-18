// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../SmartAccount.sol";

contract EntryPointMock is IEntryPoint {
    function depositTo(address) external payable {}

    function getUserOpHash(UserOperation calldata userOp) external pure override returns (bytes32) {
        return keccak256(abi.encode(userOp.sender, userOp.nonce, userOp.callData));
    }
}

contract Counter {
    uint256 public number;

    function setNumber(uint256 n) external {
        number = n;
    }
}

contract SmartAccountTest is Test {
    uint256 private ownerKey = 0xA11CE;
    address private owner = vm.addr(ownerKey);
    address private recovery = address(0xBEEF);
    EntryPointMock private ep;
    SmartAccount private account;
    Counter private counter;

    function setUp() public {
        ep = new EntryPointMock();
        account = new SmartAccount(owner, recovery, IEntryPoint(address(ep)));
        counter = new Counter();
    }

    function _buildOp(bytes memory callData) internal view returns (UserOperation memory op, bytes32 hash) {
        op = UserOperation({
            sender: address(account),
            nonce: account.nonce(),
            initCode: bytes(""),
            callData: callData,
            callGasLimit: 0,
            verificationGasLimit: 0,
            preVerificationGas: 0,
            maxFeePerGas: 0,
            maxPriorityFeePerGas: 0,
            paymasterAndData: bytes(""),
            signature: bytes("")
        });
        hash = ep.getUserOpHash(op);
    }

    function _sign(bytes32 hash, uint256 key) internal returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, hash);
        return abi.encodePacked(r, s, v);
    }

    function testExecuteValidSig() public {
        bytes memory data = abi.encodeWithSignature("setNumber(uint256)", 42);
        (UserOperation memory op, bytes32 hash) = _buildOp(data);
        op.signature = _sign(hash, ownerKey);
        vm.prank(address(ep));
        account.validateUserOp(op, hash, 0);
        vm.prank(address(ep));
        account.execute(address(counter), 0, data);
        assertEq(counter.number(), 42);
        assertEq(account.nonce(), 1);
    }

    function testInvalidSigReverts() public {
        bytes memory data = abi.encodeWithSignature("setNumber(uint256)", 1);
        (UserOperation memory op, bytes32 hash) = _buildOp(data);
        op.signature = _sign(hash, ownerKey + 1);
        vm.prank(address(ep));
        uint256 validation = account.validateUserOp(op, hash, 0);
        assertEq(validation, 1);
    }

    function testRecoveryChangeOwner() public {
        uint256 newKey = 0xB0B;
        address newOwner = vm.addr(newKey);
        vm.prank(recovery);
        account.changeOwner(newOwner);

        bytes memory data = abi.encodeWithSignature("setNumber(uint256)", 7);
        (UserOperation memory op, bytes32 hash) = _buildOp(data);
        op.signature = _sign(hash, newKey);
        vm.prank(address(ep));
        account.validateUserOp(op, hash, 0);
        vm.prank(address(ep));
        account.execute(address(counter), 0, data);
        assertEq(counter.number(), 7);
        assertEq(account.nonce(), 1);
    }
}
