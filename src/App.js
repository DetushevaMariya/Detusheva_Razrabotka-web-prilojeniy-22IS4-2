import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import Promotions from './components/Promotions';
import News from './components/News';
import BuyAgo from './components/BuyAgo';
import SpecialOffersSection from './components/SpecialOffersSection';
import OurStores from './components/OurStores';
import ArticlesSection from './components/ArticlesSection';
import FavoritesPage from './components/FavoritesPage';
import CatalogPage from './components/CatalogPage';
import CategoryPage from './components/CategoryPage';
import AboutPage from './components/AboutPage';
import VacanciesPage from './components/VacanciesPage';
import ContactsPage from './components/ContactsPage';
import CartPage from './components/CartPage';
import DeliveryPage from './components/DeliveryPage';
import OrdersPage from './components/OrdersPage';
import Footer from './components/Footer';

// Страницы
import AllArticlesPage from './pages/AllArticlesPage';
import AllPromotionsPage from './pages/AllPromotionsPage';
import AllNewsPage from './pages/AllNewsPage';
import AllBuyAgoPage from './pages/AllBuyAgoPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [favorites, setFavorites] = useState([]);


  const [promotions, setPromotions] = useState([]);
  const [newsProducts, setNewsProducts] = useState([]); 
  const [buyAgoProducts, setBuyAgoProducts] = useState([]);
  const [articles, setArticles] = useState([]);

 
  useEffect(() => {
    // Акции
    fetch('http://localhost:5000/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data))
      .catch(err => console.error('Ошибка загрузки акций:', err));

    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setNewsProducts(data.slice(0, 8))) 
      .catch(err => console.error('Ошибка загрузки новинок:', err));

    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setBuyAgoProducts(data.slice(8, 16)))
      .catch(err => console.error('Ошибка загрузки "покупали раньше":', err));

    // Статьи (из таблицы news)
    fetch('http://localhost:5000/api/news')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error('Ошибка загрузки статей:', err));
  }, []);

  // --- Функция поиска ---
  const onSearch = (query) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setSearchHistory(prev => [query, ...prev.filter(item => item !== query)].slice(0, 5));
  };

  // --- Работа с избранным ---
  const toggleFavorite = (product) => {
    setFavorites(prev =>
      prev.some(fav => fav.id === product.id)
        ? prev.filter(fav => fav.id !== product.id)
        : [...prev, product]
    );
  };

  const isFavorite = (product) => {
    return favorites.some(fav => fav.id === product.id);
  };

  return (
    <Router>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchHistory={searchHistory}
        onSearch={onSearch}
      />
      <Hero />

      {/* Акции */}
      <Promotions
        promotions={promotions}
        onProductClick={() => {}}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />

      {/* Новинки */}
      <News
        products={newsProducts}
        onProductClick={() => {}}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />

      {/* Покупали раньше */}
      <BuyAgo
        products={buyAgoProducts}
        onProductClick={() => {}}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />

      <SpecialOffersSection />
      <OurStores />
      <ArticlesSection articles={articles} />

      <Routes>
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/category/:categoryKey" element={<CategoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/articles" element={<AllArticlesPage articles={articles} />} />
        <Route path="/promotions" element={<AllPromotionsPage promotions={promotions} />} />
        <Route path="/news" element={<AllNewsPage products={newsProducts} />} />
        <Route path="/buyago" element={<AllBuyAgoPage products={buyAgoProducts} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
