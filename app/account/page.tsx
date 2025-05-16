"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { signIn, signUp, getUser, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [profile, setProfile] = useState<any>({
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Fetch profile info from Supabase
  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile({ ...profile, ...data });
        })
        .finally(() => setProfileLoading(false));
    }
  }, [user]);

  useEffect(() => {
    async function fetchOrdersAndItems() {
      if (!user) return;
      setOrdersLoading(true);
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!ordersError && ordersData && ordersData.length > 0) {
        setOrders(ordersData);
        // Fetch order items for these orders, joined with products
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, product:products!fk_product(id, name, image, price, sale_price)')
          .in('order_id', ordersData.map((o: any) => o.id));
        if (!itemsError && itemsData) {
          setOrderItems(itemsData);
          console.log('Fetched order items:', itemsData);
        } else {
          console.log('Order items fetch error:', itemsError);
        }
      } else {
        setOrders([]);
        setOrderItems([]);
      }
      setOrdersLoading(false);
    }
    fetchOrdersAndItems();
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      getUser().then(({ data }) => setUser(data.user));
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
    } else {
      setIsSignUp(false);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      email: user.email, // always use auth email
    });
    setProfileLoading(false);
    if (!error) setProfileSuccess('Profile saved!');
  };

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-md">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User className="w-6 h-6" /> {isSignUp ? "Sign Up" : "Sign In"}
          </h1>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? "Signing up..." : "Signing in...") : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            {isSignUp ? (
              <>
                <span>Already have an account? </span>
                <button className="text-blue-600 underline" onClick={() => { setIsSignUp(false); setError(""); }}>
                  Sign In
                </button>
              </>
            ) : (
              <>
                <span>Don't have an account? </span>
                <button className="text-blue-600 underline" onClick={() => { setIsSignUp(true); setError(""); }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-6 h-6" />
        <h1 className="text-2xl font-bold">My Account</h1>
        <Button variant="outline" size="sm" className="ml-auto" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form className="space-y-2" onSubmit={handleProfileSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={profile.first_name}
                onChange={handleProfileChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={profile.last_name}
                onChange={handleProfileChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              disabled
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={profile.phone}
              onChange={handleProfileChange}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={profile.address}
              onChange={handleProfileChange}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              value={profile.apartment}
              onChange={handleProfileChange}
              className="border rounded px-3 py-2 w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={profile.city}
                onChange={handleProfileChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={profile.state}
                onChange={handleProfileChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="zip_code"
                placeholder="ZIP Code"
                value={profile.zip_code}
                onChange={handleProfileChange}
                className="border rounded px-3 py-2"
              />
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={profile.country}
              onChange={handleProfileChange}
              className="border rounded px-3 py-2 w-full"
            />
            <Button type="submit" className="w-full mt-2" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save'}
            </Button>
            {profileSuccess && <div className="text-green-600 text-sm">{profileSuccess}</div>}
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <div className="space-y-2">
            {ordersLoading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">No orders found.</p>
            ) : (
              <ul>
                {orders.map(order => (
                  <li key={order.id} className="border-b py-2">
                    <div>
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {/* Total removed, item prices are shown below */}
                    </div>
                    <div className="text-xs text-gray-500">
                      Status: {order.status || 'N/A'}
                    </div>
                    {/* Order items */}
                    <ul className="mt-2 space-y-1">
                      {orderItems.filter(item => item.order_id === order.id).map(item => (
                        <li key={item.id} className="flex items-center gap-2 text-sm">
                          {item.product?.image && (
                            <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded" />
                          )}
                          <span>{item.product?.name || 'Product'}</span>
                          <span className="ml-auto">x{item.quantity}</span>
                          <span className="ml-4">${item.price?.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}