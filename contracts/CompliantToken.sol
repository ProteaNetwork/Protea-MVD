pragma solidity ^0.4.18;

import "./ERC223/ERC223_Interface.sol";
import "./ERC223/Receiver_Interface.sol";
 // Using Revert safemath for Token interactions as used by ERC223 recommendation
import "./ERC223/SafeMath.sol";

// This is a ERC223 token with a simple facet facility 
contract CompliantToken is ERC223, SafeMath {
    mapping(address => uint) balances;
    // Tracks all earned tokens, not transfered
    mapping(address => uint) issued;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    uint16 private issuingAmount;

    event TokensIssued(address account, uint amount);
    event Debug(string message);

    // 20000000,"Faucet223",2,200,"FTC"
    function CompliantToken(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        uint16 _issuingAmount,
        string _tokenSymbol
    ) public {
        uint init = _issuingAmount * 20;
        balances[this] = _initialAmount - init;               
        balances[msg.sender] = init;               
        issued[msg.sender] = init;               
        totalSupply = _initialAmount;                        
        name = _tokenName;                                   
        decimals = _decimalUnits;        
        issuingAmount = _issuingAmount;              
        symbol = _tokenSymbol;                               
    }

    modifier onlyNewAccount() {
        require(issued[msg.sender] == 0);
        _;
    }

    function faucet() public onlyNewAccount{
        // TODO: check if requestor is a contract or not
        // Can either mint new tokens or take from the current supply
        balances[this] -= issuingAmount;
        issued[msg.sender] += issuingAmount;
        balances[msg.sender] += issuingAmount;
        emit TokensIssued(msg.sender, issuingAmount);
    }

    // Function that is called when a user or another contract wants to transfer funds .
    function transfer(address _to, uint _value, bytes _data, string _custom_fallback) public returns(bool success) {

        if (isContract(_to)) {
            if (balanceOf(msg.sender) < _value) revert();
            balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
            balances[_to] = safeAdd(balanceOf(_to), _value);
            assert(_to.call.value(0)(bytes4(keccak256(_custom_fallback)), msg.sender, _value, _data));
            emit Transfer(msg.sender, _to, _value, _data);
            return true;
        } else {
            return transferToAddress(_to, _value, _data);
        }
    }


    // Function that is called when a user or another contract wants to transfer funds .
    function transfer(address _to, uint _value, bytes _data) public returns(bool success) {

        if (isContract(_to)) {
            return transferToContract(_to, _value, _data);
        } else {
            return transferToAddress(_to, _value, _data);
        }
    }

    // Standard function transfer similar to ERC20 transfer with no _data .
    // Added due to backwards compatibility reasons .
    function transfer(address _to, uint _value) public returns(bool success) {
        //standard function transfer similar to ERC20 transfer with no _data
        //added due to backwards compatibility reasons
        bytes memory empty;
        if (isContract(_to)) {
            return transferToContract(_to, _value, empty);
        } else {
            return transferToAddress(_to, _value, empty);
        }
    }

    //assemble the given address bytecode. If bytecode exists then the _addr is a contract.
    function isContract(address _addr) private view returns(bool is_contract) {
        uint length;
        assembly {
            //retrieve the size of the code on target address, this needs assembly
            length: = extcodesize(_addr)
        }
        return (length > 0);
    }

    //function that is called when transaction target is an address
    function transferToAddress(address _to, uint _value, bytes _data) private returns(bool success) {
        emit Debug("transfer to address");
        if (balanceOf(msg.sender) < _value) revert();
        balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
        balances[_to] = safeAdd(balanceOf(_to), _value);
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    //function that is called when transaction target is a contract
    function transferToContract(address _to, uint _value, bytes _data) private returns(bool success) {
        emit Debug("transfer to contract");
        if (balanceOf(msg.sender) < _value) revert();
        emit Debug("Passed balance check");
        
        balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
        emit Debug("Passed deduction");
        balances[_to] = safeAdd(balanceOf(_to), _value);
        emit Debug("Passed adding ");
        ERC223Receiver receiver = ERC223Receiver(_to);
        emit Debug("Passed contract fetching");
        receiver.tokenFallback(msg.sender, _value, _data);
        emit Debug("Passed fallback");
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }


    function balanceOf(address _owner) public view returns(uint balance) {
        return balances[_owner];
    }
}