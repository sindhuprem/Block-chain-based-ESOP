// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AccessControl.sol";

/**
 * @title ESOPManagement
 * @dev Main contract for managing Employee Stock Ownership Plans
 */
contract ESOPManagement is AccessControl {
    
    // Grant structure
    struct Grant {
        uint256 grantId;
        address employeeAddress;
        uint256 totalShares;
        uint256 vestedShares;
        uint256 exercisedShares;
        uint256 grantDate;
        uint256 cliffPeriod;
        uint256 vestingDuration;
        bool isActive;
        string employeeName;
    }
    
    // State variables
    mapping(uint256 => Grant) public grants;
    mapping(address => uint256[]) public employeeGrants;
    uint256 public grantCounter;
    uint256 public totalESOPPool;
    uint256 public allocatedShares;
    
    // Events
    event GrantCreated(
        uint256 indexed grantId,
        address indexed employee,
        uint256 totalShares,
        uint256 grantDate
    );
    
    event SharesVested(
        uint256 indexed grantId,
        address indexed employee,
        uint256 vestedAmount
    );
    
    event SharesExercised(
        uint256 indexed grantId,
        address indexed employee,
        uint256 exercisedAmount
    );
    
    event GrantRevoked(
        uint256 indexed grantId,
        address indexed employee,
        uint256 revokedShares
    );
    
    constructor(uint256 _totalESOPPool) {
        totalESOPPool = _totalESOPPool;
        allocatedShares = 0;
        grantCounter = 0;
    }
    
    function createGrant(
        address _employee,
        string memory _employeeName,
        uint256 _totalShares,
        uint256 _cliffPeriod,
        uint256 _vestingDuration
    ) public onlyRole(ADMIN_ROLE) returns (uint256) {
        require(_employee != address(0), "Invalid employee address");
        require(_totalShares > 0, "Shares must be greater than 0");
        require(_cliffPeriod < _vestingDuration, "Cliff must be less than vesting duration");
        require(allocatedShares + _totalShares <= totalESOPPool, "Exceeds ESOP pool");
        
        grantCounter++;
        
        uint256 cliffSeconds = _cliffPeriod * 1 days;
        uint256 vestingSeconds = _vestingDuration * 1 days;
        
        grants[grantCounter] = Grant({
            grantId: grantCounter,
            employeeAddress: _employee,
            totalShares: _totalShares,
            vestedShares: 0,
            exercisedShares: 0,
            grantDate: block.timestamp,
            cliffPeriod: cliffSeconds,
            vestingDuration: vestingSeconds,
            isActive: true,
            employeeName: _employeeName
        });
        
        employeeGrants[_employee].push(grantCounter);
        allocatedShares += _totalShares;
        
        if (!hasRole(EMPLOYEE_ROLE, _employee)) {
            grantRole(EMPLOYEE_ROLE, _employee);
        }
        
        emit GrantCreated(grantCounter, _employee, _totalShares, block.timestamp);
        
        return grantCounter;
    }
    
    function calculateVestedShares(uint256 _grantId) public view returns (uint256) {
        Grant memory grant = grants[_grantId];
        
        if (!grant.isActive) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - grant.grantDate;
        
        if (timeElapsed < grant.cliffPeriod) {
            return 0;
        }
        
        if (timeElapsed >= grant.vestingDuration) {
            return grant.totalShares;
        }
        
        uint256 vestedAmount = (grant.totalShares * timeElapsed) / grant.vestingDuration;
        
        return vestedAmount;
    }
    
    function updateVesting(uint256 _grantId) public {
        require(grants[_grantId].isActive, "Grant is not active");
        
        uint256 newVestedAmount = calculateVestedShares(_grantId);
        grants[_grantId].vestedShares = newVestedAmount;
        
        emit SharesVested(_grantId, grants[_grantId].employeeAddress, newVestedAmount);
    }
    
    function exerciseShares(uint256 _grantId, uint256 _amount) public {
        Grant storage grant = grants[_grantId];
        
        require(msg.sender == grant.employeeAddress, "Not authorized");
        require(grant.isActive, "Grant not active");
        
        updateVesting(_grantId);
        
        uint256 exercisableShares = grant.vestedShares - grant.exercisedShares;
        require(_amount <= exercisableShares, "Insufficient vested shares");
        
        grant.exercisedShares += _amount;
        
        emit SharesExercised(_grantId, msg.sender, _amount);
    }
    
    function revokeGrant(uint256 _grantId) public onlyRole(ADMIN_ROLE) {
        Grant storage grant = grants[_grantId];
        require(grant.isActive, "Grant already inactive");
        
        updateVesting(_grantId);
        
        uint256 unvestedShares = grant.totalShares - grant.vestedShares;
        
        grant.isActive = false;
        allocatedShares -= unvestedShares;
        
        emit GrantRevoked(_grantId, grant.employeeAddress, unvestedShares);
    }
    
    function getEmployeeGrants(address _employee) public view returns (uint256[] memory) {
        return employeeGrants[_employee];
    }
    
    function getGrantDetails(uint256 _grantId) public view returns (
        address employee,
        string memory employeeName,
        uint256 totalShares,
        uint256 vestedShares,
        uint256 exercisedShares,
        uint256 grantDate,
        bool isActive
    ) {
        Grant memory grant = grants[_grantId];
        
        return (
            grant.employeeAddress,
            grant.employeeName,
            grant.totalShares,
            calculateVestedShares(_grantId),
            grant.exercisedShares,
            grant.grantDate,
            grant.isActive
        );
    }
    
    function getAvailablePool() public view returns (uint256) {
        return totalESOPPool - allocatedShares;
    }
}