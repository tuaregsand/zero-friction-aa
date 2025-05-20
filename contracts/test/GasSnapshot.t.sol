// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../SmartAccount.sol";

contract GasSnapshot is Test {
    SmartAccount account;

    function setUp() public {
        account = new SmartAccount(address(this), address(0), IEntryPoint(address(0)));
    }

    function testGasExecute() public {
        account.execute(address(0), 0, "");
    }
}
