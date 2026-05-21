// ============================================================================
// APP STATE & DATABASE INITIALIZATION
// ============================================================================

// Factory Tenant Nodes
const FACTORIES = {
  FreshSqueeze_HQ: "FreshSqueeze Juice Co. (HQ)",
  EnergyPulse_Ltd: "EnergyPulse Production Ltd.",
  BioNectar_Ind: "BioNectar Industrial Labs"
};

// Default Permissions Matrix (RBAC)
let permissionsMatrix = {
  Boss: {
    dashboard: true,
    approvals: true,
    items: true,
    editItems: true,
    warehouses: true,
    rbac: true,
    users: true,
    audit: true,
    movements: true,
    verification: true,
    adjustStock: true
  },
  Operator: {
    dashboard: true,
    approvals: false,
    items: true,
    editItems: false,
    warehouses: true,
    rbac: false,
    users: true,
    audit: true,
    movements: true,
    verification: true,
    adjustStock: false
  },
  Guest: {
    dashboard: true,
    approvals: false,
    items: true,
    editItems: false,
    warehouses: true,
    rbac: false,
    users: false,
    audit: true,
    movements: false,
    verification: true,
    adjustStock: false
  }
};

// Raw Materials Database (Only Raw Materials, NO Finished Goods)
let itemsDatabase = [
  { id: 1, sku: "RAW-ORANGE-CONC", name: "Brazilian Orange Concentrate 65 Brix", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 40, reorder: 10, price: 650.00, status: "Active" },
  { id: 2, sku: "RAW-APPLE-CONC", name: "Polish Apple Concentrate 70 Brix", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 16, reorder: 10, price: 580.00, status: "Active" },
  { id: 3, sku: "RAW-CANE-SUGAR", name: "Refined Cane Sugar Granules", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 50, baseUnit: "kg", containerCount: 300, reorder: 50, price: 42.50, status: "Active" },
  { id: 4, sku: "RAW-CITRIC-ACID", name: "Anhydrous Citric Acid Powder", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 25, baseUnit: "kg", containerCount: 10, reorder: 20, price: 52.50, status: "Active" }, // Low Stock (10 <= 20)
  { id: 5, sku: "RAW-PET-BOTTLE", name: "1L Clear PET Bottles (Preforms)", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 1000, baseUnit: "units", containerCount: 12, reorder: 10, price: 150.00, status: "Active" },
  { id: 6, sku: "RAW-ALUM-CAN", name: "330ml Aluminum Cans (Sleek)", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 2000, baseUnit: "units", containerCount: 22, reorder: 15, price: 160.00, status: "Active" },
  { id: 7, sku: "RAW-BOTTLE-CAP", name: "Green Plastic Caps 28mm", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 5000, baseUnit: "units", containerCount: 2, reorder: 5, price: 100.00, status: "Active" } // Low Stock (2 <= 5)
];

// Warehouse Locations (User-configurable storage nodes)
let warehouseDatabase = [
  { id: "wh-1", name: "Sabev-1", temp: "4.2°C", humidity: "45% RH", status: "Active" },
  { id: "wh-2", name: "Sabev-2", temp: "22.5°C", humidity: "32% RH", status: "Active" },
  { id: "wh-3", name: "Warehouse-1", temp: "20.1°C", humidity: "40% RH", status: "Active" }
];

// Inbound/Outbound Movements Database (Date and Time-wise log)
let movementsDatabase = [
  { timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), sku: "RAW-ORANGE-CONC", name: "Brazilian Orange Concentrate 65 Brix", type: "Inbound", containers: 10, totalQty: 2000, baseUnit: "Litres", originDest: "Supplier (Procured) -> Sabev-1", user: "boss@freshsqueeze.com", supplier: "Brazilian OrangeCorp Ltd", vehicleNum: "TRK-90A-1", approvedBy: "Elizabeth Vance" },
  { timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(), sku: "RAW-CANE-SUGAR", name: "Refined Cane Sugar Granules", type: "Outbound", containers: 20, totalQty: 1000, baseUnit: "kg", originDest: "Sabev-2 -> Mixing Tank 3", user: "operator@freshsqueeze.com", movedBy: "John Hammond", vehicleNum: "Cart B-02", approvedBy: "Elizabeth Vance" },
  { timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), sku: "RAW-PET-BOTTLE", name: "1L Clear PET Bottles (Preforms)", type: "Outbound", containers: 2, totalQty: 2000, baseUnit: "units", originDest: "Warehouse-1 -> Bottling Line 1", user: "operator@freshsqueeze.com", movedBy: "John Hammond", vehicleNum: "Cart B-03", approvedBy: "Elizabeth Vance" }
];

// Physical Stocktake Verification Database
let verificationDatabase = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    warehouse: "Sabev-1",
    sku: "RAW-ORANGE-CONC",
    name: "Brazilian Orange Concentrate 65 Brix",
    systemQty: 40,
    physicalQty: 40,
    variance: 0,
    verifiedBy: "John Hammond",
    approvedBy: "Elizabeth Vance",
    status: "Verified"
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    warehouse: "Sabev-1",
    sku: "RAW-APPLE-CONC",
    name: "Polish Apple Concentrate 70 Brix",
    systemQty: 16,
    physicalQty: 15,
    variance: -1,
    verifiedBy: "John Hammond",
    approvedBy: "Elizabeth Vance",
    status: "Pending Adjustment"
  }
];

// Workforce Identity Directory
let usersDatabase = [
  { id: "W-893", name: "Elizabeth Vance", email: "boss@freshsqueeze.com", role: "Boss", twoFactor: "SMS + Hardware Token", mode: "OTP_AUTO_BYPASS", status: "Active" },
  { id: "W-402", name: "John Hammond", email: "operator@freshsqueeze.com", role: "Operator", twoFactor: "Authenticator App", mode: "OTP_PENDING_ADMIN", status: "Active" },
  { id: "W-112", name: "Arthur Dent", email: "guest@freshsqueeze.com", role: "Guest", twoFactor: "SMS Mobile verification", mode: "OTP_PENDING_ADMIN", status: "Active" }
];

// Security Audit Log Database
let auditLogs = [
  { timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), module: "SECURITY", action: "Tenant node FreshSqueeze_HQ handshake initialized", user: "SYSTEM", ip: "10.142.0.12", level: "INFO", signature: "0x8f2d...9a2e" },
  { timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(), module: "RBAC", action: "Global policy sync completed successfully", user: "SYSTEM", ip: "10.142.0.12", level: "INFO", signature: "0x4b7c...7e12" },
  { timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(), module: "INVENTORY", action: "Discrepancy audit initiated on Bin A-04", user: "boss@freshsqueeze.com (Boss)", ip: "192.168.1.45", level: "INFO", signature: "0xe2a1...3b9c" }
];

// Pending login approval requests
let loginApprovals = [];

// Session expiry countdown (24 Hours)
let sessionDurationSeconds = 24 * 60 * 60 - 8;

// Active session state
let currentSession = {
  active: false,
  role: "Boss",
  email: "boss@freshsqueeze.com",
  tenant: "FreshSqueeze_HQ",
  screen: "screen-dashboard"
};

// Temp login object during OTP verification
let pendingLogin = null;

// ============================================================================
// COMPLIANCE AUDITOR & LOGGERS
// ============================================================================

function logSystemAction(module, action, user, ip = "192.168.1.45", level = "INFO") {
  const hex = "0123456789abcdef";
  let sig = "0x";
  for(let i=0; i<4; i++) sig += hex[Math.floor(Math.random()*16)];
  sig += "...";
  for(let i=0; i<4; i++) sig += hex[Math.floor(Math.random()*16)];

  const newLog = {
    timestamp: new Date().toISOString(),
    module: module.toUpperCase(),
    action: action,
    user: user,
    ip: ip,
    level: level.toUpperCase(),
    signature: sig
  };
  auditLogs.unshift(newLog);
  
  // Refresh views
  renderAuditTrailTable();
  renderDashboardAuditExcerpt();
}

function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast) return;
  
  toastMessage.textContent = message;
  const icon = toast.querySelector('i');
  if (isSuccess) {
    icon.className = "fa-solid fa-circle-check text-green";
  } else {
    icon.className = "fa-solid fa-circle-exclamation text-danger";
  }
  
  toast.classList.remove('hidden');
  
  if (toast.timeoutId) clearTimeout(toast.timeoutId);
  
  toast.timeoutId = setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(num) {
  return "$" + num.toFixed(2);
}

function formatLogTimestamp(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString() + " " + d.toTimeString().split(" ")[0];
}

function checkPermission(permissionKey) {
  const role = currentSession.role;
  return permissionsMatrix[role] && permissionsMatrix[role][permissionKey] === true;
}

// ============================================================================
// SCREEN NAVIGATION & ROUTING
// ============================================================================

function switchScreen(screenId) {
  let permissionKey = "";
  if (screenId === "screen-dashboard") permissionKey = "dashboard";
  else if (screenId === "screen-approvals") permissionKey = "approvals";
  else if (screenId === "screen-items") permissionKey = "items";
  else if (screenId === "screen-warehouses") permissionKey = "warehouses";
  else if (screenId === "screen-movements") permissionKey = "movements";
  else if (screenId === "screen-verification") permissionKey = "verification";
  else if (screenId === "screen-rbac") permissionKey = "rbac";
  else if (screenId === "screen-users") permissionKey = "users";
  else if (screenId === "screen-audit") permissionKey = "audit";

  if (!checkPermission(permissionKey)) {
    showToast(`Access Denied: Role '${currentSession.role}' does not have view permission.`, false);
    logSystemAction("SECURITY", `Unauthorized access attempt to screen ${screenId}`, `${currentSession.email} (${currentSession.role})`, "192.168.1.45", "warning");
    
    if (screenId !== "screen-dashboard") {
      switchScreen("screen-dashboard");
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      document.getElementById('menu-dashboard').classList.add('active');
    }
    return;
  }

  document.querySelectorAll('.app-screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
  currentSession.screen = screenId;

  const titles = {
    "screen-dashboard": "System Dashboard",
    "screen-approvals": "Boss Authorization Queue",
    "screen-items": "Raw Materials Master Ledger",
    "screen-warehouses": "Warehouse Storage Locations",
    "screen-movements": "Procurement & Movements Manager",
    "screen-verification": "Physical Verification & Stocktake",
    "screen-rbac": "Role-Based Access Control Security Matrix",
    "screen-users": "Staff Identity Directory",
    "screen-audit": "Immutable Cryptographic Audit Trail"
  };
  document.getElementById('screen-title').textContent = titles[screenId] || "Raw Materials System";

  // Render trigger
  if (screenId === "screen-dashboard") {
    renderDashboardStats();
    renderDashboardAuditExcerpt();
  } else if (screenId === "screen-approvals") {
    renderApprovalsTable();
  } else if (screenId === "screen-items") {
    renderItemsTable();
  } else if (screenId === "screen-warehouses") {
    renderWarehouseLocations();
  } else if (screenId === "screen-movements") {
    populateMovementDropdowns();
    renderMovementsTable();
  } else if (screenId === "screen-verification") {
    populateVerificationDropdowns();
    renderVerificationLogsTable();
  } else if (screenId === "screen-rbac") {
    renderRBACMatrixTable();
  } else if (screenId === "screen-users") {
    renderUsersTable();
  } else if (screenId === "screen-audit") {
    renderAuditTrailTable();
  }

  logSystemAction("SYSTEM", `Navigated to ${titles[screenId]} Module`, `${currentSession.email} (${currentSession.role})`);
  setTimeout(adjustContentPadding, 50);
}

function setupSidebarNavigation() {
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      
      document.querySelectorAll('.sidebar-menu .menu-item').forEach(m => m.classList.remove('active'));
      item.classList.add('active');
      
      switchScreen(target);
    });
  });
}

