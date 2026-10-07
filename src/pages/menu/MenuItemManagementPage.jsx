/* oxlint-disable react/set-state-in-effect */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Tags,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";

import {
  createMenuItem,
  deleteMenuItem,
  getActiveMenus,
  getAllMenuItems,
  updateMenuItem,
} from "../../api/menuApi";

const emptyForm = {
  menuId: "",
  itemName: "",
  category: "",
  description: "",
  price: "",
  availabilityStatus: "AVAILABLE",
};

export default function MenuItemManagementPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [menus, setMenus] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [formData, setFormData] = useState(emptyForm);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] =
    useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [menuItemData, menuData] = await Promise.all([
        getAllMenuItems(),
        getActiveMenus(),
      ]);

      setMenuItems(
        Array.isArray(menuItemData) ? menuItemData : [],
      );

      setMenus(Array.isArray(menuData) ? menuData : []);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Menu information could not be loaded.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          menuItems
            .map((item) => item.category)
            .filter(Boolean),
        ),
      ].sort(),
    [menuItems],
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.itemName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        item.menuName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        item.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "ALL" ||
        item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        item.availabilityStatus === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    menuItems,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  const availableCount = menuItems.filter(
    (item) =>
      item.availabilityStatus?.toUpperCase() ===
      "AVAILABLE",
  ).length;

  function openCreateForm() {
    setEditingItem(null);
    setFormData({
      ...emptyForm,
      menuId:
        menus.length > 0
          ? String(menus[0].menuId)
          : "",
    });
    setFormError("");
    setSuccessMessage("");
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditingItem(item);
    setFormData({
      menuId: String(item.menuId),
      itemName: item.itemName || "",
      category: item.category || "",
      description: item.description || "",
      price: String(item.price ?? ""),
      availabilityStatus:
        item.availabilityStatus || "AVAILABLE",
    });
    setFormError("");
    setSuccessMessage("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingItem(null);
    setFormData(emptyForm);
    setFormError("");
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!formData.menuId) {
      setFormError("Please select a menu.");
      return;
    }

    if (!formData.itemName.trim()) {
      setFormError("Item name is required.");
      return;
    }

    if (!formData.category.trim()) {
      setFormError("Category is required.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setFormError(
        "Price must be zero or greater.",
      );
      return;
    }

    const payload = {
      menuId: Number(formData.menuId),
      itemName: formData.itemName.trim(),
      category: formData.category
        .trim()
        .toUpperCase()
        .replaceAll(" ", "_"),
      description: formData.description.trim() || null,
      price: Number(formData.price),
      availabilityStatus:
        formData.availabilityStatus,
    };

    setSaving(true);

    try {
      if (editingItem) {
        await updateMenuItem(
          editingItem.menuItemId,
          payload,
        );

        setSuccessMessage(
          "Menu item updated successfully.",
        );
      } else {
        await createMenuItem(payload);

        setSuccessMessage(
          "Menu item created successfully.",
        );
      }

      setFormOpen(false);
      setEditingItem(null);
      setFormData(emptyForm);
      await loadData();
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "The menu item could not be saved.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingItem) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteMenuItem(
        deletingItem.menuItemId,
      );

      setSuccessMessage(
        "Menu item deleted successfully.",
      );
      setDeletingItem(null);
      await loadData();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "The menu item could not be deleted. It may already be used by an order or catering package.",
        ),
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Menu Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Menu item management
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Create and maintain the dishes used by customer
            menus, catering packages and food orders.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-primary-950 transition hover:border-primary-300 hover:bg-primary-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </button>
        </div>
      </section>

      {errorMessage && (
        <MessageBox
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}

      {successMessage && (
        <MessageBox
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={UtensilsCrossed}
          label="Menu Items"
          value={menuItems.length}
        />

        <SummaryCard
          icon={Tags}
          label="Categories"
          value={categories.length}
        />

        <SummaryCard
          icon={UtensilsCrossed}
          label="Available Items"
          value={availableCount}
        />
      </section>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search item, menu or description"
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">All Categories</option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {formatLabel(category)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none focus:border-primary-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">
              Unavailable
            </option>
          </select>
        </div>

        <p className="mt-3 text-xs text-stone-500">
          Showing {filteredItems.length} of{" "}
          {menuItems.length} menu items.
        </p>
      </section>

      {/* Records */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <UtensilsCrossed className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Menu items
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Authoritative menu records stored in the
                Aurevia database.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            filtered={menuItems.length > 0}
          />
        ) : (
          <>
            <div className="hidden grid-cols-[1.3fr_1fr_1fr_130px_130px_160px] gap-4 border-b border-stone-200 bg-stone-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 xl:grid">
              <span>Item</span>
              <span>Menu</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-stone-200">
              {filteredItems.map((item) => (
                <MenuItemRow
                  key={item.menuItemId}
                  item={item}
                  onEdit={() => openEditForm(item)}
                  onDelete={() =>
                    setDeletingItem(item)
                  }
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Data integrity */}
      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Shared Menu Data
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          One menu source supports every Aurevia workflow
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Maintain"
            text="The Chef creates and updates authoritative menu records."
          />

          <FlowStep
            number="02"
            title="Publish"
            text="Available items are displayed on customer-facing menus."
          />

          <FlowStep
            number="03"
            title="Order"
            text="Customers select available items when creating orders."
          />

          <FlowStep
            number="04"
            title="Reuse"
            text="The same records support catering packages and recommendations."
          />
        </div>
      </section>

      {formOpen && (
        <MenuItemFormModal
          formData={formData}
          menus={menus}
          editing={Boolean(editingItem)}
          saving={saving}
          errorMessage={formError}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {deletingItem && (
        <DeleteModal
          item={deletingItem}
          deleting={deleting}
          onConfirm={handleDelete}
          onClose={() => {
            if (!deleting) {
              setDeletingItem(null);
            }
          }}
        />
      )}
    </div>
  );
}

function MenuItemRow({
  item,
  onEdit,
  onDelete,
}) {
  return (
    <div className="grid gap-4 px-6 py-5 xl:grid-cols-[1.3fr_1fr_1fr_130px_130px_160px] xl:items-center">
      <div>
        <p className="font-semibold text-primary-950">
          {item.itemName}
        </p>

        <p className="mt-1 line-clamp-2 text-sm text-stone-500">
          {item.description || "No description"}
        </p>

        <p className="mt-1 text-xs text-stone-400">
          Item #{item.menuItemId}
        </p>
      </div>

      <DetailField
        mobileLabel="Menu"
        value={item.menuName}
      />

      <DetailField
        mobileLabel="Category"
        value={formatLabel(item.category)}
      />

      <DetailField
        mobileLabel="Price"
        value={formatCurrency(item.price)}
      />

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400 xl:hidden">
          Status
        </p>

        <StatusBadge
          status={item.availabilityStatus}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

function MenuItemFormModal({
  formData,
  menus,
  editing,
  saving,
  errorMessage,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <ModalShell onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-primary-950">
              {editing
                ? "Edit menu item"
                : "Add menu item"}
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Enter the menu item information stored in
              the database.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-primary-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <FormField label="Menu">
            <select
              name="menuId"
              value={formData.menuId}
              onChange={onChange}
              required
              className={inputClasses}
            >
              <option value="">Select a menu</option>

              {menus.map((menu) => (
                <option
                  key={menu.menuId}
                  value={menu.menuId}
                >
                  {menu.menuName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Item Name">
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={onChange}
              maxLength={100}
              required
              className={inputClasses}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Category">
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={onChange}
                placeholder="MAIN_COURSE"
                maxLength={50}
                required
                className={inputClasses}
              />
            </FormField>

            <FormField label="Price (LKR)">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onChange}
                min="0"
                step="0.01"
                required
                className={inputClasses}
              />
            </FormField>
          </div>

          <FormField label="Availability Status">
            <select
              name="availabilityStatus"
              value={formData.availabilityStatus}
              onChange={onChange}
              required
              className={inputClasses}
            >
              <option value="AVAILABLE">
                Available
              </option>

              <option value="UNAVAILABLE">
                Unavailable
              </option>
            </select>
          </FormField>

          <FormField label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={4}
              className={inputClasses}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 border-t border-stone-200 p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-wait disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editing
                ? "Save Changes"
                : "Create Item"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function DeleteModal({
  item,
  deleting,
  onConfirm,
  onClose,
}) {
  return (
    <ModalShell onClose={onClose} narrow>
      <div className="p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
          <Trash2 className="h-5 w-5 text-red-700" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-primary-950">
          Delete menu item?
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-600">
          You are about to delete{" "}
          <span className="font-semibold text-primary-950">
            {item.itemName}
          </span>
          . This action cannot be undone.
        </p>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Existing items referenced by orders or catering
          packages may be protected by database constraints.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  children,
  onClose,
  narrow = false,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/60 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full overflow-hidden rounded-2xl bg-white shadow-xl ${
          narrow ? "max-w-md" : "max-w-2xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-primary-950">
        {label}
      </span>

      {children}
    </label>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function DetailField({ mobileLabel, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400 xl:hidden">
        {mobileLabel}
      </p>

      <p className="text-sm font-medium text-primary-950">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const available =
    status?.toUpperCase() === "AVAILABLE";

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        available
          ? "bg-emerald-100 text-emerald-800"
          : "bg-stone-200 text-stone-700"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function MessageBox({
  type,
  message,
  onClose,
}) {
  const success = type === "success";

  return (
    <section
      className={`mt-8 flex items-start justify-between gap-4 rounded-2xl border p-5 ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <p className="text-sm font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close message"
      >
        <X className="h-4 w-4" />
      </button>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="px-6 py-14 text-center">
      <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-600">
        Loading menu items...
      </p>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
        <UtensilsCrossed className="h-6 w-6 text-primary-700" />
      </div>

      <h3 className="mt-5 font-semibold text-primary-950">
        {filtered
          ? "No matching menu items"
          : "No menu items available"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {filtered
          ? "Change the search term or filters to view other records."
          : "Create the first menu item to begin managing the menu."}
      </p>
    </div>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div>
      <p className="text-sm font-bold text-gold-400">
        {number}
      </p>

      <h3 className="mt-2 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-300">
        {text}
      </p>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatLabel(value) {
  if (!value) {
    return "Unknown";
  }

  return value
    .toString()
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getErrorMessage(error, fallback) {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === "string") {
    return responseData.message;
  }

  if (typeof responseData?.detail === "string") {
    return responseData.detail;
  }

  if (responseData?.errors) {
    const validationMessage = Object.values(
      responseData.errors,
    )[0];

    if (validationMessage) {
      return validationMessage;
    }
  }

  return fallback;
}

const inputClasses =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100";