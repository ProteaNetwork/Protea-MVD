pragma solidity ^0.4.18;

import "./GroupAdmin.sol";
import "./ERC223/ERC223.sol";
import "./ERC223/ERC223Receiver.sol";
import "./zeppelin/lifecycle/Destructible.sol";

contract TokenConference is Destructible, GroupAdmin, ERC223Receiver {
    ERC223 internal token;

    string public name;
    uint256 public deposit;
    uint public limitOfParticipants;
    uint public registered;
    uint public attended;
    bool public ended;
    bool public cancelled;
    uint public endedAt;
    uint public coolingPeriod;
    uint256 public payoutAmount;
    string public encryption;

    mapping(address => Participant) public participants;
    mapping(uint => address) public participantsIndex;

    // // For keeping track of the deposits made to the events account
    mapping(address => uint) public deposited;
    bool paid;


    struct Participant {
        address addr;
        address identity;
        bool attended;
        bool paid;
    }

    struct TKN {
        address sender;
        uint value;
        bytes data;
        bytes4 sig;
    }

    event RegisterEvent(address addr);
    event AttendEvent(address addr);
    event PaybackEvent(uint256 _payout);
    event WithdrawEvent(address addr, uint256 _payout);
    event CancelEvent();
    event ClearEvent(address addr, uint256 leftOver);

    // // Token
    event FundsReserved(address addr, uint256 amount);
    event FundsRecovered(address addr, uint amount);
    event ProfileUpdated(string name);

    // /* Modifiers */
    modifier onlyActive {
        require(!ended);
        _;
    }

    modifier onlyEnded {
        require(ended);
        _;
    }

    modifier onlyToken {
        require(msg.sender == address(token));
        _;
    }

    /* Public functions */

    function TokenConference(
        string _name,
        uint256 _deposit,
        uint _limitOfParticipants,
        uint _coolingPeriod,
        address _tokenAddress,
        string _encryption
    ) public {
        token = ERC223(_tokenAddress);
        if (bytes(_name).length != 0) {
            name = _name;
        } else {
            name = "Test";
        }

        if (_deposit != 0) {
            deposit = _deposit;
        } else {
            deposit = 200;
        }

        if (_limitOfParticipants != 0) {
            limitOfParticipants = _limitOfParticipants;
        } else {
            limitOfParticipants = 20;
        }

        if (_coolingPeriod != 0) {
            coolingPeriod = _coolingPeriod;
        } else {
            coolingPeriod = 1 weeks;
        }

        if (bytes(_encryption).length != 0) {
            encryption = _encryption;
        }
    }

    function registerInternal(address _from, uint _value) internal onlyActive {
        require(_value >= deposit);
        require(registered < limitOfParticipants);
        require(!isRegistered(_from));
        deposited[_from] += _value;
        registered++;
        participantsIndex[registered] = _from;
        // Leaving Identity field open for Proof of Attendance
        participants[_from] = Participant(_from, address(0), false, false);
        emit RegisterEvent(_from);
    }

    function withdraw() external onlyEnded {
        require(payoutAmount > 0);
        Participant storage participant = participants[msg.sender];
        require(participant.addr == msg.sender);
        require(cancelled || participant.attended);
        require(participant.paid == false);

        participant.paid = true;
        transfer(payoutAmount);
        emit WithdrawEvent(msg.sender, payoutAmount);
    }

    // /* Constants */
    function totalBalance() view public returns(uint256) {
        return token.balanceOf(this);
    }

    function isRegistered(address _addr) constant public returns(bool) {
        return participants[_addr].addr != address(0);
    }

    function isAttended(address _addr) constant public returns(bool) {
        return isRegistered(_addr) && participants[_addr].attended;
    }

    function isPaid(address _addr) constant public returns(bool) {
        return isRegistered(_addr) && participants[_addr].paid;
    }

    function payout() constant public returns(uint256) {
        if (attended == 0) return 0;
        return uint(totalBalance()) / uint(attended);
    }

    // /* Admin only functions */

    function payback() external onlyOwner onlyActive {
        payoutAmount = payout();
        ended = true;
        endedAt = now;
        emit PaybackEvent(payoutAmount);
    }

    function cancel() external onlyOwner onlyActive {
        payoutAmount = deposit;
        cancelled = true;
        ended = true;
        endedAt = now;
        emit CancelEvent();
    }

    /* return the remaining of balance if there are any unclaimed after cooling period */
    function clear() external onlyOwner onlyEnded {
        require(now > endedAt + coolingPeriod);
        require(ended);
        uint leftOver = totalBalance();
        transfer(leftOver);
        emit ClearEvent(owner, leftOver);
    }

    function setLimitOfParticipants(uint _limitOfParticipants) external onlyOwner onlyActive {
        limitOfParticipants = _limitOfParticipants;
    }

    function attend(address[] _addresses) external onlyAdmin onlyActive {
        for (uint i = 0; i < _addresses.length; i++) {
            address _addr = _addresses[i];
            require(isRegistered(_addr));
            require(!isAttended(_addr));
            emit AttendEvent(_addr);
            participants[_addr].attended = true;
            attended++;
            // Identity rewards functions could happen here

        }
    }

    function transfer(uint _amount) internal returns(bool) {
        return token.transfer(msg.sender, _amount);
    }

    // ERC223 compliance
    function tokenFallback(address _from, uint _value, bytes _data) external {
        require(msg.sender == address(token));

        registerInternal(_from, _value);

    }
}