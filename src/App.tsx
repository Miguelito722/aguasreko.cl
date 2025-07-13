import React from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Products from './components/Products';
import InstagramFeed from './components/InstagramFeed';
import ValueProposition from './components/ValueProposition';
import AboutSection from './components/AboutSection';
import ForCompanies from './components/ForCompanies';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import PaymentRouter from './components/PaymentRouter';
import ConfigurationRouter from './components/ConfigurationRouter';
import EnterpriseQuoteRouter from './components/EnterpriseQuoteRouter';
import EnterpriseRouter from './components/EnterpriseRouter';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  // Check if we're on the payment page
  const isPaymentPage = window.location.pathname === '/payment' || window.location.hash === '#payment';
  
  // Check if we're on the configuration page
  const isConfigurationPage = window.location.pathname === '/configuracion';

  // Check if we're on the enterprise quote page
  const isEnterpriseQuotePage = window.location.pathname === '/cotizacion-empresas';

  // Check if we're on the enterprise page
  const isEnterprisePage = window.location.pathname === '/empresas';

  // Check if we're on the analytics page
  const isAnalyticsPage = window.location.pathname === '/analytics';
  if (isPaymentPage) {
    return (
      <AuthProvider>
        <PaymentRouter />
      </AuthProvider>
    );
  }

  if (isConfigurationPage) {
    return (
      <AuthProvider>
        <ConfigurationRouter />
      </AuthProvider>
    );
  }

  if (isEnterpriseQuotePage) {
    return (
      <AuthProvider>
        <EnterpriseQuoteRouter />
      </AuthProvider>
    );
  }

  if (isEnterprisePage) {
    return (
      <AuthProvider>
        <EnterpriseRouter />
      </AuthProvider>
    );
  }

  if (isAnalyticsPage) {
    return (
      <AuthProvider>
        <AnalyticsDashboard />
      </AuthProvider>
    );
  }
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Hero />
            <HowItWorks />
            <Products />
            <InstagramFeed />
            <ValueProposition />
            <AboutSection />
            <ForCompanies />
            <MapSection />
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;