// ============================================================================
// SECURE OTP LOGIN FLOW & SIMULATOR PORTAL
// ============================================================================

function setupAuthHandlers() {
  // Step 1: Credentials
  document.getElementById('btn-submit-credentials').addEventListener('click', () => {
    const tenant = document.getElementById('login-tenant').value;
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    if (!email) {
      alert("Please enter a valid employee email.");
      return;
    }

    let detectedRole = "";
    if (email === "boss@freshsqueeze.com" && pass === "supersecure123") {
      detectedRole = "Boss";
    } else if (email === "operator@freshsqueeze.com" && pass === "operator123") {
      detectedRole = "Operator";
    } else if (email === "guest@freshsqueeze.com" && pass === "guest123") {
      detectedRole = "Guest";
    } else {
      alert("Invalid credentials. Try boss@freshsqueeze.com / supersecure123");
      logSystemAction("SECURITY", `Failed login attempt for email: ${email}`, "GUEST_IP_HANDSHAKE", "192.168.1.88", "critical");
      return;
    }

    pendingLogin = {
      email: email,
      role: detectedRole,
      tenant: tenant,
      tenantName: FACTORIES[tenant]
    };

    document.getElementById('auth-step-login').classList.remove('active');
    document.getElementById('auth-step-otp').classList.add('active');
    
    const otpInputs = document.querySelectorAll('.otp-digit');
    otpInputs.forEach(i => i.value = "");
    otpInputs[0].focus();

    logSystemAction("SECURITY", `Credentials verified, dispatching 2FA OTP challenges`, email);
  });

  // OTP digit navigation
  const otpInputs = document.querySelectorAll('.otp-digit');
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
        otpInputs[index - 1].focus();
        otpInputs[index - 1].value = "";
      }
    });
  });

  document.getElementById('btn-back-login').addEventListener('click', () => {
    document.getElementById('auth-step-otp').classList.remove('active');
    document.getElementById('auth-step-login').classList.add('active');
    pendingLogin = null;
  });

  // Submit OTP
  document.getElementById('btn-submit-otp').addEventListener('click', () => {
    let otpCode = "";
    document.querySelectorAll('.otp-digit').forEach(input => {
      otpCode += input.value.trim();
    });

    if (otpCode !== "123456") {
      alert("Invalid verification code. Use the hint: 123456");
      logSystemAction("SECURITY", `Invalid OTP verification attempt`, pendingLogin.email, "192.168.1.88", "warning");
      return;
    }

    logSystemAction("SECURITY", `OTP verification successful`, pendingLogin.email);

    if (pendingLogin.role === "Boss") {
      completeUserLogin(pendingLogin.email, pendingLogin.role, pendingLogin.tenant);
      showToast("Access Granted: Administrator session established.");
    } else {
      // Operator & Guest require Boss approval
      const requestId = Math.floor(Math.random() * 100000);
      const newApprovalRequest = {
        id: requestId,
        email: pendingLogin.email,
        role: pendingLogin.role,
        timestamp: new Date().toISOString(),
        tenant: pendingLogin.tenant,
        tenantName: pendingLogin.tenantName,
        ip: "192.168.1.104",
        sessionKey: "sess_" + Math.random().toString(36).substring(2, 8)
      };
      
      loginApprovals.push(newApprovalRequest);
      updateApprovalBadges();

      document.getElementById('waiting-user-display').textContent = pendingLogin.email;
      document.getElementById('waiting-tenant-display').textContent = pendingLogin.tenantName;

      document.getElementById('auth-step-otp').classList.remove('active');
      document.getElementById('auth-step-waiting').classList.add('active');

      logSystemAction("SECURITY", `Login approval request placed in queue (ID: ${requestId})`, pendingLogin.email, "192.168.1.104", "warning");
      startPolledApprovalCheck(requestId);
    }
  });

  document.getElementById('btn-cancel-waiting').addEventListener('click', () => {
    if (pendingLogin) {
      loginApprovals = loginApprovals.filter(req => req.email !== pendingLogin.email);
      updateApprovalBadges();
      logSystemAction("SECURITY", `Authorization request cancelled by user`, pendingLogin.email);
    }
    document.getElementById('auth-step-waiting').classList.remove('active');
    document.getElementById('auth-step-login').classList.add('active');
    pendingLogin = null;
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    logSystemAction("SECURITY", `Session terminated by user request`, `${currentSession.email} (${currentSession.role})`);
    currentSession.active = false;
    currentSession.email = "";
    
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('auth-step-login').classList.add('active');
    document.getElementById('auth-step-otp').classList.remove('active');
    document.getElementById('auth-step-waiting').classList.remove('active');
    
    syncSimulatorPanel();
    showToast("Session closed successfully. System locked.");
  });
}

function completeUserLogin(email, role, tenant) {
  currentSession.active = true;
  currentSession.email = email;
  currentSession.role = role;
  currentSession.tenant = tenant;
  
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('app-container').classList.remove('hidden');
  
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.getElementById('menu-dashboard').classList.add('active');
  switchScreen("screen-dashboard");

  document.getElementById('active-tenant-name').textContent = FACTORIES[tenant];
  document.getElementById('user-display-name').textContent = email.split('@')[0].toUpperCase();
  document.getElementById('user-display-role').textContent = role;
  document.getElementById('header-avatar-circle').textContent = role.charAt(0);
  
  applyDynamicRBACUIShields();
  syncSimulatorPanel();
  
  logSystemAction("SECURITY", `Session verified. Access granted to raw materials system.`, `${email} (${role})`);
}

let approvalPollInterval = null;
function startPolledApprovalCheck(requestId) {
  if (approvalPollInterval) clearInterval(approvalPollInterval);
  approvalPollInterval = setInterval(() => {
    const req = loginApprovals.find(r => r.id === requestId);
    if (!req) {
      clearInterval(approvalPollInterval);
      if (pendingLogin) {
        completeUserLogin(pendingLogin.email, pendingLogin.role, pendingLogin.tenant);
        showToast("Login Approved by Administrator! Access granted.");
        pendingLogin = null;
      }
    }
  }, 1000);
}

// ============================================================================
// DYNAMIC UI RBAC ENFORCEMENT
// ============================================================================

