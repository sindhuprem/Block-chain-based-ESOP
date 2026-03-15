@echo off
start cmd /k "cd /d "C:\Users\SRUTHI A\Desktop\esop-blockchain-platform\Block-chain-based-ESOP\blockchain" && npx ganache --port 8545 --mnemonic "test test test test test test test test test test test junk" --db "./ganache-db""
timeout /t 3
start cmd /k "cd /d "C:\Users\SRUTHI A\Desktop\esop-blockchain-platform\Block-chain-based-ESOP\backend" && venv\Scripts\activate && python app.py"
start cmd /k "cd /d "C:\Users\SRUTHI A\Desktop\esop-blockchain-platform\Block-chain-based-ESOP\my-react-app" && npm run dev"