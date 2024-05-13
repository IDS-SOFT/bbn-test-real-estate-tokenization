// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract RealEstateToken is ERC20, Ownable, Pausable, ERC20Burnable {
    // Mapping to keep track of token holder dividends
    mapping(address => uint256) private _dividends;

    // Total property value managed by the token
    uint256 public propertyValue;

    constructor(uint256 initialSupply, uint256 _propertyValue) ERC20("RealEstateToken", "RET")  Ownable(msg.sender) {
          // This is not typically necessary and may indicate a wrong setup or version
        _mint(msg.sender, initialSupply);
        propertyValue = _propertyValue;
    }

    // Function to distribute dividends to token holders
    function distributeDividends() public payable onlyOwner {
        require(msg.value > 0, "No ether sent for dividends distribution.");
        uint256 totalSupply = totalSupply();
        uint256 totalDividends = msg.value;

        // Distributing dividends based on the token balance of each holder
        address[] memory holders = _getHolders();
        for (uint i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 holderBalance = balanceOf(holder);
            if(holderBalance > 0) {
                uint256 holderDividend = (totalDividends * holderBalance) / totalSupply;
                _dividends[holder] += holderDividend;
            }
        }
    }

    // Function to safely retrieve dividend holders
    function _getHolders() internal view returns (address[] memory) {
        uint256 holderCount = 0;
        address[] memory holders = new address[](holderCount);
        for (uint i = 0; i < totalSupply(); i++) {
            address holder = address(uint160(i));
            if(balanceOf(holder) > 0 && !_isHolderAdded(holders, holder)) {
                holders[holderCount] = holder;
                holderCount++;
            }
        }
        return holders;
    }

    // Helper function to check if a holder is already added
    function _isHolderAdded(address[] memory holders, address holder) internal pure returns (bool) {
        for(uint i = 0; i < holders.length; i++) {
            if(holders[i] == holder) {
                return true;
            }
        }
        return false;
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