function applyDynamicRBACUIShields() {
  const sidebarItems = {
    "menu-dashboard": "dashboard",
    "menu-approvals": "approvals",
    "menu-items": "items",
    "menu-warehouses": "warehouses",
    "menu-movements": "movements",
    "menu-verification": "verification",
    "menu-rbac": "rbac",
    "menu-users": "users",
    "menu-audit": "audit"
  };

  for (const [id, permission] of Object.entries(sidebarItems)) {
    const el = document.getElementById(id);
    if (el) {
      if (checkPermission(permission)) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  }

  // Raw Materials Ledger Actions
  const addItemBtn = document.getElementById('btn-add-item');
  if (addItemBtn) {
    if (checkPermission('editItems')) addItemBtn.classList.remove('hidden');
    else addItemBtn.classList.add('hidden');
  }
  
  const editItemHeaders = document.querySelectorAll('#items-table th:last-child');
  editItemHeaders.forEach(el => {
    if (checkPermission('editItems')) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  // Location Management Buttons
  const addWhBtn = document.getElementById('btn-add-warehouse');
  const whErrorBox = document.getElementById('warehouse-error-box');
  const isBoss = currentSession.role === "Boss";
  
  if (addWhBtn) {
    if (isBoss) addWhBtn.classList.remove('hidden');
    else addWhBtn.classList.add('hidden');
  }
  if (whErrorBox) {
    if (isBoss) whErrorBox.classList.add('hidden');
    else whErrorBox.classList.remove('hidden');
  }

  // RBAC Shield
  const rbacErrorBox = document.getElementById('rbac-error-box');
  const saveRbacBtn = document.getElementById('btn-save-rbac');
  if (isBoss) {
    if (rbacErrorBox) rbacErrorBox.classList.add('hidden');
    if (saveRbacBtn) saveRbacBtn.classList.remove('hidden');
  } else {
    if (rbacErrorBox) rbacErrorBox.classList.remove('hidden');
    if (saveRbacBtn) saveRbacBtn.classList.add('hidden');
  }

  // Security status coloring
  const secBadge = document.getElementById('system-security-badge');
  const secBadgeText = secBadge.querySelector('span');
  if (isBoss) {
    secBadge.className = "system-security-badge sec-green";
    secBadgeText.textContent = "BOSS ROOT ADMIN ACTIVE";
  } else if (currentSession.role === "Operator") {
    secBadge.className = "system-security-badge sec-green";
    secBadgeText.textContent = "OPERATOR SESSION RUNNING";
  } else {
    secBadge.className = "system-security-badge sec-amber";
    secBadgeText.textContent = "RESTRICTED AUDIT CONSOLE";
  }
}

// ============================================================================
// COMPONENT RENDERING LOGIC
// ============================================================================

// 1. Dashboard
function renderDashboardStats() {
  document.getElementById('dash-total-items').textContent = itemsDatabase.length;
  
  // Low stock calculation: containerCount <= reorder
  const lowStockCount = itemsDatabase.filter(i => i.containerCount <= i.reorder).length;
  const lowStockEl = document.getElementById('dash-low-stock');
  lowStockEl.textContent = lowStockCount;
  lowStockEl.className = lowStockCount > 0 ? "stat-val text-danger" : "stat-val text-green";

  document.getElementById('dash-pending-logins').textContent = loginApprovals.length;
  document.getElementById('dash-movements-count').textContent = movementsDatabase.length;

  const complianceCircleText = document.querySelector('.compliance-circle span');
  const complianceCircleIcon = document.querySelector('.compliance-circle i');
  const complianceCircle = document.querySelector('.compliance-circle');
  
  if (lowStockCount > 0) {
    complianceCircle.className = "compliance-circle sec-amber";
    complianceCircleIcon.className = "fa-solid fa-triangle-exclamation text-amber";
    complianceCircleText.className = "text-amber-dark font-bold";
    complianceCircleText.textContent = "Low Stock Warning";
  } else {
    complianceCircle.className = "compliance-circle sec-green";
    complianceCircleIcon.className = "fa-solid fa-check-double text-green";
    complianceCircleText.className = "text-green-dark font-bold";
    complianceCircleText.textContent = "100% Secure";
  }

  // Update breakdown graphs (liquids sum, solids sum, packaging units sum)
  const liquidsVol = itemsDatabase.filter(i => i.category === "Liquid").reduce((acc, curr) => acc + (curr.containerCount * curr.capacityPerContainer), 0);
  const solidsMass = itemsDatabase.filter(i => i.category === "Dry").reduce((acc, curr) => acc + (curr.containerCount * curr.capacityPerContainer), 0);
  const pkgUnits = itemsDatabase.filter(i => i.category === "Packaging").reduce((acc, curr) => acc + (curr.containerCount * curr.capacityPerContainer), 0);

  const lPct = Math.min(100, Math.round((liquidsVol / 20000) * 100));
  const sPct = Math.min(100, Math.round((solidsMass / 30000) * 100));
  const pPct = Math.min(100, Math.round((pkgUnits / 100000) * 100));

  document.getElementById('chart-liquids-bar').style.width = lPct + "%";
  document.getElementById('chart-liquids-val').textContent = formatNumber(liquidsVol) + " L";

  document.getElementById('chart-solids-bar').style.width = sPct + "%";
  document.getElementById('chart-solids-val').textContent = formatNumber(solidsMass) + " kg";

  document.getElementById('chart-pkg-bar').style.width = pPct + "%";
  document.getElementById('chart-pkg-val').textContent = formatNumber(pkgUnits) + " units";
}

function renderDashboardAuditExcerpt() {
  const tbody = document.querySelector('#dashboard-audit-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const excerpt = auditLogs.slice(0, 3);
  excerpt.forEach(log => {
    const tr = document.createElement('tr');
    let lvlBadge = `<span class="badge badge-outline-primary">INFO</span>`;
    if (log.level === "WARNING") lvlBadge = `<span class="badge badge-outline-amber">WARN</span>`;
    if (log.level === "CRITICAL") lvlBadge = `<span class="badge badge-light-danger">ALERT</span>`;

    tr.innerHTML = `
      <td class="timestamp">${formatLogTimestamp(log.timestamp)}</td>
      <td>${log.action}</td>
      <td>${log.user}</td>
      <td class="ip-address">${log.ip}</td>
      <td>${lvlBadge}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('dash-btn-view-audit').onclick = () => {
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById('menu-audit').classList.add('active');
    switchScreen("screen-audit");
  };
}

// 2. Boss Approvals Table
function renderApprovalsTable() {
  const emptyState = document.getElementById('approvals-empty-state');
  const table = document.getElementById('approvals-table');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = "";

  if (loginApprovals.length === 0) {
    emptyState.classList.remove('hidden');
    table.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  table.classList.remove('hidden');

  loginApprovals.forEach(req => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-bold">${req.email}</td>
      <td><span class="badge badge-blue">${req.role}</span></td>
      <td class="timestamp">${formatLogTimestamp(req.timestamp)}</td>
      <td>${req.tenantName}</td>
      <td class="ip-address">${req.ip}</td>
      <td class="sku">${req.sessionKey}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-approve" data-id="${req.id}">
          <i class="fa-solid fa-check"></i> Approve
        </button>
        <button class="btn btn-sm btn-danger btn-reject" data-id="${req.id}">
          <i class="fa-solid fa-xmark"></i> Reject
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      approveLoginRequest(id);
    });
  });

  tbody.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      rejectLoginRequest(id);
    });
  });
}

function approveLoginRequest(id) {
  const req = loginApprovals.find(r => r.id === id);
  if (!req) return;

  logSystemAction("SECURITY", `Login session request APPROVED by Administrator`, `boss@freshsqueeze.com`);
  loginApprovals = loginApprovals.filter(r => r.id !== id);
  
  updateApprovalBadges();
  renderApprovalsTable();
  showToast(`Authorized session for ${req.email}`);
}

function rejectLoginRequest(id) {
  const req = loginApprovals.find(r => r.id === id);
  if (!req) return;

  logSystemAction("SECURITY", `Login session request REJECTED by Administrator`, `boss@freshsqueeze.com`, "192.168.1.45", "warning");
  loginApprovals = loginApprovals.filter(r => r.id !== id);
  
  if (pendingLogin && pendingLogin.email === req.email) {
    pendingLogin = null;
  }
  
  updateApprovalBadges();
  renderApprovalsTable();
  showToast(`Rejected request for ${req.email}`, false);
}

function updateApprovalBadges() {
  const count = loginApprovals.length;
  const sidebarBadge = document.getElementById('approvals-badge');
  sidebarBadge.textContent = count;
  if (count > 0) {
    sidebarBadge.classList.remove('hidden');
    document.getElementById('notification-indicator').classList.add('active');
  } else {
    sidebarBadge.classList.add('hidden');
    document.getElementById('notification-indicator').classList.remove('active');
  }

  const screenBadge = document.getElementById('approvals-count-badge');
  if (screenBadge) {
    screenBadge.textContent = `${count} pending request${count === 1 ? '' : 's'}`;
  }
}

// 3. Raw Materials Ledger Table
function renderItemsTable() {
  const tbody = document.querySelector('#items-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchQuery = document.getElementById('items-search').value.trim().toLowerCase();
  const categoryFilter = document.getElementById('items-filter-category').value;

  const filtered = itemsDatabase.filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(searchQuery) || 
                          item.name.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter === "" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    
    // Status and stock alarms
    const totalQtyVal = item.containerCount * item.capacityPerContainer;
    let stockStatusBadge = `<span class="badge badge-green">In Stock</span>`;
    
    if (item.containerCount === 0) {
      stockStatusBadge = `<span class="badge badge-danger">Out of Stock</span>`;
    } else if (item.containerCount <= item.reorder) {
      stockStatusBadge = `<span class="badge badge-amber">Low Stock</span>`;
    }

    const editColumn = checkPermission('editItems') ? `
      <td>
        <button class="btn btn-sm btn-outline-primary btn-edit-item" data-id="${item.id}">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button class="btn btn-sm btn-outline-danger btn-delete-item" data-id="${item.id}">
          <i class="fa-solid fa-trash-can"></i> Delete
        </button>
      </td>
    ` : `<td class="hidden"></td>`;

    tr.innerHTML = `
      <td class="sku">${item.sku}</td>
      <td class="font-bold">${item.name}</td>
      <td><span class="badge badge-outline-primary">${item.category}</span></td>
      <td>${item.warehouse}</td>
      <td>${item.containerUnit}</td>
      <td class="number">${formatNumber(item.capacityPerContainer)} ${item.baseUnit}</td>
      <td class="number font-bold">${formatNumber(item.containerCount)}</td>
      <td class="number font-bold text-blue">${formatNumber(totalQtyVal)} ${item.baseUnit}</td>
      <td class="number">${formatNumber(item.reorder)}</td>
      <td class="number">${formatCurrency(item.price)}</td>
      ${editColumn}
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      openItemModal(id);
    });
  });

  tbody.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      deleteItem(id);
    });
  });
}

function openItemModal(id = null) {
  if (!checkPermission('editItems')) {
    showToast("Access Denied: You do not have permissions to edit master data.", false);
    return;
  }

  const modal = document.getElementById('modal-item');
  const title = document.getElementById('modal-item-title');
  const form = document.getElementById('form-item');
  
  document.getElementById('items-error-box').classList.add('hidden');
  populateWarehouseDropdown('item-warehouse');

  if (id) {
    const item = itemsDatabase.find(i => i.id === id);
    if (!item) return;

    title.textContent = "Edit Raw Material Specifications";
    document.getElementById('item-form-id').value = item.id;
    document.getElementById('item-sku').value = item.sku;
    document.getElementById('item-sku').disabled = true;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-warehouse').value = item.warehouse;
    document.getElementById('item-unit-type').value = item.containerUnit;
    document.getElementById('item-capacity').value = item.capacityPerContainer;
    document.getElementById('item-base-unit').value = item.baseUnit;
    document.getElementById('item-container-count').value = item.containerCount;
    document.getElementById('item-reorder').value = item.reorder;
    document.getElementById('item-price').value = item.price;
  } else {
    title.textContent = "Add Raw Material to Ledger";
    form.reset();
    document.getElementById('item-form-id').value = "";
    document.getElementById('item-sku').disabled = false;
  }

  modal.classList.remove('hidden');
}

