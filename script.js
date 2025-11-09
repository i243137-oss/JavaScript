const state = {
  theme: localStorage.getItem("lf-theme") || "light",
  users: JSON.parse(localStorage.getItem("lf-users") || "[]"),
  announcements: JSON.parse(localStorage.getItem("lf-announcements") || "[]"),
  auditLog: JSON.parse(localStorage.getItem("lf-audit") || "[]"),
  notifications: [],
  moderationQueue: [],
  items: [],
  activeUser: JSON.parse(localStorage.getItem("lf-activeUser") || "null"),
  filters: {
    search: "",
    category: "all",
    location: "all",
    status: "all",
    sort: "newest",
  },
};

const seededData = (() => {
  if (localStorage.getItem("lf-seeded")) return;

  const sampleUsers = [
    {
      id: crypto.randomUUID(),
      name: "Jordan Ayo",
      email: "jordan.ayo@university.edu",
      department: "Computer Science",
      phone: "+1 555 123 4567",
      role: "student",
      status: "active",
    },
    {
      id: crypto.randomUUID(),
      name: "Priya Patel",
      email: "priya.patel@university.edu",
      department: "Electrical Engineering",
      phone: "+1 555 987 1111",
      role: "student",
      status: "active",
    },
    {
      id: crypto.randomUUID(),
      name: "Samuel Green",
      email: "samuel.green@university.edu",
      department: "Student Affairs",
      phone: "+1 555 999 0000",
      role: "admin",
      status: "active",
    },
  ];

  const sampleItems = [
    {
      id: crypto.randomUUID(),
      title: "Blue Dell XPS 13",
      type: "lost",
      category: "Electronics",
      location: "Library",
      description:
        "Laptop in a grey sleeve with stickers of NASA and open-source logos.",
      status: "lost",
      date: "2025-11-05",
      ownerId: sampleUsers[0].id,
      images: [],
      history: [
        { status: "lost", timestamp: "2025-11-05T09:00:00Z" },
        { status: "found", timestamp: "2025-11-07T15:30:00Z" },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: "Keychain with dorm fob",
      type: "found",
      category: "Accessories",
      location: "Cafeteria",
      description:
        "Silver keychain with a red dormitory fob and two keys. Found near seating area.",
      status: "found",
      date: "2025-11-06",
      ownerId: sampleUsers[1].id,
      images: [],
      history: [{ status: "found", timestamp: "2025-11-06T13:00:00Z" }],
    },
    {
      id: crypto.randomUUID(),
      title: "Chemistry 201 Textbook",
      type: "lost",
      category: "Books",
      location: "Lecture Hall",
      description:
        "Spiral-bound book with highlighted pages and sticky notes on chapters 4-6.",
      status: "returned",
      date: "2025-10-28",
      ownerId: sampleUsers[0].id,
      images: [],
      history: [
        { status: "lost", timestamp: "2025-10-28T11:00:00Z" },
        { status: "found", timestamp: "2025-10-30T16:45:00Z" },
        { status: "returned", timestamp: "2025-11-01T10:15:00Z" },
      ],
    },
  ];

  const sampleAnnouncements = [
    {
      id: crypto.randomUUID(),
      title: "Unclaimed items donation policy",
      message:
        "Unclaimed items older than 30 days will be donated to campus charities. Please review your history regularly.",
      createdAt: new Date().toISOString(),
    },
  ];

  const sampleModeration = [
    {
      id: crypto.randomUUID(),
      title: "Black leather wallet",
      type: "found",
      category: "Accessories",
      location: "Library",
      description:
        "Wallet with student ID inside. Please verify owner with matching ID.",
      date: "2025-11-08",
      submittedBy: sampleUsers[1].id,
    },
    {
      id: crypto.randomUUID(),
      title: "Graphing calculator TI-84",
      type: "lost",
      category: "Electronics",
      location: "Lab",
      description:
        "Calculator with initials P.P. on the back. Lost after lab session.",
      date: "2025-11-07",
      submittedBy: sampleUsers[1].id,
    },
  ];

  localStorage.setItem("lf-users", JSON.stringify(sampleUsers));
  localStorage.setItem("lf-items", JSON.stringify(sampleItems));
  localStorage.setItem("lf-announcements", JSON.stringify(sampleAnnouncements));
  localStorage.setItem("lf-audit", JSON.stringify([]));
  localStorage.setItem("lf-moderation", JSON.stringify(sampleModeration));
  localStorage.setItem("lf-seeded", "true");
})();

const dom = {
  themeToggle: document.getElementById("themeToggle"),
  roleSwitcher: document.getElementById("roleSwitcher"),
  logoutBtn: document.getElementById("logoutBtn"),
  activeUserName: document.querySelector(".active-user__name"),
  authTabs: document.querySelectorAll(".auth-tabs__tab"),
  authPanels: document.querySelectorAll("[data-role-panel]"),
  authForms: {
    login: document.getElementById("authLogin"),
    register: document.getElementById("authRegister"),
  },
  reportForms: document.querySelectorAll(".report-form"),
  reportTabs: document.querySelectorAll(".sub-tabs__btn"),
  alerts: document.getElementById("alerts"),
  resultsGrid: document.getElementById("resultsGrid"),
  stats: {
    lost: document.getElementById("statLost"),
    found: document.getElementById("statFound"),
    returned: document.getElementById("statReturned"),
  },
  historyList: document.getElementById("historyList"),
  notificationList: document.getElementById("notificationList"),
  clearNotifications: document.getElementById("clearNotifications"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  locationFilter: document.getElementById("locationFilter"),
  statusFilter: document.getElementById("statusFilter"),
  sortFilter: document.getElementById("sortFilter"),
  clearFilters: document.getElementById("clearFilters"),
  dashboards: {
    user: document.getElementById("user-dashboard"),
    admin: document.getElementById("admin-dashboard"),
  },
  moderationList: document.getElementById("moderationList"),
  announcementForm: document.getElementById("announcementForm"),
  announcementList: document.getElementById("announcementList"),
  userList: document.getElementById("userList"),
  analytics: {
    lost: document.getElementById("analyticsLost"),
    recovery: document.getElementById("analyticsRecovery"),
    resolution: document.getElementById("analyticsResolution"),
    frequent: document.getElementById("analyticsFrequent"),
    chart: document.getElementById("categoryChart"),
  },
  downloadAuditLog: document.getElementById("downloadAuditLog"),
  downloadUserReport: document.getElementById("downloadUserReport"),
};

function hydrateState() {
  state.items = JSON.parse(localStorage.getItem("lf-items") || "[]");
  state.moderationQueue = JSON.parse(
    localStorage.getItem("lf-moderation") || "[]"
  );
  state.users = JSON.parse(localStorage.getItem("lf-users") || "[]");
  state.announcements = JSON.parse(
    localStorage.getItem("lf-announcements") || "[]"
  );
  state.auditLog = JSON.parse(localStorage.getItem("lf-audit") || "[]");
}

hydrateState();

const TEMPLATES = {
  itemCard: document.getElementById("itemCardTemplate"),
  historyCard: document.getElementById("historyItemTemplate"),
  moderationItem: document.getElementById("moderationItemTemplate"),
  userItem: document.getElementById("userListItemTemplate"),
};

/* -------------------------------------------------------------
   Utilities
------------------------------------------------------------- */
function saveState() {
  localStorage.setItem("lf-items", JSON.stringify(state.items));
  localStorage.setItem("lf-users", JSON.stringify(state.users));
  localStorage.setItem("lf-announcements", JSON.stringify(state.announcements));
  localStorage.setItem("lf-moderation", JSON.stringify(state.moderationQueue));
  localStorage.setItem("lf-audit", JSON.stringify(state.auditLog));
  localStorage.setItem("lf-activeUser", JSON.stringify(state.activeUser));
}

function createAlert(message, type = "success", dismissAfter = 4000) {
  const alert = document.createElement("div");
  alert.className = `alert alert--${type}`;
  alert.innerHTML = `
    <span>${message}</span>
    <button type="button" class="ghost-btn ghost-btn--sm" aria-label="Dismiss notification">Dismiss</button>
  `;
  const dismissBtn = alert.querySelector("button");
  dismissBtn.addEventListener("click", () => alert.remove());
  dom.alerts.appendChild(alert);
  if (dismissAfter) {
    setTimeout(() => alert.remove(), dismissAfter);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function recordAudit(event) {
  state.auditLog.push({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), ...event });
  if (state.auditLog.length > 200) state.auditLog.shift();
  localStorage.setItem("lf-audit", JSON.stringify(state.auditLog));
}

function getUserById(id) {
  return state.users.find((user) => user.id === id) || null;
}

function requireActiveUser() {
  if (!state.activeUser) {
    createAlert("Please login to continue.", "warning");
    return false;
  }
  return true;
}

function isAdmin(user = state.activeUser) {
  return user?.role === "admin";
}

/* -------------------------------------------------------------
   Theme
------------------------------------------------------------- */
function setTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  dom.themeToggle.querySelector(".icon").textContent =
    theme === "dark" ? "☀️" : "🌙";
  dom.themeToggle.querySelector(".label").textContent =
    theme === "dark" ? "Light" : "Dark";
  localStorage.setItem("lf-theme", theme);
}

dom.themeToggle.addEventListener("click", () => {
  setTheme(state.theme === "light" ? "dark" : "light");
});

setTheme(state.theme);

/* -------------------------------------------------------------
   Authentication
------------------------------------------------------------- */
function switchAuthTab(tabId) {
  dom.authTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabId;
    tab.setAttribute("aria-selected", String(isActive));
  });

  dom.authPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.rolePanel !== tabId);
  });
}

