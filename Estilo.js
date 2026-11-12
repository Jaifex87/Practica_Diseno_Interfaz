let selectedServer = '';
let drawerSessionId = 0;
let modalSessionId = 0;

const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');
const menuToggleBtn = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const modal = document.getElementById('modal');
let drawerReturnFocus = null;
let modalReturnFocus = null;

function restoreFocus(element) {
  const target = element && element.isConnected ? element : menuToggleBtn;
  const targetIsHiddenSidebarItem = window.innerWidth < 1024 &&
    sidebar.contains(target) &&
    !sidebar.classList.contains('open');
  (targetIsHiddenSidebarItem ? menuToggleBtn : target).focus();
}

function openDrawer(serverName) {
  drawerSessionId += 1;
  drawerReturnFocus = document.activeElement;
  selectedServer = serverName;
  document.getElementById('drawerServerName').textContent = serverName;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('active');
  document.getElementById('serverAlias').focus();
}

function closeDrawer() {
  if (!drawer.classList.contains('open')) {
    return;
  }
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  checkBackdropClose();
  restoreFocus(drawerReturnFocus);
  drawerReturnFocus = null;
}

function openModal(serverName) {
  modalSessionId += 1;
  modalReturnFocus = document.activeElement;
  selectedServer = serverName;
  document.getElementById('modalServerName').textContent = serverName;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('active');
  modal.querySelector('.btn-secondary').focus();
}

function closeModal() {
  if (!modal.classList.contains('open')) {
    return;
  }
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  checkBackdropClose();
  restoreFocus(modalReturnFocus);
  modalReturnFocus = null;
}

function checkBackdropClose() {
  const isMobileSidebarOpen = window.innerWidth < 1024 && sidebar.classList.contains('open');
  if (!drawer.classList.contains('open') &&
      !modal.classList.contains('open') &&
      !isMobileSidebarOpen) {
    backdrop.classList.remove('active');
  }
}

function closeAllOverlays() {
  closeDrawer();
  closeModal();
  sidebar.classList.remove('open');
  menuToggleBtn.setAttribute('aria-expanded', 'false');
  checkBackdropClose();
}

function executeCriticalAction() {
  const serverName = selectedServer;
  const actionSessionId = modalSessionId;
  const btn = document.getElementById('confirmActionBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    alert(`La instancia ${serverName} ha sido reiniciada exitosamente.`);
    btn.classList.remove('loading');
    btn.disabled = false;
    if (modalSessionId === actionSessionId) {
      closeModal();
    }
  }, 1500);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const serverName = selectedServer;
  const formSessionId = drawerSessionId;
  const form = event.currentTarget;
  const formMessage = document.getElementById('formMessage');
  if (!form.checkValidity()) {
    formMessage.textContent = 'Completa los campos obligatorios y revisa los datos señalados.';
    form.reportValidity();
    return;
  }
  formMessage.textContent = '';

  const saveBtn = document.getElementById('saveBtn');
  const controls = Array.from(form.querySelectorAll('.form-control, .switch input'));
  const previousDisabledStates = controls.map(control => control.disabled);

  form.setAttribute('aria-busy', 'true');
  form.querySelectorAll('.form-group').forEach(group => group.classList.add('loading'));
  controls.forEach(control => {
    control.disabled = true;
  });
  saveBtn.classList.add('loading');
  saveBtn.disabled = true;

  setTimeout(() => {
    alert(`Parámetros de ${serverName} actualizados correctamente.`);
    form.removeAttribute('aria-busy');
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('loading'));
    controls.forEach((control, index) => {
      control.disabled = previousDisabledStates[index];
    });
    saveBtn.classList.remove('loading');
    saveBtn.disabled = false;
    if (drawerSessionId === formSessionId) {
      closeDrawer();
    }
  }, 1200);
}

const themeToggleBtn = document.getElementById('themeToggle');
const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');

