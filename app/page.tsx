'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (passcode === 'Poesie509$$$') {
      // Store auth token in both localStorage and cookies
      localStorage.setItem('zewo_auth', 'authenticated');
      document.cookie = 'zewo_auth=authenticated; path=/; max-age=86400'; // 24 hours
      router.push('/dashboard');
    } else {
      setError('Invalid passcode');
      setPasscode('');
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 'var(--space-lg)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
        zIndex: 1
      }} />
      
      <div style={{
        background: 'var(--bg-elevated)',
        padding: 'var(--space-2xl)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        maxWidth: '440px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        zIndex: 2,
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '40px',
          margin: '0 auto var(--space-xl) auto',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          position: 'relative'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ffffff, #f0f9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Z</span>
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: 'var(--space-sm)',
          background: 'linear-gradient(135deg, var(--accent-blue-light), var(--accent-purple-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em'
        }}>
          Welcome back Zewo
        </h1>
        
        <p style={{
          color: 'var(--text-tertiary)',
          marginBottom: 'var(--space-2xl)',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          Enter your access code to continue
        </p>

        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <div style={{ position: 'relative', marginBottom: 'var(--space-lg)' }}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              style={{
                width: '100%',
                padding: 'var(--space-lg) var(--space-xl)',
                fontSize: '1.125rem',
                textAlign: 'center',
                letterSpacing: '0.2em',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                transition: 'var(--transition)',
                fontFamily: 'ui-monospace, monospace'
              }}
              disabled={isLoading}
              autoFocus
            />
            {isLoading && (
              <div style={{
                position: 'absolute',
                right: 'var(--space-lg)',
                top: '50%',
                transform: 'translateY(-50%)',
                animation: 'spin 1s linear infinite'
              }}>
                ⟳
              </div>
            )}
          </div>
          
          {error && (
            <div style={{
              color: 'var(--accent-red-light)',
              marginBottom: 'var(--space-lg)',
              fontSize: '0.875rem',
              padding: 'var(--space-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !passcode}
            className={`btn btn-lg ${isLoading || !passcode ? '' : ''}`}
            style={{
              width: '100%',
              opacity: isLoading || !passcode ? 0.5 : 1,
              cursor: isLoading || !passcode ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 'var(--space-sm)' 
            }}>
              {isLoading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                  Verifying...
                </>
              ) : (
                <>
                  <span>→</span>
                  Enter ZewoDesk
                </>
              )}
            </span>
          </button>
          
          <div style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--border)'
          }}>
            <p style={{
              color: 'var(--text-tertiary)',
              fontSize: '0.875rem',
              marginBottom: 'var(--space-lg)',
              lineHeight: '1.4'
            }}>
              Just browsing? View the public portfolio
            </p>
            <button
              type="button"
              onClick={() => router.push('/projects?visitor=true')}
              className="btn-ghost"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                fontSize: '0.875rem'
              }}
            >
              <span>👀</span>
              View Public Projects
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}