import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Check, Lock, ShoppingCart, Star, X } from 'lucide-react';
import { products } from './products.js';
import './styles.css';

function ProductCard({ product, onView, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="badge">{product.badge}</span>
      </div>
      <div className="product-body">
        <div className="rating"><Star size={16} fill="currentColor" /> Trusted offer</div>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="product-footer">
          <strong>{product.price}</strong>
          <button onClick={() => onView(product)} className="text-button">View details</button>
        </div>
        <button onClick={() => onAdd(product)} className="primary full">Add to cart</button>
      </div>
    </article>
  );
}

function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-button close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <img src={product.image} alt={product.name} className="modal-image" />
        <div className="modal-content">
          <span className="badge inline">{product.badge}</span>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <ul>
            {product.bullets.map((item) => <li key={item}><Check size={18} /> {item}</li>)}
          </ul>
          <div className="modal-actions">
            <strong>{product.price}</strong>
            <button className="primary" onClick={() => { onAdd(product); onClose(); }}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, open, onClose, onRemove, onCheckout }) {
  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price.replace(/[^0-9.]/g, '')), 0), [cart]);
  return (
    <aside className={`cart ${open ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Your cart</h2>
        <button className="icon-button" onClick={onClose} aria-label="Close cart"><X size={20} /></button>
      </div>
      {cart.length === 0 ? (
        <p className="muted">Your cart is empty. Add an offer to continue.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.addedAt}`}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.price}</span>
                </div>
                <button className="text-button danger" onClick={() => onRemove(item.addedAt)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-total"><span>Total</span><strong>€{total.toFixed(2)}</strong></div>
          <button className="primary full checkout" onClick={onCheckout}>Begin checkout <ArrowRight size={18} /></button>
          <p className="secure"><Lock size={14} /> Checkout opens in a secure offer frame when supported.</p>
        </>
      )}
    </aside>
  );
}

function CheckoutFrame({ product, onClose }) {
  if (!product) return null;
  const isPlaceholder = product.checkoutUrl.includes('example.com');
  return (
    <div className="checkout-page">
      <div className="checkout-topbar">
        <div>
          <span className="eyebrow">Secure checkout</span>
          <h2>{product.name}</h2>
        </div>
        <button className="secondary" onClick={onClose}>Back to store</button>
      </div>
      {isPlaceholder ? (
        <div className="placeholder-checkout">
          <h3>Affiliate checkout URL needed</h3>
          <p>Replace <code>checkoutUrl</code> in <code>src/products.js</code> with the real sweepstake/affiliate checkout link. If the provider blocks iframes, this button can redirect instead.</p>
        </div>
      ) : (
        <iframe title="Offer checkout" src={product.checkoutUrl} className="checkout-frame" />
      )}
      <a className="fallback-link" href={product.checkoutUrl} target="_blank" rel="noreferrer">Open checkout in new tab</a>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  const addToCart = (product) => {
    setCart((items) => [...items, { ...product, addedAt: Date.now() }]);
    setCartOpen(true);
  };

  const beginCheckout = () => {
    const product = cart[cart.length - 1];
    if (product) {
      setCheckoutProduct(product);
      setCartOpen(false);
    }
  };

  if (checkoutProduct) return <CheckoutFrame product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />;

  return (
    <main>
      <nav className="nav">
        <div className="logo">Offer<span>Store</span></div>
        <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingCart size={18} /> Cart ({cart.length})</button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Premium product offers</span>
          <h1>Simple product pages with a custom checkout handoff.</h1>
          <p>Show product pictures, explain the offer, let visitors add to cart, then load your affiliate sweepstake checkout in an iframe or fallback redirect.</p>
          <div className="hero-actions">
            <a href="#products" className="primary">Shop offers</a>
            <a href="#how" className="secondary">How it works</a>
          </div>
        </div>
        <div className="hero-panel">
          <div className="mini-card"><Check /> Product catalog</div>
          <div className="mini-card"><Check /> Local cart</div>
          <div className="mini-card"><Check /> Iframe checkout slot</div>
        </div>
      </section>

      <section id="products" className="section">
        <div className="section-heading">
          <span className="eyebrow">Featured offers</span>
          <h2>Choose your offer</h2>
        </div>
        <div className="grid">
          {products.map((product) => <ProductCard key={product.id} product={product} onView={setSelected} onAdd={addToCart} />)}
        </div>
      </section>

      <section id="how" className="how section">
        <div>
          <span className="eyebrow">Funnel flow</span>
          <h2>Built to replace the Shopify checkout path.</h2>
        </div>
        <ol>
          <li><strong>Browse</strong><span>Visitor reviews product pictures and offer copy.</span></li>
          <li><strong>Add to cart</strong><span>Cart stores the selected offer locally.</span></li>
          <li><strong>Begin checkout</strong><span>Affiliate sweepstake checkout loads in the checkout frame.</span></li>
        </ol>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />
      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onRemove={(id) => setCart((items) => items.filter((item) => item.addedAt !== id))} onCheckout={beginCheckout} />
      {cartOpen && <div className="cart-scrim" onClick={() => setCartOpen(false)} />}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
