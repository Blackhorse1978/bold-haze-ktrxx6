import React, { useState, useMemo, useEffect } from "react";

const ModernBakeryERP = () => {
  // --- AUTH STATES ---

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // --- APP STATES ---

  const [view, setView] = useState("dashboard");

  const [activeBranch, setActiveBranch] = useState("ALL"); // New Branch Filter

  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [cart, setCart] = useState([]);

  const [myOrders, setMyOrders] = useState([]);

  // --- BRANCH DATA ---

  const branches = [
    { code: "ALL", name: "All Branches" },

    { code: "RC-01", name: "Regal Chowk" },

    { code: "PB-02", name: "Pirbag" },

    { code: "LZ-03", name: "Lal Bazar" },
  ];

  // --- DELIVERY STATES ---

  const [deliveryDate, setDeliveryDate] = useState("");

  const [deliveryTime, setDeliveryTime] = useState("");

  // --- BOX CATEGORIES ---

  const boxCategories = [
    { id: "MS1009", type: "8 KHANA", stock: 112 },

    { id: "MS1011", type: "8 KHANA", stock: 1357 },

    { id: "MS1007", type: "6 KHANA", stock: 2538 },

    { id: "MS1201", type: "4 KHANA LONG", stock: 1783 },
  ];

  // --- CUSTOMER & CONFIG ---

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [orderConfig, setOrderConfig] = useState({
    selectedBox: boxCategories[0].id,

    containerRequired: "No",
  });

  useEffect(() => {
    const now = new Date();

    setDeliveryDate(now.toISOString().split("T")[0]);

    setDeliveryTime(now.toTimeString().slice(0, 5));
  }, [view]);

  // --- INVENTORY ---

  const [inventory] = useState([
    {
      id: "MS1001",
      name: "BAKIR KHANI",
      branchCode: "RC-01",
      price: 20,
      stock: 504,
    },

    {
      id: "MS1002",
      name: "BREAD NAMKEEN",
      branchCode: "PB-02",
      price: 40,
      stock: 330,
    },

    {
      id: "MS1004",
      name: "CHICKEN PATTIES",
      branchCode: "RC-01",
      price: 35,
      stock: 864,
    },

    {
      id: "MS1005",
      name: "FRUIT CAKE",
      branchCode: "LZ-03",
      price: 150,
      stock: 45,
    },
  ]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (credentials.username === "admin" && credentials.password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  // --- FILTERED LOGIC (Branch + Search) ---

  const filteredProducts = useMemo(() => {
    return inventory.filter((p) => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchBranch =
        activeBranch === "ALL" || p.branchCode === activeBranch;

      return matchSearch && matchBranch;
    });
  }, [searchTerm, inventory, activeBranch]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const punchOrder = () => {
    if (!customer.name || !customer.phone || cart.length === 0) {
      return alert("Customer details and items are mandatory!");
    }

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const newOrder = {
      orderId: `ORD-${Date.now()}`,

      branch: activeBranch,

      customer: { ...customer },

      delivery: { date: deliveryDate, time: deliveryTime },

      items: [...cart],

      packaging: { ...orderConfig },

      total,

      timestamp: new Date().toLocaleString(),
    };

    setMyOrders([newOrder, ...myOrders]);

    alert("Order Synced to Cloud!");

    setCart([]);

    setCustomer({ name: "", phone: "", email: "", address: "" });

    setView("orders");
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginOverlay}>
        <form style={styles.loginCard} onSubmit={handleLogin}>
          <div style={styles.loginHeader}>
            <h2 style={{ margin: 0 }}>MODERN SWEETS</h2>

            <p style={{ fontSize: "0.8rem", color: "#666" }}>
              Enterprise Resource Planning
            </p>
          </div>

          <input
            type="text"
            placeholder="Username"
            style={styles.input}
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <button type="submit" style={styles.loginBtn}>
            ENTER SYSTEM
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}

      <nav style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>MS</div>

          <h2 style={{ fontSize: "1.1rem" }}>BACKERY ERP</h2>
        </div>

        <div style={styles.navGroup}>
          <p style={styles.navLabel}>MAIN MENU</p>

          <button
            style={view === "dashboard" ? styles.activeNav : styles.navLink}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </button>

          <button
            style={view === "punch" ? styles.activeNav : styles.navLink}
            onClick={() => setView("punch")}
          >
            New Order
          </button>

          <button
            style={view === "orders" ? styles.activeNav : styles.navLink}
            onClick={() => setView("orders")}
          >
            History
          </button>
        </div>

        <div style={styles.navGroup}>
          <p style={styles.navLabel}>BRANCHES</p>

          {branches.map((b) => (
            <button
              key={b.code}
              style={
                activeBranch === b.code
                  ? styles.activeBranchBtn
                  : styles.branchBtn
              }
              onClick={() => setActiveBranch(b.code)}
            >
              <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>
                [{b.code}]
              </span>{" "}
              {b.name}
            </button>
          ))}
        </div>

        <button style={styles.logoutBtn} onClick={() => setIsLoggedIn(false)}>
          Logout System
        </button>
      </nav>

      {/* Main Content */}

      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <h2 style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
            {view}{" "}
            <span style={{ color: "#3498db", fontSize: "0.9rem" }}>
              | {activeBranch}
            </span>
          </h2>
        </header>

        {view === "dashboard" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>Live Inventory - {activeBranch}</h3>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>CODE</th>

                  <th style={styles.th}>PRODUCT NAME</th>

                  <th style={styles.th}>BRANCH</th>

                  <th style={styles.th}>STOCK</th>

                  <th style={styles.th}>RATE</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item.id} style={styles.tableRow}>
                    <td style={styles.td}>{item.id}</td>

                    <td style={styles.td}>
                      <strong>{item.name}</strong>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.tag}>{item.branchCode}</span>
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        color: item.stock < 100 ? "#e74c3c" : "#2ecc71",
                        fontWeight: "bold",
                      }}
                    >
                      {item.stock}
                    </td>

                    <td style={styles.td}>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "punch" && (
          <div style={styles.grid}>
            <div>
              <input
                placeholder="🔍 Search items by name..."
                style={styles.searchBar}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div style={styles.itemGrid}>
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    style={styles.itemCard}
                    onClick={() => addToCart(p)}
                  >
                    <div style={styles.itemPrice}>₹{p.price}</div>

                    <strong>{p.name}</strong>

                    <div
                      style={{
                        fontSize: "0.7rem",
                        marginTop: "5px",
                        color: "#888",
                      }}
                    >
                      {p.branchCode}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.cartBox}>
              <h3 style={{ margin: "0 0 15px 0" }}>Order Processing</h3>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Customer Info</label>

                <input
                  placeholder="Name"
                  style={styles.input}
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />

                <input
                  placeholder="Phone"
                  style={styles.input}
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />
              </div>

              <div style={styles.dateTimeRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Delivery</label>

                  <input
                    type="date"
                    style={styles.input}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Time</label>

                  <input
                    type="time"
                    style={styles.input}
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.configSummary}>
                <div>
                  <div style={{ fontSize: "0.7rem" }}>
                    BOX: {orderConfig.selectedBox}
                  </div>

                  <div style={{ fontSize: "0.7rem" }}>
                    CONT: {orderConfig.containerRequired}
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  style={styles.configBtn}
                >
                  EDIT
                </button>
              </div>

              <div style={styles.cartItemsScroll}>
                {cart.map((item) => (
                  <div key={item.id} style={styles.cartItemRow}>
                    <span>
                      {item.name} <small>x{item.qty}</small>
                    </span>

                    <strong>₹{item.price * item.qty}</strong>
                  </div>
                ))}
              </div>

              <div style={styles.totalRow}>
                <span>GRAND TOTAL</span>

                <span>₹{cart.reduce((s, i) => s + i.price * i.qty, 0)}</span>
              </div>

              <button style={styles.punchDataBtn} onClick={punchOrder}>
                PUNCH & PRINT
              </button>
            </div>
          </div>
        )}

        {view === "orders" && (
          <div>
            <h3>Recent Transactions</h3>

            {myOrders.map((order) => (
              <div key={order.orderId} style={styles.orderCard}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>
                    {order.customer.name}{" "}
                    <span style={styles.tag}>{order.branch}</span>
                  </strong>

                  <span style={{ fontSize: "0.75rem", color: "#95a5a6" }}>
                    {order.timestamp}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", marginTop: "8px" }}>
                  Items:{" "}
                  {order.items.map((i) => `${i.name}(${i.qty})`).join(", ")}
                </div>

                <div style={styles.orderCardFooter}>
                  <span>ID: {order.orderId}</span>

                  <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
                    Paid: ₹{order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal simplified */}

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>Packaging Config</h3>

              <select
                style={styles.input}
                value={orderConfig.selectedBox}
                onChange={(e) =>
                  setOrderConfig({
                    ...orderConfig,
                    selectedBox: e.target.value,
                  })
                }
              >
                {boxCategories.map((box) => (
                  <option key={box.id} value={box.id}>
                    {box.id} - {box.type}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowModal(false)}
                style={styles.loginBtn}
              >
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- STYLES ---

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Segoe UI', sans-serif",
  },

  sidebar: {
    width: "260px",
    backgroundColor: "#1c2833",
    padding: "20px",
    color: "#ecf0f1",
    display: "flex",
    flexDirection: "column",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
    padding: "0 10px",
  },

  logoIcon: {
    background: "#3498db",
    padding: "8px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1.2rem",
  },

  navGroup: { marginBottom: "30px" },

  navLabel: {
    fontSize: "0.65rem",
    color: "#566573",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "10px",
    paddingLeft: "12px",
  },

  navLink: {
    width: "100%",
    padding: "12px",
    background: "none",
    border: "none",
    color: "#abb2b9",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "0.3s",
  },

  activeNav: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    textAlign: "left",
    fontWeight: "bold",
  },

  branchBtn: {
    width: "100%",
    padding: "8px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "none",
    color: "#abb2b9",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "5px",
    fontSize: "0.85rem",
  },

  activeBranchBtn: {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    textAlign: "left",
    marginBottom: "5px",
    fontSize: "0.85rem",
  },

  logoutBtn: {
    marginTop: "auto",
    padding: "12px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  mainContent: { flex: 1, padding: "30px", overflowY: "auto" },

  topHeader: {
    marginBottom: "25px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "15px",
  },

  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    padding: "15px",
    borderBottom: "2px solid #f0f2f5",
    color: "#7f8c8d",
    textAlign: "left",
    fontSize: "0.8rem",
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #f0f2f5",
    fontSize: "0.9rem",
  },

  tag: {
    background: "#ebf5fb",
    color: "#2980b9",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: "bold",
  },

  loginOverlay: {
    height: "100vh",
    backgroundColor: "#1c2833",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loginCard: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "20px",
    width: "320px",
    boxShadow: "0 20px 25px rgba(0,0,0,0.2)",
  },

  loginHeader: { marginBottom: "30px", textAlign: "center" },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #dcdde1",
    outline: "none",
  },

  loginBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  searchBar: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    fontSize: "1rem",
  },

  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "15px",
  },

  itemCard: {
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    background: "#fff",
    border: "1px solid transparent",
    transition: "0.2s",
    position: "relative",
  },

  itemPrice: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#2ecc71",
    color: "white",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem",
  },

  cartBox: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    height: "fit-content",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0",
    borderTop: "2px dashed #eee",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },

  punchDataBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },

  orderCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
    borderLeft: "6px solid #3498db",
  },

  orderCardFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    paddingTop: "10px",
    borderTop: "1px solid #eee",
    fontSize: "0.8rem",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "350px",
  },

  configSummary: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f8f9f9",
    padding: "10px",
    borderRadius: "8px",
    margin: "10px 0",
  },

  configBtn: {
    border: "none",
    background: "#34495e",
    color: "white",
    padding: "4px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.7rem",
  },

  cartItemsScroll: { margin: "15px 0", maxHeight: "180px", overflowY: "auto" },

  cartItemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: "0.9rem",
    borderBottom: "1px solid #f9f9f9",
  },
};

export default ModernBakeryERP;
