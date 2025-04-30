document.addEventListener('DOMContentLoaded', () => {
  // Add lock screen check
  const lockScreen = document.querySelector('.lock-screen');
  const container = document.querySelector('.container');
  const fingerprintScanner = document.querySelector('.fingerprint-scanner');
  let isUnlocked = false;

  function unlockSystem() {
    if (!isUnlocked) {
      fingerprintScanner.classList.add('scanning');
      
      setTimeout(() => {
        lockScreen.classList.add('unlocked');
        container.classList.add('unlocked');
        isUnlocked = true;
        
        // Store unlock state
        sessionStorage.setItem('systemUnlocked', 'true');
        
        showNotification('SYSTEM UNLOCKED');
      }, 1500);
    }
  }

  // Check if system was previously unlocked in this session
  if (sessionStorage.getItem('systemUnlocked') === 'true') {
    unlockSystem();
  }

  fingerprintScanner.addEventListener('click', unlockSystem);

  // Add random glitch effect to hexagons
  const hexagons = document.querySelectorAll('.hexagon');
  
  function randomGlitch() {
    hexagons.forEach(hex => {
      if (Math.random() > 0.9) {
        hex.style.transform = 'scale(1.2)';
        hex.style.background = '#00fff277';
        
        setTimeout(() => {
          hex.style.transform = 'scale(1)';
          hex.style.background = '#00fff211';
        }, 150);
      }
    });
  }

  // Run glitch effect periodically
  setInterval(randomGlitch, 1000);

  // Add interactive hover effects
  document.querySelector('.hud').addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    
    document.querySelector('.hud').style.transform = 
      `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });

  // Reset transform when mouse leaves
  document.querySelector('.hud').addEventListener('mouseleave', () => {
    document.querySelector('.hud').style.transform = 
      'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });

  // Add settings functionality
  const modeSelect = document.querySelector('.futuristic-select');
  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      const mode = e.target.value;
      document.body.setAttribute('data-mode', mode.toLowerCase());
    });
  }

  // Add system card hover effects
  const systemCards = document.querySelectorAll('.system-card');
  systemCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add system card interaction effects
  systemCards.forEach(card => {
    // Random status updates
    setInterval(() => {
      const detailValues = card.querySelectorAll('.detail-value');
      detailValues.forEach(value => {
        if (Math.random() > 0.7) {
          value.style.color = '#00fff2';
          setTimeout(() => {
            value.style.color = '';
          }, 200);
        }
      });
    }, 2000);

    // Add button click effects
    const buttons = card.querySelectorAll('.system-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 200);
      });
    });
  });

  // Add log rotation
  const logs = [
    "ROUTINE MAINTENANCE COMPLETED",
    "NETWORK OPTIMIZATION IN PROGRESS",
    "DEFENSE PROTOCOLS UPDATED",
    "POWER LEVELS NORMALIZED",
    "SYSTEM SCAN COMPLETED",
    "BANDWIDTH ALLOCATION ADJUSTED",
    "SECURITY PATCH INSTALLED",
    "BACKUP SYSTEMS VERIFIED"
  ];

  const systemLogs = document.querySelector('.system-logs');
  if (systemLogs) {
    setInterval(() => {
      const newLog = logs[Math.floor(Math.random() * logs.length)];
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.textContent = newLog;
      
      systemLogs.insertBefore(logEntry, systemLogs.firstChild);
      if (systemLogs.children.length > 3) {
        systemLogs.removeChild(systemLogs.lastChild);
      }
    }, 5000);
  }

  // Initialize WebSocket connection
  const room = new WebsimSocket();

  // Load saved settings when available
  room.collection('settings').subscribe(function(settings) {
    if (settings && settings.length > 0) {
      const userSettings = settings[0];
      applySettings(userSettings);
    } else {
      // Create default settings if none exist
      createDefaultSettings();
    }
  });

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  async function createDefaultSettings() {
    const defaultSettings = {
      systemMode: 'NORMAL',
      autoRepair: true,
      powerLimit: 80,
      securityLevel: 'HIGH',
      notifications: true,
      maintenance: 'AUTOMATIC',
      networkOptimization: true,
      backupFrequency: 'DAILY',
      performanceMode: 'BALANCED',
      debugMode: false
    };
    
    try {
      await room.collection('settings').create(defaultSettings);
      showNotification('Default settings initialized');
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  }

  async function updateSettings(updates) {
    try {
      const settings = room.collection('settings').getList();
      if (settings && settings.length > 0) {
        await room.collection('settings').update(settings[0].id, updates);
        showNotification('Settings updated');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  }

  function applySettings(settings) {
    // Update UI elements with saved settings
    document.querySelector('.futuristic-select').value = settings.systemMode;
    document.querySelector('input[type="checkbox"]').checked = settings.autoRepair;
    
    // Update new settings
    document.getElementById('powerLimit').value = settings.powerLimit;
    document.getElementById('powerLimitValue').textContent = settings.powerLimit + '%';
    
    document.getElementById('securityLevel').value = settings.securityLevel;
    document.getElementById('notifications').checked = settings.notifications;
    document.getElementById('maintenance').value = settings.maintenance;
    document.getElementById('networkOptimization').checked = settings.networkOptimization;
    document.getElementById('backupFrequency').value = settings.backupFrequency;
    document.getElementById('performanceMode').value = settings.performanceMode;
    document.getElementById('debugMode').checked = settings.debugMode;
  }

  // Add settings event listeners
  document.getElementById('systemMode').addEventListener('change', e => {
    updateSettings({ systemMode: e.target.value });
  });

  document.getElementById('autoRepair').addEventListener('change', e => {
    updateSettings({ autoRepair: e.target.checked });
  });

  document.getElementById('powerLimit').addEventListener('change', e => {
    const value = parseInt(e.target.value);
    document.getElementById('powerLimitValue').textContent = value + '%';
    updateSettings({ powerLimit: value });
  });

  document.getElementById('securityLevel').addEventListener('change', e => {
    updateSettings({ securityLevel: e.target.value });
  });

  document.getElementById('notifications').addEventListener('change', e => {
    updateSettings({ notifications: e.target.checked });
  });

  document.getElementById('maintenance').addEventListener('change', e => {
    updateSettings({ maintenance: e.target.value });
  });

  document.getElementById('networkOptimization').addEventListener('change', e => {
    updateSettings({ networkOptimization: e.target.checked });
  });

  document.getElementById('backupFrequency').addEventListener('change', e => {
    updateSettings({ backupFrequency: e.target.value });
  });

  document.getElementById('performanceMode').addEventListener('change', e => {
    updateSettings({ performanceMode: e.target.value });
  });

  document.getElementById('debugMode').addEventListener('change', e => {
    updateSettings({ debugMode: e.target.checked });
  });
});
