// Script d'installation PWA pour Garibobo Agenda
// Compatible avec tous les navigateurs

(function() {
  'use strict';

  let deferredPrompt;
  let installButton;

  // Détection du navigateur
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isSamsungInternet = /SamsungBrowser/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true ||
                       window.matchMedia('(display-mode: minimal-ui)').matches;

  console.log('[PWA] Détection navigateur:', {
    isIOS,
    isAndroid,
    isSafari,
    isSamsungInternet,
    isStandalone
  });

  // Si déjà installé, ne rien faire
  if (isStandalone) {
    console.log('[PWA] Application déjà installée');
    return;
  }

  // Créer le bouton d'installation
  function createInstallButton() {
    if (installButton) return;

    installButton = document.createElement('div');
    installButton.id = 'pwa-install-prompt';
    installButton.innerHTML = `
      <style>
        #pwa-install-prompt {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: #0175C2;
          padding: 15px 25px;
          border-radius: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 15px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: slideUp 0.3s ease-out;
          max-width: 90%;
        }

        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        #pwa-install-prompt .icon {
          font-size: 24px;
        }

        #pwa-install-prompt .content {
          flex: 1;
        }

        #pwa-install-prompt .title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
        }

        #pwa-install-prompt .subtitle {
          font-size: 13px;
          opacity: 0.7;
        }

        #pwa-install-prompt .buttons {
          display: flex;
          gap: 10px;
        }

        #pwa-install-prompt button {
          padding: 8px 20px;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        #pwa-install-prompt .install-btn {
          background: #0175C2;
          color: white;
        }

        #pwa-install-prompt .install-btn:hover {
          background: #0155A0;
          transform: scale(1.05);
        }

        #pwa-install-prompt .close-btn {
          background: transparent;
          color: #666;
        }

        #pwa-install-prompt .close-btn:hover {
          background: #f0f0f0;
        }

        @media (max-width: 600px) {
          #pwa-install-prompt {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          #pwa-install-prompt .buttons {
            width: 100%;
            flex-direction: column;
          }

          #pwa-install-prompt button {
            width: 100%;
          }
        }
      </style>
      <div class="icon">📱</div>
      <div class="content">
        <div class="title">Installer Garibobo Agenda</div>
        <div class="subtitle">Accès rapide depuis votre écran d'accueil</div>
      </div>
      <div class="buttons">
        <button class="install-btn">Installer</button>
        <button class="close-btn">Plus tard</button>
      </div>
    `;

    document.body.appendChild(installButton);

    // Bouton installer
    installButton.querySelector('.install-btn').addEventListener('click', () => {
      if (isIOS) {
        showIOSInstructions();
      } else if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] Installation acceptée');
          }
          deferredPrompt = null;
          hideInstallButton();
        });
      }
    });

    // Bouton fermer
    installButton.querySelector('.close-btn').addEventListener('click', () => {
      hideInstallButton();
      // Ne plus afficher pendant 7 jours
      localStorage.setItem('pwa-install-dismissed', Date.now());
    });
  }

  function hideInstallButton() {
    if (installButton) {
      installButton.style.animation = 'slideDown 0.3s ease-out';
      setTimeout(() => {
        installButton.remove();
        installButton = null;
      }, 300);
    }
  }

  // Instructions pour iOS
  function showIOSInstructions() {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <style>
        .ios-install-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          padding: 20px;
          animation: fadeIn 0.3s;
        }

        .ios-install-content {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 400px;
          text-align: center;
          color: #333;
        }

        .ios-install-content h2 {
          color: #0175C2;
          margin-bottom: 20px;
        }

        .ios-install-content .step {
          margin: 20px 0;
          text-align: left;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 10px;
        }

        .ios-install-content .step-number {
          display: inline-block;
          width: 30px;
          height: 30px;
          background: #0175C2;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 30px;
          margin-right: 10px;
          font-weight: bold;
        }

        .ios-install-content button {
          margin-top: 20px;
          padding: 12px 30px;
          background: #0175C2;
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
        }
      </style>
      <div class="ios-install-modal">
        <div class="ios-install-content">
          <h2>📱 Installation sur iOS</h2>
          <div class="step">
            <span class="step-number">1</span>
            Appuyez sur le bouton Partager <strong>⎙</strong>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            Faites défiler et sélectionnez<br><strong>"Sur l'écran d'accueil"</strong>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            Appuyez sur <strong>"Ajouter"</strong>
          </div>
          <button onclick="this.closest('.ios-install-modal').remove()">
            Compris !
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Écouter l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt déclenché');
    e.preventDefault();
    deferredPrompt = e;

    // Vérifier si l'utilisateur n'a pas déjà refusé
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed || Date.now() - dismissed > 7 * 24 * 60 * 60 * 1000) {
      setTimeout(createInstallButton, 3000); // Afficher après 3 secondes
    }
  });

  // Pour iOS, afficher le bouton après un délai
  if (isIOS && !isStandalone) {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed || Date.now() - dismissed > 7 * 24 * 60 * 60 * 1000) {
      setTimeout(createInstallButton, 5000);
    }
  }

  // Détecter l'installation réussie
  window.addEventListener('appinstalled', (evt) => {
    console.log('[PWA] Application installée avec succès');
    hideInstallButton();
    
    // Afficher un message de succès
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
      <style>
        .install-success {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #4CAF50;
          color: white;
          padding: 15px 30px;
          border-radius: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      </style>
      <div class="install-success">
        ✅ Application installée avec succès !
      </div>
    `;
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
  });

  // Vérifier les mises à jour du Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            showUpdateNotification();
          }
        });
      });
    });
  }

  function showUpdateNotification() {
    const updateMsg = document.createElement('div');
    updateMsg.innerHTML = `
      <style>
        .update-notification {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #FF9800;
          color: white;
          padding: 15px 25px;
          border-radius: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .update-notification button {
          padding: 8px 20px;
          background: white;
          color: #FF9800;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
        }
      </style>
      <div class="update-notification">
        <span>🔄 Nouvelle version disponible !</span>
        <button onclick="window.location.reload()">Mettre à jour</button>
      </div>
    `;
    document.body.appendChild(updateMsg);
  }

  console.log('[PWA] Script d\'installation chargé');
})();
