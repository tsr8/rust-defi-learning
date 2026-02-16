import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorCounter } from "../target/types/anchor_counter";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("anchor-counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorCounter as Program<AnchorCounter>;
  let counterPDA: PublicKey;

  it("Initializes counter", async () => {
    [counterPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("counter")],
      program.programId
    );

    await program.methods
      .initialize()
      .accounts({
        counter: counterPDA,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const counter = await program.account.counter.fetch(counterPDA);
    console.log("Counter:", counter.count.toString());
  });

  it("Increments counter", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterPDA,
      })
      .rpc();

    const counter = await program.account.counter.fetch(counterPDA);
    console.log("Counter after increment:", counter.count.toString());
  });
});
