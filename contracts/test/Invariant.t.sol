// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../SmartAccount.sol";
import "../ZfaPaymaster.sol";

contract EntryPointMock is IEntryPoint {
    function depositTo(address) external payable {}
    function getUserOpHash(UserOperation calldata userOp) external pure override returns (bytes32) {
        return keccak256(abi.encode(userOp.sender, userOp.nonce));
    }
}

contract Reentrant {
    SmartAccount public account;
    constructor(SmartAccount _account) { account = _account; }
    fallback() external payable {
        try account.execute(address(0), 0, "") { } catch { }
    }
}

contract Invariant is Test {
    SmartAccount account;
    Reentrant reentrant;
    EntryPointMock ep;
    address owner;

    ZfaPaymaster paymaster;
    address pmOwner;
    address constant DAPP = address(0x123);

    function setUp() public {
        owner = address(0xA11CE);
        pmOwner = address(this);
        ep = new EntryPointMock();
        account = new SmartAccount(owner, address(0xBEEF), IEntryPoint(address(ep)));
        reentrant = new Reentrant(account);
        paymaster = new ZfaPaymaster(IEntryPoint(address(ep)), pmOwner, 1 ether);
    }

    function callExecute() external {
        vm.prank(owner);
        account.execute(address(reentrant), 0, "");
    }

    function addWhitelist(address a) external {
        vm.prank(pmOwner);
        paymaster.addToWhitelist(a);
    }

    function removeWhitelist(address a) external {
        vm.prank(pmOwner);
        paymaster.removeFromWhitelist(a);
    }

    function testInvariantOwnerUnchanged() public {
        for (uint256 i = 0; i < 10; i++) {
            this.callExecute();
        }
        assertEq(account.owner(), owner);
    }

    function testInvariantWhitelistOnlyOwner() public {
        address attacker = address(0xBAD);
        for (uint256 i = 0; i < 10; i++) {
            vm.prank(attacker);
            vm.expectRevert();
            paymaster.addToWhitelist(DAPP);
            vm.prank(attacker);
            vm.expectRevert();
            paymaster.removeFromWhitelist(DAPP);
        }
    }
}
