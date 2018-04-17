pragma solidity ^0.4.18;

import "./ERC20.sol";

contract ERC223 is ERC20 {
    function transfer(address to, uint value, bytes data) public;
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}