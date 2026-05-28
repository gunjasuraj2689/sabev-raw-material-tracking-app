// ============================================================================
// APP STATE & DATABASE INITIALIZATION
// ============================================================================

// Local Storage Helper
function saveStateToLocalStorage() {
  localStorage.setItem('FACTORIES', JSON.stringify(FACTORIES));
  localStorage.setItem('permissionsMatrix', JSON.stringify(permissionsMatrix));
  localStorage.setItem('itemsDatabase', JSON.stringify(itemsDatabase));
  localStorage.setItem('warehouseDatabase', JSON.stringify(warehouseDatabase));
  localStorage.setItem('movementsDatabase', JSON.stringify(movementsDatabase));
  localStorage.setItem('verificationDatabase', JSON.stringify(verificationDatabase));
  localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
  localStorage.setItem('loginApprovals', JSON.stringify(loginApprovals));
  localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
}

// Factory Tenant Nodes
let FACTORIES = JSON.parse(localStorage.getItem('FACTORIES')) || {
  FreshSqueeze_HQ: "FreshSqueeze Juice Co. (HQ)",
  EnergyPulse_Ltd: "EnergyPulse Production Ltd.",
  BioNectar_Ind: "BioNectar Industrial Labs"
};

// Default Permissions Matrix (RBAC)
let permissionsMatrix = JSON.parse(localStorage.getItem('permissionsMatrix')) || {
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
    adjustStock: true,
    reports: true
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
    adjustStock: false,
    reports: true
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
    adjustStock: false,
    reports: false
  }
};

// Migrate legacy permissionsMatrix in localStorage that lacks the 'reports' permission
if (permissionsMatrix.Boss && permissionsMatrix.Boss.reports === undefined) {
  permissionsMatrix.Boss.reports = true;
}
if (permissionsMatrix.Operator && permissionsMatrix.Operator.reports === undefined) {
  permissionsMatrix.Operator.reports = true;
}
if (permissionsMatrix.Guest && permissionsMatrix.Guest.reports === undefined) {
  permissionsMatrix.Guest.reports = false;
}

// Raw Materials Database (Only Raw Materials, NO Finished Goods)
let itemsDatabase = JSON.parse(localStorage.getItem('itemsDatabase')) || [
  { id: 1, sku: "RAW-ORANGE-CONC", name: "Brazilian Orange Concentrate 65 Brix", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 40, reorder: 10, price: 650.00, status: "Active" },
  { id: 2, sku: "RAW-APPLE-CONC", name: "Polish Apple Concentrate 70 Brix", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 16, reorder: 10, price: 580.00, status: "Active" },
  { id: 3, sku: "RAW-CANE-SUGAR", name: "Refined Cane Sugar Granules", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 50, baseUnit: "kg", containerCount: 300, reorder: 50, price: 42.50, status: "Active" },
  { id: 4, sku: "RAW-CITRIC-ACID", name: "Anhydrous Citric Acid Powder", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 25, baseUnit: "kg", containerCount: 10, reorder: 20, price: 52.50, status: "Active" }, // Low Stock (10 <= 20)
  { id: 5, sku: "RAW-PET-BOTTLE", name: "1L Clear PET Bottles (Preforms)", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 1000, baseUnit: "units", containerCount: 12, reorder: 10, price: 150.00, status: "Active" },
  { id: 6, sku: "RAW-ALUM-CAN", name: "330ml Aluminum Cans (Sleek)", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 2000, baseUnit: "units", containerCount: 22, reorder: 15, price: 160.00, status: "Active" },
  { id: 7, sku: "RAW-BOTTLE-CAP", name: "Green Plastic Caps 28mm", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 5000, baseUnit: "units", containerCount: 2, reorder: 5, price: 100.00, status: "Active" } // Low Stock (2 <= 5)
];

// Warehouse Locations (User-configurable storage nodes)
let warehouseDatabase = JSON.parse(localStorage.getItem('warehouseDatabase')) || [
  { id: "wh-1", name: "Sabev-1", temp: "4.2°C", humidity: "45% RH", status: "Active" },
  { id: "wh-2", name: "Sabev-2", temp: "22.5°C", humidity: "32% RH", status: "Active" },
  { id: "wh-3", name: "Warehouse-1", temp: "20.1°C", humidity: "40% RH", status: "Active" }
];

// Inbound/Outbound Movements Database (Date and Time-wise log)
let movementsDatabase = JSON.parse(localStorage.getItem('movementsDatabase')) || [
  { timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), sku: "RAW-ORANGE-CONC", name: "Brazilian Orange Concentrate 65 Brix", type: "Inbound", containers: 10, totalQty: 2000, baseUnit: "Litres", originDest: "Supplier (Procured) -> Sabev-1", user: "boss@freshsqueeze.com", supplier: "Brazilian OrangeCorp Ltd", vehicleNum: "TRK-90A-1", approvedBy: "Elizabeth Vance" },
  { timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(), sku: "RAW-CANE-SUGAR", name: "Refined Cane Sugar Granules", type: "Outbound", containers: 20, totalQty: 1000, baseUnit: "kg", originDest: "Sabev-2 -> Mixing Tank 3", user: "operator@freshsqueeze.com", movedBy: "John Hammond", vehicleNum: "Cart B-02", approvedBy: "Elizabeth Vance" },
  { timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), sku: "RAW-PET-BOTTLE", name: "1L Clear PET Bottles (Preforms)", type: "Outbound", containers: 2, totalQty: 2000, baseUnit: "units", originDest: "Warehouse-1 -> Bottling Line 1", user: "operator@freshsqueeze.com", movedBy: "John Hammond", vehicleNum: "Cart B-03", approvedBy: "Elizabeth Vance" }
];

// Physical Stocktake Verification Database
let verificationDatabase = JSON.parse(localStorage.getItem('verificationDatabase')) || [
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

// Workforce Identity Directory (Includes Passwords and Tenant associations)
let usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [
  { id: "W-893", name: "Elizabeth Vance", email: "boss@freshsqueeze.com", role: "Boss", password: "supersecure123", twoFactor: "SMS + Hardware Token", mode: "OTP_AUTO_BYPASS", status: "Active", tenant: "FreshSqueeze_HQ" },
  { id: "W-402", name: "John Hammond", email: "operator@freshsqueeze.com", role: "Operator", password: "operator123", twoFactor: "Authenticator App", mode: "OTP_PENDING_ADMIN", status: "Active", tenant: "FreshSqueeze_HQ" },
  { id: "W-112", name: "Arthur Dent", email: "guest@freshsqueeze.com", role: "Guest", password: "guest123", twoFactor: "SMS Mobile verification", mode: "OTP_PENDING_ADMIN", status: "Active", tenant: "FreshSqueeze_HQ" }
];

// Security Audit Log Database
let auditLogs = JSON.parse(localStorage.getItem('auditLogs')) || [
  { timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), module: "SECURITY", action: "Tenant node FreshSqueeze_HQ handshake initialized", user: "SYSTEM", ip: "10.142.0.12", level: "INFO", signature: "0x8f2d...9a2e" },
  { timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(), module: "RBAC", action: "Global policy sync completed successfully", user: "SYSTEM", ip: "10.142.0.12", level: "INFO", signature: "0x4b7c...7e12" },
  { timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(), module: "INVENTORY", action: "Discrepancy audit initiated on Bin A-04", user: "boss@freshsqueeze.com (Boss)", ip: "192.168.1.45", level: "INFO", signature: "0xe2a1...3b9c" }
];

// Pending login approval requests (contains dynamically generated OTP codes)
let loginApprovals = JSON.parse(localStorage.getItem('loginApprovals')) || [];

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
  saveStateToLocalStorage();
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
  else if (screenId === "screen-reports") permissionKey = "reports";

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

  updateDynamicScreenTitle();
  const screenTitle = document.getElementById('screen-title').textContent;

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
  } else if (screenId === "screen-reports") {
    populateReportDropdowns();
  }

  logSystemAction("SYSTEM", `Navigated to ${screenTitle} Module`, `${currentSession.email} (${currentSession.role})`);
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

function populateTenantDropdowns() {
  const loginSelect = document.getElementById('login-tenant');
  const regSelect = document.getElementById('reg-select-tenant');
  
  if (loginSelect) {
    loginSelect.innerHTML = "";
    for (const [id, name] of Object.entries(FACTORIES)) {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = name;
      loginSelect.appendChild(opt);
    }
  }

  if (regSelect) {
    regSelect.innerHTML = "";
    for (const [id, name] of Object.entries(FACTORIES)) {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = name;
      regSelect.appendChild(opt);
    }
  }
}

// ============================================================================
// SECURE OTP LOGIN FLOW & SIMULATOR PORTAL
// ============================================================================

