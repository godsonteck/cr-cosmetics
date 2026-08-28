'use client';

import React, { useEffect, useState } from 'react';
import AccountClient from '@/app/AccountClient';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { getAllOrders } from '@/services/orderService';
import { Order } from '@/types';
import Badge from '@/components/ui/Badge';

export default function AccountPage() {
  const { customer, isAuthenticated, signOutCustomer } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      if (isAuthenticated) {
        try {
          const list = await getAllOrders();
          setOrders(list);
        } catch (e) {
          setOrders([]);
        }
      }
    }
    load();
  }, [isAuthenticated]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <Badge variant="success" size="sm">Delivered</Badge>;
      case 'confirmed':
        return <Badge variant="info" size="sm">Confirmed</Badge>;
      case 'dispatched':
        return <Badge variant="warning" size="sm">Dispatched</Badge>;
      default:
        return <Badge variant="default" size="sm">Placed</Badge>;
    }
  };

  return (
    <AccountClient
      customer={customer}
      isAuthenticated={isAuthenticated}
      recentOrders={orders}
      wishlistCount={wishlistCount}
      getStatusBadge={getStatusBadge}
      signOutCustomer={signOutCustomer}
    />
  );
}
