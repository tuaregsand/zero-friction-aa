// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Vm.sol";

abstract contract Test {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function assertEq(uint256 a, uint256 b) internal pure {
        require(a == b, "unequal numbers");
    }

    function assertEq(address a, address b) internal pure {
        require(a == b, "unequal addresses");
    }
}