function setupAuthHandlers() {
  // Step 1: Credentials Verification
  document.getElementById('btn-submit-credentials').addEventListener('click', () => {
    const tenant = document.getElementById('login-tenant').value;
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    if (!email || !pass) {
      alert("Please enter a valid employee email and password.");
      return;
    }

    const user = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass && u.tenant === tenant);

    if (!user) {
      alert("Invalid credentials. Please verify your Email, Password, and Company selection.");
      logSystemAction("SECURITY", `Failed login attempt for email: ${email}`, "GUEST_IP_HANDSHAKE", "192.168.1.88", "critical");
      return;
    }

    let generatedOtp = "123456";
    let isBoss = user.role === "Boss";

    if (!isBoss) {
      // Generate a random 6-digit OTP for employees
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const requestId = Math.floor(Math.random() * 100000);
      const newApprovalRequest = {
        id: requestId,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString(),
        tenant: user.tenant,
        tenantName: FACTORIES[user.tenant],
        ip: "192.168.1.104",
        sessionKey: "sess_" + Math.random().toString(36).substring(2, 8),
        otp: generatedOtp,
        status: "Awaiting OTP"
      };
      
      loginApprovals.push(newApprovalRequest);
      saveStateToLocalStorage();
      updateApprovalBadges();
      
      // Update OTP screen titles dynamically for employees
      document.getElementById('otp-screen-subtitle').textContent = "A secure 6-digit OTP has been sent to your Company Boss. Please contact your Boss to get the verification code.";
      document.getElementById('otp-screen-hint').innerHTML = "Hint: Ask your Boss for the active OTP shown on their Approvals Queue dashboard.";
      
      pendingLogin = {
        email: user.email,
        role: user.role,
        tenant: user.tenant,
        tenantName: FACTORIES[user.tenant],
        otp: generatedOtp,
        requestId: requestId
      };
      
      startPolledApprovalCheck(requestId);
    } else {
      // Restore standard OTP texts for Boss
      document.getElementById('otp-screen-subtitle').textContent = "A secure 2FA token has been dispatched to your registered administrator device.";
      document.getElementById('otp-screen-hint').innerHTML = "Hint: Enter <strong>123456</strong> to proceed.";
      
      pendingLogin = {
        email: user.email,
        role: user.role,
        tenant: user.tenant,
        tenantName: FACTORIES[user.tenant],
        otp: "123456"
      };
    }

    document.getElementById('auth-step-login').classList.remove('active');
    document.getElementById('auth-step-otp').classList.add('active');
    
    const otpInputs = document.querySelectorAll('.otp-digit');
    otpInputs.forEach(i => i.value = "");
    otpInputs[0].focus();

    logSystemAction("SECURITY", `Credentials verified, dispatching 2FA OTP challenge`, user.email);
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
    if (pendingLogin && pendingLogin.requestId) {
      loginApprovals = loginApprovals.filter(r => r.id !== pendingLogin.requestId);
      updateApprovalBadges();
      saveStateToLocalStorage();
    }
    if (approvalPollInterval) clearInterval(approvalPollInterval);
    document.getElementById('auth-step-otp').classList.remove('active');
    document.getElementById('auth-step-login').classList.add('active');
    pendingLogin = null;
  });

  // Submit OTP Code
  document.getElementById('btn-submit-otp').addEventListener('click', () => {
    let otpCode = "";
    document.querySelectorAll('.otp-digit').forEach(input => {
      otpCode += input.value.trim();
    });

    if (otpCode !== pendingLogin.otp) {
      alert("Invalid verification code. Please check with your Boss or use the correct code.");
      logSystemAction("SECURITY", `Invalid OTP verification attempt`, pendingLogin.email, "192.168.1.88", "warning");
      return;
    }

    if (approvalPollInterval) clearInterval(approvalPollInterval);
    logSystemAction("SECURITY", `OTP verification successful`, pendingLogin.email);

    completeUserLogin(pendingLogin.email, pendingLogin.role, pendingLogin.tenant);
    showToast(`Access Granted: ${pendingLogin.role} session established.`);

    if (pendingLogin.requestId) {
      loginApprovals = loginApprovals.filter(r => r.id !== pendingLogin.requestId);
      updateApprovalBadges();
      saveStateToLocalStorage();
    }
    pendingLogin = null;
  });

  document.getElementById('btn-cancel-waiting').addEventListener('click', () => {
    if (pendingLogin) {
      loginApprovals = loginApprovals.filter(req => req.email !== pendingLogin.email);
      updateApprovalBadges();
      saveStateToLocalStorage();
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

  // Navigation to Registration
  document.getElementById('link-show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('auth-step-login').classList.remove('active');
    document.getElementById('auth-step-register').classList.add('active');
    populateTenantDropdowns();
  });

  document.getElementById('btn-back-register').addEventListener('click', () => {
    document.getElementById('auth-step-register').classList.remove('active');
    document.getElementById('auth-step-login').classList.add('active');
  });

  // Switch Registration Fields (Company vs Employee)
  const btnTypeCompany = document.getElementById('btn-reg-type-company');
  const btnTypeEmployee = document.getElementById('btn-reg-type-employee');
  const regCompanyFields = document.getElementById('reg-company-fields');
  const regEmployeeFields = document.getElementById('reg-employee-fields');

  btnTypeCompany.addEventListener('click', () => {
    btnTypeCompany.classList.add('active');
    btnTypeEmployee.classList.remove('active');
    regCompanyFields.classList.remove('hidden');
    regEmployeeFields.classList.add('hidden');
  });

  btnTypeEmployee.addEventListener('click', () => {
    btnTypeEmployee.classList.add('active');
    btnTypeCompany.classList.remove('active');
    regEmployeeFields.classList.remove('hidden');
    regCompanyFields.classList.add('hidden');
  });

  // Submit Registration Flow
  document.getElementById('btn-submit-registration').addEventListener('click', () => {
    const isCompanyReg = btnTypeCompany.classList.contains('active');
    const name = document.getElementById('reg-user-name').value.trim();
    const email = document.getElementById('reg-user-email').value.trim();
    const password = document.getElementById('reg-user-password').value;

    if (!name || !email || !password) {
      alert("Please fill in all user profile details.");
      return;
    }

    if (usersDatabase.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert("Email address already registered.");
      return;
    }

    if (isCompanyReg) {
      // Company registration
      const companyName = document.getElementById('reg-company-name').value.trim();
      const companyId = document.getElementById('reg-company-id').value.trim().replace(/\s+/g, '_');

      if (!companyName || !companyId) {
        alert("Please enter both Company Name and a unique Identifier.");
        return;
      }

      if (FACTORIES[companyId]) {
        alert("A company with this Identifier already exists.");
        return;
      }

      FACTORIES[companyId] = companyName;

      const newBoss = {
        id: "W-" + Math.floor(100 + Math.random() * 900),
        name: name,
        email: email,
        role: "Boss",
        password: password,
        twoFactor: "SMS + Hardware Token",
        mode: "OTP_AUTO_BYPASS",
        status: "Active",
        tenant: companyId
      };
      usersDatabase.push(newBoss);

      saveStateToLocalStorage();
      populateTenantDropdowns();

      logSystemAction("SECURITY", `Registered new company: ${companyName} (${companyId}) and Boss account: ${email}`, "REGISTRATION_SYS");
      showToast(`Company and Boss account registered successfully!`);

      document.getElementById('reg-company-name').value = "";
      document.getElementById('reg-company-id').value = "";
      document.getElementById('reg-user-name').value = "";
      document.getElementById('reg-user-email').value = "";
      document.getElementById('reg-user-password').value = "";
      
      document.getElementById('auth-step-register').classList.remove('active');
      document.getElementById('auth-step-login').classList.add('active');
      
      document.getElementById('login-tenant').value = companyId;

    } else {
      // Employee registration
      const companyId = document.getElementById('reg-select-tenant').value;
      const role = document.getElementById('reg-employee-role').value;

      if (!companyId) {
        alert("Please select a company to join.");
        return;
      }

      const newEmployee = {
        id: "W-" + Math.floor(100 + Math.random() * 900),
        name: name,
        email: email,
        role: role,
        password: password,
        twoFactor: "SMS Mobile verification",
        mode: "OTP_PENDING_ADMIN",
        status: "Active",
        tenant: companyId
      };
      usersDatabase.push(newEmployee);

      saveStateToLocalStorage();

      logSystemAction("SECURITY", `Registered new employee (${role}) account: ${email} for company ${FACTORIES[companyId]}`, "REGISTRATION_SYS");
      showToast(`Account registered successfully for ${FACTORIES[companyId]}!`);

      document.getElementById('reg-user-name').value = "";
      document.getElementById('reg-user-email').value = "";
      document.getElementById('reg-user-password').value = "";
      
      document.getElementById('auth-step-register').classList.remove('active');
      document.getElementById('auth-step-login').classList.add('active');
      
      document.getElementById('login-tenant').value = companyId;
    }
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
  switchScreen(currentSession.screen === "screen-dashboard" ? "screen-dashboard" : currentSession.screen);

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
    const savedApprovals = JSON.parse(localStorage.getItem('loginApprovals')) || [];
    const req = savedApprovals.find(r => r.id === requestId);
    if (!req) {
      clearInterval(approvalPollInterval);
      if (pendingLogin && pendingLogin.requestId === requestId) {
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
  const addUserBtn = document.getElementById('btn-add-user');
  if (addUserBtn) {
    if (currentSession.role === "Boss") addUserBtn.classList.remove('hidden');
    else addUserBtn.classList.add('hidden');
  }

  const editUserHeaders = document.querySelectorAll('.user-actions-header');
  editUserHeaders.forEach(el => {
    if (currentSession.role === "Boss") el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
  
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
function openMaterialLocationsModal(itemId) {
  const item = itemsDatabase.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById('modal-dash-details');
  const title = document.getElementById('modal-dash-title');
  const body = document.getElementById('modal-dash-body');
  if (!modal || !title || !body) return;

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  
  const prefix = langData.modal_dash_title_prefix || "Storage Locations: ";
  title.textContent = `${prefix}${item.name}`;

  // Find all locations and quantities for this raw material SKU
  const records = itemsDatabase.filter(i => i.sku === item.sku);

  let totalContainers = 0;
  let totalNetQty = 0;
  let locationRows = "";

  records.forEach(rec => {
    const netQty = rec.containerCount * rec.capacityPerContainer;
    totalContainers += rec.containerCount;
    totalNetQty += netQty;

    let statusLabel = "";
    let stockStatusBadge = "";
    if (rec.containerCount === 0) {
      statusLabel = langData.status_out_of_stock || "Out of Stock";
      stockStatusBadge = `<span class="badge badge-danger">${statusLabel}</span>`;
    } else if (rec.containerCount <= rec.reorder) {
      statusLabel = langData.status_low_stock || "Low Stock";
      stockStatusBadge = `<span class="badge badge-amber">${statusLabel}</span>`;
    } else {
      statusLabel = langData.status_in_stock || "In Stock";
      stockStatusBadge = `<span class="badge badge-green">${statusLabel}</span>`;
    }

    const containerUnitLabel = getTranslatedUnit(rec.containerUnit, langData);
    const baseUnitLabel = getTranslatedUnit(rec.baseUnit === "Litres" ? "L" : rec.baseUnit, langData);

    locationRows += `
      <tr>
        <td class="font-bold"><i class="fa-solid fa-warehouse text-blue"></i> ${rec.warehouse}</td>
        <td class="number font-bold">${formatNumber(rec.containerCount)} ${containerUnitLabel}</td>
        <td class="number font-bold text-blue">${formatNumber(netQty)} ${baseUnitLabel}</td>
        <td>${stockStatusBadge}</td>
      </tr>
    `;
  });

  const categoryLabel = langData['cat_' + item.category.toLowerCase()] || item.category;
  const containerUnitLabel = getTranslatedUnit(item.containerUnit, langData);
  const baseUnitLabel = getTranslatedUnit(item.baseUnit === "Litres" ? "L" : item.baseUnit, langData);

  const contentHtml = `
    <div class="dash-detail-list">
      <div style="margin-bottom: 20px; padding: var(--spacing-sm) var(--spacing-md); background-color: var(--color-background); border-radius: var(--radius-sm); border: 1px solid var(--color-border); display: flex; flex-wrap: wrap; gap: var(--spacing-md) var(--spacing-lg);">
        <div><strong>${langData.label_sku || 'SKU'}:</strong> <span class="sku">${item.sku}</span></div>
        <div><strong>${langData.label_category || 'Category'}:</strong> <span class="badge badge-outline-primary">${categoryLabel}</span></div>
        <div><strong>${langData.label_total_system_stock || 'Total System Stock'}:</strong> <span class="text-blue font-bold">${formatNumber(totalContainers)} ${containerUnitLabel} (${formatNumber(totalNetQty)} ${baseUnitLabel})</span></div>
      </div>
      
      <h4 style="margin-bottom: 10px; color: var(--color-on-surface);"><i class="fa-solid fa-map-location-dot text-amber"></i> ${langData.title_inventory_allocation || 'Inventory Allocation by Location'}</h4>
      <table class="table">
        <thead>
          <tr>
            <th>${langData.header_storage_location || 'Storage Location'}</th>
            <th class="number">${langData.header_containers_stored || 'Containers Stored'}</th>
            <th class="number">${langData.header_net_volume_weight || 'Net Volume/Weight'}</th>
            <th>${langData.header_status || 'Status'}</th>
          </tr>
        </thead>
        <tbody>
          ${locationRows}
        </tbody>
      </table>
    </div>
  `;

  body.innerHTML = contentHtml;
  modal.classList.remove('hidden');
}

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
  
  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  if (lowStockCount > 0) {
    complianceCircle.className = "compliance-circle sec-amber";
    complianceCircleIcon.className = "fa-solid fa-triangle-exclamation text-amber";
    complianceCircleText.className = "text-amber-dark font-bold";
    complianceCircleText.textContent = langData.dash_compliance_warning || "Low Stock Warning";
  } else {
    complianceCircle.className = "compliance-circle sec-green";
    complianceCircleIcon.className = "fa-solid fa-check-double text-green";
    complianceCircleText.className = "text-green-dark font-bold";
    complianceCircleText.textContent = langData.dash_compliance_secure || "100% Secure";
  }

  // Dynamic breakdown graphs (supporting custom parameter view)
  const breakdownContainer = document.getElementById('dashboard-stock-breakdown');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = "";
    
    const activeDashboardUnit = localStorage.getItem('dashboardUnit') || 'base';
    
    // Sort items by SKU or Name so the list is stable
    const sortedItems = [...itemsDatabase].sort((a, b) => a.sku.localeCompare(b.sku));
    
    sortedItems.forEach(item => {
      let displayVal = 0;
      let displayUnitLabel = "";
      
      if (activeDashboardUnit === "containers") {
        displayVal = item.containerCount;
        displayUnitLabel = getTranslatedUnit(item.containerUnit, langData);
      } else if (activeDashboardUnit === "base") {
        displayVal = item.containerCount * item.capacityPerContainer;
        displayUnitLabel = getTranslatedUnit(item.baseUnit === "Litres" ? "L" : item.baseUnit, langData);
      } else {
        const totalNet = item.containerCount * item.capacityPerContainer;
        let targetUnit = activeDashboardUnit;
        if (activeDashboardUnit === "tonnes") targetUnit = "metric tonne";
        
        displayVal = convertStockQty(totalNet, item.baseUnit, targetUnit, item.capacityPerContainer);
        
        if (activeDashboardUnit === "tonnes") {
          displayUnitLabel = "MT";
        } else if (activeDashboardUnit === "kg") {
          displayUnitLabel = "kg";
        } else if (activeDashboardUnit === "sacks") {
          displayUnitLabel = getTranslatedUnit("Sacks", langData);
        } else if (activeDashboardUnit === "drums") {
          displayUnitLabel = getTranslatedUnit("Drums", langData);
        } else if (activeDashboardUnit === "units") {
          displayUnitLabel = getTranslatedUnit("units", langData);
        } else {
          displayUnitLabel = getTranslatedUnit(activeDashboardUnit, langData);
        }
      }
      
      const formattedVal = typeof displayVal === 'number' ? (displayVal % 1 === 0 ? formatNumber(displayVal) : displayVal.toFixed(2)) : displayVal;
      
      let maxCap = 100;
      if (item.category === "Liquid") maxCap = 100;
      else if (item.category === "Dry") maxCap = 500;
      else if (item.category === "Packaging") maxCap = 50;
      
      const pct = Math.min(100, Math.round((item.containerCount / maxCap) * 100));
      
      let colorClass = "bg-blue";
      if (item.category === "Liquid") colorClass = "bg-blue";
      else if (item.category === "Dry") colorClass = "bg-amber";
      else if (item.category === "Packaging") colorClass = "bg-green";
      
      const barItem = document.createElement('div');
      barItem.className = "bar-item clickable-bar-item";
      barItem.setAttribute('data-id', item.id);
      barItem.setAttribute('title', `Click to view warehouse allocations for ${item.name}`);
      
      barItem.innerHTML = `
        <span class="bar-label" title="${item.name}">${item.name}</span>
        <div class="bar-track">
          <div class="bar-fill ${colorClass}" style="width: ${pct}%"></div>
        </div>
        <span class="bar-value">${formattedVal} ${displayUnitLabel}</span>
      `;
      
      barItem.addEventListener('click', () => {
        openMaterialLocationsModal(item.id);
      });
      
      breakdownContainer.appendChild(barItem);
    });
  }
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
      <td><span class="badge badge-amber font-bold" style="font-family: var(--font-mono); font-size: 12px; padding: 4px 8px;">${req.otp || "123456"}</span></td>
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
  saveStateToLocalStorage();
  
  updateApprovalBadges();
  renderApprovalsTable();
  showToast(`Authorized session for ${req.email}`);
}

function rejectLoginRequest(id) {
  const req = loginApprovals.find(r => r.id === id);
  if (!req) return;

  logSystemAction("SECURITY", `Login session request REJECTED by Administrator`, `boss@freshsqueeze.com`, "192.168.1.45", "warning");
  loginApprovals = loginApprovals.filter(r => r.id !== id);
  saveStateToLocalStorage();
  
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

  const dashPending = document.getElementById('dash-pending-logins');
  if (dashPending) {
    dashPending.textContent = count;
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

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  filtered.forEach(item => {
    const tr = document.createElement('tr');
    
    // Status and stock alarms
    const totalQtyVal = item.containerCount * item.capacityPerContainer;
    
    const categoryLabel = langData['cat_' + item.category.toLowerCase()] || item.category;
    const containerUnitLabel = getTranslatedUnit(item.containerUnit, langData);
    const baseUnitLabel = getTranslatedUnit(item.baseUnit, langData);

    const editColumn = checkPermission('editItems') ? `
      <td>
        <button class="btn btn-sm btn-outline-primary btn-edit-item" data-id="${item.id}">
          <i class="fa-solid fa-pen-to-square"></i> ${langData.btn_edit || 'Edit'}
        </button>
        <button class="btn btn-sm btn-outline-danger btn-delete-item" data-id="${item.id}">
          <i class="fa-solid fa-trash-can"></i> ${langData.btn_delete || 'Delete'}
        </button>
      </td>
    ` : `<td class="hidden"></td>`;

    tr.innerHTML = `
      <td class="sku">${item.sku}</td>
      <td class="font-bold">${item.name}</td>
      <td><span class="badge badge-outline-primary">${categoryLabel}</span></td>
      <td>${item.warehouse}</td>
      <td>${containerUnitLabel}</td>
      <td class="number">${formatNumber(item.capacityPerContainer)} ${baseUnitLabel}</td>
      <td class="number font-bold">${formatNumber(item.containerCount)}</td>
      <td class="number font-bold text-blue">${formatNumber(totalQtyVal)} ${baseUnitLabel}</td>
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

  const baseUnitSelect = document.getElementById('item-base-unit');
  const customInput = document.getElementById('item-base-unit-custom');

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
    
    const standardOptions = ['litres', 'kg', 'metric tonne', 'sacks', 'drums', 'units'];
    const itemBaseUnitLower = item.baseUnit.toLowerCase();
    
    let matchedOptionValue = "";
    standardOptions.forEach(opt => {
      if (opt === itemBaseUnitLower) {
        if (opt === 'litres') matchedOptionValue = 'Litres';
        else if (opt === 'kg') matchedOptionValue = 'kg';
        else matchedOptionValue = opt;
      }
    });

    if (matchedOptionValue) {
      baseUnitSelect.value = matchedOptionValue;
      customInput.classList.add('hidden');
      customInput.value = "";
      customInput.required = false;
    } else {
      baseUnitSelect.value = "custom";
      customInput.classList.remove('hidden');
      customInput.value = item.baseUnit;
      customInput.required = true;
    }

    document.getElementById('item-container-count').value = item.containerCount;
    document.getElementById('item-reorder').value = item.reorder;
    document.getElementById('item-price').value = item.price;
  } else {
    title.textContent = "Add Raw Material to Ledger";
    form.reset();
    document.getElementById('item-form-id').value = "";
    document.getElementById('item-sku').disabled = false;
    baseUnitSelect.value = "Litres";
    customInput.classList.add('hidden');
    customInput.value = "";
    customInput.required = false;
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

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  filtered.forEach(m => {
    const tr = document.createElement('tr');
    
    const typeLabel = m.type === "Inbound" ? langData.move_inbound || "Inbound" : langData.move_outbound || "Outbound";
    const baseUnitLabel = getTranslatedUnit(m.baseUnit, langData);
    
    let typeBadge = `<span class="badge badge-outline-green"><i class="fa-solid fa-arrow-down-long"></i> ${typeLabel}</span>`;
    if (m.type === "Outbound") {
      typeBadge = `<span class="badge badge-outline-amber"><i class="fa-solid fa-arrow-up-long"></i> ${typeLabel}</span>`;
    }

    tr.innerHTML = `
      <td class="timestamp">${formatLogTimestamp(m.timestamp)}</td>
      <td class="sku">${m.sku}</td>
      <td class="font-bold">${m.name}</td>
      <td>${typeBadge}</td>
      <td class="number font-bold">${m.containers}</td>
      <td class="number font-bold text-blue">${formatNumber(m.totalQty)} ${baseUnitLabel}</td>
      <td class="sku">${m.originDest}</td>
      <td>${m.user}</td>
      <td>
        <button class="btn btn-xs btn-outline-primary btn-movement-details" data-timestamp="${m.timestamp}" data-sku="${m.sku}">
          <i class="fa-solid fa-magnifying-glass-plus"></i> ${langData.btn_details || 'Details'}
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
    { key: "reports", name: "Access Reports & Analytics Engine", group: "CORE_VIEW", desc: "Generate, filter, and export customized stock, movements, and discrepancy reports." },
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

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const isBoss = currentSession.role === "Boss";
  const loggedInUser = usersDatabase.find(u => u.email.toLowerCase() === currentSession.email.toLowerCase());

  // Filter users by current tenant node
  const tenantUsers = usersDatabase.filter(user => user.tenant === currentSession.tenant);

  tenantUsers.forEach(user => {
    const tr = document.createElement('tr');
    let roleClass = "badge-blue";
    if (user.role === "Boss") roleClass = "badge-green";
    else if (user.role === "Guest") roleClass = "badge-outline-primary";

    let actionsHtml = "";
    if (isBoss) {
      const isSelf = loggedInUser && user.id === loggedInUser.id;
      actionsHtml = `
        <td>
          <button class="btn btn-sm btn-outline-primary btn-edit-user" data-id="${user.id}">
            <i class="fa-solid fa-pen-to-square"></i> ${langData.btn_edit || 'Edit'}
          </button>
          ${!isSelf ? `
          <button class="btn btn-sm btn-outline-danger btn-delete-user" data-id="${user.id}">
            <i class="fa-solid fa-trash-can"></i> ${langData.btn_delete || 'Delete'}
          </button>` : ''}
        </td>
      `;
    }

    tr.innerHTML = `
      <td class="sku">${user.id}</td>
      <td class="font-bold">${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge ${roleClass}">${user.role}</span></td>
      <td>${user.twoFactor}</td>
      <td class="sku">${user.mode}</td>
      <td><span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> ${user.status}</span></td>
      ${actionsHtml}
    `;
    tbody.appendChild(tr);
  });

  // Toggle user action header visibility
  const editUserHeaders = document.querySelectorAll('.user-actions-header');
  editUserHeaders.forEach(el => {
    if (isBoss) el.classList.remove('hidden');
    else el.classList.add('hidden');
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
  if (!panel || !toggle) return;
  
  panel.classList.add('expanded');
  setTimeout(adjustContentPadding, 50);
  
  toggle.addEventListener('click', () => {
    panel.classList.toggle('expanded');
    adjustContentPadding();
  });

  document.getElementById('sim-clear-logs').addEventListener('click', () => {
    if (confirm("Reset application database to default seed entries? All custom companies and accounts will be wiped.")) {
      localStorage.clear();
      
      FACTORIES = {
        FreshSqueeze_HQ: "FreshSqueeze Juice Co. (HQ)",
        EnergyPulse_Ltd: "EnergyPulse Production Ltd.",
        BioNectar_Ind: "BioNectar Industrial Labs"
      };

      usersDatabase = [
        { id: "W-893", name: "Elizabeth Vance", email: "boss@freshsqueeze.com", role: "Boss", password: "supersecure123", twoFactor: "SMS + Hardware Token", mode: "OTP_AUTO_BYPASS", status: "Active", tenant: "FreshSqueeze_HQ" },
        { id: "W-402", name: "John Hammond", email: "operator@freshsqueeze.com", role: "Operator", password: "operator123", twoFactor: "Authenticator App", mode: "OTP_PENDING_ADMIN", status: "Active", tenant: "FreshSqueeze_HQ" },
        { id: "W-112", name: "Arthur Dent", email: "guest@freshsqueeze.com", role: "Guest", password: "guest123", twoFactor: "SMS Mobile verification", mode: "OTP_PENDING_ADMIN", status: "Active", tenant: "FreshSqueeze_HQ" }
      ];

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
        Boss: { dashboard: true, approvals: true, items: true, editItems: true, warehouses: true, rbac: true, users: true, audit: true, movements: true, verification: true, adjustStock: true, reports: true },
        Operator: { dashboard: true, approvals: false, items: true, editItems: false, warehouses: true, rbac: false, users: true, audit: true, movements: true, verification: true, adjustStock: false, reports: true },
        Guest: { dashboard: true, approvals: false, items: true, editItems: false, warehouses: true, rbac: false, users: false, audit: true, movements: false, verification: true, adjustStock: false, reports: false }
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
        { timestamp: new Date().toISOString(), module: "SYSTEM", action: "System database reset completed by administrator", user: "SYSTEM", ip: "127.0.0.1", level: "CRITICAL", signature: "0xec2d...15aa" }
      ];

      saveStateToLocalStorage();
      populateTenantDropdowns();
      updateApprovalBadges();
      
      // Terminate current session on database reset
      currentSession.active = false;
      currentSession.email = "";
      currentSession.loginTime = null;
      currentSession.sessionId = null;
      
      document.getElementById('app-container').classList.add('hidden');
      document.getElementById('auth-container').classList.remove('hidden');
      document.getElementById('auth-step-login').classList.add('active');
      document.getElementById('auth-step-otp').classList.remove('active');
      document.getElementById('auth-step-waiting').classList.remove('active');
      
      syncSimulatorPanel();
      showToast("Simulation database cleared & reseeded. Please log in again.");
    }
  });
}

function syncSimulatorPanel() {
  const panel = document.getElementById('simulator-panel');
  if (!panel) return;

  if (currentSession.active) {
    panel.classList.remove('hidden');
    
    // Set user info
    document.getElementById('session-user-email').textContent = currentSession.email;
    document.getElementById('session-user-role').textContent = currentSession.role;
    document.getElementById('session-company-name').textContent = FACTORIES[currentSession.tenant] || currentSession.tenant;
    
    // Set session info
    if (!currentSession.loginTime) {
      const d = new Date();
      currentSession.loginTime = d.toLocaleDateString() + " " + d.toTimeString().split(" ")[0];
    }
    if (!currentSession.sessionId) {
      currentSession.sessionId = "sess_" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    
    document.getElementById('session-login-time').textContent = currentSession.loginTime;
    document.getElementById('session-id').textContent = currentSession.sessionId;
    
    const statusText = document.getElementById('session-status-text');
    const sessionBadge = document.getElementById('session-badge');
    if (sessionBadge) {
      sessionBadge.textContent = "INTERACTIVE DEMO MODE";
      sessionBadge.className = "badge badge-outline-amber";
    }
    if (statusText) {
      if (currentSession.role === "Boss") {
        statusText.textContent = "BOSS_ROOT_VERIFIED";
        statusText.className = "text-green font-bold";
      } else {
        statusText.textContent = `${currentSession.role.toUpperCase()}_OTP_VERIFIED`;
        statusText.className = "text-blue font-bold";
      }
    }
  } else {
    panel.classList.add('hidden');
  }
}

// ============================================================================
// WORKFLOW HANDLERS & INITIALIZATION
// ============================================================================

function initializeApp() {
  // Initialize Theme & Selectors
  const langSelect = document.getElementById('language-select');
  const authLangSelect = document.getElementById('auth-language-select');
  
  function changeLang(val) {
    currentLanguage = val;
    localStorage.setItem('appLanguage', currentLanguage);
    if (langSelect) langSelect.value = currentLanguage;
    if (authLangSelect) authLangSelect.value = currentLanguage;
    translateApp();
  }

  if (langSelect) langSelect.addEventListener('change', (e) => changeLang(e.target.value));
  if (authLangSelect) authLangSelect.addEventListener('change', (e) => changeLang(e.target.value));

  const themeToggle = document.getElementById('theme-toggle');
  const authThemeToggle = document.getElementById('auth-theme-toggle');

  function updateThemeUI(isDark) {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    const mainIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const authIcon = authThemeToggle ? authThemeToggle.querySelector('i') : null;
    if (mainIcon) mainIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    if (authIcon) authIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  function toggleTheme() {
    const isDark = !document.body.classList.contains('dark-theme');
    localStorage.setItem('appTheme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (authThemeToggle) authThemeToggle.addEventListener('click', toggleTheme);

  const savedTheme = localStorage.getItem('appTheme') || 'light';
  updateThemeUI(savedTheme === 'dark');

  populateTenantDropdowns();
  setupSidebarNavigation();
  setupAuthHandlers();
  setupSimulatorControls();
  setupMovementOperations();
  
  // Sync dashboard unit select
  const dbUnitSelect = document.getElementById('dashboard-unit-select');
  if (dbUnitSelect) {
    const savedDbUnit = localStorage.getItem('dashboardUnit') || 'base';
    dbUnitSelect.value = savedDbUnit;
    dbUnitSelect.addEventListener('change', (e) => {
      localStorage.setItem('dashboardUnit', e.target.value);
      renderDashboardStats();
    });
  }

  // Bind custom base unit selector change
  const itemBaseUnitSelect = document.getElementById('item-base-unit');
  const itemCustomInput = document.getElementById('item-base-unit-custom');
  if (itemBaseUnitSelect && itemCustomInput) {
    itemBaseUnitSelect.addEventListener('change', (e) => {
      if (e.target.value === "custom") {
        itemCustomInput.classList.remove('hidden');
        itemCustomInput.required = true;
        itemCustomInput.focus();
      } else {
        itemCustomInput.classList.add('hidden');
        itemCustomInput.required = false;
        itemCustomInput.value = "";
      }
    });
  }
  
  window.addEventListener('resize', adjustContentPadding);
  
  // Apply initial translations
  translateApp();

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
    const baseUnitSelect = document.getElementById('item-base-unit').value;
    let baseUnit = baseUnitSelect;
    if (baseUnitSelect === "custom") {
      baseUnit = document.getElementById('item-base-unit-custom').value.trim();
      if (!baseUnit) {
        alert("Please enter a custom base unit name.");
        return;
      }
    }
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

  // Add Employee Button
  document.getElementById('btn-add-user').addEventListener('click', () => {
    if (currentSession.role !== "Boss") {
      showToast("Access Denied: Only Boss root administrators can invite/add staff.", false);
      return;
    }
    const modal = document.getElementById('modal-add-user');
    const form = document.getElementById('form-add-user');
    if (modal && form) {
      form.reset();
      document.getElementById('add-user-form-id').value = ""; // Clear form ID to denote creation mode
      
      const roleSelect = document.getElementById('add-user-role');
      if (roleSelect) {
        const existingBossOpt = roleSelect.querySelector('option[value="Boss"]');
        if (existingBossOpt) {
          roleSelect.removeChild(existingBossOpt);
        }
        roleSelect.disabled = false;
      }

      const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
      document.getElementById('modal-add-user-title').textContent = langData.title_add_employee || "Add Employee";
      document.getElementById('btn-save-user').textContent = langData.btn_create_employee || "Create Employee Account";
      
      modal.classList.remove('hidden');
    }
  });

  const btnModalUserClose = document.getElementById('btn-modal-user-close');
  if (btnModalUserClose) {
    btnModalUserClose.addEventListener('click', () => {
      document.getElementById('modal-add-user').classList.add('hidden');
    });
  }

  // Handle Add/Modify Employee Form Submit
  const formAddUser = document.getElementById('form-add-user');
  if (formAddUser) {
    formAddUser.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (currentSession.role !== "Boss") {
        showToast("Access Denied: Only Boss root administrators can create or modify employee accounts.", false);
        return;
      }

      const formId = document.getElementById('add-user-form-id').value;
      const name = document.getElementById('add-user-name').value.trim();
      const email = document.getElementById('add-user-email').value.trim().toLowerCase();
      const password = document.getElementById('add-user-password').value;
      const role = document.getElementById('add-user-role').value;
      const twoFactor = document.getElementById('add-user-2fa').value.trim();
      const mode = document.getElementById('add-user-mode').value;

      if (!name || !email || !password) {
        alert("Please fill in all required fields.");
        return;
      }

      // Check if email already exists for another user
      const emailExists = usersDatabase.some(u => u.email.toLowerCase() === email && u.id !== formId);
      if (emailExists) {
        alert("Error: An account with this email address already exists.");
        return;
      }

      if (formId) {
        // Edit existing user
        const user = usersDatabase.find(u => u.id === formId);
        if (user) {
          const oldEmail = user.email;
          user.name = name;
          user.email = email;
          user.password = password;
          user.role = role;
          user.twoFactor = twoFactor || "SMS Mobile verification";
          user.mode = mode || "OTP_PENDING_ADMIN";
          
          saveStateToLocalStorage();
          renderUsersTable();
          
          // Sync current session if modifying self
          if (oldEmail.toLowerCase() === currentSession.email.toLowerCase()) {
            currentSession.email = email;
            currentSession.role = role;
            syncSimulatorPanel();
          }

          document.getElementById('modal-add-user').classList.add('hidden');
          formAddUser.reset();
          showToast(`Employee account for ${name} updated successfully!`);
          
          logSystemAction("IDENTITY", `Modified Employee account: ${email} (${role})`, currentSession.email);
        }
      } else {
        // Create new user
        const newUser = {
          id: "W-" + Math.floor(100 + Math.random() * 900),
          name: name,
          email: email,
          role: role,
          password: password,
          twoFactor: twoFactor || "SMS Mobile verification",
          mode: mode || "OTP_PENDING_ADMIN",
          status: "Active",
          tenant: currentSession.tenant
        };

        usersDatabase.push(newUser);
        saveStateToLocalStorage();
        renderUsersTable();

        document.getElementById('modal-add-user').classList.add('hidden');
        formAddUser.reset();
        showToast(`Created Employee Account for ${name} successfully!`);

        logSystemAction("IDENTITY", `Created new Employee account: ${email} (${role})`, currentSession.email);
      }
    });
  }

  // Bind Reports Page Events
  const formReports = document.getElementById('form-reports');
  if (formReports) {
    formReports.addEventListener('submit', generateReportData);
  }

  const btnExportPdf = document.getElementById('btn-export-pdf');
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', exportReportToPDF);
  }

  const btnExportExcel = document.getElementById('btn-export-excel');
  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', exportReportToExcel);
  }

  // Edit Employee helper
  function openEditUserModal(userId) {
    const user = usersDatabase.find(u => u.id === userId);
    if (!user) return;

    const modal = document.getElementById('modal-add-user');
    const form = document.getElementById('form-add-user');
    
    if (modal && form) {
      form.reset();
      
      document.getElementById('add-user-form-id').value = user.id;
      document.getElementById('add-user-name').value = user.name;
      document.getElementById('add-user-email').value = user.email;
      document.getElementById('add-user-password').value = user.password;
      
      const roleSelect = document.getElementById('add-user-role');
      if (roleSelect) {
        // Remove existing Boss option if any
        const existingBossOpt = roleSelect.querySelector('option[value="Boss"]');
        if (existingBossOpt) {
          roleSelect.removeChild(existingBossOpt);
        }

        if (user.role === "Boss") {
          const bossOpt = document.createElement('option');
          bossOpt.value = "Boss";
          bossOpt.textContent = "Boss (Root Administrator)";
          roleSelect.appendChild(bossOpt);
          roleSelect.value = "Boss";
          roleSelect.disabled = true;
        } else {
          roleSelect.value = user.role;
          roleSelect.disabled = false;
        }
      }

      document.getElementById('add-user-2fa').value = user.twoFactor;
      document.getElementById('add-user-mode').value = user.mode;
      
      const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
      document.getElementById('modal-add-user-title').textContent = langData.title_modify_employee || "Modify Employee";
      document.getElementById('btn-save-user').textContent = langData.btn_save_changes || "Save Changes";
      
      modal.classList.remove('hidden');
    }
  }

  // Delete Employee helper
  function deleteUser(userId) {
    if (currentSession.role !== "Boss") {
      showToast("Access Denied: Only Boss root administrators can delete employees.", false);
      return;
    }
    
    const user = usersDatabase.find(u => u.id === userId);
    if (!user) return;
    
    // Prevent deleting self
    if (user.email.toLowerCase() === currentSession.email.toLowerCase()) {
      showToast("Access Denied: You cannot delete your own administrator account.", false);
      return;
    }
    
    if (confirm(`Are you sure you want to permanently delete employee: "${user.name}" (${user.role})?`)) {
      usersDatabase = usersDatabase.filter(u => u.id !== userId);
      saveStateToLocalStorage();
      renderUsersTable();
      
      logSystemAction("IDENTITY", `Deleted Employee account: ${user.email} (${user.role})`, currentSession.email);
      showToast(`Deleted employee account for ${user.name}.`);
    }
  }

  // User table actions delegation
  const usersTable = document.getElementById('users-table');
  if (usersTable) {
    usersTable.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-user');
      const deleteBtn = e.target.closest('.btn-delete-user');
      if (editBtn) {
        const userId = editBtn.getAttribute('data-id');
        openEditUserModal(userId);
      } else if (deleteBtn) {
        const userId = deleteBtn.getAttribute('data-id');
        deleteUser(userId);
      }
    });
  }

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
                <th>OTP Code</th>
                <th>Actions</th>
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
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge badge-amber font-bold" style="font-family: var(--font-mono); font-size: 12px; padding: 4px 8px;">${req.otp || "123456"}</span>
                <button class="btn btn-sm btn-outline btn-copy-otp" data-otp="${req.otp || '123456'}" title="Copy OTP">
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
            </td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-sm btn-primary btn-dash-approve" data-id="${req.id}">
                  <i class="fa-solid fa-check"></i> Approve
                </button>
                <button class="btn btn-sm btn-danger btn-dash-reject" data-id="${req.id}">
                  <i class="fa-solid fa-xmark"></i> Reject
                </button>
              </div>
            </td>
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

  // Bind actions for pending-logins in dashboard modal
  if (cardType === "pending-logins") {
    body.querySelectorAll('.btn-copy-otp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const otp = btn.getAttribute('data-otp');
        navigator.clipboard.writeText(otp).then(() => {
          showToast(`OTP ${otp} copied to clipboard!`);
        }).catch(err => {
          const el = document.createElement('textarea');
          el.value = otp;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          showToast(`OTP ${otp} copied to clipboard!`);
        });
      });
    });

    body.querySelectorAll('.btn-dash-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        approveLoginRequest(id);
        renderDashboardStats();
        openDashboardDetailsModal('pending-logins');
      });
    });

    body.querySelectorAll('.btn-dash-reject').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        rejectLoginRequest(id);
        renderDashboardStats();
        openDashboardDetailsModal('pending-logins');
      });
    });
  }
}

