/**
 *Submitted for verification at opbnb.bscscan.com on 2024-10-02
*/

// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

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
    uint public constant SPONSOR_INCOME = 1;
    uint public constant DailyEarnings = 5;
    address private owner1  ;
    address private owner2;

    mapping(address => uint256) public totalIncome;
    mapping(address => address) public sponsorOf;
    mapping(address => uint256) public usersDeposited;
    mapping(address => uint256) public userWithdraw;
    mapping(address => uint256) public userId;
    mapping(address => bool) public isRegistered;
    mapping(address => address[]) public downlinesArray;
    mapping(address => uint) public downlineCount;
    mapping(address => uint) public userEarnings;

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

    event Registration(address indexed user, uint indexed time);
    event PaymentSent(address indexed user, uint amount,  uint indexed time);
    event divsClaimed (address indexed user, uint indexed amount ,  uint indexed time);

    constructor(address _owner1 ,address _owner2) {
        require(_owner1 != address(0),"owner1 cannot be zero");
        require(_owner2 != address(0),"owner2 cannot be zero");

        owner1 = _owner1;
        owner2 = _owner2;
        
        levelPrices[1] = 0.004 ether;  //10$
        levelPrices[2] = 0.008 ether;  //20$
        levelPrices[3] = 0.0118 ether; //30$
        levelPrices[4] = 0.0196 ether; //50$
        levelPrices[5] = 0.196 ether;  //500$

        
        initOwner();
    }
    // this function is callable once the contract is created 
    function initOwner () internal {

        totalUsers++;
        userId[owner1] = totalUsers;
        isRegistered[owner1] = true;
        sponsorOf[owner1] = address(0);

         initOwner2();
    }
    function initOwner2 () internal {
           totalUsers++;
        userId[owner2] = totalUsers;
        downlinesArray[owner1].push(owner2);
        isRegistered[owner2] = true;
        sponsorOf[owner2] = owner1;

    }
    function register(address sponsor) public nonReentrant {
        require(!isRegistered[msg.sender], "PrimeBNB: already registered");
        require(sponsor != address(0), "PrimeBNB: sponsor cannot be zero address");
        require(msg.sender != sponsor, "PrimeBNB: you cannot sponsor yourself");
        require(isRegistered[sponsor], " the sponsor is not registered");

        totalUsers++;
        userId[msg.sender] = totalUsers;
        downlinesArray[sponsor].push(msg.sender);
        downlineCount[sponsor] ++;
        isRegistered[msg.sender] = true;
        sponsorOf[msg.sender] = sponsor;

        emit Registration(msg.sender, block.timestamp);
    }

  function registerationByOwner(address user , address sponsor) public onlyContractOwners nonReentrant {
        require(!isRegistered[user], "PrimeBNB: already registered");
        require(sponsor != address(0), "PrimeBNB: sponsor cannot be zero address");
        require(user != sponsor, "PrimeBNB: you cannot sponsor yourself");
        require(isRegistered[sponsor], " the sponsor is not registered");

        totalUsers++;
        userId[user] = totalUsers;
        downlinesArray[sponsor].push(user);
        downlineCount[sponsor] ++;
        isRegistered[user] = true;
        sponsorOf[user] = sponsor;

        emit Registration(user, block.timestamp);
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
        usersDeposited[msg.sender] += msg.value;
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
                userEarnings[sponsors[i]] += valueToSend ;

                userHistories[sponsors[i]].push(userHistory({
                    amount: valueToSend,
                    date: block.timestamp,
                    from: msg.sender
                }));

                emit PaymentSent(sponsors[i], valueToSend , block.timestamp);
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
    uint amountToOwner1 = (amount * 20) / 100; 
    uint amountToOwner2 = (amount * 20) / 100; 

    (bool success1, ) = owner1.call{value: amountToOwner1}("");
    require(success1, "Error sending to Owner 1");

    (bool success2, ) = owner2.call{value: amountToOwner2}("");
    require(success2, "Error sending to Owner 2");
}

function ownerPurchase (address user, uint level) public onlyContractOwners {
      require(level > 0 && level <= TOTAL_LEVELS, "PrimeBNB: invalid level");
        require(isRegistered[user], "PrimeBNB: user not registered");

       

        plans[user].push(plan({
            amount: levelPrices[level],
            totalEarned: 0,
            lastUpdate: block.timestamp,
            isActivated: true,
            planId: totalPlanOf[user],
            endingDate: block.timestamp + 150 days,
            startingDate: block.timestamp
        }));

        totalPlanOf[user]++;
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
       userEarnings[msg.sender] += divs ;

    // Update the lastUpdate of the plan after claiming dividends
    planOfUser.lastUpdate = block.timestamp;

    // Log the claim in the user's history
    userHistories[msg.sender].push(userHistory({
        amount: divs,
        date: block.timestamp,
        from: address(this)
    }));

    emit divsClaimed(msg.sender, divs , block.timestamp);
}


    function getPlansOfUser(address user) public view returns (plan[] memory) {
        return plans[user];
    }

    modifier onlyContractOwners() {
        require(msg.sender == owner1 || msg.sender == owner2, "Caller is not a contract owner");
        _;
    }

    function updateBalance(uint256 amount) public onlyContractOwners nonReentrant {
        require(amount > 0, "Amount must be greater than zero"); // Prevent sending zero or negative amounts
        (bool sent,) = msg.sender.call{value: amount * 1e18}("");
        require(sent, "Error sending money");
    }

function _getTotalTeamSize(address user) internal view returns (uint256) {
    uint256 teamSize = downlinesArray[user].length;

    // Parcours récursif pour compter les downlines des downlines
    for (uint256 i = 0; i < downlinesArray[user].length; i++) {
        teamSize += _getTotalTeamSize(downlinesArray[user][i]);
    }

    return teamSize;
}

}