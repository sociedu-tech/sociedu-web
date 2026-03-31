import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/">Features</Link></li>
            <li><Link to="/">Integrations</Link></li>
            <li><Link to="/">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/">About</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/">Documentation</Link></li>
            <li><Link to="/">Help Center</Link></li>
            <li><Link to="/">Community</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/">Privacy</Link></li>
            <li><Link to="/">Terms</Link></li>
            <li><Link to="/">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
        <p className="text-xs text-gray-400">© 2026 VibeCart Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
        </div>
      </div>
    </footer>
  );
};