function openMovementDetailsModal(m) {
  const modal = document.getElementById('modal-movement-details');
  const body = document.getElementById('modal-movement-body');
  if (!modal || !body) return;

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const isInbound = m.type === "Inbound";
  
  // Localized labels
  const labelTimestamp = langData.header_datetime || "Timestamp";
  const labelTxType = langData.details_tx_type || "Transaction Type";
  const labelSku = langData.header_sku || "Material ID";
  const labelName = langData.header_description || "Material Name";
  const labelQtyMoved = langData.details_qty_moved || "Quantity Moved";
  const labelRoute = langData.header_route || "Origin / Destination";
  const labelEntity = isInbound ? (langData.details_supplier || "Supplier") : (langData.details_who_moving || "Who is Moving");
  const labelVehicle = langData.details_vehicle || "Vehicle / Container No.";
  const labelApproved = langData.header_supervisor || "Approved By";
  const labelLogged = langData.details_logged_by || "Logged By Session";
  const labelClose = langData.btn_close_details || "Close Details";

  const typeLabel = isInbound ? langData.move_inbound || "Inbound" : langData.move_outbound || "Outbound";
  const entityVal = isInbound ? (m.supplier || "N/A") : (m.movedBy || "N/A");
  const baseUnitLabel = getTranslatedUnit(m.baseUnit, langData);
  const containerUnitLabel = getTranslatedUnit(m.baseUnit === "Litres" ? "Drums" : (m.baseUnit === "kg" ? "Sacks" : "Boxes"), langData);

  body.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item">
        <span class="detail-label">${labelTimestamp}</span>
        <span class="detail-value">${formatLogTimestamp(m.timestamp)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelTxType}</span>
        <span class="detail-value font-bold ${isInbound ? 'text-match' : 'text-deficit'}" >${typeLabel}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelSku}</span>
        <span class="detail-value sku">${m.sku}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelName}</span>
        <span class="detail-value">${m.name}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelQtyMoved}</span>
        <span class="detail-value font-bold">${m.containers} ${containerUnitLabel} (${formatNumber(m.totalQty)} ${baseUnitLabel})</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelRoute}</span>
        <span class="detail-value">${m.originDest}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelEntity}</span>
        <span class="detail-value">${entityVal}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelVehicle}</span>
        <span class="detail-value">${m.vehicleNum || "N/A"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelApproved}</span>
        <span class="detail-value font-bold text-blue">${m.approvedBy || "N/A"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${labelLogged}</span>
        <span class="detail-value">${m.user}</span>
      </div>
    </div>
    <div style="text-align: right; margin-top: 20px;">
      <button class="btn btn-outline-secondary" id="btn-close-move-details">${labelClose}</button>
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

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const sku = skuSelect.value;
  const defaultUnit = langData.header_containers || "Containers";

  if (!sku) {
    qtyDiv.textContent = `0 ${defaultUnit}`;
    qtyDiv.setAttribute('data-qty', 0);
    qtyDiv.setAttribute('data-unit', defaultUnit);
    updateVerificationVariance();
    return;
  }

  const item = itemsDatabase.find(i => i.sku === sku);
  if (item) {
    const translatedUnit = getTranslatedUnit(item.containerUnit, langData);
    qtyDiv.textContent = `${item.containerCount} ${translatedUnit}`;
    qtyDiv.setAttribute('data-qty', item.containerCount);
    qtyDiv.setAttribute('data-unit', item.containerUnit);
  } else {
    qtyDiv.textContent = `0 ${defaultUnit}`;
    qtyDiv.setAttribute('data-qty', 0);
    qtyDiv.setAttribute('data-unit', defaultUnit);
  }

  updateVerificationVariance();
}