dom.authTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
});

document.querySelectorAll("[data-open-auth]").forEach((btn) => {
  btn.addEventListener("click", () => {
    switchAuthTab(btn.dataset.openAuth);
    window.scrollTo({ top: dom.authForms.login.offsetTop - 100, behavior: "smooth" });
  });
});

function validateUniversityEmail(email) {
  return /^[^@\s]+@[^@\s]+\.(edu|ac\.[a-z]+)$/i.test(email);
}

dom.authForms.login.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("loginEmail").toLowerCase();
  const password = formData.get("loginPassword");

  if (!validateUniversityEmail(email)) {
    createAlert("Use your verified university email address to sign in.", "warning");
    return;
  }

  const user = state.users.find((u) => u.email.toLowerCase() === email);
  if (!user) {
    createAlert("No account found. Please register first.", "danger");
    return;
  }

  if (user.status !== "active") {
    createAlert("Your account is suspended. Contact support.", "danger");
    return;
  }

  state.activeUser = user;
  recordAudit({ actor: user.email, action: "login" });
  saveState();
  renderApp();
  createAlert(`Welcome back, ${user.name.split(" ")[0]}!`);
  event.currentTarget.reset();
});

dom.authForms.register.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  const data = {
    name: formData.get("registerName").trim(),
    email: formData.get("registerEmail").toLowerCase(),
    department: formData.get("registerDepartment").trim(),
    phone: formData.get("registerPhone").trim(),
    password: formData.get("registerPassword"),
    confirm: formData.get("registerConfirm"),
  };

  if (!validateUniversityEmail(data.email)) {
    createAlert(
      "Please use a valid university email (ending with .edu or academic domain).",
      "warning"
    );
    return;
  }

  if (data.password.length < 8) {
    createAlert("Password must be at least 8 characters long.", "warning");
    return;
  }

  if (data.password !== data.confirm) {
    createAlert("Passwords do not match. Try again.", "danger");
    return;
  }

  if (state.users.some((u) => u.email.toLowerCase() === data.email)) {
    createAlert("This email is already registered. Try logging in.", "warning");
    return;
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    department: data.department,
    phone: data.phone,
    role: "student",
    status: "active",
  };

  state.users.push(newUser);
  state.activeUser = newUser;
  createAlert("Account created successfully. Welcome aboard!");
  recordAudit({ actor: newUser.email, action: "register" });
  saveState();
  renderApp();
  event.currentTarget.reset();
  switchAuthTab("login");
});

