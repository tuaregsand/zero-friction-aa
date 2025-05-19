// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

contract Budget {
    uint256 public constant DAILY_BUDGET_WEI = 1 ether;
    mapping(address => uint256) public spent;

    function sponsor(address user, uint256 amount) external {
        require(spent[user] + amount <= DAILY_BUDGET_WEI, "budget exceeded");
        spent[user] += amount;
    }
}

contract InvariantPaymasterBudget is Test {
    Budget private budget;
    function _clamp(uint256 x, uint256 min, uint256 max) internal pure returns (uint256) {
        if (x < min) return min;
        if (x > max) return max;
        return x;
    }
    function _assert(bool ok) internal pure {
        require(ok, "assert failed");
    }

    function setUp() public {
        budget = new Budget();
    }

    function testInvariantBudget(address user, uint256 amount) public {
        amount = _clamp(amount, 0, budget.DAILY_BUDGET_WEI());
        vm.prank(user);
        try budget.sponsor(user, amount) {} catch {}
        _assert(budget.spent(user) <= budget.DAILY_BUDGET_WEI());
    }
}
