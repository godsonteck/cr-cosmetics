'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { BUSINESS } from '@/utils/constants';

export default function WhatsAppOrderButton() {
  const { items, total, totalCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const generateWhatsAppMessage = () => {
    let msg = `Hello ${BUSINESS.name}! 🇬🇭\nI would like to place an order from your online store:\n\n`;

    if (items.length > 0) {
      items.forEach((item, idx) => {
        const itemPrice = item.selectedVariant?.price || item.product.price;
        msg += `${idx + 1}. ${item.quantity}× ${item.product.name} (${formatPrice(itemPrice * item.quantity)})\n`;
      });
      msg += `\n*Estimated Total: ${formatPrice(total)}*\n`;
    } else {
      msg += `I am browsing your store and have an inquiry regarding product availability and delivery to Botwe/Accra.\n`;
    }

    msg += `\nStore: ${BUSINESS.location}`;
    return encodeURIComponent(msg);
  };

  const whatsappUrl = `https://wa.me/233592153306?text=${generateWhatsAppMessage()}`;

  return (
    <div className="wa-floating-container">
      {isOpen && (
        <div className="wa-popover">
          <div className="wa-popover-head">
            <div className="wa-agent-info">
              <span className="wa-avatar">CR</span>
              <div>
                <div className="wa-agent-name">{BUSINESS.name} Support</div>
                <div className="wa-agent-status">Online • Botwe Branch</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="wa-close-btn"
              aria-label="Close WhatsApp prompt"
            >
              &times;
            </button>
          </div>

          <div className="wa-popover-body">
            <p className="wa-welcome-text">
              👋 Hi there! Need quick assistance with a product or want to order your {totalCount > 0 ? `${totalCount} cart items` : 'skincare & groceries'} directly via WhatsApp?
            </p>
            {totalCount > 0 && (
              <div className="wa-cart-preview-box">
                <span>🛒 Cart ({totalCount} items): <strong>{formatPrice(total)}</strong></span>
              </div>
            )}
          </div>

          <div className="wa-popover-foot">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-chat-link-btn"
            >
              <span>💬 Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="wa-trigger-btn"
        aria-label="WhatsApp Order & Support"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.572 4.183 1.571 5.929l-1.571 5.738 5.894-1.547c1.705.932 3.662 1.467 5.74 1.467 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span className="wa-btn-label">Order via WhatsApp</span>
      </button>

      <style jsx>{`
        .wa-floating-container {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 990;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        .wa-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #25D366;
          color: #ffffff;
          border: none;
          padding: 12px 18px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
          cursor: pointer;
        }
        .wa-trigger-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5);
        }
        .wa-popover {
          width: 320px;
          background: #FFFFFF;
          border: 1px solid #E7E2DA;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        .wa-popover-head {
          background-color: #075E54;
          color: #ffffff;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wa-agent-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wa-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #7B2347;
          color: #ffffff;
          font-weight: 700;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-agent-name {
          font-size: 0.8rem;
          font-weight: 700;
        }
        .wa-agent-status {
          font-size: 10px;
          opacity: 0.8;
        }
        .wa-close-btn {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 18px;
          cursor: pointer;
        }
        .wa-popover-body {
          padding: 16px;
        }
        .wa-welcome-text {
          font-size: 0.82rem;
          color: #1C1917;
          line-height: 1.4;
          margin: 0;
        }
        .wa-cart-preview-box {
          margin-top: 12px;
          padding: 8px 12px;
          background-color: #FAF7F2;
          border-radius: 6px;
          font-size: 0.78rem;
          color: #57534E;
        }
        .wa-popover-foot {
          padding: 12px 16px;
          background-color: #FAF7F2;
          border-top: 1px solid #E7E2DA;
        }
        .wa-chat-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #25D366;
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
