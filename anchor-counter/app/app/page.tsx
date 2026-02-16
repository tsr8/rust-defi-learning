'use client'
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import idl from '../../idl.json';

const PROGRAM_ID = new PublicKey("FvtceSCEtNKTBw5rfSLdyPxfB2grkrFGibpwZat8mifB");
const connection = new Connection("https://api.devnet.solana.com");

export default function Home() {
  const [wallet, setWallet] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getProvider = () => {
    const anchorWallet = {
      publicKey: wallet!.publicKey,
      signTransaction: wallet!.signTransaction.bind(wallet!),
      signAllTransactions: wallet!.signAllTransactions.bind(wallet!),
    } as anchor.Wallet;
    return new anchor.AnchorProvider(connection, anchorWallet, { commitment: 'confirmed' });
  };

  const connectWallet = async () => {
    try {
      const provider = (window as any)?.solana;
      if (provider?.isPhantom) {
        await provider.connect();
        setWallet(provider);
        setConnected(true);
        setError('');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const initializeCounter = async () => {
    if (!wallet) return;
    setLoading(true); setError('');
    try {
      const provider = getProvider();
      const program = new anchor.Program(idl as anchor.Idl, provider);
      const [counterPDA] = PublicKey.findProgramAddressSync([Buffer.from("counter")], PROGRAM_ID);
      
      await program.methods.initialize()
        .accounts({
          counter: counterPDA,
          user: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).rpc();
      
      setTimeout(() => fetchCount(counterPDA), 2000);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const incrementCounter = async () => {
    if (!wallet) return;
    setLoading(true); setError('');
    try {
      const provider = getProvider();
      const program = new anchor.Program(idl as anchor.Idl, provider);
      const [counterPDA] = PublicKey.findProgramAddressSync([Buffer.from("counter")], PROGRAM_ID);
      
      await program.methods.increment().accounts({ counter: counterPDA }).rpc();
      setTimeout(() => fetchCount(counterPDA), 2000);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchCount = async (counterPDA: PublicKey) => {
    try {
      if (!wallet) return;
      const provider = getProvider();
      const program = new anchor.Program(idl as anchor.Idl, provider);
      const account = await program.account.counter.fetch(counterPDA);
      setCount(account.count.toNumber());
    } catch (err) {
      setCount(0);
    }
  };

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      const [counterPDA] = PublicKey.findProgramAddressSync([Buffer.from("counter")], PROGRAM_ID);
      fetchCount(counterPDA);
    }
  }, [connected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-12">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-white">
        <h1 className="text-5xl font-bold mb-8 text-center">🎉 Counter LIVE!</h1>
        
        <div className="mb-12 p-8 bg-black/30 rounded-2xl">
          {!connected ? (
            <button onClick={connectWallet} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 px-12 py-6 rounded-2xl text-2xl font-bold">
              🔗 Połącz Phantom (Devnet)
            </button>
          ) : (
            <div className="text-xl p-4 bg-green-500/30 rounded-xl border-2 border-green-500">
              ✅ Połączono: {wallet!.publicKey!.toString().slice(0, 8)}...
            </div>
          )}
        </div>

        {error && <div className="mb-8 p-6 bg-red-500/20 border-2 border-red-500 rounded-2xl">❌ {error}</div>}

        {connected && (
          <div className="text-center">
            <div className="text-8xl font-mono mb-12 p-12 bg-black/40 rounded-3xl border-4 border-white/20">
              {count}
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
              <button onClick={initializeCounter} disabled={loading} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 px-12 py-8 rounded-2xl text-2xl font-bold shadow-2xl disabled:opacity-50">
                {loading ? '⏳' : '🚀 Initialize'}
              </button>
              <button onClick={incrementCounter} disabled={loading} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 px-12 py-8 rounded-2xl text-2xl font-bold shadow-2xl disabled:opacity-50">
                {loading ? '⏳' : '➕ Increment +1'}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <a href="https://explorer.solana.com/address/FvtceSCEtNKTBw5rfSLdyPxfB2grkrFGibpwZat8mifB?cluster=devnet" target="_blank" className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-xl text-xl font-bold">
            🌐 Solana Explorer
          </a>
        </div>
      </div>
    </div>
  );
}