dom.logoutBtn.addEventListener("click", () => {
  if (!state.activeUser) return;
  recordAudit({ actor: state.activeUser.email, action: "logout" });
  state.activeUser = null;
  saveState();
  renderApp();
  createAlert("You have been logged out.", "success");
});

/* -------------------------------------------------------------
   Role Switching
------------------------------------------------------------- */
dom.roleSwitcher.addEventListener("change", () => {
  const isAdminView = dom.roleSwitcher.value === "admin";
  dom.dashboards.admin.classList.toggle("is-hidden", !isAdminView);
  dom.dashboards.user.classList.toggle("is-hidden", isAdminView);
});

function syncRoleSwitcher() {
  const view = state.activeUser?.role === "admin" ? "admin" : "student";
  dom.roleSwitcher.value = view;
  dom.dashboards.admin.classList.toggle("is-hidden", view !== "admin");
  dom.dashboards.user.classList.toggle("is-hidden", view === "admin");
}

/* -------------------------------------------------------------
   Report Forms
------------------------------------------------------------- */
function switchReportTab(targetId) {
  dom.reportTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === targetId;
    tab.setAttribute("aria-selected", String(isActive));
  });

  dom.reportForms.forEach((form) => {
    form.classList.toggle("is-hidden", form.id !== targetId);
  });
}

