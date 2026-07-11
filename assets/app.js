(() => {
  "use strict";

  const root = document.documentElement;
  const metaDescription = document.getElementById("meta-description");
  const languageButtons = [...document.querySelectorAll("[data-set-lang]")];
  const themeToggle = document.getElementById("theme-toggle");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileNav = document.getElementById("mobile-nav");
  const toast = document.getElementById("toast");

  const uiText = {
    ko: {
      title: "NPNCB Vulnerability Lab — Deflate 은닉 취약점",
      description: "Deflate의 NPNCB 은닉 취약점과 DBA 비트 채널, 적응형 C# PoC, 탐지·정규화 방안을 설명하는 한·영 연구 페이지입니다.",
      copied: "클립보드에 복사했습니다.",
      copyFailed: "복사하지 못했습니다.",
      fits: "수용 가능 + 종료자",
      exact: "정확히 수용 · 종료자 없음",
      truncated: (bytes) => `${bytes}바이트까지 절단`,
      empty: "빈 메시지",
      bits: "bits",
      bytes: "bytes",
      theme: "색상 테마 전환",
      menuOpen: "메뉴 닫기",
      menuClosed: "메뉴 열기"
    },
    en: {
      title: "NPNCB Vulnerability Lab — Hidden Bits in DEFLATE",
      description: "A bilingual visual guide to the NPNCB/DBA covert channel in DEFLATE, with an adaptive C# proof of concept and defensive guidance.",
      copied: "Copied to the clipboard.",
      copyFailed: "Copy failed.",
      fits: "fits + terminator",
      exact: "exact fit · no terminator",
      truncated: (bytes) => `truncated to ${bytes} bytes`,
      empty: "empty message",
      bits: "bits",
      bytes: "bytes",
      theme: "Toggle color theme",
      menuOpen: "Close menu",
      menuClosed: "Open menu"
    }
  };

  const safeStorage = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* no-op */ }
    }
  };

  function currentLanguage() {
    return root.lang === "en" ? "en" : "ko";
  }

  function selectInitialLanguage() {
    const queryLanguage = new URLSearchParams(location.search).get("lang");
    if (queryLanguage === "ko" || queryLanguage === "en") return queryLanguage;
    const storedLanguage = safeStorage.get("npncb-language");
    if (storedLanguage === "ko" || storedLanguage === "en") return storedLanguage;
    return navigator.language?.toLowerCase().startsWith("ko") ? "ko" : "en";
  }

  function setLanguage(language, updateUrl = true) {
    const lang = language === "en" ? "en" : "ko";
    root.lang = lang;
    document.title = uiText[lang].title;
    metaDescription?.setAttribute("content", uiText[lang].description);
    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLang === lang));
    });
    themeToggle?.setAttribute("aria-label", uiText[lang].theme);
    mobileMenuButton?.setAttribute(
      "aria-label",
      mobileMenuButton.getAttribute("aria-expanded") === "true" ? uiText[lang].menuOpen : uiText[lang].menuClosed
    );
    safeStorage.set("npncb-language", lang);

    if (updateUrl) {
      try {
        const url = new URL(location.href);
        url.searchParams.set("lang", lang);
        history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      } catch {
        // Some local preview contexts expose an opaque origin. The language
        // switch still works; only the shareable query string is skipped.
      }
    }
    updateCapacityLab();
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.setLang));
  });

  function selectInitialTheme() {
    const storedTheme = safeStorage.get("npncb-theme");
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return "dark";
  }

  function setTheme(theme) {
    const normalized = theme === "light" ? "light" : "dark";
    root.dataset.theme = normalized;
    safeStorage.set("npncb-theme", normalized);
  }

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  function closeMobileMenu() {
    if (!mobileMenuButton || !mobileNav) return;
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", uiText[currentLanguage()].menuClosed);
    mobileNav.hidden = true;
  }

  mobileMenuButton?.addEventListener("click", () => {
    const open = mobileMenuButton.getAttribute("aria-expanded") !== "true";
    mobileMenuButton.setAttribute("aria-expanded", String(open));
    mobileMenuButton.setAttribute("aria-label", open ? uiText[currentLanguage()].menuOpen : uiText[currentLanguage()].menuClosed);
    if (mobileNav) mobileNav.hidden = !open;
  });
  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

  const revealElements = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  const navTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-25% 0px -65%", threshold: [0, 0.1, 0.35] });
    navTargets.forEach((section) => sectionObserver.observe(section));
  }

  const startOffsetInput = document.getElementById("start-offset");
  const blockCountInput = document.getElementById("block-count");
  const sampleMessageInput = document.getElementById("sample-message");
  const startOffsetOutput = document.getElementById("start-offset-output");
  const blockCountOutput = document.getElementById("block-count-output");
  const bitCells = document.getElementById("bit-cells");
  const dbaPerBlockOutput = document.getElementById("dba-per-block");
  const totalCapacityOutput = document.getElementById("total-capacity");
  const wholeByteCapacityOutput = document.getElementById("whole-byte-capacity");
  const messageFitOutput = document.getElementById("message-fit");
  const textEncoder = new TextEncoder();

  function validUtf8PrefixLength(text, maximumBytes) {
    let used = 0;
    for (const symbol of text) {
      const size = textEncoder.encode(symbol).length;
      if (used + size > maximumBytes) break;
      used += size;
    }
    return used;
  }

  function updateBitCells(start, alignedEnd) {
    if (!bitCells) return;
    bitCells.textContent = "";
    const headerEnd = start + 3;
    for (let index = 0; index < 16; index += 1) {
      const cell = document.createElement("span");
      cell.className = "bit-cell";
      cell.setAttribute("aria-label", `bit ${index}`);
      if (index < start) {
        cell.classList.add("previous");
        cell.textContent = "·";
      } else if (index < headerEnd) {
        cell.classList.add("header");
        cell.textContent = index === start ? "F" : "T";
      } else if (index < alignedEnd) {
        cell.classList.add("dba");
        cell.textContent = "D";
      } else if (index < alignedEnd + 16) {
        cell.classList.add("next");
        cell.textContent = "L";
      } else {
        cell.classList.add("unused");
        cell.textContent = "·";
      }
      bitCells.appendChild(cell);
    }
  }

  function updateCapacityLab() {
    if (!startOffsetInput || !blockCountInput || !sampleMessageInput) return;
    const lang = currentLanguage();
    const start = Number(startOffsetInput.value);
    const count = Number(blockCountInput.value);
    const afterHeader = start + 3;
    const alignedEnd = afterHeader % 8 === 0 ? afterHeader : Math.ceil(afterHeader / 8) * 8;
    const dbaBits = alignedEnd - afterHeader;
    const totalBits = dbaBits * count;
    const wholeBytes = Math.floor(totalBits / 8);
    const message = sampleMessageInput.value;
    const messageBytes = textEncoder.encode(message).length;
    const prefixBytes = validUtf8PrefixLength(message, wholeBytes);

    if (startOffsetOutput) startOffsetOutput.value = String(start);
    if (blockCountOutput) blockCountOutput.value = String(count);
    if (dbaPerBlockOutput) dbaPerBlockOutput.textContent = `${dbaBits} ${uiText[lang].bits}`;
    if (totalCapacityOutput) totalCapacityOutput.textContent = `${totalBits.toLocaleString()} ${uiText[lang].bits}`;
    if (wholeByteCapacityOutput) wholeByteCapacityOutput.textContent = `${wholeBytes.toLocaleString()} ${uiText[lang].bytes}`;

    if (messageFitOutput) {
      messageFitOutput.classList.remove("fit-good", "fit-tight", "fit-bad");
      if (messageBytes === 0) {
        messageFitOutput.textContent = uiText[lang].empty;
        messageFitOutput.classList.add("fit-good");
      } else if (messageBytes < wholeBytes) {
        messageFitOutput.textContent = uiText[lang].fits;
        messageFitOutput.classList.add("fit-good");
      } else if (messageBytes === wholeBytes) {
        messageFitOutput.textContent = uiText[lang].exact;
        messageFitOutput.classList.add("fit-tight");
      } else {
        messageFitOutput.textContent = uiText[lang].truncated(prefixBytes);
        messageFitOutput.classList.add("fit-bad");
      }
    }
    updateBitCells(start, alignedEnd);
  }

  [startOffsetInput, blockCountInput, sampleMessageInput].forEach((control) => {
    control?.addEventListener("input", updateCapacityLab);
  });

  let toastTimer = 0;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
  }

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const directValue = button.getAttribute("data-copy");
      const targetId = button.getAttribute("data-copy-target");
      const targetValue = targetId ? document.getElementById(targetId)?.innerText : null;
      const value = directValue ?? targetValue ?? "";
      try {
        await navigator.clipboard.writeText(value);
        showToast(uiText[currentLanguage()].copied);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        textarea.remove();
        showToast(ok ? uiText[currentLanguage()].copied : uiText[currentLanguage()].copyFailed);
      }
    });
  });

  setTheme(selectInitialTheme());
  setLanguage(selectInitialLanguage(), false);
  updateCapacityLab();
})();
