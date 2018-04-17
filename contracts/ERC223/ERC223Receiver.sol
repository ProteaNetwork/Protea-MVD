pragma solidity ^0.4.18;

interface ERC223Receiver { 
    function tokenFallback(address _from, uint _value, bytes _data) external;
}