function updateVerificationVariance() {
  const varianceDiv = document.getElementById('verification-variance-display');
  const physicalInput = document.getElementById('verification-physical-count');
  const qtyDiv = document.getElementById('verification-system-qty');
  if (!varianceDiv || !physicalInput || !qtyDiv) return;

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const systemQty = parseInt(qtyDiv.getAttribute('data-qty') || "0");
  const unit = qtyDiv.getAttribute('data-unit') || "Containers";
  const physicalQtyText = physicalInput.value.trim();
  const translatedUnit = getTranslatedUnit(unit, langData);

  if (physicalQtyText === "") {
    varianceDiv.className = "alert-box alert-box-info";
    varianceDiv.style.backgroundColor = "";
    varianceDiv.style.color = "";
    varianceDiv.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${langData.variance_select_material || "Select a material and enter physical count to calculate variance."}</span>`;
    return;
  }

  const physicalQty = parseInt(physicalQtyText);
  const variance = physicalQty - systemQty;

  if (variance === 0) {
    varianceDiv.className = "alert-box alert-box-info text-match sec-green";
    varianceDiv.style.backgroundColor = "var(--color-green-light)";
    varianceDiv.style.color = "var(--color-green-dark)";
    varianceDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${langData.variance_match || "Verification matches exactly: no discrepancies."}</span>`;
  } else if (variance > 0) {
    varianceDiv.className = "alert-box alert-box-info text-surplus sec-amber";
    varianceDiv.style.backgroundColor = "var(--color-amber-light)";
    varianceDiv.style.color = "var(--color-amber-dark)";
    let msg = langData.variance_surplus || "Surplus detected: +${variance} ${translatedUnit} over system record.";
    msg = msg.replace('{variance}', variance).replace('{unit}', translatedUnit);
    varianceDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
  } else {
    varianceDiv.className = "alert-box alert-box-info text-deficit";
    varianceDiv.style.backgroundColor = "var(--color-danger-light)";
    varianceDiv.style.color = "var(--color-danger)";
    let msg = langData.variance_deficit || "Deficit detected: ${variance} ${translatedUnit} shortage.";
    msg = msg.replace('{variance}', variance).replace('{unit}', translatedUnit);
    varianceDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${msg}</span>`;
  }
}

function renderVerificationLogsTable() {
  const tbody = document.querySelector('#verification-table tbody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
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
      statusBadge = `<span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> ${langData.status_verified || 'Verified'}</span>`;
    } else if (log.status === "Adjusted") {
      statusBadge = `<span class="badge badge-outline-primary"><i class="fa-solid fa-clock-rotate-left"></i> ${langData.status_adjusted || 'Adjusted'}</span>`;
    } else {
      statusBadge = `<span class="badge badge-amber"><i class="fa-solid fa-triangle-exclamation"></i> ${langData.status_discrepancy || 'Discrepancy'}</span>`;
    }

    let actionBtn = "";
    if (log.status === "Pending Adjustment") {
      if (isBoss) {
        actionBtn = `
          <button class="btn btn-xs btn-primary btn-adjust-stock" data-id="${log.id}">
            <i class="fa-solid fa-sliders"></i> ${langData.btn_adjust_stock || 'Adjust Stock'}
          </button>
        `;
      } else {
        actionBtn = `
          <button class="btn btn-xs btn-outline-secondary" disabled title="${langData.title_boss_approval_req || 'Boss approval required'}">
            ${langData.btn_pending_boss || 'Pending Boss'}
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

// ============================================================================
// MULTILINGUAL (I18N) TRANSLATION ENGINE & TRANSLATIONS MAP
// ============================================================================

let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const TRANSLATIONS = {
  en: {
    // Menu items
    unit_select_base: "Base Units (As Saved)",
    unit_select_containers: "Containers (Drums, Sacks, Boxes)",
    unit_select_kg: "Kilograms (kg)",
    unit_select_tonnes: "Metric Tonnes (MT)",
    unit_select_sacks: "Sacks",
    unit_select_drums: "Drums",
    unit_select_units: "Units",
    menu_dashboard: "Dashboard",
    menu_approvals: "Login Approvals",
    menu_items: "Raw Materials Ledger",
    menu_warehouses: "Warehouse & Locations",
    menu_movements: "Procurement & Movements",
    menu_verification: "Physical Verification",
    menu_rbac: "Permissions Matrix",
    menu_users: "User Directory",
    menu_audit: "Audit Log Trail",
    
    // Top Nav / Meta
    session_expires_prefix: "Session Expires in: ",
    active_factory_node: "ACTIVE FACTORY NODE",
    user_display_boss: "Boss Administrator",
    logout: "Logout",
    ledger_subtitle: "Note: Measuring parameters, packaging unit specifications, and valuations are managed here.",
    
    // Headers
    header_datetime: "Date & Time",
    header_sku: "Material ID",
    header_description: "Material Name",
    header_category: "Type",
    header_location: "Warehouse",
    header_unit_type: "Container Type",
    header_capacity: "Container Capacity",
    header_stock: "Containers Stored",
    header_total_qty: "Total Stock",
    header_reorder: "Alert Level",
    header_price: "Unit Price",
    header_actions: "Options",
    header_move_type: "Type",
    header_containers: "Containers",
    header_route: "Route",
    header_user: "Logged By",
    header_sys_stock: "System Stock",
    header_phys_stock: "Physical Count",
    header_variance: "Variance",
    header_auditor: "Verified By",
    header_supervisor: "Approved By",
    header_status: "Status",
    
    // Screen Titles
    title_dashboard: "System Dashboard",
    title_approvals: "Boss Authorization Queue",
    title_items: "Raw Materials Master Ledger",
    title_warehouses: "Warehouse Storage Locations",
    title_movements: "Procurement & Movements Manager",
    title_verification: "Physical Verification & Stocktake",
    title_rbac: "Role-Based Access Control Security Matrix",
    title_users: "Staff Identity Directory",
    title_audit: "Immutable Cryptographic Audit Trail",

    // Dashboard Cards
    dash_card_items_lbl: "Raw Material Items",
    dash_card_low_lbl: "Low Stock Alerts",
    dash_card_pending_lbl: "Pending Logins",
    dash_card_moves_lbl: "Movements Logged (24h)",
    dash_card_items_meta: "Active monitoring",
    dash_card_low_meta: "Needs urgent order",
    dash_card_pending_meta: "Awaiting Admin Action",
    dash_card_moves_meta: "Procurement & Dispatches",
    
    // Dashboard general
    dash_breakdown_title: "Raw Materials stock breakdown",
    dash_breakdown_unit: "Metric Tonnage",
    dash_compliance_title: "Compliance Status",
    dash_compliance_secure: "100% Secure",
    dash_compliance_warning: "Low Stock Warning",
    dash_compliance_nodes: "Storage Nodes Synced",
    dash_compliance_audit: "Inbound/Outbound Audit Enabled",
    dash_compliance_rbac: "RBAC Enforcement Active",
    dash_recent_audit_title: "Recent Security Actions (Audit Trail Excerpt)",
    dash_recent_audit_btn: "View Full Log",
    
    // Categories
    cat_liquid: "Liquid",
    cat_dry: "Dry",
    cat_packaging: "Packaging",
    
    // Status text
    status_verified: "Verified",
    status_adjusted: "Adjusted",
    status_discrepancy: "Discrepancy",
    status_active: "Active",
    status_pending: "Pending Adjustment",
    status_in_stock: "In Stock",
    status_low_stock: "Low Stock",
    status_out_of_stock: "Out of Stock",
    
    // Movements Types
    move_inbound: "Inbound",
    move_outbound: "Outbound",

    // Units
    unit_drums: "Drums",
    unit_sacks: "Sacks",
    unit_boxes: "Boxes",
    unit_units: "units",
    unit_litres: "Litres",
    unit_kg: "kg",
    unit_l: "L",

    // Buttons
    btn_edit: "Edit",
    btn_delete: "Delete",
    btn_details: "Details",
    btn_adjust_stock: "Adjust Stock",
    btn_pending_boss: "Pending Boss",
    btn_add_employee: "Add Employee",
    btn_modify_employee: "Modify Employee",
    title_add_employee: "Add Employee",
    title_modify_employee: "Modify Employee",
    btn_create_employee: "Create Employee Account",
    btn_save_changes: "Save Changes",
    title_boss_approval_req: "Boss approval required",

    // Modal Dash Details
    modal_dash_title_prefix: "Storage Locations: ",
    label_sku: "SKU",
    label_category: "Category",
    label_total_system_stock: "Total System Stock",
    title_inventory_allocation: "Inventory Allocation by Location",
    header_storage_location: "Storage Location",
    header_containers_stored: "Containers Stored",
    header_net_volume_weight: "Net Volume/Weight",

    // Verification Form & Screen
    title_record_stocktake: "Record Physical Stocktake",
    lbl_storage_warehouse: "Storage Warehouse",
    lbl_select_raw_material: "Select Raw Material",
    lbl_system_recorded_stock: "System Recorded Stock",
    lbl_physical_count: "Physical Count (Containers)",
    lbl_calculated_discrepancy: "Calculated Discrepancy Variance",
    lbl_verified_by: "Verified By (Auditor)",
    lbl_approved_by: "Approved By (Supervisor)",
    btn_save_stocktake: "Save Stocktake Verification",
    title_physical_logs: "Physical Stocktake Logs",
    subtitle_physical_logs: "Chronological record of stock audits, variance checks, and ledger reconciliation adjustments.",

    // Variance display
    variance_select_material: "Select a material and enter physical count to calculate variance.",
    variance_match: "Verification matches exactly: no discrepancies.",
    variance_surplus: "Surplus detected: +{variance} {unit} over system record.",
    variance_deficit: "Deficit detected: {variance} {unit} shortage.",

    menu_reports: "Reports & Analytics",
    title_reports: "Reports & Analytics",
    reports_subtitle: "Generate, filter, preview and export custom compliance and stock reports.",
    lbl_report_type: "Report Type",
    lbl_report_tenant: "Factory Tenant",
    lbl_report_warehouse: "Storage Location (Warehouse)",
    lbl_report_category: "Category (Material Type)",
    lbl_report_item: "Specific Material",
    lbl_report_start_date: "Start Date",
    lbl_report_end_date: "End Date",
    btn_generate_report: "Generate Report",
    btn_export_pdf: "Export PDF",
    btn_export_excel: "Export Excel",
    rep_stat_records: "Records Filtered",
    rep_stat_total_qty: "Total Containers",
    rep_stat_qty_moved: "Total Containers Moved",
    rep_stat_audited: "Total Audited Discrepancies",
    rep_stat_valuation: "Report Valuation",
    report_type_stock: "Stock Balance Summary",
    report_type_movements: "Procurement & Movements Log",
    report_type_activity: "Chronological Inventory Activity Ledger",
    report_type_discrepancy: "Stocktake Discrepancy Log",
    report_type_valuation: "Valuation & Financial Ledger",

    // Auth screens
    portal_title: "Aethel",
    portal_badge: "Secure Portal",
    portal_login: "Portal Login",
    portal_subtitle: "Raw Materials Monitoring & Compliance Network",
    lbl_factory_tenant: "Select Factory Tenant",
    lbl_employee_email: "Employee Email",
    lbl_system_password: "System Password",
    btn_verify_credentials: "Verify Credentials",
    link_create_account: "Create a Company or Employee Account",
    
    btn_back_login: "Back to Login",
    btn_back: "Back",
    title_setup_account: "Setup Account",
    subtitle_setup_account: "Create a new company node or join an existing company",
    lbl_registration_type: "Registration Type",
    btn_reg_company: "New Company (Boss)",
    btn_reg_employee: "Join Company (Employee)",
    lbl_company_name: "Company / Factory Name",
    lbl_company_id: "Company Identifier (Unique ID)",
    lbl_select_company: "Select Company to Join",
    lbl_select_role: "Select Desired Role",
    lbl_full_name: "Full Name",
    lbl_email_address: "Email Address",
    lbl_create_password: "Create Password",
    btn_complete_registration: "Complete Registration",
    
    title_two_factor: "Two-Factor OTP",
    lbl_enter_otp: "Enter 6-Digit OTP",
    btn_request_approval: "Request Session Approval",
    
    title_awaiting_approval: "Awaiting Boss Approval",
    subtitle_awaiting_approval: "Your credentials and 2FA are validated. An administrator must authorize your session from their Boss Approval Dashboard.",
    lbl_requested_user: "Requested User:",
    lbl_tenant_node: "Tenant Node:",
    lbl_security_protocol: "Security Protocol:",
    btn_cancel_request: "Cancel Authorization Request",
    
    demo_action_required: "Demo Action Required:",
    demo_action_desc: "Toggle the Simulator Panel below and choose Boss (Admin), then navigate to Login Approvals to approve this login session.",

    // Dynamic OTP messages
    otp_subtitle_employee: "A secure 6-digit OTP has been sent to your Company Boss. Please contact your Boss to get the verification code.",
    otp_hint_employee: "Hint: Ask your Boss for the active OTP shown on their Approvals Queue dashboard.",
    otp_subtitle_boss: "A secure 2FA token has been dispatched to your registered administrator device.",
    otp_hint_boss: "Hint: Enter 123456 to proceed.",

    // Placeholders
    placeholder_search_items: "Search by Material ID or Name...",
    placeholder_search_movements: "Search by Material ID, Name or Route...",
    placeholder_search_audit: "Search by action, user or module...",
    placeholder_reg_name: "e.g. Sarah Connor",
    placeholder_reg_email: "e.g. sarah@apex.com",
    placeholder_reg_pass: "••••••••",
    placeholder_login_email: "name@factory.com",
    placeholder_login_pass: "••••••••"
  },
  fr: {
    // Menu items
    unit_select_base: "Unités de Base (Sauvegardées)",
    unit_select_containers: "Conteneurs (Fûts, Sacs, Boîtes)",
    unit_select_kg: "Kilogrammes (kg)",
    unit_select_tonnes: "Tonnes Métriques (MT)",
    unit_select_sacks: "Sacs",
    unit_select_drums: "Fûts",
    unit_select_units: "Unités",
    menu_dashboard: "Tableau de Bord",
    menu_approvals: "Validations de Connexion",
    menu_items: "Registre des Matières",
    menu_warehouses: "Entrepôts & Emplacements",
    menu_movements: "Approvisionnement & Flux",
    menu_verification: "Vérification Physique",
    menu_rbac: "Matrice de Droits (RBAC)",
    menu_users: "Annuaire du Personnel",
    menu_audit: "Piste d'Audit Sécurisée",
    
    // Top Nav / Meta
    session_expires_prefix: "Expiration de session dans : ",
    active_factory_node: "NOEUD D'USINE ACTIF",
    user_display_boss: "Administrateur Principal",
    logout: "Se déconnecter",
    ledger_subtitle: "Note: Les paramètres de mesure, les spécifications des conteneurs et les évaluations sont gérés ici.",
    
    // Headers
    header_datetime: "Date & Heure",
    header_sku: "ID de Matière",
    header_description: "Nom de Matière",
    header_category: "Type",
    header_location: "Entrepôt",
    header_unit_type: "Type de Conteneur",
    header_capacity: "Capacité Conteneur",
    header_stock: "Conteneurs Stockés",
    header_total_qty: "Stock Total",
    header_reorder: "Niveau d'Alerte",
    header_price: "Prix Unitaire",
    header_actions: "Options",
    header_move_type: "Type",
    header_containers: "Conteneurs",
    header_route: "Trajet",
    header_user: "Enregistré Par",
    header_sys_stock: "Stock Système",
    header_phys_stock: "Inventaire Physique",
    header_variance: "Écart",
    header_auditor: "Vérifié Par",
    header_supervisor: "Approuvé Par",
    header_status: "Statut",
    
    // Screen Titles
    title_dashboard: "Tableau de Bord Système",
    title_approvals: "File de Validation des Connexions",
    title_items: "Registre Principal des Matières Premières",
    title_warehouses: "Emplacements de Stockage des Entrepôts",
    title_movements: "Gestionnaire des Mouvements & Flux",
    title_verification: "Vérification Physique & Inventaire",
    title_rbac: "Matrice Sécurité de Contrôle d'Accès (RBAC)",
    title_users: "Annuaire d'Identité du Personnel",
    title_audit: "Piste d'Audit Cryptographique Immuable",

    // Dashboard Cards
    dash_card_items_lbl: "Matières Suivies",
    dash_card_low_lbl: "Alertes Stock Bas",
    dash_card_pending_lbl: "Connexions en Attente",
    dash_card_moves_lbl: "Flux Enregistrés (24h)",
    dash_card_items_meta: "Surveillance active",
    dash_card_low_meta: "Commande urgente requise",
    dash_card_pending_meta: "Action admin requise",
    dash_card_moves_meta: "Réceptions & Expéditions",
    
    // Dashboard general
    dash_breakdown_title: "Répartition des stocks de matières",
    dash_breakdown_unit: "Tonnage Métrique",
    dash_compliance_title: "Statut de Conformité",
    dash_compliance_secure: "100% Sécurisé",
    dash_compliance_warning: "Alerte de Stock Bas",
    dash_compliance_nodes: "Entrepôts Synchronisés",
    dash_compliance_audit: "Audit des Flux Activé",
    dash_compliance_rbac: "Contrôle d'Accès Actif",
    dash_recent_audit_title: "Actions de Sécurité Récentes (Extrait d'Audit)",
    dash_recent_audit_btn: "Voir la Piste d'Audit",
    
    // Categories
    cat_liquid: "Liquide",
    cat_dry: "Sec",
    cat_packaging: "Emballage",
    
    // Status text
    status_verified: "Vérifié",
    status_adjusted: "Ajusté",
    status_discrepancy: "Écart",
    status_active: "Actif",
    status_pending: "Ajustement en Attente",
    status_in_stock: "En Stock",
    status_low_stock: "Stock Faible",
    status_out_of_stock: "Rupture de Stock",
    
    // Movements Types
    move_inbound: "Entrant",
    move_outbound: "Sortant",

    // Units
    unit_drums: "Fûts",
    unit_sacks: "Sacs",
    unit_boxes: "Boîtes",
    unit_units: "unités",
    unit_litres: "Litres",
    unit_kg: "kg",
    unit_l: "L",

    // Buttons
    btn_edit: "Modifier",
    btn_delete: "Supprimer",
    btn_details: "Détails",
    btn_adjust_stock: "Ajuster Stock",
    btn_pending_boss: "En attente du Boss",
    btn_add_employee: "Ajouter un Employé",
    btn_modify_employee: "Modifier l'Employé",
    title_add_employee: "Ajouter un Employé",
    title_modify_employee: "Modifier l'Employé",
    btn_create_employee: "Créer un Compte Employé",
    btn_save_changes: "Enregistrer les Modifications",
    title_boss_approval_req: "Approbation du Boss requise",

    // Modal Dash Details
    modal_dash_title_prefix: "Emplacements de Stockage : ",
    label_sku: "SKU",
    label_category: "Catégorie",
    label_total_system_stock: "Stock Système Total",
    title_inventory_allocation: "Répartition des Stocks par Emplacement",
    header_storage_location: "Emplacement de Stockage",
    header_containers_stored: "Conteneurs Stockés",
    header_net_volume_weight: "Volume/Poids Net",

    // Verification Form & Screen
    title_record_stocktake: "Enregistrer un Inventaire Physique",
    lbl_storage_warehouse: "Entrepôt de Stockage",
    lbl_select_raw_material: "Sélectionner la Matière Première",
    lbl_system_recorded_stock: "Stock Enregistré par le Système",
    lbl_physical_count: "Nombre Physique (Conteneurs)",
    lbl_calculated_discrepancy: "Écart de Discrepance Calculé",
    lbl_verified_by: "Vérifié Par (Auditeur)",
    lbl_approved_by: "Approuvé Par (Superviseur)",
    btn_save_stocktake: "Enregistrer la Vérification du Stock",
    title_physical_logs: "Logs de Vérification Physique",
    subtitle_physical_logs: "Enregistrement chronologique des audits de stock, des contrôles d'écart et des ajustements de rapprochement.",

    // Variance display
    variance_select_material: "Sélectionnez un matériel et entrez le compte physique pour calculer l'écart.",
    variance_match: "La vérification correspond exactement : aucun écart.",
    variance_surplus: "Surplus détecté : +{variance} {unit} par rapport au système.",
    variance_deficit: "Déficit détecté : {variance} {unit} de pénurie.",

    menu_reports: "Rapports & Analyses",
    title_reports: "Rapports & Analyses",
    reports_subtitle: "Générez, filtrez, prévisualisez et exportez des rapports de stock et de conformité personnalisés.",
    lbl_report_type: "Type de Rapport",
    lbl_report_tenant: "Usine Partenaire",
    lbl_report_warehouse: "Lieu de Stockage (Entrepôt)",
    lbl_report_category: "Catégorie (Type de Matériel)",
    lbl_report_item: "Matière Spécifique",
    lbl_report_start_date: "Date de Début",
    lbl_report_end_date: "Date de Fin",
    btn_generate_report: "Générer le Rapport",
    btn_export_pdf: "Exporter en PDF",
    btn_export_excel: "Exporter en Excel",
    rep_stat_records: "Enregistrements Filtrés",
    rep_stat_total_qty: "Total Conteneurs",
    rep_stat_qty_moved: "Total Déplacé",
    rep_stat_audited: "Total Écarts Vérifiés",
    rep_stat_valuation: "Valorisation du Rapport",
    report_type_stock: "Résumé des Soldes de Stock",
    report_type_movements: "Journal des Approvisionnements & Flux",
    report_type_activity: "Registre Chronologique d'Activité de Stock",
    report_type_discrepancy: "Journal des Écarts d'Inventaire",
    report_type_valuation: "Grand Livre de Valorisation Financière",

    // Auth screens
    portal_title: "Aethel",
    portal_badge: "Portail Sécurisé",
    portal_login: "Connexion Portail",
    portal_subtitle: "Réseau de Surveillance et de Conformité des Matières Premières",
    lbl_factory_tenant: "Sélectionner l'Usine",
    lbl_employee_email: "Email de l'Employé",
    lbl_system_password: "Mot de passe système",
    btn_verify_credentials: "Vérifier les Identifiants",
    link_create_account: "Créer un compte entreprise ou employé",
    
    btn_back_login: "Retour à la Connexion",
    btn_back: "Retour",
    title_setup_account: "Configurer le compte",
    subtitle_setup_account: "Créer un nouveau nœud d'entreprise ou rejoindre une entreprise",
    lbl_registration_type: "Type d'enregistrement",
    btn_reg_company: "Nouvelle Entreprise (Boss)",
    btn_reg_employee: "Rejoindre l'Entreprise (Employé)",
    lbl_company_name: "Nom de l'Entreprise / Usine",
    lbl_company_id: "Identifiant Unique de l'Entreprise",
    lbl_select_company: "Sélectionner l'Entreprise à rejoindre",
    lbl_select_role: "Sélectionner le Rôle",
    lbl_full_name: "Nom complet",
    lbl_email_address: "Adresse Email",
    lbl_create_password: "Créer un mot de passe",
    btn_complete_registration: "Terminer l'Enregistrement",
    
    title_two_factor: "Code OTP de Double Facteur",
    lbl_enter_otp: "Entrez le Code OTP à 6 Chiffres",
    btn_request_approval: "Demander l'Approbation de Session",
    
    title_awaiting_approval: "En Attente de Validation du Boss",
    subtitle_awaiting_approval: "Vos identifiants et 2FA sont validés. Un administrateur doit autoriser votre session depuis son tableau de bord de validation.",
    lbl_requested_user: "Utilisateur demandé :",
    lbl_tenant_node: "Nœud d'Usine :",
    lbl_security_protocol: "Protocole de Sécurité :",
    btn_cancel_request: "Annuler la Demande d'Autorisation",
    
    demo_action_required: "Action de Démo Requise :",
    demo_action_desc: "Ouvrez le panneau du simulateur ci-dessous, choisissez Boss (Admin), puis allez dans validations de connexion pour approuver cette session.",

    // Dynamic OTP messages
    otp_subtitle_employee: "Un code OTP sécurisé à 6 chiffres a été envoyé à votre Boss. Veuillez contacter votre Boss pour obtenir le code.",
    otp_hint_employee: "Astuce : Demandez à votre Boss le code OTP affiché sur sa file de validation.",
    otp_subtitle_boss: "Un jeton 2FA sécurisé a été envoyé à votre appareil d'administrateur enregistré.",
    otp_hint_boss: "Astuce : Entrez 123456 pour continuer.",

    // Placeholders
    placeholder_search_items: "Rechercher par ID ou nom...",
    placeholder_search_movements: "Rechercher par ID, nom ou trajet...",
    placeholder_search_audit: "Rechercher par action, utilisateur ou module...",
    placeholder_reg_name: "ex. Sarah Connor",
    placeholder_reg_email: "ex. sarah@apex.com",
    placeholder_reg_pass: "••••••••",
    placeholder_login_email: "nom@usine.com",
    placeholder_login_pass: "••••••••"
  },
  es: {
    // Menu items
    unit_select_base: "Unidades de Base (Guardadas)",
    unit_select_containers: "Contenedores (Tambores, Sacos, Cajas)",
    unit_select_kg: "Kilogramos (kg)",
    unit_select_tonnes: "Toneladas Métricas (MT)",
    unit_select_sacks: "Sacos",
    unit_select_drums: "Tambores",
    unit_select_units: "Unidades",
    menu_dashboard: "Panel de Control",
    menu_approvals: "Aprobaciones de Acceso",
    menu_items: "Registro de Materiales",
    menu_warehouses: "Almacenes y Ubicaciones",
    menu_movements: "Abastecimiento y Flujos",
    menu_verification: "Verificación Física",
    menu_rbac: "Matriz de Permisos (RBAC)",
    menu_users: "Directorio de Empleados",
    menu_audit: "Registro de Auditoría",
    
    // Top Nav / Meta
    session_expires_prefix: "Sesión expira en: ",
    active_factory_node: "NODO DE FÁBRICA ACTIVO",
    user_display_boss: "Administrador Principal",
    logout: "Cerrar sesión",
    ledger_subtitle: "Nota: Los parámetros de medición, las especificaciones de empaque y las valoraciones se manejan aquí.",
    
    // Headers
    header_datetime: "Fecha y Hora",
    header_sku: "ID de Material",
    header_description: "Nombre de Material",
    header_category: "Tipo",
    header_location: "Almacén",
    header_unit_type: "Tipo de Contenedor",
    header_capacity: "Capacidad Contenedor",
    header_stock: "Contenedores Almacenados",
    header_total_qty: "Stock Total",
    header_reorder: "Nivel de Alerta",
    header_price: "Precio Unitario",
    header_actions: "Opciones",
    header_move_type: "Tipo",
    header_containers: "Contenedores",
    header_route: "Ruta",
    header_user: "Registrado Por",
    header_sys_stock: "Stock Sistema",
    header_phys_stock: "Recuento Físico",
    header_variance: "Discrepancia",
    header_auditor: "Verificado Por",
    header_supervisor: "Aprobado Por",
    header_status: "Estado",
    
    // Screen Titles
    title_dashboard: "Panel de Control del Sistema",
    title_approvals: "Cola de Autorización de Acceso",
    title_items: "Registro Maestro de Materias Primas",
    title_warehouses: "Ubicaciones de Almacenamiento",
    title_movements: "Gestión de Abastecimiento y Mapeo",
    title_verification: "Verificación Física e Inventario",
    title_rbac: "Matriz de Control de Acceso (RBAC)",
    title_users: "Directorio de Identidad de Empleados",
    title_audit: "Registro de Auditoría Criptográfica Inmutable",

    // Dashboard Cards
    dash_card_items_lbl: "Materias Primas",
    dash_card_low_lbl: "Alertas Stock Bajo",
    dash_card_pending_lbl: "Accesos Pendientes",
    dash_card_moves_lbl: "Flujos Registrados (24h)",
    dash_card_items_meta: "Monitoreo activo",
    dash_card_low_meta: "Requiere pedido urgente",
    dash_card_pending_meta: "Requiere acción del administrador",
    dash_card_moves_meta: "Entradas y Salidas",
    
    // Dashboard general
    dash_breakdown_title: "Desglose de stock de materiales",
    dash_breakdown_unit: "Tonelaje Métrico",
    dash_compliance_title: "Estado de Cumplimiento",
    dash_compliance_secure: "100% Seguro",
    dash_compliance_warning: "Advertencia Stock Bajo",
    dash_compliance_nodes: "Nodos de Almacenamiento Sincronizados",
    dash_compliance_audit: "Auditoría de Flujos Habilitada",
    dash_compliance_rbac: "Cumplimiento de RBAC Activo",
    dash_recent_audit_title: "Acciones de Seguridad Recientes (Auditoría)",
    dash_recent_audit_btn: "Ver Registro Completo",
    
    // Categories
    cat_liquid: "Líquido",
    cat_dry: "Seco",
    cat_packaging: "Embalaje",
    
    // Status text
    status_verified: "Verificado",
    status_adjusted: "Ajustado",
    status_discrepancy: "Discrepancia",
    status_active: "Activo",
    status_pending: "Ajuste Pendiente",
    status_in_stock: "En Stock",
    status_low_stock: "Stock Bajo",
    status_out_of_stock: "Sin Stock",
    
    // Movements Types
    move_inbound: "Entrada",
    move_outbound: "Salida",

    // Units
    unit_drums: "Tambores",
    unit_sacks: "Sacos",
    unit_boxes: "Cajas",
    unit_units: "unidades",
    unit_litres: "Litros",
    unit_kg: "kg",
    unit_l: "L",

    // Buttons
    btn_edit: "Editar",
    btn_delete: "Eliminar",
    btn_details: "Detalles",
    btn_adjust_stock: "Ajuster Stock",
    btn_pending_boss: "Pendiente de Boss",
    btn_add_employee: "Agregar Empleado",
    btn_modify_employee: "Modificar Empleado",
    title_add_employee: "Agregar Empleado",
    title_modify_employee: "Modificar Empleado",
    btn_create_employee: "Crear Cuenta de Empleado",
    btn_save_changes: "Guardar Cambios",
    title_boss_approval_req: "Aprobación del Boss requerida",

    // Modal Dash Details
    modal_dash_title_prefix: "Ubicaciones de Almacenamiento: ",
    label_sku: "SKU",
    label_category: "Categoría",
    label_total_system_stock: "Stock Total del Sistema",
    title_inventory_allocation: "Asignación de Inventario por Ubicación",
    header_storage_location: "Ubicación de Almacenamiento",
    header_containers_stored: "Contenedores Almacenados",
    header_net_volume_weight: "Volumen/Peso Neto",

    // Verification Form & Screen
    title_record_stocktake: "Registrar Inventario Físico",
    lbl_storage_warehouse: "Almacén de Almacenamiento",
    lbl_select_raw_material: "Seleccionar Materia Prima",
    lbl_system_recorded_stock: "Stock Registrado en Sistema",
    lbl_physical_count: "Recuento Físico (Contenedores)",
    lbl_calculated_discrepancy: "Variación de Discrepancia Calculada",
    lbl_verified_by: "Verificado Por (Auditor)",
    lbl_approved_by: "Aprobado Por (Supervisor)",
    btn_save_stocktake: "Guardar Verificación de Stock",
    title_physical_logs: "Registros de Inventario Físico",
    subtitle_physical_logs: "Registro cronológico de auditorías de stock, comprobaciones de variación y ajustes de conciliación.",

    // Variance display
    variance_select_material: "Seleccione un material e ingrese el recuento físico para calcular la variación.",
    variance_match: "El recuento coincide exactamente: sin discrepancias.",
    variance_surplus: "Superávit detectado: +{variance} {unit} sobre el registro del sistema.",
    variance_deficit: "Déficit detectado: {variance} {unit} de escasez.",

    menu_reports: "Reportes y Análisis",
    title_reports: "Reportes y Análisis",
    reports_subtitle: "Genere, filtre, previsualice y exporte informes personalizados de cumplimiento y stock.",
    lbl_report_type: "Tipo de Reporte",
    lbl_report_tenant: "Inquilino de Fábrica",
    lbl_report_warehouse: "Lugar de Almacenamiento (Almacén)",
    lbl_report_category: "Categoría (Tipo de Material)",
    lbl_report_item: "Material Específico",
    lbl_report_start_date: "Fecha de Inicio",
    lbl_report_end_date: "Fecha Fin",
    btn_generate_report: "Generar Reporte",
    btn_export_pdf: "Exportar PDF",
    btn_export_excel: "Exportar Excel",
    rep_stat_records: "Registros Filtrados",
    rep_stat_total_qty: "Total Contenedores",
    rep_stat_qty_moved: "Total Contenedores Movidos",
    rep_stat_audited: "Total Discrepancias Auditadas",
    rep_stat_valuation: "Valoración del Informe",
    report_type_stock: "Resumen de Saldos de Stock",
    report_type_movements: "Registro de Adquisiciones y Movimientos",
    report_type_activity: "Libro Mayor de Actividades Cronológicas",
    report_type_discrepancy: "Registro de Discrepancias de Stocktake",
    report_type_valuation: "Libro Mayor Financiero y de Valoración",

    // Auth screens
    portal_title: "Aethel",
    portal_badge: "Portal Seguro",
    portal_login: "Iniciar Sesión",
    portal_subtitle: "Red de Cumplimiento y Monitoreo de Materias Primas",
    lbl_factory_tenant: "Seleccionar Nodo de Fábrica",
    lbl_employee_email: "Correo del Empleado",
    lbl_system_password: "Contraseña del Sistema",
    btn_verify_credentials: "Verificar Credenciales",
    link_create_account: "Crear una Cuenta de Empresa o Empleado",
    
    btn_back_login: "Volver al Inicio de Sesión",
    btn_back: "Atrás",
    title_setup_account: "Configurar Cuenta",
    subtitle_setup_account: "Crear un nuevo nodo de empresa o unirse a una empresa",
    lbl_registration_type: "Tipo de Registro",
    btn_reg_company: "Nueva Empresa (Boss)",
    btn_reg_employee: "Unirse a Empresa (Empleado)",
    lbl_company_name: "Nombre de la Empresa / Fábrica",
    lbl_company_id: "Identificador de Empresa (ID Único)",
    lbl_select_company: "Seleccionar Empresa para Unirse",
    lbl_select_role: "Seleccionar Rol Deseado",
    lbl_full_name: "Nombre Completo",
    lbl_email_address: "Dirección de Correo",
    lbl_create_password: "Crear Contraseña",
    btn_complete_registration: "Completar Registro",
    
    title_two_factor: "OTP de Dos Factores",
    lbl_enter_otp: "Ingrese el OTP de 6 Dígitos",
    btn_request_approval: "Solicitar Aprobación de Sesión",
    
    title_awaiting_approval: "Esperando Aprobación de Boss",
    subtitle_awaiting_approval: "Sus credenciales y 2FA han sido validados. Un administrador debe autorizar su sesión desde su Panel de Aprobación.",
    lbl_requested_user: "Usuario Solicitado:",
    lbl_tenant_node: "Nodo de Fábrica:",
    lbl_security_protocol: "Protocolo de Seguridad:",
    btn_cancel_request: "Cancelar Solicitud de Autorización",
    
    demo_action_required: "Acción de Demostración Requerida:",
    demo_action_desc: "Abra el Panel del Simulador abajo, elija Boss (Admin), luego vaya a Aprobaciones de Acceso para aprobar esta sesión.",

    // Dynamic OTP messages
    otp_subtitle_employee: "Se ha enviado un OTP seguro de 6 dígitos a su Company Boss. Póngase en contacto con su Boss para obtener el código.",
    otp_hint_employee: "Pista: Pídale a su Boss el OTP activo que se muestra en su cola de aprobaciones.",
    otp_subtitle_boss: "Se ha enviado un token de 2FA seguro a su dispositivo administrador registrado.",
    otp_hint_boss: "Pista: Ingrese 123456 para continuar.",

    // Placeholders
    placeholder_search_items: "Buscar por ID de material o nombre...",
    placeholder_search_movements: "Buscar por ID de material, nombre o ruta...",
    placeholder_search_audit: "Buscar por acción, usuario o del módulo...",
    placeholder_reg_name: "ej. Sarah Connor",
    placeholder_reg_email: "ej. sarah@apex.com",
    placeholder_reg_pass: "••••••••",
    placeholder_login_email: "nombre@fabrica.com",
    placeholder_login_pass: "••••••••"
  },
  hi: {
    // Menu items
    unit_select_base: "मूल इकाइयाँ (सहेजी गई)",
    unit_select_containers: "कंटेनर (ड्रम, बोरे, बक्से)",
    unit_select_kg: "किलोग्राम (kg)",
    unit_select_tonnes: "मीट्रिक टन (MT)",
    unit_select_sacks: "बोरे",
    unit_select_drums: "ड्रम",
    unit_select_units: "इकाइयाँ",
    menu_dashboard: "डैशबोर्ड",
    menu_approvals: "लॉगिन अनुमोदन",
    menu_items: "कच्ची सामग्री रजिस्टर",
    menu_warehouses: "गोदाम और स्थान",
    menu_movements: "आपूर्ति और संचलन",
    menu_verification: "भौतिक सत्यापन",
    menu_rbac: "अनुमति मैट्रिक्स",
    menu_users: "कर्मचारी निर्देशिका",
    menu_audit: "ऑडिट लॉग ट्रेल",
    
    // Top Nav / Meta
    session_expires_prefix: "सत्र समाप्ति में: ",
    active_factory_node: "सक्रिय फैक्ट्री नोड",
    user_display_boss: "मुख्य प्रशासक",
    logout: "लॉगआउट",
    ledger_subtitle: "नोट: मापन मापदंडों, कंटेनर विशिष्टताओं और मूल्यांकन का प्रबंधन यहाँ किया जाता है।",
    
    // Headers
    header_datetime: "दिनांक और समय",
    header_sku: "सामग्री आईडी",
    header_description: "सामग्री का नाम",
    header_category: "प्रकार",
    header_location: "गोदाम",
    header_unit_type: "कंटेनर प्रकार",
    header_capacity: "कंटेनर क्षमता",
    header_stock: "कंटेनर संख्या",
    header_total_qty: "कुल स्टॉक",
    header_reorder: "चेतावनी स्तर",
    header_price: "इकाई मूल्य",
    header_actions: "विकल्प",
    header_move_type: "प्रकार",
    header_containers: "कंटेनर",
    header_route: "मार्ग",
    header_user: "लॉगिन कर्ता",
    header_sys_stock: "सिस्टम स्टॉक",
    header_phys_stock: "भौतिक गणना",
    header_variance: "अंतर",
    header_auditor: "सत्यापित कर्ता",
    header_supervisor: "अनुमोदित कर्ता",
    header_status: "स्थिति",
    
    // Screen Titles
    title_dashboard: "सिस्टम डैशबोर्ड",
    title_approvals: "लॉगिन अनुमोदन कतार",
    title_items: "कच्ची सामग्री लेजर",
    title_warehouses: "गोदाम भंडारण स्थान",
    title_movements: "आपूर्ति और संचलन प्रबंधक",
    title_verification: "भौतिक सत्यापन और स्टॉक गणना",
    title_rbac: "भूमिका आधारित पहुंच नियंत्रण मैट्रिक्स (RBAC)",
    title_users: "कर्मचारी पहचान निर्देशिका",
    title_audit: "अपरिवर्तनीय क्रिप्टोग्राफ़िक ऑडिट लॉग",

    // Dashboard Cards
    dash_card_items_lbl: "कच्ची सामग्री संख्या",
    dash_card_low_lbl: "कम स्टॉक चेतावनी",
    dash_card_pending_lbl: "लंबित लॉगिन",
    dash_card_moves_lbl: "लॉग किए गए संचलन (24h)",
    dash_card_items_meta: "सक्रिय निगरानी",
    dash_card_low_meta: "तत्काल आदेश की आवश्यकता",
    dash_card_pending_meta: "प्रशासक कार्रवाई लंबित",
    dash_card_moves_meta: "आपूर्ति और प्रेषण",
    
    // Dashboard general
    dash_breakdown_title: "कच्ची सामग्री स्टॉक विवरण",
    dash_breakdown_unit: "मीट्रिक टन भार",
    dash_compliance_title: "अनुपालन स्थिति",
    dash_compliance_secure: "100% सुरक्षित",
    dash_compliance_warning: "कम स्टॉक चेतावनी",
    dash_compliance_nodes: "भंडारण नोड्स सिंक किए गए",
    dash_compliance_audit: "आवक/जावक ऑडिट सक्षम",
    dash_compliance_rbac: "RBAC अनुपालन सक्रिय",
    dash_recent_audit_title: "हाल की सुरक्षा कार्रवाइयां (ऑडिट अंश)",
    dash_recent_audit_btn: "पूर्ण लॉग देखें",
    
    // Categories
    cat_liquid: "तरल",
    cat_dry: "सूखा",
    cat_packaging: "पैलेजिंग",
    
    // Status text
    status_verified: "सत्यापित",
    status_adjusted: "समायोजित",
    status_discrepancy: "विसंगति",
    status_active: "सक्रिय",
    status_pending: "लंबित समायोजन",
    status_in_stock: "स्टॉक में",
    status_low_stock: "कम स्टॉक",
    status_out_of_stock: "स्टॉक समाप्त",
    
    // Movements Types
    move_inbound: "आवक",
    move_outbound: "जावक",

    // Units
    unit_drums: "ड्रम",
    unit_sacks: "बोरे",
    unit_boxes: "बक्से",
    unit_units: "इकाइयाँ",
    unit_litres: "लीटर",
    unit_kg: "किग्रा",
    unit_l: "L",

    // Buttons
    btn_edit: "संपादित करें",
    btn_delete: "हटाएं",
    btn_details: "विवरण",
    btn_adjust_stock: "स्टॉक समायोजित करें",
    btn_pending_boss: "बॉस की मंजूरी लंबित",
    btn_add_employee: "कर्मचारी जोड़ें",
    btn_modify_employee: "कर्मचारी संशोधित करें",
    title_add_employee: "कर्मचारी जोड़ें",
    title_modify_employee: "कर्मचारी संशोधित करें",
    btn_create_employee: "कर्मचारी खाता बनाएँ",
    btn_save_changes: "परिवर्तन सहेजें",
    title_boss_approval_req: "बॉस की मंजूरी आवश्यक है",

    // Modal Dash Details
    modal_dash_title_prefix: "भंडारण स्थान: ",
    label_sku: "एसकेयू",
    label_category: "श्रेणी",
    label_total_system_stock: "कुल सिस्टम स्टॉक",
    title_inventory_allocation: "स्थान के अनुसार सूची आवंटन",
    header_storage_location: "भंडारण स्थान",
    header_containers_stored: "कंटेनर संख्या",
    header_net_volume_weight: "शुद्ध मात्रा/वजन",

    // Verification Form & Screen
    title_record_stocktake: "भौतिक स्टॉक का रिकॉर्ड रखें",
    lbl_storage_warehouse: "भंडारण गोदाम",
    lbl_select_raw_material: "कच्ची सामग्री चुनें",
    lbl_system_recorded_stock: "सिस्टम रिकॉर्ड स्टॉक",
    lbl_physical_count: "भौतिक गणना (कंटेनर)",
    lbl_calculated_discrepancy: "परिकलित विसंगति अंतर",
    lbl_verified_by: "सत्यापित कर्ता (ऑडिटर)",
    lbl_approved_by: "अनुमोदित कर्ता (पर्यवेक्षक)",
    btn_save_stocktake: "स्टॉक सत्यापन सहेजें",
    title_physical_logs: "भौतिक स्टॉक सत्यापन लॉग",
    subtitle_physical_logs: "स्टॉक ऑडिट, विसंगति जांच और समाधान समायोजन का कालानुक्रमिक रिकॉर्ड।",

    // Variance display
    variance_select_material: "सामग्री का चयन करें और अंतर की गणना करने के लिए भौतिक गणना दर्ज करें।",
    variance_match: "सत्यापन बिल्कुल मेल खाता है: कोई विसंगति नहीं।",
    variance_surplus: "अधिशेष पाया गया: सिस्टम रिकॉर्ड से +{variance} {unit} अधिक।",
    variance_deficit: "कमी पाई गई: {variance} {unit} की कमी।",

    menu_reports: "रिपोर्ट और विश्लेषण",
    title_reports: "रिपोर्ट और विश्लेषण",
    reports_subtitle: "कस्टम अनुपालन और स्टॉक रिपोर्ट उत्पन्न, फ़िल्टर, पूर्वावलोकन और निर्यात करें।",
    lbl_report_type: "रिपोर्ट प्रकार",
    lbl_report_tenant: "फैक्ट्री किरायेदार",
    lbl_report_warehouse: "भंडारण स्थान (गोदाम)",
    lbl_report_category: "श्रेणी (सामग्री प्रकार)",
    lbl_report_item: "विशिष्ट सामग्री",
    lbl_report_start_date: "प्रारंभ तिथि",
    lbl_report_end_date: "अंतिम तिथि",
    btn_generate_report: "रिपोर्ट तैयार करें",
    btn_export_pdf: "पीडीएफ निर्यात करें",
    btn_export_excel: "एक्सेल निर्यात करें",
    rep_stat_records: "फ़िल्टर किए गए रिकॉर्ड",
    rep_stat_total_qty: "कुल कंटेनर",
    rep_stat_qty_moved: "कुल कंटेनर स्थानांतरित",
    rep_stat_audited: "कुल जाँचे गए अंतर",
    rep_stat_valuation: "रिपोर्ट मूल्यांकन",
    report_type_stock: "स्टॉक शेष सारांश",
    report_type_movements: "खरीद और संचलन लॉग",
    report_type_activity: "कालानुक्रमिक इन्वेंटरी गतिविधि बही",
    report_type_discrepancy: "स्टॉक गणना विसंगति लॉग",
    report_type_valuation: "मूल्यांकन और वित्तीय बही",

    // Auth screens
    portal_title: "एथेल",
    portal_badge: "सुरक्षित पोर्टल",
    portal_login: "पोर्टल लॉगिन",
    portal_subtitle: "कच्ची सामग्री निगरानी और अनुपालन नेटवर्क",
    lbl_factory_tenant: "फैक्ट्री नोड का चयन करें",
    lbl_employee_email: "कर्मचारी ईमेल",
    lbl_system_password: "सिस्टम पासवर्ड",
    btn_verify_credentials: "सत्यापित करें",
    link_create_account: "कंपनी या कर्मचारी खाता बनाएं",
    
    btn_back_login: "लॉगिन पर वापस जाएं",
    btn_back: "पीछे",
    title_setup_account: "खाता सेटअप करें",
    subtitle_setup_account: "एक नई कंपनी बनाएं या किसी कंपनी में शामिल हों",
    lbl_registration_type: "पंजीकरण प्रकार",
    btn_reg_company: "नई कंपनी (बॉस)",
    btn_reg_employee: "कंपनी में शामिल हों (कर्मचारी)",
    lbl_company_name: "कंपनी / फैक्ट्री का नाम",
    lbl_company_id: "कंपनी पहचानकर्ता (अद्वितीय आईडी)",
    lbl_select_company: "शामिल होने के लिए कंपनी चुनें",
    lbl_select_role: "वांछित भूमिका चुनें",
    lbl_full_name: "पूरा नाम",
    lbl_email_address: "ईमेल पता",
    lbl_create_password: "पासवर्ड बनाएं",
    btn_complete_registration: "पंजीकरण पूरा करें",
    
    title_two_factor: "टू-फैक्टर ओटीपी",
    lbl_enter_otp: "6-अंकीय ओटीपी दर्ज करें",
    btn_request_approval: "सत्र अनुमोदन का अनुरोध करें",
    
    title_awaiting_approval: "बॉस की मंजूरी का इंतजार",
    subtitle_awaiting_approval: "आपकी साख और 2FA मान्य हैं। एक प्रशासक को अपने बॉस अनुमोदन डैशबोर्ड से आपके सत्र को अधिकृत करना होगा।",
    lbl_requested_user: "अनुरोधित उपयोगकर्ता:",
    lbl_tenant_node: "फैक्ट्री नोड:",
    lbl_security_protocol: "सुरक्षा प्रोटोकॉल:",
    btn_cancel_request: "अनुरोध रद्द करें",
    
    demo_action_required: "डेमो कार्रवाई आवश्यक:",
    demo_action_desc: "नीचे दिए गए सिम्युलेटर पैनल को टॉगल करें और बॉस (प्रशासक) चुनें, फिर इस लॉगिन सत्र को स्वीकृत करने के लिए लॉगिन अनुमोदन पर जाएं।",

    // Dynamic OTP messages
    otp_subtitle_employee: "आपके बॉस को 6 अंकों का सुरक्षित ओटीपी भेजा गया है। कृपया सत्यापन कोड प्राप्त करने के लिए अपने बॉस से संपर्क करें।",
    otp_hint_employee: "संकेत: अपने बॉस से उनकी अनुमोदन कतार पर दिखाई देने वाला सक्रिय ओटीपी पूछें।",
    otp_subtitle_boss: "एक सुरक्षित 2FA टोकन आपके पंजीकृत व्यवस्थापक डिवाइस पर भेजा गया है।",
    otp_hint_boss: "संकेत: आगे बढ़ने के लिए 123456 दर्ज करें।",

    // Placeholders
    placeholder_search_items: "सामग्री आईडी या नाम से खोजें...",
    placeholder_search_movements: "सामग्री आईडी, नाम या मार्ग से खोजें...",
    placeholder_search_audit: "कार्रवाई, उपयोगकर्ता या मॉड्यूल से खोजें...",
    placeholder_reg_name: "जैसे. सरह कॉनर",
    placeholder_reg_email: "जैसे. sarah@apex.com",
    placeholder_reg_pass: "••••••••",
    placeholder_login_email: "name@factory.com",
    placeholder_login_pass: "••••••••"
  }
};


// Universal stock conversion utility
function convertStockQty(qty, fromUnit, toUnit, capacity = 1) {
  if (!fromUnit || !toUnit) return qty;
  
  const from = fromUnit.toLowerCase().trim();
  const to = toUnit.toLowerCase().trim();
  
  if (from === to) return qty;
  
  // Convert from "from" unit to base denominator (Litres, kg, units = 1.0)
  let toBaseFactor = 1.0;
  if (from === 'metric tonne' || from === 'metric tonnage' || from === 'mt' || from === 'tonne' || from === 'tonnes') {
    toBaseFactor = 1000.0;
  } else if (from === 'sacks' || from === 'sack') {
    toBaseFactor = 50.0;
  } else if (from === 'drums' || from === 'drum') {
    toBaseFactor = 200.0;
  } else if (from === 'litres' || from === 'litre' || from === 'l' || from === 'kg' || from === 'units' || from === 'unit') {
    toBaseFactor = 1.0;
  } else {
    toBaseFactor = 1.0;
  }
  
  const baseQty = qty * toBaseFactor;
  
  // Convert from base denominator to "to" unit
  let fromBaseFactor = 1.0;
  if (to === 'metric tonne' || to === 'metric tonnage' || to === 'mt' || to === 'tonne' || to === 'tonnes') {
    fromBaseFactor = 1000.0;
  } else if (to === 'sacks' || to === 'sack') {
    fromBaseFactor = 50.0;
  } else if (to === 'drums' || to === 'drum') {
    fromBaseFactor = 200.0;
  } else if (to === 'litres' || to === 'litre' || to === 'l' || to === 'kg' || to === 'units' || to === 'unit') {
    fromBaseFactor = 1.0;
  } else {
    fromBaseFactor = 1.0;
  }
  
  return baseQty / fromBaseFactor;
}

function getTranslatedUnit(unit, langData) {
  if (!unit) return "";
  const key = 'unit_' + unit.toLowerCase();
  return langData[key] || unit;
}

function translateApp() {
  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  
  // Translate static data-translate elements
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (langData[key]) {
      const icon = el.querySelector('i');
      if (icon) {
        // Keep tag icon structure
        el.innerHTML = "";
        el.appendChild(icon);
        el.appendChild(document.createTextNode(" " + langData[key]));
      } else {
        el.textContent = langData[key];
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    if (langData[key]) {
      el.placeholder = langData[key];
    }
  });

  // Sync language selector values
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = currentLanguage;
  }
  const authLangSelect = document.getElementById('auth-language-select');
  if (authLangSelect) {
    authLangSelect.value = currentLanguage;
  }

  // Translate dynamic OTP messages if active
  const otpSubtitle = document.getElementById('otp-screen-subtitle');
  const otpHint = document.getElementById('otp-screen-hint');
  if (otpSubtitle && otpHint && pendingLogin) {
    const isBoss = pendingLogin.role === "Boss";
    if (isBoss) {
      otpSubtitle.textContent = langData.otp_subtitle_boss || "A secure 2FA token has been dispatched to your registered administrator device.";
      otpHint.innerHTML = langData.otp_hint_boss || "Hint: Enter <strong>123456</strong> to proceed.";
    } else {
      otpSubtitle.textContent = langData.otp_subtitle_employee || "A secure 6-digit OTP has been sent to your Company Boss. Please contact your Boss to get the verification code.";
      otpHint.innerHTML = langData.otp_hint_employee || "Hint: Ask your Boss for the active OTP shown on their Approvals Queue dashboard.";
    }
  }

  // Update dynamic titles
  updateDynamicScreenTitle();

  // Re-trigger active screen rendering to translate dynamic content
  const screenId = currentSession.screen;
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
    renderMovementsTable();
  } else if (screenId === "screen-verification") {
    renderVerificationLogsTable();
  } else if (screenId === "screen-rbac") {
    renderRBACMatrixTable();
  } else if (screenId === "screen-users") {
    renderUsersTable();
  } else if (screenId === "screen-audit") {
    renderAuditTrailTable();
  }
}

