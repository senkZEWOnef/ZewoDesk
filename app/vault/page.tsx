'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VaultItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  uploadDate: string;
  parentId?: string;
  fileType?: string;
}

export default function VaultPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('zewo_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
      // Load existing items from localStorage
      const savedItems = localStorage.getItem('vault_items');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const newFiles = Array.from(uploadedFiles).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'file' as const,
      size: file.size,
      fileType: file.type || 'application/octet-stream',
      uploadDate: new Date().toISOString(),
      parentId: currentFolder || undefined
    }));

    const updatedItems = [...items, ...newFiles];
    setItems(updatedItems);
    localStorage.setItem('vault_items', JSON.stringify(updatedItems));
  };

  const createFolder = () => {
    if (!folderName.trim()) return;

    const newFolder: VaultItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: folderName.trim(),
      type: 'folder',
      uploadDate: new Date().toISOString(),
      parentId: currentFolder || undefined
    };

    const updatedItems = [...items, newFolder];
    setItems(updatedItems);
    localStorage.setItem('vault_items', JSON.stringify(updatedItems));
    setFolderName('');
    setShowCreateFolder(false);
  };

  const openFolder = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  const goBack = () => {
    const currentFolderItem = items.find(item => item.id === currentFolder);
    setCurrentFolder(currentFolderItem?.parentId || null);
  };

  const getCurrentItems = () => {
    return items.filter(item => item.parentId === currentFolder);
  };

  const getCurrentPath = () => {
    if (!currentFolder) return 'Root';
    const path = [];
    let current = currentFolder;
    
    while (current) {
      const folder = items.find(item => item.id === current);
      if (folder) {
        path.unshift(folder.name);
        current = folder.parentId || null;
      } else {
        break;
      }
    }
    
    return path.join(' / ');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const deleteItem = (itemId: string) => {
    // If deleting a folder, also delete all items inside it
    const getItemsToDelete = (id: string): string[] => {
      const itemsToDelete = [id];
      const childItems = items.filter(item => item.parentId === id);
      childItems.forEach(child => {
        if (child.type === 'folder') {
          itemsToDelete.push(...getItemsToDelete(child.id));
        } else {
          itemsToDelete.push(child.id);
        }
      });
      return itemsToDelete;
    };

    const itemsToDelete = getItemsToDelete(itemId);
    const updatedItems = items.filter(item => !itemsToDelete.includes(item.id));
    setItems(updatedItems);
    localStorage.setItem('vault_items', JSON.stringify(updatedItems));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.startsWith('text/')) return '📝';
    if (type.includes('document') || type.includes('word')) return '📄';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📊';
    return '📁';
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
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, var(--accent-red), var(--accent-purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🗃️ Secure Vault
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px'
          }}>
            Upload and manage your important files securely
          </p>
        </div>

        {/* Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          padding: '16px 20px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentFolder && (
              <button
                onClick={goBack}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-blue)';
                  e.currentTarget.style.color = 'var(--accent-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                ← Back
              </button>
            )}
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              📁 {getCurrentPath()}
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateFolder(true)}
            style={{
              background: 'var(--accent-blue)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            + New Folder
          </button>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              minWidth: '400px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}>
                Create New Folder
              </h3>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') createFolder();
                  if (e.key === 'Escape') setShowCreateFolder(false);
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCreateFolder(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!folderName.trim()}
                  style={{
                    background: folderName.trim() ? 'var(--accent-blue)' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: folderName.trim() ? 'pointer' : 'not-allowed',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          style={{
            border: dragOver ? '2px dashed var(--accent-red)' : '2px dashed var(--border)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '40px',
            background: dragOver ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-secondary)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>
            {dragOver ? '📥' : '📂'}
          </div>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '4px',
            color: 'var(--text-primary)'
          }}>
            {dragOver ? 'Drop files here' : 'Upload Files'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {currentFolder ? `Files will be added to ${getCurrentPath()}` : 'Drag & drop files or click to browse'}
          </p>
          
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
            accept="*/*"
          />
        </div>

        {/* Items Grid */}
        {getCurrentItems().length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: 'var(--text-primary)'
            }}>
              {currentFolder ? 'Contents' : 'Vault Contents'} ({getCurrentItems().length})
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {getCurrentItems().map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    cursor: item.type === 'folder' ? 'pointer' : 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = item.type === 'folder' ? 'var(--accent-blue)' : 'var(--accent-red)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => item.type === 'folder' ? openFolder(item.id) : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px' }}>
                      {item.type === 'folder' ? '📁' : getFileIcon(item.fileType || '')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.name}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-secondary)',
                        marginTop: '2px'
                      }}>
                        {item.type === 'folder' 
                          ? `${items.filter(i => i.parentId === item.id).length} items`
                          : formatFileSize(item.size || 0)
                        }
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.type === 'folder') {
                          const childCount = items.filter(i => i.parentId === item.id).length;
                          if (childCount > 0) {
                            if (confirm(`This folder contains ${childCount} items. Delete everything?`)) {
                              deleteItem(item.id);
                            }
                          } else {
                            deleteItem(item.id);
                          }
                        } else {
                          deleteItem(item.id);
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontSize: '12px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-red)';
                        e.currentTarget.style.color = 'var(--accent-red)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '8px'
                  }}>
                    {item.type === 'folder' ? 'Created' : 'Uploaded'}: {new Date(item.uploadDate).toLocaleDateString()}
                  </div>
                  {item.type === 'folder' && (
                    <div style={{
                      fontSize: '10px',
                      color: 'var(--accent-blue)',
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      Click to open folder
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {getCurrentItems().length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 32px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {currentFolder ? '📁' : '🗃️'}
            </div>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>
              {currentFolder ? 'This folder is empty' : 'Your vault is empty'}
            </h3>
            <p>
              {currentFolder ? 'Upload files or create folders to organize your content' : 'Create your first folder or upload files to get started'}
            </p>
          </div>
        )}

        {/* Back to Dashboard */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-red)';
              e.currentTarget.style.color = 'var(--accent-red)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}