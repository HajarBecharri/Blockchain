// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract InsuranceContract {
    struct Insurance {
       
        address etudiant;
        address society;
        uint256 amount;
        uint256 dateCreation;
        uint256 durationInDays;
        uint256 dateExpiration;
        
    }

    mapping(address => Insurance[]) public insurances;
    

    event InsuranceCreated(address indexed etudiant, address indexed society, uint256 amount, uint256 dateCreation, uint256 durationInDays, uint256 dateExpiration);
    event InsuranceStopped(uint256 indexed id);
    event InsuranceRestarted(uint256 indexed id);
    event FundTransferredToSociety(address indexed sender, address indexed society, uint256 amount);

    modifier onlySociety(uint256 _id) {
        require(msg.sender == insurances[msg.sender][_id].society, "Not authorized");
        _;
    }

    address payable owner; // Owner to receive funds
    address payable society;

    constructor() {
        owner = payable(0x7526fb9605FE387929143f626E82125EAf231B2d);
       
    }

    function createInsurance(address _society, uint256 _durationInDays) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_durationInDays > 0, "Invalid duration");

        uint256 dateCreation = block.timestamp;
        uint256 dateExpiration = dateCreation + (_durationInDays * 1 days);

        Insurance memory newInsurance = Insurance({
           
            etudiant: msg.sender,
            society: _society,
            amount: msg.value,
            dateCreation: dateCreation,
            durationInDays: _durationInDays,
            dateExpiration: dateExpiration
            
        });
        // Initialiser society avec la valeur de _society
        society = payable(_society);

        insurances[msg.sender].push(newInsurance);
        insurances[_society].push(newInsurance); // Add to society's insurances

        emit InsuranceCreated( msg.sender, _society, msg.value, dateCreation, _durationInDays, dateExpiration);

       
    }

    function stopInsurance(uint256 _id) external onlySociety(_id) {
       

    
        emit InsuranceStopped(_id);
    }

    function restartInsurance(uint256 _id) external {
       
      

        emit InsuranceRestarted(_id);
    }

    function getInsurances() external view returns (Insurance[] memory) {
        return insurances[msg.sender];
    }

    function transferToSociety() external payable {
        require(society != address(0), "Society address not set");
        society.transfer(msg.value);
        // Emit an event to record the success of the transfer
        emit FundTransferredToSociety(msg.sender, society, msg.value);
    }
}