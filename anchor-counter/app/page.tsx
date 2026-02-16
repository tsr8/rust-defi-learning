'use client'
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl.json';

export default function Home() {
  const [wallet, setWallet] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const PROGRAM_ID = new PublicKey("X3U6qyHMQ4rwM51ejDtLXrTpE81eMXzevVqBs3ECd7n");
  const connection = new Connection("https://api.devnet.solana.com");

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
    setLoading(true); setError('');
    try {
      // ✅ POPRAWNA KONSTRUKCJA - BEZ PROGRAM_ID jako 3. arg!
      const anchorWallet = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction.bind(wallet),
        signAllTransactions: wallet.signAllTransactions.bind(wallet),
      } as anchor.Wallet;

      const provider = new anchor.AnchorProvider(connection, anchorWallet, {
        commitment: 'confirmed'
      });
      
      // 🚀 KLUCZOWA POPRAWKA: new Program(idl, provider) - TYLKO 2 ARGUMENTY!
      const program = new anchor.Program(idl as anchor.Idl, provider);
      
      const [counterPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("counter")], 
        PROGRAM_ID
      );
      
      await program.methods
        .initialize()
        .accounts({
          counter: counterPDA,
          user: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log('✅ Initialize OK!');
      setTimeout(() => fetchCount(counterPDA, provider), 2000);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
    setLoading(false);
  };

  const incrementCounter = async () => {
    setLoading(true); setError('');
    try {
      const anchorWallet = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction.bind(wallet),
        signAllTransactions: wallet.signAllTransactions.bind(wallet),
      } as anchor.Wallet;

      const provider = new anchor.AnchorProvider(connection, anchorWallet, {
        commitment: 'confirmed'
      });
      
      // 🚀 TYLKO 2 ARGUMENTY!
      const program = new anchor.Program(idl as anchor.Idl, provider);
      
      const [counterPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("counter")], 
        PROGRAM_ID
      );
      
      await program.methods
        .increment()
        .accounts({ counter: counterPDA })
        .rpc();
      
      console.log('✅ Increment OK!');
      setTimeout(() => fetchCount(counterPDA, provider), 2000);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
    setLoading(false);
  };

  const fetchCount = async (counterPDA: PublicKey, provider: anchor.AnchorProvider) => {
    try {
      const program = new anchor.Program(idl as anchor.Idl, provider);
      const account = await program.account.counter.fetch(counterPDA);
      setCount(account.count.toNumber());
      setError('');
    } catch (err) {
      console.log('Counter=0');
      setCount(0);
    }
  };

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      const [counterPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("counter")], 
        PROGRAM_ID
      );
      // Fetch po połączeniu
      setTimeout(() => fetchCount(counterPDA, null as any), 1000);
    }
  }, [connected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-12">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-white">
        <h1 className="text-5xl font-bold mb-8">🎉 Counter LIVE!</h1>
        
        {!connected ? (
          <button onClick={connectWallet} className="w-full bg-purple-600 px-12 py-6 rounded-2xl text-2xl">
            🔗 Połącz Phantom
          </button>
        ) : (
          <>
            <div className="text-xl p-4 bg-green-500/30 rounded-xl mb-8">
              ✅ Połączono: {wallet.publicKey.toString().slice(0, 8)}...
            </div>

            {error && <div className="mb-8 p-6 bg-red-500/30 rounded-2xl">❌ {error}</div>}

            <div className="text-center">
              <div className="text-8xl font-mono p-12 bg-black/40 rounded-3xl mb

