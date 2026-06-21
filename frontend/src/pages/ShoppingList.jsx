import React, { useMemo, useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import "./ShoppingList.css";
import { getShoppingList, updateShoppingList } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", quantity: "", price: "" };

function formatCurrency(amount) {
  return `Rs ${Number(amount).toLocaleString("en-IN")}`;
}

function ShoppingList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getShoppingList(user.userId)
      .then((res) => {
        const mapped = res.data.items.map((item, i) => ({
          id: item._id || i,
          name: item.name,
          quantity: item.quantity,
          price: item.estimatedCost || 0,
          purchased: item.checked,
        }));
        setItems(mapped);
      })
      .catch(() => {});
  }, [user]);

  const syncToBackend = async (updatedItems) => {
    if (!user) return;
    setSaving(true);
    try {
      const backendItems = updatedItems.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: "pcs",
        category: "Other",
        checked: i.purchased,
        estimatedCost: i.price,
      }));
      await updateShoppingList(user.userId, { items: backendItems });
    } catch {}
    setSaving(false);
  };

  const summary = useMemo(() => {
    const purchased = items.filter((i) => i.purchased).length;
    const estimatedCost = items.reduce((t, i) => t + Number(i.price), 0);
    return { totalItems: items.length, estimatedCost, purchased, remaining: items.length - purchased };
  }, [items]);

  const handleChange = (e) => {
    setForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const quantity = form.quantity.trim();
    const price = Number(form.price);
    if (!name || !quantity || isNaN(price) || price < 0) return;
    const updated = [...items, { id: Date.now(), name, quantity, price, purchased: false }];
    setItems(updated);
    syncToBackend(updated);
    setForm(emptyForm);
  };

  const togglePurchased = (id) => {
    const updated = items.map((i) => i.id === id ? { ...i, purchased: !i.purchased } : i);
    setItems(updated);
    syncToBackend(updated);
  };

  const deleteItem = (id) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    syncToBackend(updated);
  };

  return (
    <Layout pageTitle="Shopping List">
      <div className="shopping-page">
        <header className="shopping-header">
          <div>
            <p className="shopping-eyebrow">Grocery Planner</p>
            <h1>Shopping Dashboard</h1>
            <p className="shopping-subtitle">Manage your shopping list and track costs.</p>
          </div>
          <div className="shopping-budget-pill">
            <span>Estimated Spend</span>
            <strong>{formatCurrency(summary.estimatedCost)}</strong>
          </div>
        </header>

        <section className="shopping-summary-grid">
          <article className="shopping-stat-card"><span>Total Items</span><strong>{summary.totalItems}</strong></article>
          <article className="shopping-stat-card"><span>Estimated Cost</span><strong>{formatCurrency(summary.estimatedCost)}</strong></article>
          <article className="shopping-stat-card"><span>Purchased</span><strong>{summary.purchased}</strong></article>
          <article className="shopping-stat-card"><span>Remaining</span><strong>{summary.remaining}</strong></article>
        </section>

        <section className="shopping-panel">
          <div className="shopping-panel-header">
            <div>
              <h2>Add Shopping Item</h2>
              <p>New items are added to the list automatically as pending.</p>
            </div>
            {saving && <span style={{ opacity: 0.6, fontSize: "0.8rem" }}>Saving…</span>}
          </div>

          <form className="shopping-form" onSubmit={handleAddItem}>
            <label>Item Name<input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Eggs" /></label>
            <label>Quantity<input type="text" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 12 Pieces" /></label>
            <label>Price<input type="number" name="price" value={form.price} onChange={handleChange} min="0" placeholder="e.g. 120" /></label>
            <button className="shopping-primary-button" type="submit">Add Item</button>
          </form>
        </section>

        <section className="shopping-panel">
          <div className="shopping-panel-header">
            <div>
              <h2>Shopping List</h2>
              <p>{summary.remaining} items still need to be purchased.</p>
            </div>
          </div>

          <div className="shopping-table-wrap">
            <table className="shopping-table">
              <thead>
                <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <button className={`status-pill ${item.purchased ? "is-purchased" : "is-pending"}`} type="button" onClick={() => togglePurchased(item.id)}>
                        {item.purchased ? "Purchased" : "Pending"}
                      </button>
                    </td>
                    <td>
                      <button className="shopping-danger-button" type="button" onClick={() => deleteItem(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default ShoppingList;
