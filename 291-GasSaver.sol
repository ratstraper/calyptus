// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasSaver {
    mapping (address => string) public winners;
    error ToMuchGas(uint);

    function participate(string calldata userID) public {
        uint gas = gasleft();
        if (gas > 35000) {
            revert ToMuchGas(gas);
        }
        winners[msg.sender] = userID;

    }
}

contract GasMeter {
    function save(address addr) public {

        (bool success, ) = addr.call{gas: 35000}(
            abi.encodeWithSignature("participate(string)", "linkedin.com/in/bepossible")
        );
    
        require(success);
    }
}