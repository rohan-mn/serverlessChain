# serverlessChain

A local, end-to-end demo of a **serverless blockchain transaction system**:

- **Hardhat**: local EVM node for test accounts & RPC  
- **AWS Lambda (via LocalStack)**:  
  - `send-native`: sends a native ETH transfer via RPC  
  - `recent-txs`: reads recent transactions  
- **web**: front-end to drive the flows

---

## 📁 Folder Structure
serverlessChain/  
├─ blockchain/ # Hardhat project (contracts, scripts, config)  
├─ lambdas/  
│ ├─ send-native/ # Lambda to send native transfers  
│ └─ recent-txs/ # Lambda to read recent transactions  
└─ web/ # Front-end app (dev server via npm run dev)  



---

## ⚙️ Prerequisites

- **Node.js 18+ / npm**
- **Docker Desktop** (for LocalStack)
- **AWS CLI v2**
- **PowerShell** (commands below use PowerShell syntax)
- **Git** (optional, for cloning)

> 💡 If you’re on Windows + WSL, stick to one environment consistently (don’t mix paths).

---

## 🚀 Quick Start (PowerShell)

Run everything **in order** below.

### 1️⃣ Start the Hardhat Node

```powershell
# Start the Hardhat node
npx hardhat node
```

### 2️⃣ Start LocalStack (in a separate terminal)
```powershell
# Start the LocalStack container from any directory  
docker run --rm -it -p 4566:4566 -p 4571:4571 -v "/var/run/docker.sock:/var/run/docker.sock" localstack/localstack
```
### 3️⃣ Configure LocalStack Environment  
```powershell
# --- ENV for LocalStack ---
$ENDP = "http://localhost:4566"
$env:AWS_ACCESS_KEY_ID = "test"
$env:AWS_SECRET_ACCESS_KEY = "test"
$env:AWS_DEFAULT_REGION = "us-east-1"
```
### 4️⃣ Build & Deploy the send-native Lambda  
```powershell
# ===== send-native =====
Set-Location "C:\VIT\Sem 7\PJT1New\lambdas\send-native"
npm install
npm run build

Set-Location "C:\VIT\Sem 7\PJT1New\lambdas"
if (Test-Path .\send.zip) { Remove-Item .\send.zip }
Compress-Archive -Path .\send-native\dist\* -DestinationPath .\send.zip -Force

# Create once (idempotent; ignore "already exists" error)
aws --endpoint-url $ENDP lambda create-function `
  --function-name send-native `
  --runtime nodejs20.x `
  --handler index.handler `
  --role "arn:aws:iam::000000000000:role/lambda-basic" `
  --zip-file "fileb://send.zip" `
  2>$null

# Always ensure latest code + env
aws --endpoint-url $ENDP lambda update-function-code `
  --function-name send-native `
  --zip-file fileb://send.zip

aws --endpoint-url $ENDP lambda update-function-configuration `
  --function-name send-native `
  --environment "Variables={SENDER_PRIV_KEY='0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',RPC_URL='http://host.docker.internal:8545'}"
```

### 5️⃣ Build & Deploy the recent-txs Lambda  
```powershell
# ===== recent-txs =====
Set-Location "C:\VIT\Sem 7\PJT1New\lambdas\recent-txs"
npm install
npm run build

Set-Location "C:\VIT\Sem 7\PJT1New\lambdas"
if (Test-Path .\recent.zip) { Remove-Item .\recent.zip }
Compress-Archive -Path .\recent-txs\dist\* -DestinationPath .\recent.zip -Force

aws --endpoint-url $ENDP lambda create-function `
  --function-name recent-txs `
  --runtime nodejs20.x `
  --handler index.handler `
  --role "arn:aws:iam::000000000000:role/lambda-basic" `
  --zip-file "fileb://recent.zip" `
  2>$null

aws --endpoint-url $ENDP lambda update-function-code `
  --function-name recent-txs `
  --zip-file fileb://recent.zip

aws --endpoint-url $ENDP lambda update-function-configuration `
  --function-name recent-txs `
  --environment "Variables={RPC_URL='http://host.docker.internal:8545'}"

# Optional: quick sanity check
aws --endpoint-url $ENDP lambda list-functions | Out-String
```

### 6️⃣ Start the Web Frontend  
```powershell  
# From your web folder
npm install
npm run dev
```



