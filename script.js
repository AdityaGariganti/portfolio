// ═══════════════════════════════════════════════════════════
// SCRIPT.JS — Data Analyst Portfolio
// ═══════════════════════════════════════════════════════════
//
// HOW JAVASCRIPT WORKS (super simple):
//
// document.querySelector('.navbar')
//   → finds the HTML element with class="navbar"
//
// element.classList.add('scrolled')
//   → adds class "scrolled" to that element
//   → which triggers different CSS styles you wrote
//
// element.addEventListener('click', function() { ... })
//   → runs the code inside { } when the element is clicked
//
// ═══════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────
// 1. TYPING ANIMATION (cycles job titles in hero)
//    ✏️ EDIT: Change the words in the titles array
// ─────────────────────────────────────────────────
const typedEl = document.getElementById('heroTyped');

const titles = [
  'Data Analyst',          // ✏️ Change to your titles
  'SQL Developer',
  'BI Developer',
  'Data Storyteller',
];
// ↑ Add/remove items from this list to change what types

let ti = 0;   // which title we are on (index)
let ci = 0;   // which character we are at
let deleting = false;

function runTyping() {
  if (!typedEl) return;  // safety check — stop if element doesn't exist

  const word = titles[ti];  // current word e.g. "Data Analyst"

  if (!deleting) {
    // TYPING: add one letter at a time
    typedEl.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) {
      // Finished typing — wait 2 seconds then start deleting
      setTimeout(() => { deleting = true; }, 2000);
    }
  } else {
    // DELETING: remove one letter at a time
    typedEl.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      // Finished deleting — move to next word
      deleting = false;
      ti = (ti + 1) % titles.length;
      // % titles.length wraps back to 0 after the last title
    }
  }

  // Call this function again after a delay
  // Typing = slower (115ms), Deleting = faster (60ms)
  setTimeout(runTyping, deleting ? 60 : 115);
}

runTyping();  // start the animation!


// ─────────────────────────────────────────────────
// 2. NAVBAR — shrinks when scrolled, highlights
//    current section link
// ─────────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Add 'scrolled' class when scrolled more than 40px
  // This triggers the dark blurred navbar background in CSS
  navbar.classList.toggle('scrolled', scrollY > 40);

  // Highlight the nav link for the section currently on screen
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 140) {
      current = sec.id;
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});


// ─────────────────────────────────────────────────
// 3. MOBILE HAMBURGER MENU
// ─────────────────────────────────────────────────
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  // 'open' class in CSS slides the nav panel in from right

  // Toggle icon between bars and X
  const icon = burger.querySelector('i');
  if (navMenu.classList.contains('open')) {
    icon.className = 'fas fa-times';   // X icon
  } else {
    icon.className = 'fas fa-bars';    // hamburger icon
  }
});

// Close menu when a link is tapped on mobile
navItems.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.querySelector('i').className = 'fas fa-bars';
  });
});


// ─────────────────────────────────────────────────
// 4. SMOOTH SCROLL for all links like href="#about"
// ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();  // stop the browser jumping instantly
      window.scrollTo({
        top: target.offsetTop - 80,  // -80 accounts for fixed navbar
        behavior: 'smooth'
      });
    }
  });
});


// ─────────────────────────────────────────────────
// 5. SCROLL REVEAL ANIMATION
//    Watches elements with class="reveal"
//    Adds class="visible" when they scroll into view
//    CSS then animates them from invisible → visible
// ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
      // unobserve = stop watching after animation plays once
    }
  });
}, { threshold: 0.1 });
// threshold: 0.1 = trigger when 10% of element is visible

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);  // start watching each element
});


// ─────────────────────────────────────────────────
// 6. SKILL BAR ANIMATION
//    Watches skill bars — when visible, fills them
//    to the percentage set in data-w="85" attribute
// ─────────────────────────────────────────────────
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sk-prog').forEach(bar => {
        const pct = bar.getAttribute('data-w');
        // data-w="85" → fills bar to 85%
        bar.style.width = pct + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-block').forEach(block => {
  barObserver.observe(block);
});


// ─────────────────────────────────────────────────
// 7. STAT NUMBER COUNT-UP ANIMATION
//    Counts from 0 up to data-count="50" number
// ─────────────────────────────────────────────────
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-n[data-count]').forEach(el => {
        const target = +el.getAttribute('data-count');
        // + converts string "50" to number 50
        let current = 0;
        const step = Math.max(1, Math.floor(target / 50));
        // step = how much to add each tick

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
          // clearInterval stops the counter when done
        }, 30);  // 30ms between each tick
      });
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) countObserver.observe(heroSection);


// ─────────────────────────────────────────────────
// 8. PROJECT FILTER BUTTONS
//    Clicking "Analysis" hides non-analysis cards
//    Clicking "All" shows everything
// ─────────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.f-btn');
const projCards  = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // Remove 'active' from all buttons, add to clicked one
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = (btn.getAttribute('data-filter') || '').toLowerCase();
    // e.g. "analysis" or "all" (normalized to lowercase)

    projCards.forEach(card => {
      const cats = (card.getAttribute('data-cat') || '').toLowerCase();
      // data-cat="Retail Analysis" → normalized to "retail analysis"

      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        // show the card
      } else {
        card.classList.add('hidden');
        // hide the card (CSS sets display:none for .hidden)
      }
    });
  });
});


// ─────────────────────────────────────────────────
// 9. CONTACT FORM — button feedback on submit
// ─────────────────────────────────────────────────
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', () => {
    // Change button text to show it was clicked
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    submitBtn.style.background   = '#22c55e';  // green
    submitBtn.style.borderColor  = '#22c55e';
    submitBtn.style.pointerEvents = 'none';    // prevent double submit

    // Reset button after 4 seconds
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.style.background   = '';
      submitBtn.style.borderColor  = '';
      submitBtn.style.pointerEvents = '';
    }, 4000);
    // Form still submits to Formspree normally — don't add e.preventDefault()
  });
}


// ─────────────────────────────────────────────────
// 10. AUTO-UPDATE FOOTER YEAR
// ─────────────────────────────────────────────────
const yearEl = document.getElementById('footerYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
  // Shows current year automatically — no manual update needed!
}
