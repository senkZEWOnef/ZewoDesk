'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const defaultNavigationButtons = [
  {
    id: 'github',
    title: 'GitHub',
    description: 'Access your repositories',
    icon: '⚡',
    iconType: 'emoji' as const,
    url: 'https://github.com',
    color: 'var(--accent-blue)',
    isDefault: true
  },
  {
    id: 'render',
    title: 'Render',
    description: 'Deploy and manage apps',
    icon: '🎯',
    iconType: 'emoji' as const,
    url: 'https://dashboard.render.com',
    color: 'var(--accent-purple)',
    isDefault: true
  },
  {
    id: 'neon',
    title: 'Neon Database',
    description: 'Manage your databases',
    icon: '🗄️',
    iconType: 'emoji' as const,
    url: 'https://neon.tech',
    color: 'var(--accent-green)',
    isDefault: true
  },
  {
    id: 'supabase',
    title: 'Supabase',
    description: 'Backend as a service',
    icon: '⚡',
    iconType: 'emoji' as const,
    url: 'https://supabase.com/dashboard',
    color: 'var(--accent-green)',
    isDefault: true
  },
  {
    id: 'netlify',
    title: 'Netlify',
    description: 'Deploy and manage sites',
    icon: '🚀',
    iconType: 'emoji' as const,
    url: 'https://app.netlify.com/teams/senkzewonef/projects',
    color: 'var(--accent-blue)',
    isDefault: true
  },
  {
    id: 'website',
    title: 'Website',
    description: 'Visit your main site',
    icon: '🌐',
    iconType: 'emoji' as const,
    url: 'https://byzewo.com',
    color: 'var(--accent-purple)',
    isDefault: true
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Manage your portfolio',
    icon: '📁',
    iconType: 'emoji' as const,
    url: '/projects',
    color: 'var(--accent-blue)',
    internal: true,
    isDefault: true
  },
  {
    id: 'meta',
    title: 'Meta',
    description: 'View meta information',
    icon: '📊',
    iconType: 'emoji' as const,
    url: '/meta',
    color: 'var(--accent-orange)',
    internal: true,
    isDefault: true
  },
  {
    id: 'vault',
    title: 'Vault',
    description: 'Secure file storage',
    icon: '🗃️',
    iconType: 'emoji' as const,
    url: '/vault',
    color: 'var(--accent-red)',
    internal: true,
    secure: true,
    isDefault: true
  }
];

