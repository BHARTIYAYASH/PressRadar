
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface PressRegistrationProps {
  onRegister: (profile: UserProfile) => void;
}

export const PressRegistration: React.FC<PressRegistrationProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [bureau, setBureau] = useState('Central Intelligence');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onRegister({
      name,
      bureau,
      idNumber: `PR-${Math.floor(Math.random() * 90000 + 10000)}`,
      isRegistered: true
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#E8E4D9] dark:bg-[#1A1A1A] p-1 shadow-2xl max-w-md w-full relative">
        <div className="border-4 border-double border-vintage-ink p-8 dark:border-noir-red/50">
          <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-black text-vintage-ink dark:text-noir-ink uppercase">Press Registration</h2>
            <div className="w-16 h-1 bg-vintage-red mx-auto my-2"></div>
            <p className="font-typewriter text-xs text-vintage-brown dark:text-noir-ink-muted">BUREAU OF NEWS INTELLIGENCE</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-headline font-bold text-sm mb-1 text-vintage-ink dark:text-noir-ink">Officer Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b-2 border-vintage-ink font-typewriter p-2 focus:outline-none dark:text-noir-ink dark:border-noir-ink-muted"
                placeholder="Type name..."
              />
            </div>
            <div>
              <label className="block font-headline font-bold text-sm mb-1 text-vintage-ink dark:text-noir-ink">Assigned Bureau</label>
              <select 
                value={bureau}
                onChange={(e) => setBureau(e.target.value)}
                className="w-full bg-transparent border-b-2 border-vintage-ink font-typewriter p-2 focus:outline-none dark:text-noir-ink dark:border-noir-ink-muted"
              >
                <option>Central Intelligence</option>
                <option>Financial Oversight</option>
                <option>Foreign Affairs</option>
                <option>Tech & Surveillance</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-vintage-ink text-vintage-paper py-3 font-headline font-bold uppercase tracking-widest hover:bg-vintage-red transition-colors dark:bg-noir-red dark:text-noir-bg"
            >
              Issue Credentials
            </button>
          </form>

          <div className="mt-8 text-[0.6rem] font-typewriter text-gray-500 uppercase text-center">
            * By registering, you agree to uphold the ethics of the free press.
          </div>
        </div>
      </div>
    </div>
  );
};