dom.reportTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchReportTab(tab.dataset.tab));
});

dom.reportForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requireActiveUser()) return;

    const formData = new FormData(form);
    const entry = {
      id: crypto.randomUUID(),
      title: formData.get("title").trim(),
      type: form.dataset.reportType,
      category: formData.get("category"),
      location: formData.get("location"),
      description: formData.get("description").trim(),
      date: formData.get("date"),
      status: form.dataset.reportType === "lost" ? "lost" : "found",
      ownerId: state.activeUser.id,
      images: form._imageData || [],
      history: [
        {
          status: form.dataset.reportType === "lost" ? "lost" : "found",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    state.moderationQueue.push(entry);
    recordAudit({
      actor: state.activeUser.email,
      action: "submitted report",
      itemTitle: entry.title,
      type: entry.type,
    });
    saveState();
    renderModerationQueue();
    triggerMatchNotifications(entry);
    createAlert(
      "Report submitted for moderation. You will be notified once approved.",
      "success"
    );
    form.reset();
    form._imageData = [];
    form
      .querySelectorAll(".image-preview")
      .forEach((prev) => (prev.innerHTML = ""));
  });
});

document.querySelectorAll('input[type="file"][data-preview-target]').forEach((input) => {
  input.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    const previewContainer = document.getElementById(
      input.dataset.previewTarget
    );
    previewContainer.innerHTML = "";
    const readerPromises = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readerPromises).then((dataUrls) => {
      dataUrls.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Uploaded preview";
        previewContainer.appendChild(img);
      });
      input.closest("form")._imageData = dataUrls;
    });
  });
});

