// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract RealEstateToken is ERC20, Ownable, Pausable, ERC20Burnable {
    // Mapping to keep track of token holder dividends
    mapping(address => uint256) private _dividends;

    // Total property value managed by the token
    uint256 public propertyValue;

    constructor(uint256 initialSupply, uint256 _propertyValue) ERC20("RealEstateToken", "RET") {
        _mint(msg.sender, initialSupply);
        propertyValue = _propertyValue;
    }

    // Function to distribute dividends to token holders
    function distributeDividends() public payable onlyOwner {
        require(msg.value > 0, "No ether sent for dividends distribution.");
        uint256 totalSupply = totalSupply();
        for (uint i = 0; i < totalSupply; i++) {
            address shareholder = address(uint160(i));
            uint256 holderBalance = balanceOf(shareholder);
            if(holderBalance > 0) {
                _dividends[shareholder] += (msg.value * holderBalance) / totalSupply;
            }
        }
    }

    // Function for a token holder to withdraw their dividends
    function withdrawDividends() public {
        uint256 dividend = _dividends[msg.sender];
        require(dividend > 0, "No dividends available for withdrawal.");
        payable(msg.sender).transfer(dividend);
        _dividends[msg.sender] = 0;
    }

    // Override the ERC20 transfer function to enforce pause functionality
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    // Override the ERC20 transferFrom function to enforce pause functionality
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    // Allows the owner to pause all token transfers in case of emergency
    function pause() public onlyOwner {
        _pause();
    }

    // Allows the owner to unpause all token transfers
    function unpause() public onlyOwner {
        _unpause();
    }
}
