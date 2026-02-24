import './style.css'
import { initNavbar } from './navbar.js'
import { auth } from './firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

// Micro-animations and interactivity
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  // Welcome Modal Logic
  const welcomeModal = document.getElementById('welcome-modal');
  const welcomeClose = document.getElementById('welcome-close');

  onAuthStateChanged(auth, (user) => {
    // Show modal if not logged in and not seen in this session
    if (!user && !sessionStorage.getItem('welcome_seen')) {
      // Delay slightly for better UX
      setTimeout(() => {
        if (welcomeModal) {
          welcomeModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }, 1500);
    }
  });

  const closeModal = () => {
    if (welcomeModal) {
      welcomeModal.classList.remove('active');
      document.body.style.overflow = '';
      sessionStorage.setItem('welcome_seen', 'true');
    }
  };

  if (welcomeClose) {
    welcomeClose.addEventListener('click', closeModal);
  }

  if (welcomeModal) {
    welcomeModal.addEventListener('click', (e) => {
      if (e.target === welcomeModal) closeModal();
    });
  }

  const cards = document.querySelectorAll('.card');
  // ... rest of intersection observer

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
  });
});

console.log('Rinconcito Animal - Premium Pet Store initialized');
