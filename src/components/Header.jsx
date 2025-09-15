import React, { useState, useEffect } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    }
  }, []);

  //Функция для обновления счётчика
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  window.updateCartCount = updateCartCount;

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
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setIsAuthOpen(false); 
  };

  const handleRegister = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setIsDropdownOpen(false);
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
          <Link to="/cart" className="nav-link">
            <CartIcon />
            <span>Корзина</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </nav>

        <div className="user-menu">
          {user ? (
            <div className="user-profile">
              <img src={user.photo || userPhoto} alt="User" />
              <span>{user.name}</span>
              <svg
                className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
                viewBox="0 0 16 16"
                fill="currentColor"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <path d="M7.999 11.5l-3.5-3.5 1.414-1.414L7.999 9.672l3.5-3.5 1.414 1.414L9.414 11.5H7.999z" />
              </svg>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              )}
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
