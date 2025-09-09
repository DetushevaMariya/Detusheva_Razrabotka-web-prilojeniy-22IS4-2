import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles.css';
import '../assets/Header.css';
import Logo from './Logo';
import userPhoto from '../assets/photo/man.jpg';
import { MenuIcon, HeartIcon, BoxIcon, CartIcon } from './Icons';
import AuthModal from './AuthModal';

const Header = ({
  searchQuery,
  setSearchQuery,
  searchHistory,
  onSearch
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthOpen(false); 
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthOpen(false); 
  };

  return (
    <div style={{ width: '1440px', margin: '0 auto', padding: '0' }}>
      <header className="header">
        <div className="logo-container">
          <Logo />
          <span>СЕВЕРЯНОЧКА</span>
        </div>

        <button
          className="catalog-button"
          onClick={() => window.location.href = '/catalog'} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: '#e8f5e8',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            textDecoration: 'none',
            transition: 'all 0.3s',
          }}
        >
          <MenuIcon />
          <span>Каталог</span>
        </button>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Найти товар"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <button 
            onClick={handleSearchClick} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            🔍
          </button>

          {showSuggestions && searchHistory.length > 0 && (
            <div className="search-suggestions">
              {searchHistory
                .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item}
                  </div>
                ))}
            </div>
          )}
        </div>

        <nav className="nav-links">
          <Link to="/favorites" className="nav-link">
            <HeartIcon />
            <span>Избранное</span>
          </Link>
          <a href="#" className="nav-link">
            <BoxIcon />
            <span>Заказы</span>
          </a>
          <a href="#" className="nav-link">
            <CartIcon />
            <span>Корзина</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>
        </nav>

        <div className="user-menu">
          {user ? (
            <div className="user-profile">
              <img src={user.photo || userPhoto} alt="User" />
              <span>{user.name}</span>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={() => setIsAuthOpen(true)}
            >
              Войти
            </button>
          )}
        </div>
      </header>

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)} 
          onLogin={handleLogin}       
          onRegister={handleRegister} 
        />
      )}
    </div>
  );
};

export default Header;