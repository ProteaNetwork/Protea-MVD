pragma solidity 0.4.21;
/** 
 * This contract serves as the main community contract, providing goverance capabilities. 
 * Going forward this will be a modification of at token curated registry to add focus to curator interaction
 */

contract ProteaCommunity {
    address private proteaRoot;

    function ProteaCommunity() public {
        proteaRoot = msg.sender;
    }

}