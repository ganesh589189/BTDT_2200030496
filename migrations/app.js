const contractAddress = "0x738eE8c6bc0C78189187c15F6E2a83BCf760c932";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ratePerUnit",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "unitsUsed",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "billAmount",
				"type": "uint256"
			}
		],
		"name": "BillGenerated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bills",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "previousReading",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentReading",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "unitsUsed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "billAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "previousReading",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentReading",
				"type": "uint256"
			}
		],
		"name": "generateBill",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBill",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "previousReading",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "currentReading",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "unitsUsed",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "billAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct ElectricityBill.Bill",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ratePerUnit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;

// Connect to MetaMask and the contract
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask to use this DApp!");
    }
});

// Generate bill function
async function generateBill() {
    const accounts = await web3.eth.getAccounts();
    const prevReading = document.getElementById("prevReading").value;
    const currReading = document.getElementById("currReading").value;

    if (!prevReading || !currReading) {
        alert("Please enter valid readings.");
        return;
    }

    try {
        await contract.methods.generateBill(prevReading, currReading)
            .send({ from: accounts[0] });

        const bill = await contract.methods.getBill().call({ from: accounts[0] });
        document.getElementById("billDetails").innerHTML =
            `Units Used: ${bill.unitsUsed}<br>Bill Amount: ${web3.utils.fromWei(bill.billAmount.toString(), 'ether')} Ether`;
    } catch (error) {
        console.error(error);
    }
}
