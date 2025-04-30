document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.panel');

  function switchPanel(panelId) {
    panels.forEach(panel => {
      panel.classList.remove('active');
    });
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    const activePanel = document.getElementById(`${panelId}-panel`);
    const activeNav = document.querySelector(`[data-panel="${panelId}"]`);
    
    activePanel.classList.add('active');
    activeNav.classList.add('active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const panelId = item.dataset.panel;
      switchPanel(panelId);
      
      // Add subtle flash effect on menu click
      item.style.textShadow = '0 0 10px #00fff2';
      setTimeout(() => {
        item.style.textShadow = 'none';
      }, 200);
    });
  });
});
