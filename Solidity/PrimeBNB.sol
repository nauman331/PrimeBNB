/**
 *Submitted for verification at opbnb.bscscan.com on 2024-09-24
*/

// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Ownable {

    address public owner;

    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function changeOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner cannot be zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != ENTERED, "ReentrancyGuard: reentrant call");
        _status = ENTERED;
        _;
        _status = NOT_ENTERED;
    }
}

contract PrimeBNB is ReentrancyGuard, Ownable {
    uint public totalUsers;
    uint public totalDeposits;
    uint256 public totalWithdrawals;
    uint public constant TOTAL_LEVELS = 6;
    uint public constant DIRECT_INCOME = 10;
    uint public constant SPONSOR_INCOME = 5;
    uint public constant DailyEarnings = 3;
    address owner1  ;
    address owner2;

    mapping(address => uint256) public totalIncome;
    mapping(address => address) public sponsorOf;
    mapping(address => uint256) public usersDeposited;
    mapping(address => uint256) public userWithdraw;
    mapping(address => uint256) public userId;
    mapping(address => bool) public isRegistered;
    mapping(address => address[]) public downlinesArray;
    mapping(uint => uint) public levelPrices;
    mapping(address => uint) public lastUpdate;
    mapping(address => plan[]) public plans;
    mapping(address => uint) public totalPlanOf;
    mapping(address => userHistory[]) public userHistories;

    struct plan {
        uint amount;
        uint totalEarned;
        uint lastUpdate;
        bool isActivated;
        uint planId;
        uint endingDate;
        uint startingDate;
    }

    struct userHistory {
        uint amount;
        uint date;
        address from;
    }

    event Registration(address indexed user);
    event PaymentSent(address indexed user, uint amount);
    event divsClaimed (address indexed user, uint indexed amount);

    constructor(address _owner1 ,address _owner2) {
        require(_owner1 != address(0),"owner1 cannot be zero");
        require(_owner2 != address(0),"owner2 cannot be zero");

        owner1 = _owner1;
        owner2 = _owner2;
        
        levelPrices[1] = 0.00004 ether;
        for (uint i = 2; i <= TOTAL_LEVELS; i++) {
            levelPrices[i] = levelPrices[i - 1] * 2;
        }
    }

    function register(address sponsor) public nonReentrant {
        require(!isRegistered[msg.sender], "PrimeBNB: already registered");
        require(sponsor != address(0), "PrimeBNB: sponsor cannot be zero address");
        require(msg.sender != sponsor, "PrimeBNB: you cannot sponsor yourself");

        totalUsers++;
        userId[msg.sender] = totalUsers;
        downlinesArray[sponsor].push(msg.sender);
        isRegistered[msg.sender] = true;
        sponsorOf[msg.sender] = sponsor;

        emit Registration(msg.sender);
    }

    function deposit(uint level) public payable nonReentrant {
        require(level > 0 && level <= TOTAL_LEVELS, "PrimeBNB: invalid level");
        require(isRegistered[msg.sender], "PrimeBNB: user not registered");
        require(msg.value == levelPrices[level], "PrimeBNB: incorrect deposit amount");

        sendEarnings(msg.value);
        sendToOwners(msg.value);

        plans[msg.sender].push(plan({
            amount: levelPrices[level],
            totalEarned: 0,
            lastUpdate: block.timestamp,
            isActivated: true,
            planId: totalPlanOf[msg.sender],
            endingDate: block.timestamp + 150 days,
            startingDate: block.timestamp
        }));

        totalPlanOf[msg.sender]++;
        totalDeposits += msg.value;
    }



    function sendEarnings(uint amount) internal returns (bool) {
        uint directIncome = (amount * DIRECT_INCOME) / 100;
        uint sponsorIncome = (amount * SPONSOR_INCOME) / 100;

        address[] memory sponsors = getUplines(msg.sender, 3);

        for (uint i = 0; i < sponsors.length; i++) {
            if (sponsors[i] != address(0)) {
                uint valueToSend = (i == 0) ? directIncome : sponsorIncome;
                (bool sent,) = sponsors[i].call{value: valueToSend}("");
                require(sent, "PrimeBNB: error sending income");

                userHistories[sponsors[i]].push(userHistory({
                    amount: valueToSend,
                    date: block.timestamp,
                    from: msg.sender
                }));

                emit PaymentSent(sponsors[i], valueToSend);
            }
        }
        return true;
    }

    function getUplines(address user, uint depth) internal view returns (address[] memory) {
        address[] memory uplines = new address[](depth);
        address currentSponsor = sponsorOf[user];

        for (uint i = 0; i < depth; i++) {
            if (currentSponsor == address(0)) {
                break;
            }
            uplines[i] = currentSponsor;
            currentSponsor = sponsorOf[currentSponsor];
        }
        return uplines;
    }

  function sendToOwners(uint amount) internal {
    uint amountToOwner1 = (amount * 35) / 1000; // 3.5%
    uint amountToOwner2 = (amount * 25) / 1000; // 2.5%

    (bool success1, ) = owner1.call{value: amountToOwner1}("");
    require(success1, "Error sending to Owner 1");

    (bool success2, ) = owner2.call{value: amountToOwner2}("");
    require(success2, "Error sending to Owner 2");
}

   function PlanEnds(address user, uint planId) internal view returns (bool) {
    require(planId > 0 && planId <= plans[user].length, "Plan ID invalide");

    plan memory userPlan = plans[user][planId - 1];

    return block.timestamp >= userPlan.endingDate;
}


function calculateDivs(uint planId, address user) public view returns (uint) {
    if (PlanEnds(user, planId)) {
        return 0;
    }

    plan memory userPlan = plans[user][planId - 1];
    uint timeElapsed = block.timestamp - userPlan.lastUpdate;
    uint gainPerSec = (userPlan.amount * DailyEarnings) / (100 * 1 days);

    return timeElapsed * gainPerSec;
}

function claimDivs(uint planId) public nonReentrant {
    require(isRegistered[msg.sender], "The sender is not registered");
    plan storage planOfUser = plans[msg.sender][planId - 1];
    require(planOfUser.isActivated, "The plan is not activated");

    uint divs = calculateDivs(planId, msg.sender);
    require(divs > 0, "No dividends to claim");

    (bool success, ) = msg.sender.call{value: divs}("");
    require(success, "Error claiming dividends");

    // Update the lastUpdate of the plan after claiming dividends
    planOfUser.lastUpdate = block.timestamp;

    // Log the claim in the user's history
    userHistories[msg.sender].push(userHistory({
        amount: divs,
        date: block.timestamp,
        from: address(this)
    }));

    emit divsClaimed(msg.sender, divs);
}


    function getPlansOfUser(address user) public view returns (plan[] memory) {
        return plans[user];
    }
}