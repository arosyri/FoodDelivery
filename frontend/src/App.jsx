import './App.css';
import { useEffect, useState } from 'react';
import {
    registerUser,
    loginUser,
    createOrder,
    getOrders
} from './services/api.js';

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [page, setPage] = useState('dashboard');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [orders, setOrders] = useState([]);
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    const foods = [
        {
            id: 1,
            name: 'Margherita Pizza',
            price: 15,
            category: 'Italian',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
            description: 'Fresh mozzarella, tomato sauce, basil'
        },
        {
            id: 2,
            name: 'Classic Burger',
            price: 12,
            category: 'Fast Food',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
            description: 'Beef patty, lettuce, cheese, special sauce'
        },
        {
            id: 3,
            name: 'Dragon Sushi',
            price: 20,
            category: 'Japanese',
            image: 'https://thesushiman.com/wp-content/uploads/2025/01/Dragon-Roll-1-scaled.jpg',
            description: 'Fresh salmon, avocado, cucumber'
        },
        {
            id: 4,
            name: 'Pasta Carbonara',
            price: 14,
            category: 'Italian',
            image: 'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/spaghettiallacarbona_86763_16x9.jpg',
            description: 'Creamy sauce, bacon, parmesan'
        },
        {
            id: 5,
            name: 'Caesar Salad',
            price: 9,
            category: 'Healthy',
            image: 'https://www.jonesdairyfarm.com/wp-content/uploads/2024/10/Bacon-Caesar-Salad-1024x683.jpg',
            description: 'Fresh lettuce, croutons, parmesan'
        },
        {
            id: 6,
            name: 'Cheesecake',
            price: 7,
            category: 'Dessert',
            image: 'https://www.oliveandmango.com/images/uploads/2023_12_15_new_york_style_cheesecake_1.jpg',
            description: 'New York style cheesecake'
        }
    ];

    const [authData, setAuthData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });

    const [orderData, setOrderData] = useState({
        itemName: '',
        quantity: 1,
        price: 1,
        paymentMethod: 'cash',
        discount: false,
        specialInstructions: ''
    });

    useEffect(() => {
        if (token) {
            loadOrders();
        }
    }, [token]);

    const loadOrders = async () => {
        try {
            const data = await getOrders(token);
            if (data.error) {
                console.error('Error loading orders:', data.error);
            } else {
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Load orders error:', error);
        }
    };

    const handleAuth = async () => {
        setAuthError('');
        setAuthSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                const data = await loginUser({
                    email: authData.email,
                    password: authData.password
                });

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    setAuthSuccess('Login successful! Redirecting...');
                    setTimeout(() => setAuthSuccess(''), 2000);
                } else if (data.error) {
                    setAuthError(data.error);
                } else if (data.message) {
                    setAuthError(data.message);
                } else {
                    setAuthError('Login failed. Please try again.');
                }
            } else {
                if (!authData.name || !authData.email || !authData.password) {
                    setAuthError('Please fill in all fields');
                    setLoading(false);
                    return;
                }

                const data = await registerUser(authData);

                if (data.message === 'User registered' || data.message === 'User registered successfully') {
                    setAuthSuccess('Registration successful! Please login.');
                    setTimeout(() => {
                        setIsLogin(true);
                        setAuthSuccess('');
                        setAuthData({
                            name: '',
                            email: '',
                            password: '',
                            role: 'customer'
                        });
                    }, 2000);
                } else if (data.error) {
                    setAuthError(data.error);
                } else if (data.message) {
                    setAuthError(data.message);
                } else {
                    setAuthError('Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            setAuthError('Connection error. Please check if server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrder = async () => {
        if (!orderData.itemName) {
            alert('🍕 Please select a food item first!');
            return;
        }

        if (orderData.quantity < 1 || orderData.quantity > 99) {
            alert('Please enter a valid quantity (1-99)');
            return;
        }
        setOrderLoading(true);

        try {
            const newOrder = {
                items: [
                    {
                        name: orderData.itemName,
                        quantity: Number(orderData.quantity),
                        price: Number(orderData.price)
                    }
                ],
                paymentMethod: orderData.paymentMethod,
                discount: orderData.discount,
                specialInstructions: orderData.specialInstructions
            };

            console.log('- Creating order with patterns:');
            console.log('- Builder: Building complex order');
            console.log('- Chain of Responsibility: Validating order');
            console.log('- Strategy: Processing payment');
            console.log('- Observer: Sending notifications');

            const result = await createOrder(newOrder, token);

            if (result.error) {
                alert('Error: ' + result.error);
            } else {
                setLastOrder(result.order);
                alert('Order created successfully!');
                await loadOrders();

                setOrderData({
                    itemName: '',
                    quantity: 1,
                    price: 1,
                    paymentMethod: 'cash',
                    discount: false,
                    specialInstructions: ''
                });

                setTimeout(() => setLastOrder(null), 5000);
            }
        } catch (error) {
            console.error('Create order error:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setOrderLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Order cancelled successfully!');
                await loadOrders();
            } else {
                alert((data.message || 'Failed to cancel order'));
            }
        } catch (error) {
            console.error('Cancel order error:', error);
            alert('Error cancelling order. Please try again.');
        }
    };

    const getOrderStats = () => {
        const total = orders.length;
        const completed = orders.filter(o => o.status === 'delivered').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        return { total, completed, cancelled, totalSpent };
    };

    const logout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            setToken('');
            setOrders([]);
            setLastOrder(null);
        }
    };

    if (!token) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Food Delivery</h1>
                        <p className="auth-subtitle">Order your favorite food</p>
                    </div>

                    {authError && (
                        <div className="auth-error">
                            <span>⚠️</span> {authError}
                        </div>
                    )}

                    {authSuccess && (
                        <div className="auth-success">
                            <span>✓</span> {authSuccess}
                        </div>
                    )}

                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={authData.name}
                            onChange={(e) =>
                                setAuthData({
                                    ...authData,
                                    name: e.target.value
                                })
                            }
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={authData.email}
                        onChange={(e) =>
                            setAuthData({
                                ...authData,
                                email: e.target.value
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={authData.password}
                        onChange={(e) =>
                            setAuthData({
                                ...authData,
                                password: e.target.value
                            })
                        }
                    />

                    {!isLogin && (
                        <select
                            value={authData.role}
                            onChange={(e) =>
                                setAuthData({
                                    ...authData,
                                    role: e.target.value
                                })
                            }
                        >
                            <option value="customer">👤 Customer</option>
                            <option value="courier">🛵 Courier</option>
                            <option value="restaurant">🏪 Restaurant</option>
                        </select>
                    )}

                    <button onClick={handleAuth} disabled={loading}>
                        {loading ? '⏳ Loading...' : (isLogin ? '🔐 Sign In' : '📝 Sign Up')}
                    </button>

                    <p className="auth-switch" onClick={() => {
                        setIsLogin(!isLogin);
                        setAuthError('');
                        setAuthSuccess('');
                    }}>
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </p>
                </div>
            </div>
        );
    }

    const stats = getOrderStats();

    return (
        <div className="dashboard">
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="user-badge">👤 {authData.name || 'Customer'}</div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={page === 'dashboard' ? 'active' : ''}
                        onClick={() => setPage('dashboard')}
                    >
                        🏠 Dashboard
                    </button>
                    <button
                        className={page === 'orders' ? 'active' : ''}
                        onClick={() => setPage('orders')}
                    >
                        📦 My Orders
                    </button>

                    <button className="logout-btn" onClick={logout}>
                        🚪 Logout
                    </button>
                </nav>

                <div className="sidebar-stats">
                    <div className="stat-item">
                    <span className="stat-label">Total Orders - </span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Total Spent - </span>
                        <span className="stat-value">${stats.totalSpent.toFixed(2)}</span>
                    </div>
                </div>


            </div>

            <div className="main-content">
                {lastOrder && (
                    <div className="notification-success">
                        <span>🎉</span> Order #{lastOrder._id?.slice(-6)} created successfully!
                        <button onClick={() => setLastOrder(null)}>×</button>
                    </div>
                )}

                {page === 'dashboard' && (
                    <>
                        <div className="welcome-section">
                            <h1>Welcome back, {authData.name || 'Food Lover'}! 🍕</h1>
                        </div>

                        <div className="food-grid">
                            {foods.map((food) => (
                                <div className="food-card" key={food.id}>
                                    <img src={food.image} alt={food.name} />
                                    <div className="food-category">{food.category}</div>
                                    <h3>{food.name}</h3>
                                    <p className="food-description">{food.description}</p>
                                    <div className="food-price">${food.price}</div>
                                    <button
                                        className="add-to-order-btn"
                                        onClick={() =>
                                            setOrderData({
                                                ...orderData,
                                                itemName: food.name,
                                                price: food.price
                                            })
                                        }
                                    >
                                        🛒 Add to Order
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="create-order">
                            <h2>📝 Create New Order</h2>

                            <div className="order-form">
                                <div className="form-group">
                                    <label>Food Item</label>
                                    <input
                                        type="text"
                                        placeholder="Selected food will appear here"
                                        value={orderData.itemName}
                                        readOnly
                                        className="readonly-input"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={orderData.quantity}
                                            onChange={(e) =>
                                                setOrderData({
                                                    ...orderData,
                                                    quantity: e.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Price per item</label>
                                        <input
                                            type="number"
                                            value={orderData.price}
                                            onChange={(e) =>
                                                setOrderData({
                                                    ...orderData,
                                                    price: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select
                                        value={orderData.paymentMethod}
                                        onChange={(e) =>
                                            setOrderData({
                                                ...orderData,
                                                paymentMethod: e.target.value
                                            })
                                        }
                                    >
                                        <option value="cash">💵 Cash on delivery</option>
                                        <option value="card">💳 Credit card</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Special Instructions (optional)</label>
                                    <textarea
                                        placeholder="Extra cheese, no onions, etc."
                                        value={orderData.specialInstructions}
                                        onChange={(e) =>
                                            setOrderData({
                                                ...orderData,
                                                specialInstructions: e.target.value
                                            })
                                        }
                                        rows="2"
                                    />
                                </div>

                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={orderData.discount}
                                        onChange={(e) =>
                                            setOrderData({
                                                ...orderData,
                                                discount: e.target.checked
                                            })
                                        }
                                    />
                                     Apply 10% discount code
                                </label>

                                <button
                                    onClick={handleCreateOrder}
                                    disabled={orderLoading || !orderData.itemName}
                                    className="create-order-btn"
                                >
                                    {orderLoading ? '⏳ Creating...' : ' Place Order'}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {page === 'orders' && (
                    <div className="orders-section">
                        <div className="orders-header">
                            <h2>📋 My Orders</h2>
                            <p>You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                        </div>

                        <div className="orders-grid">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div className="order-card" key={order._id}>
                                        <div className="order-header">
                                            <h3>{order.items[0]?.name || 'Order'}</h3>
                                            <span className={`status-badge status-${order.status}`}>
                                                {order.status === 'pending' && '⏳ Pending'}
                                                {order.status === 'confirmed' && '✓ Confirmed'}
                                                {order.status === 'cooking' && '🍳 Cooking'}
                                                {order.status === 'delivering' && '🚚 Delivering'}
                                                {order.status === 'delivered' && '✅ Delivered'}
                                                {order.status === 'cancelled' && '❌ Cancelled'}
                                            </span>
                                        </div>

                                        <div className="order-details">
                                            <p>🍽️ Quantity: {order.items[0]?.quantity || 1}</p>
                                            <p>💰 Total: ${order.totalPrice?.toFixed(2) || 0}</p>
                                            <p>💳 Payment: {order.paymentMethod === 'cash' ? 'Cash on delivery' : 'Credit card'}</p>
                                            <p>🕐 Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>

                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => cancelOrder(order._id)}
                                                className="cancel-btn"
                                            >
                                                ❌ Cancel Order
                                            </button>
                                        )}

                                        {order.status === 'delivering' && (
                                            <div className="delivery-info">
                                                🚚 Your order is on the way! Estimated arrival: 15-20 min
                                            </div>
                                        )}

                                        {order.status === 'delivered' && (
                                            <div className="delivered-info">
                                                🎉 Order completed! Rate your experience
                                            </div>
                                        )}

                                        {order.status === 'cancelled' && (
                                            <div className="cancelled-info">
                                                ⚠️ This order has been cancelled
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="empty-orders">
                                    <div className="empty-emoji">🍕</div>
                                    <h3>No orders yet</h3>
                                    <p>Start ordering your favorite food!</p>
                                    <button onClick={() => setPage('dashboard')} className="order-now-btn">
                                        Order Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;