function syncThemeToggleState() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const isDark = currentTheme === 'dark' || (!currentTheme && darkModePreference.matches);
  themeToggleBtn.setAttribute('aria-pressed', String(isDark));
}

syncThemeToggleState();
darkModePreference.addEventListener('change', () => {
  if (!document.documentElement.hasAttribute('data-theme')) {
    syncThemeToggleState();
  }
});

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const isDark = currentTheme === 'dark' || (!currentTheme && darkModePreference.matches);
  const nextTheme = isDark ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', nextTheme);
  themeToggleBtn.setAttribute('aria-pressed', String(nextTheme === 'dark'));
});

menuToggleBtn.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
  menuToggleBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  if (isOpen) {
    backdrop.classList.add('active');
  } else {
    checkBackdropClose();
  }
});

backdrop.addEventListener('click', closeAllOverlays);

document.addEventListener('keydown', event => {
  const activeOverlay = modal.classList.contains('open') ? modal :
    drawer.classList.contains('open') ? drawer : null;

  if (activeOverlay && event.key === 'Tab') {
    const focusableElements = Array.from(activeOverlay.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element => element.getClientRects().length > 0);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement) {
      event.preventDefault();
    } else if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  if (event.key !== 'Escape') {
    return;
  }

  if (modal.classList.contains('open')) {
    closeModal();
  } else if (drawer.classList.contains('open')) {
    closeDrawer();
  } else if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    menuToggleBtn.setAttribute('aria-label', 'Abrir menú');
    checkBackdropClose();
    menuToggleBtn.focus();
  }
});

const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
const metricsSection = document.getElementById('metricas');
const serversSection = document.getElementById('servidores');
const dashboardViews = ['#dashboard', '#servidores', '#metricas'];

function showDashboardView(view) {
  metricsSection.hidden = view === '#servidores';
  serversSection.hidden = view === '#metricas';
}

const initialView = dashboardViews.includes(window.location.hash) ? window.location.hash : '#dashboard';
showDashboardView(initialView);
navItems.forEach(item => {
  if (item.hash === initialView) {
    navItems.forEach(navItem => {
      navItem.classList.remove('active');
      navItem.removeAttribute('aria-current');
    });
    item.classList.add('active');
    item.setAttribute('aria-current', 'page');
  }
});

navItems.forEach(item => {
  item.addEventListener('click', event => {
    const opensConfiguration = item.hash === '#configuracion';
    if (opensConfiguration) {
      event.preventDefault();
    } else {
      showDashboardView(item.hash);
    }

    navItems.forEach(navItem => {
      navItem.classList.remove('active');
      navItem.removeAttribute('aria-current');
    });
    item.classList.add('active');
    item.setAttribute('aria-current', 'page');

    if (opensConfiguration) {
      openDrawer('Configuración general');
    }

    if (window.innerWidth < 1024) {
      sidebar.classList.remove('open');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      menuToggleBtn.setAttribute('aria-label', 'Abrir menú');
      checkBackdropClose();
      if (!opensConfiguration) {
        menuToggleBtn.focus();
      }
    }
  });
});

const tableSearch = document.getElementById('tableSearch');
const serverRows = Array.from(document.querySelectorAll('#serverTable tbody tr'));
const tableResultCount = document.getElementById('tableResultCount');

function filterServers() {
  const query = tableSearch.value.trim().toLocaleLowerCase();
  let visibleRows = 0;

  serverRows.forEach(row => {
    const searchableText = `${row.cells[0].textContent} ${row.cells[1].textContent}`.toLocaleLowerCase();
    const matches = searchableText.includes(query);
    row.hidden = !matches;
    if (matches) {
      visibleRows += 1;
    }
  });

  tableResultCount.textContent = `${visibleRows} de ${serverRows.length} servidores visibles`;
}

tableSearch.addEventListener('input', filterServers);
filterServers();

document.getElementById('drawerForm').addEventListener('input', () => {
  document.getElementById('formMessage').textContent = '';
});
