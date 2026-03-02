from web3 import Web3
import json

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

contract_address = "0xDd1eD1651b1006703De3266C21f5Dcc8DaaBB505"

with open("ESOPManagement.json") as f:
    abi = json.load(f)["abi"]

contract = w3.eth.contract(
    address=contract_address,
    abi=abi
)