// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    // token => user => value
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;

    uint256 public orderCount;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    struct _Order {
        uint256 id; // Unique identifier for the order
        address user; // User who made the order
        address tokenGet; // Address of the token they receive
        uint256 amountGet; // Amount they receive
        address tokenGive; // Address of the token they give
        uint256 amountGive; // Amount they give
        uint256 timestamp; // When order was created
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // -------------------------
    // DEPOSIT & WUTHDRAW TOKEN

    function depositToken(address _token, uint256 _amount) public {
        require(
            Token(_token).transferFrom(msg.sender, address(this), _amount),
            "Failed to deposit tokens in exchange"
        );

        tokens[_token][msg.sender] += _amount;

        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        // Ensure user has enough tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount, "Insufficient balance");

        require(
            Token(_token).transfer(msg.sender, _amount),
            "Failed to withdraw tokens from exchange"
        );

        tokens[_token][msg.sender] -= _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    // -------------------------
    // MAKE & CANCEL ORDERS
    // Token Give (The token tey want to spend), which token and how much?
    // Toke Get (The token they want to receive), which token and how much?

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        require(
            balanceOf(_tokenGive, msg.sender) >= _amountGive,
            "Insufficient balance"
        );

        orderCount++;

        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    // function getCurrentTime() internal view returns (uint) {
    //     return (block.timestamp * 1000) + 1000;
    // }
}