/* -------------------------------------------------------------
   Items Rendering
------------------------------------------------------------- */
function applyFilters(items) {
  return items
    .filter((item) => {
      const matchesSearch =
        state.filters.search.length === 0 ||
        `${item.title} ${item.description}`
          .toLowerCase()
          .includes(state.filters.search.toLowerCase());
      const matchesCategory =
        state.filters.category === "all" ||
        item.category === state.filters.category;
      const matchesLocation =
        state.filters.location === "all" ||
        item.location === state.filters.location;
      const matchesStatus =
        state.filters.status === "all" || item.status === state.filters.status;
      return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
    })
    .sort((a, b) => {
      if (state.filters.sort === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      if (state.filters.sort === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      if (state.filters.sort === "category") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
}

function updateStats(items) {
  const summary = items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { lost: 0, found: 0, returned: 0 }
  );
  dom.stats.lost.textContent = summary.lost || 0;
  dom.stats.found.textContent = summary.found || 0;
  dom.stats.returned.textContent = summary.returned || 0;
}

function renderItems() {
  dom.resultsGrid.innerHTML = "";
  const approvedItems = state.items.filter((item) => item.status !== "archived");
  updateStats(approvedItems);
  const visibleItems = applyFilters(approvedItems);

  if (visibleItems.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "notification-item";
    emptyState.innerHTML = `
      <strong>No items found.</strong>
      <span>Try adjusting filters or check again later.</span>
    `;
    dom.resultsGrid.appendChild(emptyState);
    return;
  }

  visibleItems.forEach((item) => {
    const fragment = TEMPLATES.itemCard.content.cloneNode(true);
    const card = fragment.querySelector(".item-card");
    card.dataset.status = item.status;
    fragment.querySelector(".item-card__title").textContent = item.title;
    fragment.querySelector(".item-card__status").textContent =
      item.status.toUpperCase();
    fragment.querySelector(
      ".item-card__meta"
    ).textContent = `${item.category} • ${item.location} • ${formatDate(
      item.date
    )}`;
    fragment.querySelector(".item-card__description").textContent =
      item.description;

    const tags = fragment.querySelector(".item-card__tags");
    tags.innerHTML = `
      <span class="badge">${item.type.toUpperCase()}</span>
      <span class="badge">Owner: ${
        getUserById(item.ownerId)?.name || "Unknown"
      }</span>
    `;

    const imagesContainer = fragment.querySelector(".item-card__images");
    if (item.images?.length) {
      item.images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${item.title} photo`;
        imagesContainer.appendChild(img);
      });
    }

    const claimBtn = fragment.querySelector(".item-card__claim");
    if (item.status === "returned") {
      claimBtn.disabled = true;
      claimBtn.textContent = "Already returned";
    } else {
      claimBtn.addEventListener("click", () => advanceStatus(item.id));
    }

    dom.resultsGrid.appendChild(fragment);
  });
}

function advanceStatus(itemId) {
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) return;

  const progression = ["lost", "found", "returned"];
  const currentIndex = progression.indexOf(item.status);
  if (currentIndex === -1 || currentIndex === progression.length - 1) return;

  const nextStatus = progression[currentIndex + 1];
  item.status = nextStatus;
  item.history.push({ status: nextStatus, timestamp: new Date().toISOString() });
  recordAudit({
    actor: state.activeUser?.email || "system",
    action: "status update",
    itemTitle: item.title,
    status: nextStatus,
  });
  saveState();
  renderItems();
  renderHistory();
  updateAnalytics();
  createAlert(`Item marked as ${nextStatus}.`);
}

/* -------------------------------------------------------------
   History
------------------------------------------------------------- */
function renderHistory() {
  dom.historyList.innerHTML = "";
  if (!state.activeUser) {
    const message = document.createElement("div");
    message.className = "notification-item";
    message.innerHTML = `
      <strong>Login to track your reports.</strong>
      <span>Your lost and found history will appear here.</span>
    `;
    dom.historyList.appendChild(message);
    return;
  }

  const userItems = state.items.filter((item) => item.ownerId === state.activeUser.id);
  if (userItems.length === 0) {
    const message = document.createElement("div");
    message.className = "notification-item";
    message.innerHTML = `
      <strong>No reports yet.</strong>
      <span>Submit a lost or found report to get started.</span>
    `;
    dom.historyList.appendChild(message);
    return;
  }

  userItems.forEach((item) => {
    const fragment = TEMPLATES.historyCard.content.cloneNode(true);
    fragment.querySelector(".history-card__title").textContent = item.title;
    fragment.querySelector(".history-card__status").textContent =
      item.status.toUpperCase();
    fragment.querySelector(
      ".history-card__meta"
    ).textContent = `${item.category} • ${item.location}`;

    const timeline = fragment.querySelector(".history-card__timeline");
    timeline.innerHTML = "";
    item.history
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .forEach((entry) => {
        const span = document.createElement("span");
        span.textContent = `${entry.status.toUpperCase()} • ${formatDate(
          entry.timestamp
        )}`;
        timeline.appendChild(span);
      });

    dom.historyList.appendChild(fragment);
  });
}

/* -------------------------------------------------------------
   Notifications
------------------------------------------------------------- */
function renderNotifications() {
  dom.notificationList.innerHTML = "";
  if (state.notifications.length === 0) {
    const empty = document.createElement("li");
    empty.className = "notification-item";
    empty.innerHTML = `
      <strong>No match alerts yet.</strong>
      <span>When a matching report appears, it will show up here instantly.</span>
    `;
    dom.notificationList.appendChild(empty);
    return;
  }

  state.notifications.slice(-5).forEach((note) => {
    const item = document.createElement("li");
    item.className = "notification-item";
    item.innerHTML = `
      <strong>${note.title}</strong>
      <span>${note.message}</span>
      <small>${new Date(note.timestamp).toLocaleTimeString()}</small>
    `;
    dom.notificationList.appendChild(item);
  });
}

dom.clearNotifications.addEventListener("click", () => {
  state.notifications = [];
  renderNotifications();
});

function triggerMatchNotifications(entry) {
  const matches = state.items.filter(
    (item) =>
      item.category === entry.category &&
      item.location === entry.location &&
      item.type !== entry.type &&
      item.status !== "returned"
  );

  if (!matches.length) return;

  matches.forEach((match) => {
    const title = "Potential match detected!";
    const message = `${entry.title} may relate to ${match.title}. Check details to confirm.`;
    state.notifications.push({
      id: crypto.randomUUID(),
      title,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  renderNotifications();
}

/* -------------------------------------------------------------
   Filters
------------------------------------------------------------- */
function bindFilters() {
  dom.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim();
    renderItems();
  });

  dom.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    renderItems();
  });

  dom.locationFilter.addEventListener("change", (event) => {
    state.filters.location = event.target.value;
    renderItems();
  });

  dom.statusFilter.addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    renderItems();
  });

  dom.sortFilter.addEventListener("change", (event) => {
    state.filters.sort = event.target.value;
    renderItems();
  });

  dom.clearFilters.addEventListener("click", () => {
    state.filters = {
      search: "",
      category: "all",
      location: "all",
      status: "all",
      sort: "newest",
    };
    dom.searchInput.value = "";
    dom.categoryFilter.value = "all";
    dom.locationFilter.value = "all";
    dom.statusFilter.value = "all";
    dom.sortFilter.value = "newest";
    renderItems();
  });
}

bindFilters();

/* -------------------------------------------------------------
   Moderation & Admin
------------------------------------------------------------- */
function renderModerationQueue() {
  dom.moderationList.innerHTML = "";
  if (!state.moderationQueue.length) {
    const empty = document.createElement("li");
    empty.className = "notification-item";
    empty.innerHTML = `
      <strong>No pending submissions.</strong>
      <span>Great work! All reports are up to date.</span>
    `;
    dom.moderationList.appendChild(empty);
    return;
  }

  state.moderationQueue.forEach((item) => {
    const fragment = TEMPLATES.moderationItem.content.cloneNode(true);
    fragment.querySelector(".moderation-item__title").textContent = item.title;
    fragment.querySelector(".moderation-item__meta").textContent = `${item.category} • ${item.location} • ${formatDate(
      item.date
    )}`;
    fragment.querySelector(".moderation-item__description").textContent =
      item.description;
    fragment.querySelector(".moderation-item__type").textContent =
      item.type.toUpperCase();

    const approveBtn = fragment.querySelector(".moderation-item__approve");
    const rejectBtn = fragment.querySelector(".moderation-item__reject");

    approveBtn.addEventListener("click", () => approveModeration(item.id));
    rejectBtn.addEventListener("click", () => rejectModeration(item.id));

    dom.moderationList.appendChild(fragment);
  });
}

function approveModeration(id) {
  const index = state.moderationQueue.findIndex((item) => item.id === id);
  if (index === -1) return;
  const [item] = state.moderationQueue.splice(index, 1);
  state.items.push(item);
  recordAudit({
    actor: state.activeUser?.email || "admin",
    action: "approved report",
    itemTitle: item.title,
  });
  saveState();
  renderModerationQueue();
  renderItems();
  renderHistory();
  updateAnalytics();
  triggerMatchNotifications(item);
  createAlert(`"${item.title}" is now live.`, "success");
}

function rejectModeration(id) {
  const index = state.moderationQueue.findIndex((item) => item.id === id);
  if (index === -1) return;
  const [item] = state.moderationQueue.splice(index, 1);
  recordAudit({
    actor: state.activeUser?.email || "admin",
    action: "rejected report",
    itemTitle: item.title,
  });
  saveState();
  renderModerationQueue();
  createAlert(`"${item.title}" was rejected.`, "warning");
}

dom.announcementForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireActiveUser() || !isAdmin()) {
    createAlert("Only admins can post announcements.", "danger");
    return;
  }
  const formData = new FormData(event.currentTarget);
  const announcement = {
    id: crypto.randomUUID(),
    title: formData.get("announcementTitle").trim(),
    message: formData.get("announcementBody").trim(),
    createdAt: new Date().toISOString(),
  };
  state.announcements.unshift(announcement);
  recordAudit({
    actor: state.activeUser.email,
    action: "created announcement",
    title: announcement.title,
  });
  saveState();
  renderAnnouncements();
  event.currentTarget.reset();
  createAlert("Announcement posted.", "success");
});

function renderAnnouncements() {
  dom.announcementList.innerHTML = "";
  if (!state.announcements.length) {
    const empty = document.createElement("li");
    empty.className = "notification-item";
    empty.innerHTML = `
      <strong>No announcements yet.</strong>
      <span>Admins can post important campus updates.</span>
    `;
    dom.announcementList.appendChild(empty);
    return;
  }

  state.announcements.slice(0, 5).forEach((announcement) => {
    const li = document.createElement("li");
    li.className = "announcement-item";
    li.innerHTML = `
      <h4>${announcement.title}</h4>
      <time>${formatDate(announcement.createdAt)}</time>
      <p>${announcement.message}</p>
    `;
    dom.announcementList.appendChild(li);
  });
}

function renderUserList() {
  dom.userList.innerHTML = "";
  state.users.forEach((user) => {
    const fragment = TEMPLATES.userItem.content.cloneNode(true);
    fragment.querySelector(".user-item__name").textContent = user.name;
    fragment.querySelector(
      ".user-item__meta"
    ).textContent = `${user.department} • ${user.email}`;
    const suspendBtn = fragment.querySelector(".user-item__suspend");
    const reinstateBtn = fragment.querySelector(".user-item__reinstate");
    suspendBtn.disabled = user.status !== "active";
    reinstateBtn.disabled = user.status === "active";

    suspendBtn.addEventListener("click", () => updateUserStatus(user.id, "suspended"));
    reinstateBtn.addEventListener("click", () => updateUserStatus(user.id, "active"));

    dom.userList.appendChild(fragment);
  });
}

function updateUserStatus(userId, status) {
  const user = getUserById(userId);
  if (!user) return;
  user.status = status;
  recordAudit({
    actor: state.activeUser?.email || "admin",
    action: "changed user status",
    target: user.email,
    status,
  });
  saveState();
  renderUserList();
  createAlert(`${user.name} is now ${status}.`, status === "active" ? "success" : "warning");
}

/* -------------------------------------------------------------
   Analytics
------------------------------------------------------------- */
function updateAnalytics() {
  if (!dom.analytics.chart) return;

  const itemsLast30 = state.items.filter(
    (item) =>
      new Date(item.date) >=
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  dom.analytics.lost.textContent = itemsLast30.length.toString();

  const recovered =
    itemsLast30.filter((item) => item.status === "returned").length || 0;
  const recoveryRatio = itemsLast30.length
    ? Math.round((recovered / itemsLast30.length) * 100)
    : 0;
  dom.analytics.recovery.textContent = `${recoveryRatio}%`;

  const resolutionTimes = itemsLast30
    .filter((item) => item.status === "returned")
    .map((item) => {
      const lostDate = item.history.find((entry) => entry.status === "lost");
      const returnedDate = item.history.find(
        (entry) => entry.status === "returned"
      );
      if (!lostDate || !returnedDate) return null;
      return (
        (new Date(returnedDate.timestamp) - new Date(lostDate.timestamp)) /
        (1000 * 60 * 60 * 24)
      );
    })
    .filter(Boolean);

  const averageResolution =
    resolutionTimes.length === 0
      ? 0
      : Math.max(
          1,
          Math.round(
            resolutionTimes.reduce((sum, val) => sum + val, 0) /
              resolutionTimes.length
          )
        );
  dom.analytics.resolution.textContent = `${averageResolution} days`;

  const categoryFrequency = state.items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryFrequency).sort(
    (a, b) => b[1] - a[1]
  )[0];
  dom.analytics.frequent.textContent = topCategory
    ? `${topCategory[0]}`
    : "No data";

  drawCategoryChart(categoryFrequency);
}

function drawCategoryChart(data) {
  const canvas = dom.analytics.chart;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const entries = Object.entries(data);
  if (!entries.length) {
    ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
    ctx.font = "14px Inter";
    ctx.fillText("No category data yet.", 20, canvas.height / 2);
    return;
  }

  const maxVal = Math.max(...entries.map(([, value]) => value));
  const barWidth = (canvas.width - 60) / entries.length;

  entries.forEach(([category, value], index) => {
    const barHeight = (value / maxVal) * (canvas.height - 60);
    const x = 40 + index * barWidth;
    const y = canvas.height - barHeight - 30;
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--color-primary");
    ctx.fillRect(x, y, barWidth * 0.6, barHeight);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--color-text");
    ctx.font = "12px Inter";
    ctx.fillText(value.toString(), x, y - 8);

    ctx.save();
    ctx.translate(x, canvas.height - 10);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(category, 0, 0);
    ctx.restore();
  });
}

/* -------------------------------------------------------------
   Downloads
------------------------------------------------------------- */
function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

dom.downloadAuditLog.addEventListener("click", () => {
  if (!isAdmin()) {
    createAlert("Only admins can download the audit log.", "warning");
    return;
  }
  downloadJson("audit-log.json", state.auditLog);
});

dom.downloadUserReport.addEventListener("click", () => {
  if (!isAdmin()) {
    createAlert("Only admins can download user reports.", "warning");
    return;
  }
  const report = state.users.map((user) => ({
    ...user,
    items: state.items.filter((item) => item.ownerId === user.id),
  }));
  downloadJson("user-history-report.json", report);
});

/* -------------------------------------------------------------
   Initial Render
------------------------------------------------------------- */
function renderActiveUser() {
  const name = state.activeUser ? state.activeUser.name : "Guest";
  dom.activeUserName.textContent = name;
  dom.logoutBtn.disabled = !state.activeUser;
}

function renderApp() {
  hydrateState();
  renderActiveUser();
  renderItems();
  renderHistory();
  renderNotifications();
  renderModerationQueue();
  renderAnnouncements();
  renderUserList();
  syncRoleSwitcher();
  updateAnalytics();
}

renderApp();

/* -------------------------------------------------------------
   Accessibility extras
------------------------------------------------------------- */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    renderApp();
  }
});

/* -------------------------------------------------------------
   Archive task (auto every load)
------------------------------------------------------------- */
function archiveOldCases() {
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  let archivedCount = 0;
  state.items.forEach((item) => {
    const lastUpdate = item.history[item.history.length - 1];
    if (new Date(lastUpdate.timestamp).getTime() < ninetyDaysAgo) {
      item.status = "archived";
      archivedCount += 1;
    }
  });
  if (archivedCount) {
    recordAudit({
      actor: "system",
      action: "archived cases",
      count: archivedCount,
    });
    saveState();
  }
}

archiveOldCases();
renderApp();
