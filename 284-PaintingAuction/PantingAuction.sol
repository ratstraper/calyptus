// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

contract PaintingAuction {
    address public highestBidder;
    uint public highestBid;

    function Bid() external payable {
        require(msg.value > highestBid, "Current bid is not high enough.");

        if(highestBidder != address(0)) {
            require(
                payable(highestBidder).send(highestBid),
                "Refund to previous bidder failed."
            );
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }
}