function deleteItem(id) {
  if (!checkPermission('editItems')) {
    showToast("Access Denied: You do not have permissions to delete master data.", false);
    return;
  }

  const item = itemsDatabase.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Are you sure you want to permanently delete raw material SKU: ${item.sku}?`)) {
    itemsDatabase = itemsDatabase.filter(i => i.id !== id);
    logSystemAction("INVENTORY", `Deleted raw material item SKU: ${item.sku}`, `${currentSession.email}`, "192.168.1.45", "critical");
    renderItemsTable();
    showToast(`Deleted item SKU: ${item.sku}`);
  }
}

// 4. Warehouse & Locations Configuration
function renderWarehouseLocations() {
  const container = document.getElementById('warehouse-list');
  if (!container) return;
  container.innerHTML = "";

  const isBoss = currentSession.role === "Boss";

  warehouseDatabase.forEach(wh => {
    // Collect all raw materials stored in this warehouse
    const storedItems = itemsDatabase.filter(item => item.warehouse === wh.name);

    // Create warehouse card element
    const whCard = document.createElement('div');
    whCard.className = "card card-lg warehouse-card";
    
    // Render list of compartments (materials) with concrete numbers
    let binsHTML = `<div class="bin-grid">`;
    if (storedItems.length === 0) {
      binsHTML += `
        <div class="bin-item bin-empty" style="grid-column: span 2; text-align:center;">
          <span class="bin-code">EMPTY</span>
          <span class="bin-details">No raw materials stored in this location.</span>
        </div>
      `;
    } else {
      storedItems.forEach((item, index) => {
        const binCode = `${wh.name.charAt(0).toUpperCase()}-0${index + 1}`;
        const isLow = item.containerCount <= item.reorder;
        const binClass = item.containerCount === 0 ? "bin-empty" : (isLow ? "bin-medium" : "bin-heavy");
        const totalNet = item.containerCount * item.capacityPerContainer;

        binsHTML += `
          <div class="bin-item ${binClass}">
            <span class="bin-code">${binCode} • SKU: ${item.sku}</span>
            <span class="bin-pct">${formatNumber(item.containerCount)} ${item.containerUnit}</span>
            <span class="bin-details">${item.name} (${formatNumber(totalNet)} ${item.baseUnit})</span>
          </div>
        `;
      });
    }
    binsHTML += `</div>`;

    // Boss gets to delete locations
    const deleteBtnHTML = isBoss ? `
      <button class="btn btn-sm btn-outline-danger btn-delete-warehouse" data-name="${wh.name}">
        <i class="fa-solid fa-trash-can"></i> Delete Location
      </button>
    ` : "";

    whCard.innerHTML = `
      <div class="card-header bg-navy text-white">
        <div>
          <h3 class="text-white"><i class="fa-solid fa-warehouse text-blue"></i> ${wh.name}</h3>
          <p class="text-muted text-sm">Target: <strong>T: ${wh.temp} / H: ${wh.humidity}</strong></p>
        </div>
        ${deleteBtnHTML}
      </div>
      <div class="card-body">
        <h4 class="margin-bottom-sm">Spatial Compartment Ledger</h4>
        ${binsHTML}
      </div>
    `;
    container.appendChild(whCard);
  });

  // Delete listener
  container.querySelectorAll('.btn-delete-warehouse').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      deleteWarehouseLocation(name);
    });
  });
}

function deleteWarehouseLocation(whName) {
  if (currentSession.role !== "Boss") {
    showToast("Access Denied: Only Boss root administrators can delete storage nodes.", false);
    return;
  }

  // Check if warehouse is currently holding materials
  const hasItems = itemsDatabase.some(item => item.warehouse === whName);
  if (hasItems) {
    alert(`Cannot delete storage node "${whName}": it currently stores active raw material containers. Re-allocate items before deleting.`);
    return;
  }

  if (confirm(`Are you sure you want to permanently delete warehouse location: "${whName}"?`)) {
    warehouseDatabase = warehouseDatabase.filter(w => w.name !== whName);
    logSystemAction("INVENTORY", `Deleted storage location node: ${whName}`, currentSession.email, "192.168.1.45", "critical");
    renderWarehouseLocations();
    showToast(`Storage node "${whName}" removed successfully.`);
  }
}

function populateWarehouseDropdown(dropdownId) {
  const select = document.getElementById(dropdownId);
  if (!select) return;
  select.innerHTML = "";
  warehouseDatabase.forEach(wh => {
    const opt = document.createElement('option');
    opt.value = wh.name;
    opt.textContent = wh.name;
    select.appendChild(opt);
  });
}

// ============================================================================
// PROCUREMENT & MOVEMENTS OPERATIONS
// ============================================================================

function populateMovementDropdowns() {
  populateWarehouseDropdown('inbound-warehouse');
  
  const inboundMatSelect = document.getElementById('inbound-material');
  const outboundMatSelect = document.getElementById('outbound-material');
  
  if (inboundMatSelect) {
    inboundMatSelect.innerHTML = "";
    itemsDatabase.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.sku;
      opt.textContent = `${item.sku} - ${item.name}`;
      inboundMatSelect.appendChild(opt);
    });
  }

  if (outboundMatSelect) {
    outboundMatSelect.innerHTML = "";
    itemsDatabase.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.sku;
      opt.textContent = `${item.sku} - ${item.name} (Stock: ${item.containerCount} ${item.containerUnit})`;
      outboundMatSelect.appendChild(opt);
    });
  }
}

function renderMovementsTable() {
  const tbody = document.querySelector('#movements-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchQuery = document.getElementById('movement-search').value.trim().toLowerCase();

  const filtered = movementsDatabase.filter(m => {
    return m.sku.toLowerCase().includes(searchQuery) ||
           m.name.toLowerCase().includes(searchQuery) ||
           m.originDest.toLowerCase().includes(searchQuery);
  });

  filtered.forEach(m => {
    const tr = document.createElement('tr');
    
    let typeBadge = `<span class="badge badge-outline-green"><i class="fa-solid fa-arrow-down-long"></i> Inbound</span>`;
    if (m.type === "Outbound") {
      typeBadge = `<span class="badge badge-outline-amber"><i class="fa-solid fa-arrow-up-long"></i> Outbound</span>`;
    }

    tr.innerHTML = `
      <td class="timestamp">${formatLogTimestamp(m.timestamp)}</td>
      <td class="sku">${m.sku}</td>
      <td class="font-bold">${m.name}</td>
      <td>${typeBadge}</td>
      <td class="number font-bold">${m.containers}</td>
      <td class="number font-bold text-blue">${formatNumber(m.totalQty)} ${m.baseUnit}</td>
      <td class="sku">${m.originDest}</td>
      <td>${m.user}</td>
      <td>
        <button class="btn btn-xs btn-outline-primary btn-movement-details" data-timestamp="${m.timestamp}" data-sku="${m.sku}">
          <i class="fa-solid fa-magnifying-glass-plus"></i> Details
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-movement-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const timestamp = btn.getAttribute('data-timestamp');
      const sku = btn.getAttribute('data-sku');
      const move = movementsDatabase.find(x => x.timestamp === timestamp && x.sku === sku);
      if (move) {
        openMovementDetailsModal(move);
      }
    });
  });
}

function setupMovementOperations() {
  // Inbound Procurement
  document.getElementById('form-inbound').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!checkPermission('movements')) {
      showToast("Access Denied: You do not have permissions to perform movements.", false);
      return;
    }

    const sku = document.getElementById('inbound-material').value;
    const containersToAdd = parseInt(document.getElementById('inbound-containers').value);
    const targetWh = document.getElementById('inbound-warehouse').value;
    const supplier = document.getElementById('inbound-supplier').value.trim();
    const truck = document.getElementById('inbound-truck').value.trim();
    const approvedBy = document.getElementById('inbound-approved-by').value.trim();

    const item = itemsDatabase.find(i => i.sku === sku);
    if (!item) return;

    // Update quantities
    item.containerCount += containersToAdd;
    
    // Assign warehouse if modified or initial
    item.warehouse = targetWh;

    const totalVolumetricQty = containersToAdd * item.capacityPerContainer;

    // Log movement entry
    const newMove = {
      timestamp: new Date().toISOString(),
      sku: item.sku,
      name: item.name,
      type: "Inbound",
      containers: containersToAdd,
      totalQty: totalVolumetricQty,
      baseUnit: item.baseUnit,
      originDest: `Supplier (Procured) -> ${targetWh}`,
      user: currentSession.email,
      supplier: supplier,
      vehicleNum: truck,
      approvedBy: approvedBy
    };
    
    movementsDatabase.unshift(newMove);

    logSystemAction("INVENTORY", `Procured Inbound: Added ${containersToAdd} ${item.containerUnit} of ${item.sku} to ${targetWh}`, currentSession.email);
    showToast(`Successfully registered inbound receipt of ${containersToAdd} ${item.containerUnit}.`);
    
    // Reset form & reload
    document.getElementById('inbound-containers').value = "";
    document.getElementById('inbound-supplier').value = "";
    document.getElementById('inbound-truck').value = "";
    populateMovementDropdowns();
    renderMovementsTable();
  });

  // Outbound Dispatch to Production
  document.getElementById('form-outbound').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!checkPermission('movements')) {
      showToast("Access Denied: You do not have permissions to perform movements.", false);
      return;
    }

    const sku = document.getElementById('outbound-material').value;
    const containersToRemove = parseInt(document.getElementById('outbound-containers').value);
    const destination = document.getElementById('outbound-destination').value.trim();
    const movedBy = document.getElementById('outbound-moved-by').value.trim();
    const truck = document.getElementById('outbound-truck').value.trim();
    const approvedBy = document.getElementById('outbound-approved-by').value.trim();

    const item = itemsDatabase.find(i => i.sku === sku);
    if (!item) return;

    // Safety checks for stock levels
    if (item.containerCount < containersToRemove) {
      alert(`Insufficient stock! Cannot dispatch ${containersToRemove} ${item.containerUnit} of ${item.sku}. Only ${item.containerCount} available.`);
      return;
    }

    // Update quantities
    item.containerCount -= containersToRemove;

    const totalVolumetricQty = containersToRemove * item.capacityPerContainer;

    // Log movement entry
    const newMove = {
      timestamp: new Date().toISOString(),
      sku: item.sku,
      name: item.name,
      type: "Outbound",
      containers: containersToRemove,
      totalQty: totalVolumetricQty,
      baseUnit: item.baseUnit,
      originDest: `${item.warehouse} -> ${destination}`,
      user: currentSession.email,
      movedBy: movedBy,
      vehicleNum: truck,
      approvedBy: approvedBy
    };
    
    movementsDatabase.unshift(newMove);

    logSystemAction("INVENTORY", `Dispatched Outbound: Sent ${containersToRemove} ${item.containerUnit} of ${item.sku} to ${destination}`, currentSession.email);
    showToast(`Successfully registered dispatch of ${containersToRemove} ${item.containerUnit} to ${destination}.`);

    // Reset form & reload
    document.getElementById('outbound-containers').value = "";
    document.getElementById('outbound-destination').value = "";
    document.getElementById('outbound-moved-by').value = "";
    document.getElementById('outbound-truck').value = "";
    populateMovementDropdowns();
    renderMovementsTable();
  });

  // Export Movements to CSV
  document.getElementById('btn-export-movements').addEventListener('click', () => {
    if (!checkPermission('movements')) {
      showToast("Access Denied: Permission issues.", false);
      return;
    }

    showToast("Generating spreadsheet output...");
    setTimeout(() => {
      let csv = "Timestamp,Material_SKU,Material_Description,Movement_Type,Containers,Total_Qty,Base_Unit,Origin_Destination,Supplier_Mover,Vehicle_No,Approved_By,Authorized_By\n";
      movementsDatabase.forEach(m => {
        const isI = m.type === "Inbound";
        const extraLabel = isI ? (m.supplier || "") : (m.movedBy || "");
        csv += `"${m.timestamp}","${m.sku}","${m.name}","${m.type}",${m.containers},${m.totalQty},"${m.baseUnit}","${m.originDest}","${extraLabel}","${m.vehicleNum || ""}","${m.approvedBy || ""}","${m.user}"\n`;
      });

      const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      const dl = document.createElement('a');
      dl.setAttribute("href", dataStr);
      dl.setAttribute("download", `raw_material_movements_${Date.now()}.csv`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      
      showToast("Spreadsheet downloaded successfully.");
    }, 1000);
  });
}