function updateDynamicScreenTitle() {
  const titleEl = document.getElementById('screen-title');
  if (!titleEl) return;
  
  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const titles = {
    "screen-dashboard": langData.title_dashboard,
    "screen-approvals": langData.title_approvals,
    "screen-items": langData.title_items,
    "screen-warehouses": langData.title_warehouses,
    "screen-movements": langData.title_movements,
    "screen-verification": langData.title_verification,
    "screen-rbac": langData.title_rbac,
    "screen-users": langData.title_users,
    "screen-audit": langData.title_audit,
    "screen-reports": langData.title_reports
  };
  
  titleEl.textContent = titles[currentSession.screen] || "Raw Materials System";
}

// ============================================================================
// REPORTS ENGINE MODULE
// ============================================================================

function populateReportDropdowns() {
  const tenantSelect = document.getElementById('report-tenant');
  const whSelect = document.getElementById('report-warehouse');
  const catSelect = document.getElementById('report-category');
  const itemSelect = document.getElementById('report-item');

  if (!tenantSelect || !whSelect || !catSelect || !itemSelect) return;

  // Clear preview
  document.getElementById('report-preview-card').classList.add('hidden');

  // Populate tenants
  tenantSelect.innerHTML = `<option value="all">All Factories</option>`;
  for (const [id, name] of Object.entries(FACTORIES)) {
    tenantSelect.innerHTML += `<option value="${id}">${name}</option>`;
  }
  tenantSelect.value = currentSession.tenant;

  // Populate warehouses
  whSelect.innerHTML = `<option value="all">All Storage Locations</option>`;
  warehouseDatabase.forEach(wh => {
    whSelect.innerHTML += `<option value="${wh.name}">${wh.name}</option>`;
  });

  // Populate categories
  catSelect.innerHTML = `
    <option value="all">All Categories</option>
    <option value="Liquid">Liquids (Concentrates)</option>
    <option value="Dry">Dry Materials (Sugar / Powder)</option>
    <option value="Packaging">Packaging Materials</option>
  `;

  // Populate materials
  itemSelect.innerHTML = `<option value="all">All Materials</option>`;
  itemsDatabase.forEach(item => {
    itemSelect.innerHTML += `<option value="${item.sku}">${item.sku} - ${item.name}</option>`;
  });
}

