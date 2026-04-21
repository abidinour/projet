import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import Layout from "../components/Layout";
import Dialog from "../components/Dialog";
import "./admins.css";

const emptyForm = { name: "", email: "", password: "" };

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAddOpen, setIsAddOpen]       = useState(false);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminService.getAll();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to load admins", err);
    }
  };

  const handleField = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) return;
    try {
      setLoading(true);
      await adminService.create(form);
      setForm(emptyForm);
      setIsAddOpen(false);
      loadAdmins();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding admin");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (admin) => {
    setSelectedAdmin(admin);
    setForm({ name: admin.name, email: admin.email, password: "" });
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      await adminService.update(selectedAdmin.id, form);
      setIsEditOpen(false);
      loadAdmins();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating admin");
    } finally {
      setLoading(false);
    }
  };

  const openDelete = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await adminService.delete(selectedAdmin.id);
      setIsDeleteOpen(false);
      loadAdmins();
    } catch (err) {
      alert("Error removing admin");
    }
  };

  return (
    <Layout>
      <div className="admins-page">
        <div className="admins-header">
          <div>
            <h1>Admin Management</h1>
            <p>Securely manage administrator access levels</p>
          </div>
          <button className="add-main-btn" onClick={() => { setForm(emptyForm); setIsAddOpen(true); }}>
            + Add New Admin
          </button>
        </div>

        <div className="admin-list">
          {admins.length === 0 ? (
            <div className="empty-state">No admins found</div>
          ) : (
            admins.map((admin) => (
              <div className="admin-card" key={admin.id}>
                <div className="admin-info">
                  <div className="admin-avatar">{admin.name[0].toUpperCase()}</div>
                  <div>
                    <h3>{admin.name}</h3>
                    <p>{admin.email}</p>
                  </div>
                </div>
                <div className="admin-actions">
                  <button className="edit-btn" onClick={() => openEdit(admin)}>Edit</button>
                  <button className="delete-btn" onClick={() => openDelete(admin)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ADD */}
        <Dialog
          isOpen={isAddOpen}
          title="Add New Administrator"
          onClose={() => setIsAddOpen(false)}
          onConfirm={handleAdd}
          confirmText={loading ? "Adding..." : "Add Admin"}
        >
          <p>They will have full access to the dashboard.</p>
          <input className="dialog-input" name="name"     placeholder="Full name"           value={form.name}     onChange={handleField} />
          <input className="dialog-input" name="email"    placeholder="admin@company.com"   value={form.email}    onChange={handleField} type="email" />
          <input className="dialog-input" name="password" placeholder="Password"            value={form.password} onChange={handleField} type="password" />
        </Dialog>

        {/* EDIT */}
        <Dialog
          isOpen={isEditOpen}
          title="Edit Administrator"
          onClose={() => setIsEditOpen(false)}
          onConfirm={handleEdit}
          confirmText={loading ? "Saving..." : "Save Changes"}
        >
          <p>Leave password blank to keep it unchanged.</p>
          <input className="dialog-input" name="name"     placeholder="Full name"          value={form.name}     onChange={handleField} />
          <input className="dialog-input" name="email"    placeholder="Email"              value={form.email}    onChange={handleField} type="email" />
          <input className="dialog-input" name="password" placeholder="New password (optional)" value={form.password} onChange={handleField} type="password" />
        </Dialog>

        <Dialog
          isOpen={isDeleteOpen}
          title="Remove Administrator?"
          isDestructive
          confirmText="Remove Access"
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
        >
          <p>Are you sure you want to remove <b>{selectedAdmin?.name}</b>? This cannot be undone.</p>
        </Dialog>
      </div>
    </Layout>
  );
}