// ============================================================================
// STAFF DIRECTORY, RBAC & AUDITS
// ============================================================================

function renderRBACMatrixTable() {
  const tbody = document.querySelector('#rbac-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const rbacModules = [
    { key: "dashboard", name: "Access System Dashboard", group: "CORE_VIEW", desc: "View operations health summary cards and material volumes breakdown." },
    { key: "approvals", name: "Manage Login Session Approvals", group: "SECURITY", desc: "Approve or reject OTP-verified worker node entry requests." },
    { key: "items", name: "Read Raw Materials Ledger", group: "CORE_VIEW", desc: "View the master list of tracked materials and specifications." },
    { key: "editItems", name: "Modify Materials Master", group: "MASTER_DATA", desc: "Create, Edit, and Delete raw materials in ledger." },
    { key: "warehouses", name: "Read Storage Locations", group: "CORE_VIEW", desc: "View spatial warehouses, temperatures, and numeric container levels." },
    { key: "movements", name: "Perform Inbound/Outbound Movements", group: "OPERATIONS", desc: "Access procurement additions and outbound production dispatches." },
    { key: "rbac", name: "Modify Security Permissions Matrix", group: "SECURITY", desc: "Manage matrix configurations and modify access rights globally." },
    { key: "users", name: "Read Staff Identity Directory", group: "IDENTITY", desc: "View database account listing and status check-ins." },
    { key: "audit", name: "View Cryptographic Audit Trail", group: "SECURITY", desc: "Access read logs and integrity signatures ledger." }
  ];

  rbacModules.forEach(mod => {
    const tr = document.createElement('tr');
    const isBoss = currentSession.role === "Boss";
    const disabledAttr = isBoss ? "" : "disabled";

    tr.innerHTML = `
      <td>
        <div class="rbac-module-cell">
          <span class="rbac-module-name">${mod.name}</span>
          <span class="rbac-module-desc">${mod.desc}</span>
        </div>
      </td>
      <td><span class="badge badge-outline-primary">${mod.group}</span></td>
      <td class="text-center">
        <input type="checkbox" class="secure-checkbox rbac-chk" data-role="Boss" data-key="${mod.key}" ${permissionsMatrix.Boss[mod.key] ? 'checked' : ''} ${disabledAttr}>
      </td>
      <td class="text-center">
        <input type="checkbox" class="secure-checkbox rbac-chk" data-role="Operator" data-key="${mod.key}" ${permissionsMatrix.Operator[mod.key] ? 'checked' : ''} ${disabledAttr}>
      </td>
      <td class="text-center">
        <input type="checkbox" class="secure-checkbox rbac-chk" data-role="Guest" data-key="${mod.key}" ${permissionsMatrix.Guest[mod.key] ? 'checked' : ''} ${disabledAttr}>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderUsersTable() {
  const tbody = document.querySelector('#users-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";

  usersDatabase.forEach(user => {
    const tr = document.createElement('tr');
    let roleClass = "badge-blue";
    if (user.role === "Boss") roleClass = "badge-green";
    else if (user.role === "Guest") roleClass = "badge-outline-primary";

    tr.innerHTML = `
      <td class="sku">${user.id}</td>
      <td class="font-bold">${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge ${roleClass}">${user.role}</span></td>
      <td>${user.twoFactor}</td>
      <td class="sku">${user.mode}</td>
      <td><span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> ${user.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAuditTrailTable() {
  const tbody = document.querySelector('#audit-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchQuery = document.getElementById('audit-search').value.trim().toLowerCase();
  const levelFilter = document.getElementById('audit-filter-level').value;

  const filtered = auditLogs.filter(log => {
    return (log.action.toLowerCase().includes(searchQuery) ||
           log.user.toLowerCase().includes(searchQuery) ||
           log.module.toLowerCase().includes(searchQuery)) &&
           (levelFilter === "" || log.level === levelFilter);
  });

  filtered.forEach(log => {
    const tr = document.createElement('tr');
    let lvlBadge = `<span class="badge badge-outline-primary">INFO</span>`;
    if (log.level === "WARNING") lvlBadge = `<span class="badge badge-outline-amber">WARNING</span>`;
    if (log.level === "CRITICAL") lvlBadge = `<span class="badge badge-danger">CRITICAL</span>`;

    tr.innerHTML = `
      <td class="timestamp">${formatLogTimestamp(log.timestamp)}</td>
      <td><span class="badge badge-outline-primary">${log.module}</span></td>
      <td class="font-bold">${log.action}</td>
      <td>${log.user}</td>
      <td class="ip-address">${log.ip}</td>
      <td>${lvlBadge}</td>
      <td class="sku text-green"><i class="fa-solid fa-signature"></i> ${log.signature}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================================
// SIMULATOR CONTROLS
// ============================================================================

function setupSimulatorControls() {
  const panel = document.getElementById('simulator-panel');
  const toggle = document.getElementById('simulator-toggle');
  
  panel.classList.add('expanded');
  setTimeout(adjustContentPadding, 50);
  
  toggle.addEventListener('click', () => {
    panel.classList.toggle('expanded');
    adjustContentPadding();
  });

  document.getElementById('sim-role-boss').addEventListener('click', () => {
    switchActiveSessionRole("Boss", "boss@freshsqueeze.com");
  });

  document.getElementById('sim-role-operator').addEventListener('click', () => {
    switchActiveSessionRole("Operator", "operator@freshsqueeze.com");
  });

  document.getElementById('sim-role-guest').addEventListener('click', () => {
    switchActiveSessionRole("Guest", "guest@freshsqueeze.com");
  });

  document.getElementById('sim-trigger-request').addEventListener('click', () => {
    const exists = loginApprovals.find(r => r.email === "operator@freshsqueeze.com");
    if (exists) {
      showToast("operator@freshsqueeze.com request already in approvals queue.", false);
      return;
    }

    const requestId = Math.floor(Math.random() * 100000);
    const mockRequest = {
      id: requestId,
      email: "operator@freshsqueeze.com",
      role: "Operator",
      timestamp: new Date().toISOString(),
      tenant: "FreshSqueeze_HQ",
      tenantName: FACTORIES.FreshSqueeze_HQ,
      ip: "192.168.1.155",
      sessionKey: "sess_" + Math.random().toString(36).substring(2, 8)
    };

    loginApprovals.push(mockRequest);
    updateApprovalBadges();
    
    if (currentSession.screen === "screen-approvals") renderApprovalsTable();
    showToast("Simulation: Operator request injected. Swap to Boss to approve.");
    logSystemAction("SECURITY", `Injected Operator login request (ID: ${requestId})`, "SIMULATOR_BOT");
  });

  document.getElementById('sim-clear-logs').addEventListener('click', () => {
    if (confirm("Reset prototype database to default demo entries?")) {
      itemsDatabase = [
        { id: 1, sku: "RAW-ORANGE-CONC", name: "Brazilian Orange Concentrate 65 Brix", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 40, reorder: 10, price: 650.00, status: "Active" },
        { id: 2, sku: "RAW-APPLE-CONC", name: "Polish Apple Concentrate 70 Brix", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 16, reorder: 10, price: 580.00, status: "Active" },
        { id: 3, sku: "RAW-CANE-SUGAR", name: "Refined Cane Sugar Granules", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 50, baseUnit: "kg", containerCount: 300, reorder: 50, price: 42.50, status: "Active" },
        { id: 4, sku: "RAW-CITRIC-ACID", name: "Anhydrous Citric Acid Powder", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 25, baseUnit: "kg", containerCount: 10, reorder: 20, price: 52.50, status: "Active" },
        { id: 5, sku: "RAW-PET-BOTTLE", name: "1L Clear PET Bottles (Preforms)", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 1000, baseUnit: "units", containerCount: 12, reorder: 10, price: 150.00, status: "Active" },
        { id: 6, sku: "RAW-ALUM-CAN", name: "330ml Aluminum Cans (Sleek)", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 2000, baseUnit: "units", containerCount: 22, reorder: 15, price: 160.00, status: "Active" },
        { id: 7, sku: "RAW-BOTTLE-CAP", name: "Green Plastic Caps 28mm", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 5000, baseUnit: "units", containerCount: 2, reorder: 5, price: 100.00, status: "Active" }
      ];

      warehouseDatabase = [
        { id: "wh-1", name: "Sabev-1", temp: "4.2°C", humidity: "45% RH", status: "Active" },
        { id: "wh-2", name: "Sabev-2", temp: "22.5°C", humidity: "32% RH", status: "Active" },
        { id: "wh-3", name: "Warehouse-1", temp: "20.1°C", humidity: "40% RH", status: "Active" }
      ];

      permissionsMatrix = {
        Boss: { dashboard: true, approvals: true, items: true, editItems: true, warehouses: true, rbac: true, users: true, audit: true, movements: true, verification: true, adjustStock: true },
        Operator: { dashboard: true, approvals: false, items: true, editItems: false, warehouses: true, rbac: false, users: true, audit: true, movements: true, verification: true, adjustStock: false },
        Guest: { dashboard: true, approvals: false, items: true, editItems: false, warehouses: true, rbac: false, users: false, audit: true, movements: false, verification: true, adjustStock: false }
      };

      movementsDatabase = [
        { timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), sku: "RAW-ORANGE-CONC", name: "Brazilian Orange Concentrate 65 Brix", type: "Inbound", containers: 10, totalQty: 2000, baseUnit: "Litres", originDest: "Supplier (Procured) -> Sabev-1", user: "boss@freshsqueeze.com", supplier: "Brazilian OrangeCorp Ltd", vehicleNum: "TRK-90A-1", approvedBy: "Elizabeth Vance" },
        { timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(), sku: "RAW-CANE-SUGAR", name: "Refined Cane Sugar Granules", type: "Outbound", containers: 20, totalQty: 1000, baseUnit: "kg", originDest: "Sabev-2 -> Mixing Tank 3", user: "operator@freshsqueeze.com", movedBy: "John Hammond", vehicleNum: "Cart B-02", approvedBy: "Elizabeth Vance" },
        { timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), sku: "RAW-PET-BOTTLE", name: "1L Clear PET Bottles (Preforms)", type: "Outbound", containers: 2, totalQty: 2000, baseUnit: "units", originDest: "Warehouse-1 -> Bottling Line 1", user: "operator@freshsqueeze.com", movedBy: "John Hammond", vehicleNum: "Cart B-03", approvedBy: "Elizabeth Vance" }
      ];

      verificationDatabase = [
        {
          id: 1,
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          warehouse: "Sabev-1",
          sku: "RAW-ORANGE-CONC",
          name: "Brazilian Orange Concentrate 65 Brix",
          systemQty: 40,
          physicalQty: 40,
          variance: 0,
          verifiedBy: "John Hammond",
          approvedBy: "Elizabeth Vance",
          status: "Verified"
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
          warehouse: "Sabev-1",
          sku: "RAW-APPLE-CONC",
          name: "Polish Apple Concentrate 70 Brix",
          systemQty: 16,
          physicalQty: 15,
          variance: -1,
          verifiedBy: "John Hammond",
          approvedBy: "Elizabeth Vance",
          status: "Pending Adjustment"
        }
      ];

      loginApprovals = [];
      auditLogs = [
        { timestamp: new Date().toISOString(), module: "SYSTEM", action: "Simulation database reset completed by controller", user: "boss@freshsqueeze.com", ip: "127.0.0.1", level: "CRITICAL", signature: "0xec2d...15aa" }
      ];

      updateApprovalBadges();
      switchScreen(currentSession.screen);
      showToast("Simulation database cleared & reseeded.");
    }
  });
}

function switchActiveSessionRole(role, email) {
  if (!currentSession.active) {
    completeUserLogin(email, role, "FreshSqueeze_HQ");
    showToast(`Simulation Bypass: Active Role changed to ${role}`);
  } else {
    currentSession.role = role;
    currentSession.email = email;
    
    document.getElementById('user-display-name').textContent = email.split('@')[0].toUpperCase();
    document.getElementById('user-display-role').textContent = role;
    document.getElementById('header-avatar-circle').textContent = role.charAt(0);
    
    applyDynamicRBACUIShields();
    switchScreen(currentSession.screen);
    syncSimulatorPanel();
    
    showToast(`Active Session switched to: ${role} mode`);
    logSystemAction("SECURITY", `Active login session role overridden to ${role}`, `SIMULATOR_CONTROLLER`);
  }
}

function syncSimulatorPanel() {
  const roleSpan = document.getElementById('sim-stat-role');
  const permSpan = document.getElementById('sim-stat-perms');
  const tenantSpan = document.getElementById('sim-stat-tenant');

  document.getElementById('sim-role-boss').classList.remove('active');
  document.getElementById('sim-role-operator').classList.remove('active');
  document.getElementById('sim-role-guest').classList.remove('active');

  if (currentSession.active) {
    roleSpan.textContent = currentSession.role;
    tenantSpan.textContent = currentSession.tenant;
    
    if (currentSession.role === "Boss") {
      roleSpan.className = "text-green font-bold";
      permSpan.textContent = "ALL (ROOT)";
      document.getElementById('sim-role-boss').classList.add('active');
    } else if (currentSession.role === "Operator") {
      roleSpan.className = "text-blue font-bold";
      permSpan.textContent = "VIEW + STAFF + MOVE";
      document.getElementById('sim-role-operator').classList.add('active');
    } else {
      roleSpan.className = "text-muted font-bold";
      permSpan.textContent = "VIEW ONLY";
      document.getElementById('sim-role-guest').classList.add('active');
    }
  } else {
    roleSpan.textContent = "LOCKED";
    roleSpan.className = "text-danger font-bold";
    permSpan.textContent = "NONE";
    tenantSpan.textContent = "NONE";
  }
}

// ============================================================================
// WORKFLOW HANDLERS & INITIALIZATION
// ============================================================================

function initializeApp() {
  setupSidebarNavigation();
  setupAuthHandlers();
  setupSimulatorControls();
  setupMovementOperations();
  window.addEventListener('resize', adjustContentPadding);
  
  // Timer Countdown (24h)
  setInterval(() => {
    if (sessionDurationSeconds > 0) {
      sessionDurationSeconds--;
      const hrs = Math.floor(sessionDurationSeconds / 3600);
      const mins = Math.floor((sessionDurationSeconds % 3600) / 60);
      const secs = sessionDurationSeconds % 60;
      
      const timerStr = [
        hrs.toString().padStart(2, '0'),
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
      ].join(':');
      
      document.getElementById('session-time-left').textContent = timerStr;
    }
  }, 1000);

  // Search logic inputs
  document.getElementById('items-search').addEventListener('input', renderItemsTable);
  document.getElementById('items-filter-category').addEventListener('change', renderItemsTable);
  document.getElementById('audit-search').addEventListener('input', renderAuditTrailTable);
  document.getElementById('audit-filter-level').addEventListener('change', renderAuditTrailTable);
  document.getElementById('movement-search').addEventListener('input', renderMovementsTable);

  // Modal bindings
  document.getElementById('btn-modal-close').onclick = () => {
    document.getElementById('modal-item').classList.add('hidden');
  };

  document.getElementById('btn-add-item').onclick = () => {
    openItemModal();
  };

  // Add Item Submit
  document.getElementById('form-item').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!checkPermission('editItems')) {
      document.getElementById('items-error-box').classList.remove('hidden');
      return;
    }

    const formId = document.getElementById('item-form-id').value;
    const sku = document.getElementById('item-sku').value.trim().toUpperCase();
    const name = document.getElementById('item-name').value.trim();
    const category = document.getElementById('item-category').value;
    const warehouse = document.getElementById('item-warehouse').value;
    const unitType = document.getElementById('item-unit-type').value.trim();
    const capacity = parseInt(document.getElementById('item-capacity').value);
    const baseUnit = document.getElementById('item-base-unit').value;
    const containers = parseInt(document.getElementById('item-container-count').value);
    const reorder = parseInt(document.getElementById('item-reorder').value);
    const price = parseFloat(document.getElementById('item-price').value);

    if (formId) {
      // Edit
      const item = itemsDatabase.find(i => i.id === parseInt(formId));
      if (item) {
        item.name = name;
        item.category = category;
        item.warehouse = warehouse;
        item.containerUnit = unitType;
        item.capacityPerContainer = capacity;
        item.baseUnit = baseUnit;
        item.containerCount = containers;
        item.reorder = reorder;
        item.price = price;

        logSystemAction("INVENTORY", `Modified raw material specifications for SKU: ${sku}`, currentSession.email);
        showToast("Raw material specifications updated.");
      }
    } else {
      // Create
      if (itemsDatabase.some(i => i.sku === sku)) {
        alert(`SKU ${sku} already exists in ledger.`);
        return;
      }

      const newItem = {
        id: itemsDatabase.length + 1,
        sku: sku,
        name: name,
        category: category,
        warehouse: warehouse,
        containerUnit: unitType,
        capacityPerContainer: capacity,
        baseUnit: baseUnit,
        containerCount: containers,
        reorder: reorder,
        price: price,
        status: "Active"
      };

      itemsDatabase.push(newItem);
      logSystemAction("INVENTORY", `Added raw material item SKU: ${sku} (Stock: ${containers} ${unitType})`, currentSession.email);
      showToast("Raw material appended to master ledger.");
    }

    document.getElementById('modal-item').classList.add('hidden');
    renderItemsTable();
    renderDashboardStats();
  });

  // Location Management Bindings
  document.getElementById('btn-add-warehouse').addEventListener('click', () => {
    if (currentSession.role !== "Boss") {
      showToast("Access Denied: Boss authorization required.", false);
      return;
    }
    document.getElementById('modal-warehouse').classList.remove('hidden');
  });

  document.getElementById('btn-modal-warehouse-close').onclick = () => {
    document.getElementById('modal-warehouse').classList.add('hidden');
  };

  // Add Warehouse Form Submit
  document.getElementById('form-warehouse').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (currentSession.role !== "Boss") {
      showToast("Access Denied.", false);
      return;
    }

    const name = document.getElementById('warehouse-name').value.trim();
    const temp = document.getElementById('warehouse-temp').value.trim();
    const humidity = document.getElementById('warehouse-humidity').value.trim();

    if (warehouseDatabase.some(w => w.name.toLowerCase() === name.toLowerCase())) {
      alert(`A storage node named "${name}" already exists.`);
      return;
    }

    const newWh = {
      id: "wh-" + (warehouseDatabase.length + 1),
      name: name,
      temp: temp + "°C",
      humidity: humidity + "% RH",
      status: "Active"
    };

    warehouseDatabase.push(newWh);
    logSystemAction("INVENTORY", `Created new storage node location: ${name}`, currentSession.email);
    showToast(`Storage node "${name}" initialized.`);
    
    document.getElementById('modal-warehouse').classList.add('hidden');
    document.getElementById('form-warehouse').reset();
    renderWarehouseLocations();
  });

  // Save Permissions Matrix (RBAC matrix values)
  document.getElementById('btn-save-rbac').addEventListener('click', () => {
    if (currentSession.role !== "Boss") {
      alert("Access Denied.");
      return;
    }

    const checkboxes = document.querySelectorAll('.rbac-chk');
    checkboxes.forEach(chk => {
      const role = chk.getAttribute('data-role');
      const key = chk.getAttribute('data-key');
      const checked = chk.checked;
      
      permissionsMatrix[role][key] = checked;
    });

    logSystemAction("RBAC", "Global role access matrix updated by administrator", `${currentSession.email} (Boss)`, "192.168.1.45", "critical");
    applyDynamicRBACUIShields();
    showToast("RBAC policies saved.");
  });

  // Export Audit Trail
  document.getElementById('btn-export-audit').addEventListener('click', () => {
    if (!checkPermission('audit')) {
      showToast("Access Denied.", false);
      return;
    }

    showToast("Compiling security logs...");
    setTimeout(() => {
      let csvContent = "Timestamp,Module,Action,User,IP_Address,Security_Level,Signature\n";
      auditLogs.forEach(log => {
        csvContent += `"${log.timestamp}","${log.module}","${log.action}","${log.user}","${log.ip}","${log.level}","${log.signature}"\n`;
      });

      const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
      const dl = document.createElement('a');
      dl.setAttribute("href", dataStr);
      dl.setAttribute("download", `immutable_security_audit_${Date.now()}.csv`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      showToast("Security logs exported successfully.");
    }, 1000);
  });

  // Invite worker Staff
  document.getElementById('btn-add-user').addEventListener('click', () => {
    alert("For demo purposes, configure roles in the Permissions Matrix or use the Simulator Panel.");
  });

  // Dashboard cards click handlers
  const cardTotalItems = document.getElementById('card-total-items');
  const cardLowStock = document.getElementById('card-low-stock');
  const cardPendingLogins = document.getElementById('card-pending-logins');
  const cardMovementsCount = document.getElementById('card-movements-count');

  if (cardTotalItems) {
    cardTotalItems.addEventListener('click', () => openDashboardDetailsModal('total-items'));
  }
  if (cardLowStock) {
    cardLowStock.addEventListener('click', () => openDashboardDetailsModal('low-stock'));
  }
  if (cardPendingLogins) {
    cardPendingLogins.addEventListener('click', () => openDashboardDetailsModal('pending-logins'));
  }
  if (cardMovementsCount) {
    cardMovementsCount.addEventListener('click', () => openDashboardDetailsModal('movements-count'));
  }

  // Dashboard modal close
  const btnModalDashClose = document.getElementById('btn-modal-dash-close');
  if (btnModalDashClose) {
    btnModalDashClose.onclick = () => {
      document.getElementById('modal-dash-details').classList.add('hidden');
    };
  }

  // Movement details modal close header
  const btnModalMovementClose = document.getElementById('btn-modal-movement-close');
  if (btnModalMovementClose) {
    btnModalMovementClose.onclick = () => {
      document.getElementById('modal-movement-details').classList.add('hidden');
    };
  }

  // Quick Add Item click handler in Movements Form
  const btnInboundQuickAdd = document.getElementById('btn-inbound-quick-add');
  if (btnInboundQuickAdd) {
    btnInboundQuickAdd.addEventListener('click', () => {
      openItemModal();
    });
  }

  // Physical Verification Event Listeners
  const physicalInput = document.getElementById('verification-physical-count');
  if (physicalInput) {
    physicalInput.addEventListener('input', updateVerificationVariance);
  }

  // Physical Verification Submit
  const formVerification = document.getElementById('form-verification');
  if (formVerification) {
    formVerification.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const hasVerifWrite = (currentSession.role === "Boss" || currentSession.role === "Operator");
      if (!hasVerifWrite) {
        showToast("Access Denied: You do not have permissions to perform verification.", false);
        return;
      }

      const whName = document.getElementById('verification-warehouse').value;
      const sku = document.getElementById('verification-material').value;
      if (!sku) {
        alert("Please select a valid raw material item.");
        return;
      }

      const physicalCount = parseInt(document.getElementById('verification-physical-count').value);
      const verifiedBy = document.getElementById('verification-verified-by').value.trim();
      const approvedBy = document.getElementById('verification-approved-by').value.trim();

      const item = itemsDatabase.find(i => i.sku === sku);
      if (!item) return;

      const systemQty = item.containerCount;
      const variance = physicalCount - systemQty;
      const status = (variance === 0) ? "Verified" : "Pending Adjustment";

      const newLog = {
        id: verificationDatabase.length + 1,
        timestamp: new Date().toISOString(),
        warehouse: whName,
        sku: sku,
        name: item.name,
        systemQty: systemQty,
        physicalQty: physicalCount,
        variance: variance,
        verifiedBy: verifiedBy,
        approvedBy: approvedBy,
        status: status
      };

      verificationDatabase.unshift(newLog);

      const actionText = `Physical Stocktake Verified: SKU ${sku} in ${whName}. System: ${systemQty}, Physical: ${physicalCount} (Variance: ${variance})`;
      const level = (variance === 0) ? "INFO" : "WARNING";
      logSystemAction("INVENTORY", actionText, currentSession.email, "192.168.1.45", level);

      showToast(`Stocktake logged successfully. Status: ${status}`);

      // Clear input fields
      document.getElementById('verification-physical-count').value = "";
      document.getElementById('verification-verified-by').value = "";

      updateVerificationSystemQty();
      renderVerificationLogsTable();
    });
  }

  syncSimulatorPanel();
}

// ============================================================================
// DYNAMIC DASHBOARD MODALS & PHYSICAL STOCKTAKE RECONCILIATION
// ============================================================================

function openDashboardDetailsModal(cardType) {
  const modal = document.getElementById('modal-dash-details');
  const title = document.getElementById('modal-dash-title');
  const body = document.getElementById('modal-dash-body');
  if (!modal || !title || !body) return;

  let contentHtml = "";

  if (cardType === "total-items") {
    title.textContent = "Raw Material Ledger Details";
    contentHtml = `
      <div class="dash-detail-list">
        <table class="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Warehouse</th>
              <th class="number">Stock Level</th>
            </tr>
          </thead>
          <tbody>
    `;
    itemsDatabase.forEach(item => {
      contentHtml += `
        <tr>
          <td class="sku">${item.sku}</td>
          <td><strong>${item.name}</strong></td>
          <td>${item.warehouse}</td>
          <td class="number font-bold text-blue">${formatNumber(item.containerCount)} ${item.containerUnit}</td>
        </tr>
      `;
    });
    contentHtml += `
          </tbody>
        </table>
      </div>
    `;
  } else if (cardType === "low-stock") {
    title.textContent = "Low Stock Alerts & Reorder Status";
    const lowStockItems = itemsDatabase.filter(item => item.containerCount <= item.reorder);
    if (lowStockItems.length === 0) {
      contentHtml = `<p class="text-green text-center font-bold" style="padding: 20px;"><i class="fa-solid fa-circle-check"></i> All material levels are healthy. No reorder warnings!</p>`;
    } else {
      contentHtml = `
        <div class="dash-detail-list">
          <table class="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th class="number text-danger">Current Stock</th>
                <th class="number">Reorder Level</th>
              </tr>
            </thead>
            <tbody>
      `;
      lowStockItems.forEach(item => {
        contentHtml += `
          <tr>
            <td class="sku text-danger">${item.sku}</td>
            <td><strong>${item.name}</strong></td>
            <td class="number font-bold text-danger">${formatNumber(item.containerCount)} ${item.containerUnit}</td>
            <td class="number">${formatNumber(item.reorder)} ${item.containerUnit}</td>
          </tr>
        `;
      });
      contentHtml += `
            </tbody>
          </table>
        </div>
      `;
    }
  } else if (cardType === "pending-logins") {
    title.textContent = "Pending Session Authorization Queue";
    if (loginApprovals.length === 0) {
      contentHtml = `<p class="text-green text-center font-bold" style="padding: 20px;"><i class="fa-solid fa-circle-check"></i> Security authorization queue is empty.</p>`;
    } else {
      contentHtml = `
        <div class="dash-detail-list">
          <table class="table">
            <thead>
              <tr>
                <th>Employee Email</th>
                <th>Role</th>
                <th>Request Time</th>
              </tr>
            </thead>
            <tbody>
      `;
      loginApprovals.forEach(req => {
        contentHtml += `
          <tr>
            <td><strong>${req.email}</strong></td>
            <td><span class="badge badge-blue">${req.role}</span></td>
            <td class="timestamp">${formatLogTimestamp(req.timestamp)}</td>
          </tr>
        `;
      });
      contentHtml += `
            </tbody>
          </table>
        </div>
      `;
    }
  } else if (cardType === "movements-count") {
    title.textContent = "Raw Material Movements (Recent logs)";
    if (movementsDatabase.length === 0) {
      contentHtml = `<p class="text-muted text-center" style="padding: 20px;">No movements logged in the last 24 hours.</p>`;
    } else {
      contentHtml = `
        <div class="dash-detail-list" style="max-height: 350px; overflow-y: auto;">
          <table class="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>SKU</th>
                <th>Type</th>
                <th class="number">Containers</th>
              </tr>
            </thead>
            <tbody>
      `;
      movementsDatabase.forEach(m => {
        let typeBadge = m.type === "Inbound" ? `<span class="badge badge-outline-green"><i class="fa-solid fa-arrow-down-long"></i> Inbound</span>` : `<span class="badge badge-outline-amber"><i class="fa-solid fa-arrow-up-long"></i> Outbound</span>`;
        contentHtml += `
          <tr>
            <td class="timestamp">${formatLogTimestamp(m.timestamp)}</td>
            <td class="sku">${m.sku}</td>
            <td>${typeBadge}</td>
            <td class="number font-bold">${m.containers} ${m.baseUnit === "Litres" ? "Drums" : (m.baseUnit === "kg" ? "Sacks" : "Boxes")}</td>
          </tr>
        `;
      });
      contentHtml += `
            </tbody>
          </table>
        </div>
      `;
    }
  }

  body.innerHTML = contentHtml;
  modal.classList.remove('hidden');
}

function openMovementDetailsModal(m) {
  const modal = document.getElementById('modal-movement-details');
  const body = document.getElementById('modal-movement-body');
  if (!modal || !body) return;

  const isInbound = m.type === "Inbound";
  const entityLabel = isInbound ? "Supplier" : "Who is Moving";
  const entityVal = isInbound ? (m.supplier || "N/A") : (m.movedBy || "N/A");

  body.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item">
        <span class="detail-label">Timestamp</span>
        <span class="detail-value">${formatLogTimestamp(m.timestamp)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Transaction Type</span>
        <span class="detail-value font-bold ${isInbound ? 'text-match' : 'text-deficit'}">${m.type}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Material SKU</span>
        <span class="detail-value sku">${m.sku}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Material Name</span>
        <span class="detail-value">${m.name}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Quantity Moved</span>
        <span class="detail-value font-bold">${m.containers} containers (${formatNumber(m.totalQty)} ${m.baseUnit})</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Origin / Destination</span>
        <span class="detail-value">${m.originDest}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${entityLabel}</span>
        <span class="detail-value">${entityVal}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Vehicle / Container No.</span>
        <span class="detail-value">${m.vehicleNum || "N/A"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Approved By</span>
        <span class="detail-value font-bold text-blue">${m.approvedBy || "N/A"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Logged By Session</span>
        <span class="detail-value">${m.user}</span>
      </div>
    </div>
    <div style="text-align: right; margin-top: 20px;">
      <button class="btn btn-outline-secondary" id="btn-close-move-details">Close Details</button>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('btn-close-move-details').onclick = () => {
    modal.classList.add('hidden');
  };
}

function populateVerificationDropdowns() {
  const whSelect = document.getElementById('verification-warehouse');
  const matSelect = document.getElementById('verification-material');
  if (!whSelect || !matSelect) return;

  // Populate warehouses
  whSelect.innerHTML = "";
  warehouseDatabase.forEach(wh => {
    const opt = document.createElement('option');
    opt.value = wh.name;
    opt.textContent = wh.name;
    whSelect.appendChild(opt);
  });

  // Listen to warehouse changes to update materials
  whSelect.onchange = () => {
    updateVerificationMaterials();
  };

  // Trigger initial load
  updateVerificationMaterials();
}

function updateVerificationMaterials() {
  const whSelect = document.getElementById('verification-warehouse');
  const matSelect = document.getElementById('verification-material');
  if (!whSelect || !matSelect) return;

  const whName = whSelect.value;
  matSelect.innerHTML = "";
  const filteredItems = itemsDatabase.filter(item => item.warehouse === whName);

  if (filteredItems.length === 0) {
    const opt = document.createElement('option');
    opt.value = "";
    opt.textContent = "-- No Materials in this location --";
    matSelect.appendChild(opt);
    updateVerificationSystemQty();
    return;
  }

  filteredItems.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.sku;
    opt.textContent = `${item.sku} - ${item.name}`;
    matSelect.appendChild(opt);
  });

  matSelect.onchange = () => {
    updateVerificationSystemQty();
  };

  updateVerificationSystemQty();
}

function updateVerificationSystemQty() {
  const skuSelect = document.getElementById('verification-material');
  const qtyDiv = document.getElementById('verification-system-qty');
  if (!skuSelect || !qtyDiv) return;

  const sku = skuSelect.value;

  if (!sku) {
    qtyDiv.textContent = "0 Containers";
    qtyDiv.setAttribute('data-qty', 0);
    qtyDiv.setAttribute('data-unit', "Containers");
    updateVerificationVariance();
    return;
  }

  const item = itemsDatabase.find(i => i.sku === sku);
  if (item) {
    qtyDiv.textContent = `${item.containerCount} ${item.containerUnit}`;
    qtyDiv.setAttribute('data-qty', item.containerCount);
    qtyDiv.setAttribute('data-unit', item.containerUnit);
  } else {
    qtyDiv.textContent = "0 Containers";
    qtyDiv.setAttribute('data-qty', 0);
    qtyDiv.setAttribute('data-unit', "Containers");
  }

  updateVerificationVariance();
}

function updateVerificationVariance() {
  const varianceDiv = document.getElementById('verification-variance-display');
  const physicalInput = document.getElementById('verification-physical-count');
  const qtyDiv = document.getElementById('verification-system-qty');
  if (!varianceDiv || !physicalInput || !qtyDiv) return;

  const systemQty = parseInt(qtyDiv.getAttribute('data-qty') || "0");
  const unit = qtyDiv.getAttribute('data-unit') || "Containers";
  const physicalQtyText = physicalInput.value.trim();

  if (physicalQtyText === "") {
    varianceDiv.className = "alert-box alert-box-info";
    varianceDiv.style.backgroundColor = "";
    varianceDiv.style.color = "";
    varianceDiv.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>Select a material and enter physical count to calculate variance.</span>`;
    return;
  }

  const physicalQty = parseInt(physicalQtyText);
  const variance = physicalQty - systemQty;

  if (variance === 0) {
    varianceDiv.className = "alert-box alert-box-info text-match sec-green";
    varianceDiv.style.backgroundColor = "var(--color-green-light)";
    varianceDiv.style.color = "var(--color-green-dark)";
    varianceDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Verification matches exactly: no discrepancies.</span>`;
  } else if (variance > 0) {
    varianceDiv.className = "alert-box alert-box-info text-surplus sec-amber";
    varianceDiv.style.backgroundColor = "var(--color-amber-light)";
    varianceDiv.style.color = "var(--color-amber-dark)";
    varianceDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>Surplus detected: +${variance} ${unit} over system record.</span>`;
  } else {
    varianceDiv.className = "alert-box alert-box-info text-deficit";
    varianceDiv.style.backgroundColor = "var(--color-danger-light)";
    varianceDiv.style.color = "var(--color-danger)";
    varianceDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>Deficit detected: ${variance} ${unit} shortage.</span>`;
  }
}

function renderVerificationLogsTable() {
  const tbody = document.querySelector('#verification-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const hasVerifWrite = (currentSession.role === "Boss" || currentSession.role === "Operator");
  const isBoss = currentSession.role === "Boss";

  if (!hasVerifWrite) {
    const errorBox = document.getElementById('verification-error-box');
    if (errorBox) errorBox.classList.remove('hidden');
    const formCard = document.getElementById('form-verification').closest('.card');
    if (formCard) formCard.style.display = "none";
  } else {
    const errorBox = document.getElementById('verification-error-box');
    if (errorBox) errorBox.classList.add('hidden');
    const formCard = document.getElementById('form-verification').closest('.card');
    if (formCard) formCard.style.display = "block";
  }

  verificationDatabase.forEach(log => {
    const tr = document.createElement('tr');

    let varBadge = "";
    if (log.variance === 0) {
      varBadge = `<span class="badge badge-green">0</span>`;
    } else if (log.variance > 0) {
      varBadge = `<span class="badge badge-outline-amber text-surplus">+${log.variance}</span>`;
    } else {
      varBadge = `<span class="badge badge-light-danger text-deficit">${log.variance}</span>`;
    }

    let statusBadge = "";
    if (log.status === "Verified") {
      statusBadge = `<span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> Verified</span>`;
    } else if (log.status === "Adjusted") {
      statusBadge = `<span class="badge badge-outline-primary"><i class="fa-solid fa-clock-rotate-left"></i> Adjusted</span>`;
    } else {
      statusBadge = `<span class="badge badge-amber"><i class="fa-solid fa-triangle-exclamation"></i> Discrepancy</span>`;
    }

    let actionBtn = "";
    if (log.status === "Pending Adjustment") {
      if (isBoss) {
        actionBtn = `
          <button class="btn btn-xs btn-primary btn-adjust-stock" data-id="${log.id}">
            <i class="fa-solid fa-sliders"></i> Adjust Stock
          </button>
        `;
      } else {
        actionBtn = `
          <button class="btn btn-xs btn-outline-secondary" disabled title="Boss approval required">
            Pending Boss
          </button>
        `;
      }
    } else {
      actionBtn = `<span class="text-muted text-xs">—</span>`;
    }

    tr.innerHTML = `
      <td class="timestamp">${formatLogTimestamp(log.timestamp)}</td>
      <td>${log.warehouse}</td>
      <td class="sku">${log.sku}</td>
      <td class="font-bold">${log.name}</td>
      <td class="number text-center">${log.systemQty}</td>
      <td class="number text-center">${log.physicalQty}</td>
      <td class="text-center">${varBadge}</td>
      <td>${log.verifiedBy}</td>
      <td>${log.approvedBy}</td>
      <td>${statusBadge}</td>
      <td>${actionBtn}</td>
    `;

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-adjust-stock').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      adjustSystemStock(id);
    });
  });
}

function adjustSystemStock(logId) {
  if (currentSession.role !== "Boss") {
    showToast("Access Denied: Only Boss role can reconcile ledger stock.", false);
    return;
  }

  const log = verificationDatabase.find(x => x.id === logId);
  if (!log) return;

  const item = itemsDatabase.find(i => i.sku === log.sku);
  if (!item) {
    alert(`Cannot reconcile: SKU ${log.sku} no longer exists in master ledger.`);
    return;
  }

  if (confirm(`Authorize stock adjustment? System count for SKU ${log.sku} will be updated from ${item.containerCount} to ${log.physicalQty}.`)) {
    const oldQty = item.containerCount;
    item.containerCount = log.physicalQty;
    log.status = "Adjusted";

    const actionText = `Reconciliation Stock Audit: SKU ${log.sku} ledger adjusted from ${oldQty} to ${log.physicalQty} containers by Boss.`;
    logSystemAction("INVENTORY", actionText, currentSession.email, "192.168.1.45", "warning");

    showToast(`Reconciled SKU ${log.sku} to ${log.physicalQty} containers.`);

    renderVerificationLogsTable();
    renderItemsTable();
    renderDashboardStats();
    if (currentSession.screen === "screen-verification") {
      updateVerificationSystemQty();
    }
  }
}

function adjustContentPadding() {
  const panel = document.getElementById('simulator-panel');
  const contentBody = document.querySelector('.content-body');
  if (!panel || !contentBody) return;
  
  let visibleHeight = 48; // Collapsed height
  if (panel.classList.contains('expanded')) {
    visibleHeight = panel.offsetHeight || 250;
  }
  contentBody.style.paddingBottom = `${visibleHeight + 24}px`;
}

window.addEventListener('DOMContentLoaded', initializeApp);
