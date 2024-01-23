// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract ReclamationContract {
    struct Reclamation {
       
        address etudiant;
        address society;
        uint256 amount;
        uint timestamp;
    }

    mapping(address => Reclamation[]) public reclamations;
    address payable society;


    event ReclamationSubmitted (address indexed user, address indexed society, uint256 amount);
    event ReclamationProcessed( bool accept, address indexed society, uint256 amount);
    event FundTransferredToUser(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    address payable owner; // Owner to receive funds

    constructor() {
        owner = payable(0x7526fb9605FE387929143f626E82125EAf231B2d);
        
    }

    function submitReclamation(address etudiantAdd) external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        Reclamation memory newReclamation = Reclamation({
            etudiant:etudiantAdd ,
            society: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });

        reclamations[msg.sender].push(newReclamation); // Add to etudiant's reclamations
        reclamations[etudiantAdd].push(newReclamation); // Add to society's reclamations
        // Initialiser society avec la valeur de _society
        society = payable(etudiantAdd);
        emit ReclamationSubmitted( msg.sender, society, msg.value);

       
    }

    function getReclamationsByUser() external view returns (Reclamation[] memory) {
        return reclamations[msg.sender];
    }

    function processReclamation(uint256 reclamationId, bool accept) external onlyOwner {
       
       

        // Update the status based on the 'accept' parameter
        if (accept) {
           // reclamations[msg.sender][reclamationId].status = "Approved";
            // Transfer the reclamation amount to the etudiant
            address payable etudiantAddress = payable(reclamations[msg.sender][reclamationId].etudiant);
            uint256 amountToSend = reclamations[msg.sender][reclamationId].amount;

            // Attempt to send funds
            bool success = etudiantAddress.send(amountToSend);

            // Check if the transfer was successful
            if (success) {
                // Fund transfer successful
                emit FundTransferredToUser(etudiantAddress, amountToSend);
            } else {
                // Fund transfer failed, handle error
                revert("Fund transfer failed");
            }
        } else {
           // reclamations[msg.sender][reclamationId].status = "Rejected";
        }

        // You can emit an event or perform additional actions here if needed
        emit ReclamationProcessed( accept, msg.sender, reclamations[msg.sender][reclamationId].amount);
    }

  

    function transferToUser(address user, uint256 amount) external onlyOwner {
    require(amount > 0, "Amount must be greater than 0");
    payable(user).transfer(amount);
    emit FundTransferredToUser(user, amount);
}

}
