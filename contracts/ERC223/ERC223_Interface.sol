pragma solidity ^ 0.4 .9;


contract ERC223 {
    uint256 public totalSupply;

    function balanceOf(address who) public constant returns (uint);

    function transfer(address to, uint value) public returns(bool ok);

    function transfer(address to, uint value, bytes data) public returns(bool ok);

    function transfer(address to, uint value, bytes data, string custom_fallback) public returns(bool ok);

    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}