interface Card {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconType: 'emoji' | 'image';
  iconImage?: string;
  url: string;
  color: string;
  internal?: boolean;
  secure?: boolean;
  isDefault?: boolean;
  isCustom?: boolean;
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customCards, setCustomCards] = useState<Card[]>([]);
  const [defaultCards, setDefaultCards] = useState<Card[]>(defaultNavigationButtons);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    icon: '🔗',
    iconType: 'emoji' as 'emoji' | 'image',
    iconImage: '',
    url: '',
    color: 'var(--accent-blue)'
  });
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('zewo_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
      // Load custom cards from localStorage
      const savedCustomCards = localStorage.getItem('zewo_custom_cards');
      if (savedCustomCards) {
        setCustomCards(JSON.parse(savedCustomCards));
      }
      // Load modified default cards from localStorage
      const savedDefaultCards = localStorage.getItem('zewo_default_cards');
      if (savedDefaultCards) {
        setDefaultCards(JSON.parse(savedDefaultCards));
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const saveCustomCards = (cards: Card[]) => {
    localStorage.setItem('zewo_custom_cards', JSON.stringify(cards));
    setCustomCards(cards);
  };

  const saveDefaultCards = (cards: Card[]) => {
    localStorage.setItem('zewo_default_cards', JSON.stringify(cards));
    setDefaultCards(cards);
  };

  const handleAddCard = () => {
    if (!newCard.title || !newCard.url) return;
    if (newCard.iconType === 'image' && !newCard.iconImage) return;

    const card: Card = {
      id: Date.now().toString(),
      title: newCard.title,
      description: newCard.description,
      icon: newCard.icon,
      iconType: newCard.iconType,
      iconImage: newCard.iconImage,
      url: newCard.url.startsWith('http') ? newCard.url : `https://${newCard.url}`,
      color: newCard.color,
      isCustom: true
    };

    const updatedCards = [...customCards, card];
    saveCustomCards(updatedCards);
    resetForm();
    setShowAddCardModal(false);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setNewCard({
      title: card.title,
      description: card.description,
      icon: card.icon,
      iconType: card.iconType,
      iconImage: card.iconImage || '',
      url: card.url,
      color: card.color
    });
    setShowAddCardModal(true);
  };

  const handleUpdateCard = () => {
    if (!editingCard || !newCard.title || !newCard.url) return;
    if (newCard.iconType === 'image' && !newCard.iconImage) return;

    const updatedCard = {
      ...editingCard,
      title: newCard.title,
      description: newCard.description,
      icon: newCard.icon,
      iconType: newCard.iconType,
      iconImage: newCard.iconImage,
      url: newCard.url.startsWith('http') ? newCard.url : `https://${newCard.url}`,
      color: newCard.color
    };

    if (editingCard.isDefault) {
      const updatedDefaultCards = defaultCards.map(card =>
        card.id === editingCard.id ? updatedCard : card
      );
      saveDefaultCards(updatedDefaultCards);
    } else {
      const updatedCustomCards = customCards.map(card =>
        card.id === editingCard.id ? updatedCard : card
      );
      saveCustomCards(updatedCustomCards);
    }

    resetForm();
    setEditingCard(null);
    setShowAddCardModal(false);
  };

  const handleDeleteCard = (cardId: string) => {
    const cardToDelete = [...defaultCards, ...customCards].find(card => card.id === cardId);
    if (!cardToDelete) return;

    // First confirm deletion
    if (!confirm(`Are you sure you want to delete "${cardToDelete.title}"?`)) {
      return;
    }

    // Then require password
    const password = prompt('Enter admin password to confirm deletion:');
    if (password !== 'Poesie509$$$') {
      if (password !== null) {
        alert('Incorrect password. Deletion cancelled.');
      }
      return;
    }

    // Proceed with deletion
    if (cardToDelete.isDefault) {
      const updatedDefaultCards = defaultCards.filter(card => card.id !== cardId);
      saveDefaultCards(updatedDefaultCards);
    } else {
      const updatedCustomCards = customCards.filter(card => card.id !== cardId);
      saveCustomCards(updatedCustomCards);
    }

    // Success message
    alert(`"${cardToDelete.title}" has been deleted successfully.`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setNewCard({
        ...newCard,
        iconImage: imageData,
        iconType: 'image'
      });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setNewCard({
      title: '',
      description: '',
      icon: '🔗',
      iconType: 'emoji',
      iconImage: '',
      url: '',
      color: 'var(--accent-blue)'
    });
  };

  const closeModal = () => {
    setShowAddCardModal(false);
    setEditingCard(null);
    resetForm();
  };

  const handleNavigation = (button: Card) => {
    if (button.secure) {
      // Handle secure vault access
      const password = prompt('Enter passcode to access secure vault:');
      if (password === 'Poesie509$$$') {
        router.push(button.url);
      } else if (password !== null) {
        alert('Invalid passcode');
      }
    } else if (button.internal) {
      router.push(button.url);
    } else {
      window.open(button.url, '_blank');
    }
  };

  // Combine default and custom cards
  const allCards = [...defaultCards, ...customCards];

  const handleLogout = () => {
    localStorage.removeItem('zewo_auth');
    document.cookie = 'zewo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: 'var(--space-2xl) var(--space-lg)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
        zIndex: 0
      }} />
      
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Modern Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-2xl)'
        }}>
          <div style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '48px',
            margin: '0 auto var(--space-xl) auto',
            boxShadow: 'var(--shadow-xl), var(--shadow-glow)',
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
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: 'var(--space-sm)',
            background: 'linear-gradient(135deg, var(--accent-blue-light), var(--accent-purple-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            ZewoDesk
          </h1>
          
          <p style={{
            color: 'var(--text-tertiary)',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your unified development workspace — streamlined, secure, and designed for productivity
          </p>
        </div>

        {/* Add Card Button */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <button
            onClick={() => setShowAddCardModal(true)}
            className="btn btn-lg"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow)'
            }}
          >
            <span style={{ fontSize: '1.125rem' }}>✨</span>
            Add Custom Card
          </button>
        </div>

        {/* Modern Navigation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-2xl)'
        }}>
          {allCards.map((button, index) => (
            <div
              key={`${button.id}-${index}`}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2xl) var(--space-xl)',
                cursor: 'pointer',
                transition: 'var(--transition-slow)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow)';
                // Show action buttons on hover
                const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                if (actions) {
                  actions.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                // Hide action buttons
                const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                if (actions) {
                  actions.style.opacity = '0.6';
                }
              }}
            >
              {/* Card actions - Show on ALL cards now */}
              <div 
                className="card-actions"
                style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  display: 'flex',
                  gap: 'var(--space-sm)',
                  opacity: 0.6,
                  transition: 'var(--transition)',
                  zIndex: 20
                }}
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditCard(button);
                  }}
                  className="btn-ghost btn-sm"
                  style={{
                    minWidth: 'auto',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    fontSize: '0.875rem',
                    backdropFilter: 'blur(10px)',
                    background: 'var(--bg-glass)',
                    position: 'relative',
                    zIndex: 21
                  }}
                  title="Edit card"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDeleteCard(button.id);
                  }}
                  className="btn-danger btn-sm"
                  style={{
                    minWidth: 'auto',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    fontSize: '0.875rem',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(239, 68, 68, 0.8)',
                    position: 'relative',
                    zIndex: 21
                  }}
                  title="Delete card"
                >
                  ×
                </button>
              </div>

              {/* Clickable card content area */}
              <div 
                onClick={() => handleNavigation(button)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  cursor: 'pointer'
                }}
              />
              {/* Card content with proper z-index */}
              <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
                {/* Color accent bar */}
                <div style={{
                  position: 'absolute',
                  top: '-var(--space-2xl)',
                  left: '-var(--space-xl)',
                  right: '-var(--space-xl)',
                  height: '4px',
                  background: `linear-gradient(90deg, ${button.color}, ${button.color}88)`,
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                }} />
                
                {/* Icon with glow effect */}
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--space-lg)',
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  margin: '0 auto'
                }}>
                  {'iconType' in button && button.iconType === 'image' && button.iconImage ? (
                    <img 
                      src={button.iconImage} 
                      alt={button.title}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    />
                  ) : (
                    button.icon
                  )}
                </div>
                
                {/* Title */}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em'
                }}>
                  {button.title}
                  {('secure' in button && button.secure) && (
                    <span style={{
                      fontSize: '0.75rem',
                      marginLeft: 'var(--space-sm)',
                      color: 'var(--accent-red-light)'
                    }}>🔒</span>
                  )}
                </h3>
                
                {/* Description */}
                <p style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '0.9375rem',
                  lineHeight: '1.5'
                }}>
                  {button.description}
                </p>
              </div>
              
              {/* Hover gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, transparent, ${button.color}10)`,
                opacity: 0,
                transition: 'var(--transition)',
                borderRadius: 'var(--radius-lg)',
                zIndex: 2
              }} className="hover-overlay" />
            </div>
          ))}
        </div>

        {/* Modern Logout Section */}
        <div style={{ 
          textAlign: 'center',
          marginTop: 'var(--space-2xl)',
          paddingTop: 'var(--space-2xl)',
          borderTop: '1px solid var(--border)'
        }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            marginBottom: 'var(--space-lg)'
          }}>
            Need to step away?
          </p>
          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)'
            }}
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>

        {/* Add/Edit Card Modal */}
        {showAddCardModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-lg)'
          }}>
            <div style={{
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-2xl)',
              width: '100%',
              maxWidth: '500px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-light)',
              backdropFilter: 'blur(20px)',
              animation: 'slideInDown 0.3s ease-out'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-xl)'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-xs)',
                    letterSpacing: '-0.01em'
                  }}>
                    {editingCard ? 'Edit Card' : 'Add New Card'}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-tertiary)',
                    lineHeight: '1.4'
                  }}>
                    {editingCard ? 'Update your custom card details' : 'Create a new dashboard shortcut'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="btn-ghost btn-sm"
                  style={{
                    minWidth: 'auto',
                    padding: 'var(--space-sm)'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    Card Title *
                  </label>
                  <input
                    type="text"
                    value={newCard.title}
                    onChange={(e) => setNewCard({...newCard, title: e.target.value})}
                    placeholder="e.g., Figma, Discord, Linear"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    Icon Type
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <button
                      type="button"
                      onClick={() => setNewCard({...newCard, iconType: 'emoji', iconImage: ''})}
                      className={newCard.iconType === 'emoji' ? 'btn btn-sm' : 'btn-secondary btn-sm'}
                      style={{ flex: 1 }}
                    >
                      📱 Emoji
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCard({...newCard, iconType: 'image'})}
                      className={newCard.iconType === 'image' ? 'btn btn-sm' : 'btn-secondary btn-sm'}
                      style={{ flex: 1 }}
                    >
                      🖼️ Image
                    </button>
                  </div>

                  {newCard.iconType === 'emoji' ? (
                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={newCard.icon}
                        onChange={(e) => setNewCard({...newCard, icon: e.target.value})}
                        placeholder="🎨"
                        style={{ 
                          flex: 1,
                          textAlign: 'center',
                          fontSize: '1.25rem'
                        }}
                      />
                      <div style={{
                        width: '48px',
                        height: '48px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        background: 'var(--bg-tertiary)'
                      }}>
                        {newCard.icon}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ 
                          width: '100%',
                          padding: 'var(--space-md)',
                          border: '2px dashed var(--border)',
                          borderRadius: 'var(--radius)',
                          background: 'var(--bg-tertiary)',
                          cursor: 'pointer'
                        }}
                      />
                      {newCard.iconImage && (
                        <div style={{ 
                          marginTop: 'var(--space-md)',
                          textAlign: 'center'
                        }}>
                          <img 
                            src={newCard.iconImage} 
                            alt="Preview" 
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: 'var(--radius)',
                              objectFit: 'cover',
                              boxShadow: 'var(--shadow-md)'
                            }}
                          />
                          <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--space-sm)'
                          }}>
                            Preview (64x64px recommended)
                          </p>
                        </div>
                      )}
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: 'var(--space-sm)'
                      }}>
                        Upload a square image (PNG, JPG, SVG) • Max 2MB
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={newCard.description}
                    onChange={(e) => setNewCard({...newCard, description: e.target.value})}
                    placeholder="Brief description of this tool"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    URL *
                  </label>
                  <input
                    type="url"
                    value={newCard.url}
                    onChange={(e) => setNewCard({...newCard, url: e.target.value})}
                    placeholder="https://example.com or example.com"
                    style={{ 
                      width: '100%',
                      fontFamily: 'ui-monospace, monospace'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    Accent Color
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    {[
                      { name: 'Blue', value: 'var(--accent-blue)' },
                      { name: 'Purple', value: 'var(--accent-purple)' },
                      { name: 'Green', value: 'var(--accent-green)' },
                      { name: 'Red', value: 'var(--accent-red)' },
                      { name: 'Orange', value: 'var(--accent-orange)' },
                      { name: 'Pink', value: 'var(--accent-pink)' }
                    ].map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewCard({...newCard, color: color.value})}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: newCard.color === color.value ? '3px solid var(--text-primary)' : '2px solid var(--border)',
                          background: color.value,
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: 'var(--space-md)',
                justifyContent: 'flex-end',
                marginTop: 'var(--space-xl)',
                paddingTop: 'var(--space-xl)',
                borderTop: '1px solid var(--border)'
              }}>
                <button
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCard ? handleUpdateCard : handleAddCard}
                  className="btn"
                  disabled={
                    !newCard.title || 
                    !newCard.url || 
                    (newCard.iconType === 'emoji' && !newCard.icon) ||
                    (newCard.iconType === 'image' && !newCard.iconImage)
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    opacity: (
                      !newCard.title || 
                      !newCard.url || 
                      (newCard.iconType === 'emoji' && !newCard.icon) ||
                      (newCard.iconType === 'image' && !newCard.iconImage)
                    ) ? 0.5 : 1
                  }}
                >
                  <span>{editingCard ? '💾' : '✨'}</span>
                  {editingCard ? 'Update Card' : 'Create Card'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}