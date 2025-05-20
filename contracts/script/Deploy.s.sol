// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SmartAccount} from "../SmartAccount.sol";
import {ZfaPaymaster} from "../ZfaPaymaster.sol";
import {IEntryPoint} from "../IEntryPoint.sol";

contract Deploy {
    function run(address owner, address entry, uint256 refund) external returns (SmartAccount account, ZfaPaymaster paymaster) {
        account = new SmartAccount(owner, address(0), IEntryPoint(entry));
        paymaster = new ZfaPaymaster(IEntryPoint(entry), owner, refund);
    }
}
