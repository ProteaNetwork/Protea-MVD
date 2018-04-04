pragma solidity ^ 0.4 .21;

import "./EventContract.sol";

/** 
 * The Community manager contract serves as a factory and reward system.
 * This contract facilitates the creation of Events for staked RSVP as well as the community reward payout based on participation
 */

contract CommunityManager {

    address private rootToken;
    // community => events 
    mapping(address => address[]) events;

    event eventCreated(address _community, string _name);

    function CommunityManager(address _rootToken) public {
        rootToken = _rootToken;
    }

    function createEvent(
        string _name,
        uint256 _deposit,
        uint _limitOfParticipants,
        uint _coolingPeriod,
        string _encryption) public onlyCommunity onlyMember returns(address) {
        address newEvent = new Event(_name, _deposit, _limitOfParticipants, _coolingPeriod, _encryption);
        events[msg.sender].push(newEvent);
        emit eventCreated(msg.sender, _name);
    }


    // Modifiers
    modifier onlyCommunity() {
        // TODO: Check community contract
        _;
    }

    modifier onlyMember() {
        // TODO: Check member, maybe admin
        _;
    }
    // function payoutReward() internal {

    // }
}