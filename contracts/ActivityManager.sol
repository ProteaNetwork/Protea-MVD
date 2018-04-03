pragma solidity ^ 0.4.21;
/** 
 * The Activity manager contract serves as a factory and reward system.
 * This contract facilitates the creation of Events for staked RSVP as well as the community reward payout based on participation
 */

contract ActivityManager {
    address private organiserTCR;
    
    event eventCreated(address _community, address _organiser);

    function ActivityManager(address _organiserTCR, address _rootToken) public{

    }

    modifier isOrganiser() {

        _;
    }

    function payoutReward() internal {
        
    }
}