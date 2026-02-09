# Smart contract

## Code in blockchain

Code executes by trigger. Is lmmutable. Self executable. Deterministic, works the same every time.
Code is open source, everyone can see logic. Executions are public.

🚀 Solana Programs - Quick Summary
🧠 Key Concepts to Remember
1. NO "Smart Contracts" - They're "Programs"

    Program = logic (code)

    Account = state (data)

    Key: Logic and state are separated!

2. Program = Logic without state

    Program does NOT store data

    Acts like a function: input → processing → output

    All data is in Accounts passed as parameters

3. Account = Data Container

    Each Account has an owner (Program ID)

    Only the owner can modify Account data

    Two main types:

        User Accounts (owned by: System Program)

        Program Accounts (owned by: programs)

4. Instruction = Program Call

    Says: "Hey program, execute this function on these Accounts"

    Contains: which program, which Accounts, what data

5. Sealevel = Parallelism

    Multiple programs can run simultaneously

    Because they don't block each other (state is separated)

🔄 How It Works in Practice
Simple Flow:

    User creates a Transaction with an Instruction

    Instruction specifies: Program + Accounts + data

    Solana executes the Program on the provided Accounts

    Program modifies data in Accounts

    Blockchain state is updated

Mental Model:

Think of Excel:

    Program = Excel formula (e.g., =SUM(A1:A10))

    Accounts = Excel cells (A1, A2, A3...)

    Instruction = "Run SUM formula on cells A1 to A10"

⚡ Key Differences vs Ethereum
Ethereum	Solana
Smart Contract	Program
Contract storage	Accounts
Gas	Compute Units
Sequential	Parallel
Expensive storage	Cheap storage (rent)
🎯 5 Most Important Points
1. "State and logic are separated"

    This is the fundamental difference!

    Programs are "stateless" - they don't have their own data

2. "You must pass all Accounts"

    Program cannot find data on its own

    You must explicitly say: "use these Accounts"

3. "Programs call programs"

    CPI = Cross-Program Invocations

    One program can call another

    Like functions calling functions

4. "Rent = storage fee"

    Accounts pay "rent" for storing data

    If unpaid - data gets deleted

    Minimum period is ~2 years prepaid

5. "Everything is parallel"

    Thanks to Sealevel

    Many users → many transactions simultaneously

    Key to 65,000+ TPS

📚 Essential Vocabulary

    Program - code, logic

    Account - data, state

    Instruction - program call

    Transaction - set of Instructions

    Program ID - program address

    Owner - who controls the Account

    Lamports - smallest SOL unit (10⁻⁹)

    Rent - storage fee

    CPI - Cross-Program Invocation

    Sealevel - parallel runtime

💡 "Ahaaa!" Moments
When you understand:

    "Aha! Program is like a mathematical function f(x) = ..."

    "Aha! Accounts are like variables passed to the function"

    "Aha! That's why everything can run in parallel!"

    "Aha! That's why storage is cheap - you only pay for Accounts!"

Common beginner mistakes:

    ❌ Looking for where program stores data (IT DOESN'T!)

    ❌ Trying to add storage to program (CAN'T!)

    ❌ Forgetting to pass all required Accounts

    ❌ Not understanding Account ownership

🚀 What to Learn Next?
Learning order:

    Model basics (you know this!) ← YOU'RE HERE

    Anchor framework (simplifies development)

    CPI (how programs communicate)

    PDAs (Program Derived Addresses)

    Token Program (SPL) - most important program

    Rent and Account management

    Testing and deployment

Tools to start:

    Anchor - easiest starting point

    Solana CLI - interact with blockchain

    Solana Playground - web-based IDE

    Devnet - testing without real SOL

🎯 Summary in 3 Sentences

    Solana uses PROGRAMS (logic) and ACCOUNTS (data) - they're separated

    Programs are stateless - all data is in Accounts passed as parameters

    Thanks to this separation, execution is parallel → high TPS and low fees

Remember: Program = code, Account = data, Instruction = call, Transaction = set of calls.