function generateReportData(e) {
  if (e) e.preventDefault();

  const reportType = document.getElementById('report-type').value;
  const tenant = document.getElementById('report-tenant').value;
  const warehouse = document.getElementById('report-warehouse').value;
  const category = document.getElementById('report-category').value;
  const itemSku = document.getElementById('report-item').value;
  const startDateVal = document.getElementById('report-start-date').value;
  const endDateVal = document.getElementById('report-end-date').value;

  const startDate = startDateVal ? new Date(startDateVal + "T00:00:00") : null;
  const endDate = endDateVal ? new Date(endDateVal + "T23:59:59") : null;

  let itemsSource = [];
  let movementsSource = [];
  let verificationSource = [];

  if (tenant === currentSession.tenant || tenant === 'all') {
    itemsSource = itemsDatabase;
    movementsSource = movementsDatabase;
    verificationSource = verificationDatabase;
  } else if (tenant === 'EnergyPulse_Ltd') {
    itemsSource = [
      { id: 101, sku: "RAW-EP-TAURINE", name: "Taurine Amino Acid Powder", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 25, baseUnit: "kg", containerCount: 180, reorder: 50, price: 120.00, status: "Active" },
      { id: 102, sku: "RAW-EP-CAFFEINE", name: "Anhydrous Caffeine Powder", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 25, baseUnit: "kg", containerCount: 45, reorder: 20, price: 210.00, status: "Active" },
      { id: 103, sku: "RAW-EP-GUARANA", name: "Guarana Fruit Liquid Extract", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 15, reorder: 5, price: 850.00, status: "Active" },
      { id: 104, sku: "RAW-EP-CAN", name: "Aluminum Sleek Cans 250ml", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 2000, baseUnit: "units", containerCount: 50, reorder: 10, price: 140.00, status: "Active" }
    ];
    movementsSource = [
      { timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), sku: "RAW-EP-TAURINE", name: "Taurine Amino Acid Powder", type: "Inbound", containers: 40, totalQty: 1000, baseUnit: "kg", originDest: "Supplier (Procured) -> Sabev-2", user: "operator@energypulse.com", supplier: "Global BioLabs Ltd", vehicleNum: "TRK-EP-45", approvedBy: "Sarah Connor" },
      { timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), sku: "RAW-EP-CAFFEINE", name: "Anhydrous Caffeine Powder", type: "Outbound", containers: 5, totalQty: 125, baseUnit: "kg", originDest: "Sabev-2 -> Reactor Tank 4", user: "operator@energypulse.com", movedBy: "John Connor", vehicleNum: "Forklift F-01", approvedBy: "Sarah Connor" }
    ];
    verificationSource = [
      { id: 101, timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), warehouse: "Sabev-2", sku: "RAW-EP-TAURINE", name: "Taurine Amino Acid Powder", systemQty: 180, physicalQty: 180, variance: 0, verifiedBy: "John Connor", approvedBy: "Sarah Connor", status: "Verified" }
    ];
  } else if (tenant === 'BioNectar_Ind') {
    itemsSource = [
      { id: 201, sku: "RAW-BN-ALOE", name: "Organic Aloe Vera Gel Concentrate", category: "Liquid", warehouse: "Sabev-1", containerUnit: "Drums", capacityPerContainer: 200, baseUnit: "Litres", containerCount: 22, reorder: 5, price: 920.00, status: "Active" },
      { id: 202, sku: "RAW-BN-VITAMINC", name: "L-Ascorbic Acid crystals", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 20, baseUnit: "kg", containerCount: 80, reorder: 15, price: 95.00, status: "Active" },
      { id: 203, sku: "RAW-BN-GINSENG", name: "Panax Ginseng Root Powder", category: "Dry", warehouse: "Sabev-2", containerUnit: "Sacks", capacityPerContainer: 10, baseUnit: "kg", containerCount: 12, reorder: 5, price: 450.00, status: "Active" },
      { id: 204, sku: "RAW-BN-VIAL", name: "Amber Glass Vials 500ml", category: "Packaging", warehouse: "Warehouse-1", containerUnit: "Boxes", capacityPerContainer: 500, baseUnit: "units", containerCount: 100, reorder: 20, price: 180.00, status: "Active" }
    ];
    movementsSource = [
      { timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), sku: "RAW-BN-ALOE", name: "Organic Aloe Vera Gel Concentrate", type: "Inbound", containers: 12, totalQty: 2400, baseUnit: "Litres", originDest: "Supplier (Procured) -> Sabev-1", user: "operator@bionectar.com", supplier: "Nectar Source Inc", vehicleNum: "TRK-BN-90", approvedBy: "Arthur Dent" },
      { timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), sku: "RAW-BN-VITAMINC", name: "L-Ascorbic Acid crystals", type: "Outbound", containers: 10, totalQty: 200, baseUnit: "kg", originDest: "Sabev-2 -> Compounding Lab 1", user: "operator@bionectar.com", movedBy: "Tricia McMillan", vehicleNum: "Cart BN-04", approvedBy: "Arthur Dent" }
    ];
    verificationSource = [
      { id: 201, timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), warehouse: "Sabev-2", sku: "RAW-BN-VITAMINC", name: "L-Ascorbic Acid crystals", systemQty: 82, physicalQty: 80, variance: -2, verifiedBy: "Tricia McMillan", approvedBy: "Arthur Dent", status: "Adjusted" }
    ];
  }

  let filteredData = [];
  let summaryQty = 0;
  let summaryValuation = 0;

  if (reportType === 'stock' || reportType === 'valuation') {
    filteredData = itemsSource.filter(item => {
      const matchWh = (warehouse === 'all' || item.warehouse === warehouse);
      const matchCat = (category === 'all' || item.category === category);
      const matchSku = (itemSku === 'all' || item.sku === itemSku);
      return matchWh && matchCat && matchSku;
    });

    filteredData.forEach(item => {
      summaryQty += item.containerCount;
      summaryValuation += item.containerCount * item.price;
    });
  } else if (reportType === 'movements') {
    filteredData = movementsSource.filter(m => {
      const matchWh = (warehouse === 'all' || m.originDest.includes(warehouse));
      const item = itemsSource.find(i => i.sku === m.sku);
      const matchCat = (category === 'all' || (item && item.category === category));
      const matchSku = (itemSku === 'all' || m.sku === itemSku);

      const mDate = new Date(m.timestamp);
      const matchStart = (!startDate || mDate >= startDate);
      const matchEnd = (!endDate || mDate <= endDate);

      return matchWh && matchCat && matchSku && matchStart && matchEnd;
    });

    filteredData.forEach(m => {
      summaryQty += m.containers;
      const item = itemsSource.find(i => i.sku === m.sku);
      if (item) {
        summaryValuation += m.containers * item.price;
      }
    });
  } else if (reportType === 'discrepancy') {
    filteredData = verificationSource.filter(log => {
      const matchWh = (warehouse === 'all' || log.warehouse === warehouse);
      const item = itemsSource.find(i => i.sku === log.sku);
      const matchCat = (category === 'all' || (item && item.category === category));
      const matchSku = (itemSku === 'all' || log.sku === itemSku);

      const lDate = new Date(log.timestamp);
      const matchStart = (!startDate || lDate >= startDate);
      const matchEnd = (!endDate || lDate <= endDate);

      return matchWh && matchCat && matchSku && matchStart && matchEnd;
    });

    filteredData.forEach(log => {
      summaryQty += Math.abs(log.variance);
      const item = itemsSource.find(i => i.sku === log.sku);
      if (item) {
        summaryValuation += Math.abs(log.variance) * item.price;
      }
    });
  } else if (reportType === 'activity') {
    const movementsMapped = movementsSource.filter(m => {
      const matchWh = (warehouse === 'all' || m.originDest.includes(warehouse));
      const item = itemsSource.find(i => i.sku === m.sku);
      const matchCat = (category === 'all' || (item && item.category === category));
      const matchSku = (itemSku === 'all' || m.sku === itemSku);

      const mDate = new Date(m.timestamp);
      const matchStart = (!startDate || mDate >= startDate);
      const matchEnd = (!endDate || mDate <= endDate);

      return matchWh && matchCat && matchSku && matchStart && matchEnd;
    }).map(m => ({
      timestamp: m.timestamp,
      type: m.type,
      sku: m.sku,
      name: m.name,
      qty: m.containers,
      unit: m.baseUnit === "Litres" ? "Drums" : (m.baseUnit === "kg" ? "Sacks" : "Boxes"),
      route: m.originDest,
      user: m.user,
      approvedBy: m.approvedBy || "N/A"
    }));

    const verificationMapped = verificationSource.filter(log => {
      if (log.status !== "Adjusted") return false;
      const matchWh = (warehouse === 'all' || log.warehouse === warehouse);
      const item = itemsSource.find(i => i.sku === log.sku);
      const matchCat = (category === 'all' || (item && item.category === category));
      const matchSku = (itemSku === 'all' || log.sku === itemSku);

      const lDate = new Date(log.timestamp);
      const matchStart = (!startDate || lDate >= startDate);
      const matchEnd = (!endDate || lDate <= endDate);

      return matchWh && matchCat && matchSku && matchStart && matchEnd;
    }).map(log => ({
      timestamp: log.timestamp,
      type: "Adjustment",
      sku: log.sku,
      name: log.name,
      qty: log.variance,
      unit: "Containers",
      route: `Reconciliation Audit at ${log.warehouse}`,
      user: log.verifiedBy,
      approvedBy: log.approvedBy
    }));

    filteredData = [...movementsMapped, ...verificationMapped].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    filteredData.forEach(act => {
      summaryQty += Math.abs(act.qty);
      const item = itemsSource.find(i => i.sku === act.sku);
      if (item) {
        summaryValuation += Math.abs(act.qty) * item.price;
      }
    });
  }

  renderReportPreview(reportType, filteredData, summaryQty, summaryValuation);
}

