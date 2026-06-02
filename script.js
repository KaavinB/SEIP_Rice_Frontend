(function () {
  'use strict';

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Mobile menu toggle ----------
  var menuBtn = document.querySelector('.menu-btn');
  var primaryMenu = document.getElementById('primary-menu');
  if (menuBtn && primaryMenu) {
    menuBtn.addEventListener('click', function () {
      var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      primaryMenu.hidden = expanded;
    });
    primaryMenu.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        menuBtn.setAttribute('aria-expanded', 'false');
        primaryMenu.hidden = true;
      }
    });
  }

  // ---------- Assistant interactions ----------
  var form = document.getElementById('assistantForm');
  var input = document.getElementById('assistantInput');
  var transcript = document.getElementById('assistantTranscript');
  var chips = document.querySelectorAll('.prompt-chip');

  function appendMessage(text, who) {
    if (!transcript) return;
    var wrap = document.createElement('div');
    wrap.className = 'assistant__msg ' + (who === 'user' ? 'assistant__msg--user' : 'assistant__msg--bot');

    var avatar = document.createElement('div');
    avatar.className = 'assistant__avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = who === 'user' ? 'You' : 'RA';

    var bubble = document.createElement('div');
    bubble.className = 'assistant__bubble';
    var p = document.createElement('p');
    p.textContent = text;
    bubble.appendChild(p);

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    transcript.appendChild(wrap);
    transcript.scrollTop = transcript.scrollHeight;
  }

  function botReplyFor(prompt) {
    var p = prompt.toLowerCase();
    if (p.indexOf('compare') !== -1 && p.indexOf('national') !== -1) {
      return 'Comparing the current applicant pool to national IPEDS benchmarks: representation of women in CS applicants is 28%, 4 points below the national PhD-graduate average (32%). I can draft a one-page summary for the committee — would you like me to include the institution-tier breakdown as well?';
    }
    if (p.indexOf('diversity') !== -1) {
      return 'Across the 18 active searches, applicant demographics skew toward Top-25 PhD institutions (62%). Representation of historically underrepresented groups is 19%, on par with last cycle. The Statistics and ECE searches show the most diverse pools.';
    }
    if (p.indexOf('strongest') !== -1 || p.indexOf('match') !== -1) {
      return 'Top pipeline matches for the Assistant Professor of Computational Materials search: 7 candidates within Rice peer-institution range with publication records overlapping the search criteria. I will queue these for committee review in Interfolio.';
    }
    if (p.indexOf('report') !== -1 || p.indexOf('generate') !== -1) {
      return 'Drafting a hiring report covering the current cycle: 18 searches, 1,247 applicants, 41 longlists, 12 shortlists. I will include peer benchmarking and pipeline equity metrics. The draft will land in your VPAA inbox.';
    }
    return 'I will look into "' + prompt + '" against Interfolio, IPEDS and Rice HR. Sample findings will appear here once the data layer responds.';
  }

  function handlePrompt(text) {
    if (!text || !text.trim()) return;
    appendMessage(text.trim(), 'user');
    setTimeout(function () {
      appendMessage(botReplyFor(text.trim()), 'bot');
    }, 450);
  }

  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      handlePrompt(v);
      input.value = '';
      input.focus();
    });
  }
  if (chips && chips.length) {
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function () {
        handlePrompt(chip.textContent || '');
      });
    });
  }
})();