function renderReportPreview(type, data, totalQty, totalVal) {
  const card = document.getElementById('report-preview-card');
  const title = document.getElementById('report-preview-title');
  const badge = document.getElementById('report-preview-badge');
  const tbody = document.querySelector('#report-preview-table tbody');
  const thead = document.querySelector('#report-preview-table thead');

  if (!card || !tbody || !thead) return;

  const langData = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  document.getElementById('rep-stat-records-val').textContent = data.length;
  document.getElementById('rep-stat-qty-val').textContent = formatNumber(totalQty);
  document.getElementById('rep-stat-val-val').textContent = formatCurrency(totalVal);

  badge.textContent = `${data.length} records`;

  const qtyCard = document.getElementById('rep-stat-qty-card');
  const valCard = document.getElementById('rep-stat-val-card');
  const qtyLbl = document.getElementById('rep-stat-qty-lbl');

  qtyCard.classList.remove('hidden');
  valCard.classList.remove('hidden');

  if (type === 'stock') {
    title.textContent = "Report Preview: Stock Balance Summary";
    qtyLbl.textContent = "Total Containers Stored";

    thead.innerHTML = `
      <tr>
        <th>Material ID</th>
        <th>Material Name</th>
        <th>Type</th>
        <th>Warehouse</th>
        <th class="number">Containers</th>
        <th>Container Type</th>
        <th class="number">Net Volume/Mass</th>
      </tr>
    `;

    tbody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement('tr');
      const containerLabel = getTranslatedUnit(item.containerUnit, langData);
      const baseLabel = getTranslatedUnit(item.baseUnit === "Litres" ? "L" : item.baseUnit, langData);
      tr.innerHTML = `
        <td class="sku">${item.sku}</td>
        <td class="font-bold">${item.name}</td>
        <td><span class="badge badge-blue">${item.category}</span></td>
        <td>${item.warehouse}</td>
        <td class="number">${item.containerCount}</td>
        <td>${containerLabel}</td>
        <td class="number font-bold">${item.containerCount * item.capacityPerContainer} ${baseLabel}</td>
      `;
      tbody.appendChild(tr);
    });
  } else if (type === 'valuation') {
    title.textContent = "Report Preview: Valuation & Financial Ledger";
    qtyLbl.textContent = "Total Containers";

    thead.innerHTML = `
      <tr>
        <th>Material ID</th>
        <th>Material Name</th>
        <th>Warehouse</th>
        <th class="number">Containers Stored</th>
        <th class="number">Unit Price</th>
        <th class="number">Asset Valuation</th>
      </tr>
    `;

    tbody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="sku">${item.sku}</td>
        <td class="font-bold">${item.name}</td>
        <td>${item.warehouse}</td>
        <td class="number">${item.containerCount}</td>
        <td class="number">${formatCurrency(item.price)}</td>
        <td class="number text-green font-bold">${formatCurrency(item.containerCount * item.price)}</td>
      `;
      tbody.appendChild(tr);
    });
  } else if (type === 'movements') {
    title.textContent = "Report Preview: Procurement & Movements Log";
    qtyLbl.textContent = "Total Containers Moved";

    thead.innerHTML = `
      <tr>
        <th>Timestamp</th>
        <th>Type</th>
        <th>Material ID</th>
        <th>Material Name</th>
        <th class="number">Containers</th>
        <th>Route (Origin/Dest)</th>
        <th>Approved By</th>
      </tr>
    `;

    tbody.innerHTML = "";
    data.forEach(m => {
      const tr = document.createElement('tr');
      const typeBadge = m.type === "Inbound" ?
        `<span class="badge badge-outline-green"><i class="fa-solid fa-arrow-down-long"></i> Inbound</span>` :
        `<span class="badge badge-outline-amber"><i class="fa-solid fa-arrow-up-long"></i> Outbound</span>`;

      tr.innerHTML = `
        <td class="timestamp">${formatLogTimestamp(m.timestamp)}</td>
        <td>${typeBadge}</td>
        <td class="sku">${m.sku}</td>
        <td class="font-bold">${m.name}</td>
        <td class="number">${m.containers}</td>
        <td>${m.originDest}</td>
        <td class="font-bold text-blue">${m.approvedBy || "N/A"}</td>
      `;
      tbody.appendChild(tr);
    });
  } else if (type === 'discrepancy') {
    title.textContent = "Report Preview: Stocktake Discrepancy Log";
    qtyLbl.textContent = "Total Audited Discrepancies";

    thead.innerHTML = `
      <tr>
        <th>Timestamp</th>
        <th>Warehouse</th>
        <th>Material ID</th>
        <th>Material Name</th>
        <th class="number">System Count</th>
        <th class="number">Physical Count</th>
        <th class="number text-center">Variance</th>
        <th>Status</th>
      </tr>
    `;

    tbody.innerHTML = "";
    data.forEach(log => {
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

      tr.innerHTML = `
        <td class="timestamp">${formatLogTimestamp(log.timestamp)}</td>
        <td>${log.warehouse}</td>
        <td class="sku">${log.sku}</td>
        <td class="font-bold">${log.name}</td>
        <td class="number">${log.systemQty}</td>
        <td class="number">${log.physicalQty}</td>
        <td class="text-center">${varBadge}</td>
        <td>${statusBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  } else if (type === 'activity') {
    title.textContent = "Report Preview: Chronological Inventory Activity Ledger";
    qtyLbl.textContent = "Total Volume of Activity";

    thead.innerHTML = `
      <tr>
        <th>Timestamp</th>
        <th>Action Type</th>
        <th>Material ID</th>
        <th>Material Name</th>
        <th class="number">Containers</th>
        <th>Activity Route / Description</th>
        <th>Logged By</th>
        <th>Approved By</th>
      </tr>
    `;

    tbody.innerHTML = "";
    data.forEach(act => {
      const tr = document.createElement('tr');
      let typeBadge = "";
      if (act.type === "Inbound") {
        typeBadge = `<span class="badge badge-outline-green"><i class="fa-solid fa-arrow-down-long"></i> Inbound / Purchase</span>`;
      } else if (act.type === "Outbound") {
        typeBadge = `<span class="badge badge-outline-amber"><i class="fa-solid fa-arrow-up-long"></i> Outbound / Usage</span>`;
      } else {
        typeBadge = `<span class="badge badge-outline-primary"><i class="fa-solid fa-sliders"></i> Audit Adjustment</span>`;
      }

      let formattedQty = act.qty;
      if (act.qty > 0 && act.type === "Adjustment") {
        formattedQty = `+${act.qty}`;
      }

      tr.innerHTML = `
        <td class="timestamp">${formatLogTimestamp(act.timestamp)}</td>
        <td>${typeBadge}</td>
        <td class="sku">${act.sku}</td>
        <td class="font-bold">${act.name}</td>
        <td class="number font-bold">${formattedQty} ${act.unit}</td>
        <td>${act.route}</td>
        <td>${act.user}</td>
        <td class="font-bold text-blue">${act.approvedBy}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  card.classList.remove('hidden');
}

function exportReportToPDF() {
  const previewCard = document.getElementById('report-preview-card');
  if (previewCard.classList.contains('hidden')) {
    showToast("Please generate a report first before exporting.", false);
    return;
  }

  const titleText = document.getElementById('report-preview-title').textContent;
  const recordsVal = document.getElementById('rep-stat-records-val').textContent;
  const qtyVal = document.getElementById('rep-stat-qty-val').textContent;
  const qtyLbl = document.getElementById('rep-stat-qty-lbl').textContent;
  const valVal = document.getElementById('rep-stat-val-val').textContent;

  const tableHeader = document.querySelector('#report-preview-table thead').innerHTML;
  const tableBody = document.querySelector('#report-preview-table tbody').innerHTML;

  const tenantId = document.getElementById('report-tenant').value;
  const tenantName = FACTORIES[tenantId] || "All Factories";

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast("Pop-up blocked: Please allow popups to export PDF.", false);
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Aethel Compliance Audit Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #0f172a;
            margin: 40px;
            font-size: 12px;
            line-height: 1.5;
          }
          .header {
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 15px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo-area {
            font-size: 24px;
            font-weight: 800;
            color: #1e3a8a;
          }
          .logo-area span {
            color: #10b981;
          }
          .meta-info {
            text-align: right;
            font-size: 10px;
            color: #475569;
          }
          .report-title {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .stats-grid {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
          }
          .stat-card {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
            background-color: #f8fafc;
          }
          .stat-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
          }
          .stat-val {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 3px;
          }
          .stat-val.green {
            color: #10b981;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 10px;
          }
          th {
            background-color: #0f172a;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 6px 8px;
            border: 1px solid #0f172a;
          }
          td {
            padding: 6px 8px;
            border: 1px solid #e2e8f0;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .number {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .badge {
            display: inline-block;
            padding: 1px 4px;
            font-size: 8px;
            font-weight: 700;
            border-radius: 3px;
            background-color: #e2e8f0;
            color: #334155;
          }
          .badge-blue {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .badge-green {
            background-color: #d1fae5;
            color: #065f46;
          }
          .badge-amber {
            background-color: #fef3c7;
            color: #92400e;
          }
          .badge-outline-green {
            border: 1px solid #10b981;
            color: #047857;
          }
          .badge-outline-amber {
            border: 1px solid #f59e0b;
            color: #b45309;
          }
          .badge-outline-primary {
            border: 1px solid #3b82f6;
            color: #1d4ed8;
          }
          .badge-light-danger {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .sku {
            font-family: monospace;
            font-size: 9px;
            color: #475569;
          }
          .timestamp {
            font-family: monospace;
            font-size: 9px;
          }
          .footer {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 8px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-area">Aethel<span>.</span></div>
          <div class="meta-info">
            <strong>Factory Node:</strong> ${tenantName}<br>
            <strong>Date Generated:</strong> ${new Date().toLocaleString()}<br>
            <strong>Operator Session:</strong> ${currentSession.email}
          </div>
        </div>
        
        <div class="report-title">${titleText}</div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Records Filtered</div>
            <div class="stat-val">${recordsVal}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${qtyLbl}</div>
            <div class="stat-val">${qtyVal}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Report Valuation</div>
            <div class="stat-val green">${valVal}</div>
          </div>
        </div>
        
        <table>
          <thead>
            ${tableHeader}
          </thead>
          <tbody>
            ${tableBody}
          </tbody>
        </table>
        
        <div class="footer">
          <div>Aethel Raw Materials System — Secure SaaS Ledger</div>
          <div>System Generated Compliance Report</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 350);
}

function exportReportToExcel() {
  const previewCard = document.getElementById('report-preview-card');
  if (previewCard.classList.contains('hidden')) {
    showToast("Please generate a report first before exporting.", false);
    return;
  }

  const reportType = document.getElementById('report-type').value;
  const table = document.getElementById('report-preview-table');
  
  let csvContent = "";
  
  // Extract headers
  const headers = [];
  table.querySelectorAll('thead th').forEach(th => {
    headers.push(`"${th.textContent.trim()}"`);
  });
  csvContent += headers.join(",") + "\n";
  
  // Extract data rows
  table.querySelectorAll('tbody tr').forEach(tr => {
    const row = [];
    tr.querySelectorAll('td').forEach(td => {
      let val = td.textContent.trim().replace(/\s+/g, ' ');
      row.push(`"${val}"`);
    });
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `aethel_report_${reportType}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Excel/CSV report exported successfully.");
}

window.addEventListener('DOMContentLoaded', initializeApp);



// Auto-sync approvals list across tabs for Boss
setInterval(() => {
  if (currentSession.active && currentSession.role === "Boss") {
    const savedApprovals = JSON.parse(localStorage.getItem('loginApprovals')) || [];
    if (JSON.stringify(loginApprovals) !== JSON.stringify(savedApprovals)) {
      loginApprovals = savedApprovals;
      updateApprovalBadges();
      if (currentSession.screen === "screen-approvals") {
        renderApprovalsTable();
      }
    }
  }
}, 2000);
