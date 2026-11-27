(() => {
  const c = window.WEDDING_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const set = (id, value) => { if ($(id) && value !== undefined && value !== null) $(id).textContent = value; };

  set("coverGroom", c.groomShort); set("coverBride", c.brideShort);
  set("groomName", c.groomFull); set("brideName", c.brideFull);
  set("groomParents", `Bapak ${c.groomFather}`);
  set("brideParents", `Bapak ${c.brideFather}`);

  const ceremony = c.ceremony || {}, reception = c.reception || {};
  set("ceremonyTime", ceremony.time); set("ceremonyVenue", ceremony.venue); set("ceremonyAddress", ceremony.address);
  set("receptionTime", reception.time); set("receptionVenue", reception.venue); set("receptionAddress", reception.address);
  if ($("ceremonyMaps")) $("ceremonyMaps").href = ceremony.mapsUrl || "#";
  if ($("receptionMaps")) $("receptionMaps").href = reception.mapsUrl || "#";

  const params = new URLSearchParams(location.search);
  const guest = params.get("to");
  if (guest) set("guestName", guest.replace(/\+/g, " "));

  const stamp = d => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendarUrl = (title, start, end, venue, address) => {
    const details = `Undangan ${title} Fabi & Oca. ${venue}. ${address}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${stamp(start)}/${stamp(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(`${venue}, ${address}`)}`;
  };
  if ($("calendarLink")) $("calendarLink").href = calendarUrl("Holy Matrimony Fabi & Oca", c.ceremonyStart, c.ceremonyEnd, ceremony.venue, ceremony.address);
  if ($("receptionCalendarLink")) $("receptionCalendarLink").href = calendarUrl("Resepsi Pernikahan Fabi & Oca", c.receptionStart, c.receptionEnd, reception.venue, reception.address);

  const weddingDate = new Date(`${c.weddingDateISO || "2026-12-30"}T00:00:00+07:00`);
  const countdown = () => {
    let diff = weddingDate.getTime() - Date.now();
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000), h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000 / 60000), s = Math.floor(diff % 60000 / 1000);
    set("days", String(d).padStart(3, "0")); set("hours", String(h).padStart(2, "0"));
    set("minutes", String(m).padStart(2, "0")); set("seconds", String(s).padStart(2, "0"));
  };
  countdown(); setInterval(countdown, 1000);

  const invitationContent = document.querySelectorAll("main > :not(.cover)");
  invitationContent.forEach(section => { section.inert = true; });

  $("openInvitation").addEventListener("click", () => {
    document.body.classList.add("opened");
    invitationContent.forEach(section => { section.inert = false; });
    $("couple").scrollIntoView({ behavior: "smooth" });
    const music = $("bgMusic");
    if (music && music.querySelector("source")?.getAttribute("src")) music.play().then(() => $("musicButton").classList.add("playing")).catch(() => {});
  });

  const music = $("bgMusic");
  $("musicButton").addEventListener("click", async () => {
    if (music.paused) { try { await music.play(); $("musicButton").classList.add("playing"); } catch {} }
    else { music.pause(); $("musicButton").classList.remove("playing"); }
  });

  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const number = button.dataset.copy || "";
      try { await navigator.clipboard.writeText(number); button.textContent = "Nomor rekening tersalin"; }
      catch { button.textContent = `Salin manual: ${number}`; }
    });
  });

  const revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  const form = $("rsvpForm"), status = $("formStatus"), wishes = $("wishesList");
  const rsvpLoading = $("rsvpLoading"), submitButton = form.querySelector('button[type="submit"]');
  const renderWishes = (items) => {
    wishes.innerHTML = "";
    if (!items || !items.length) return;
    items.slice().reverse().forEach(item => {
      if (!item.message) return;
      const card = document.createElement("article"); card.className = "wish-card";
      const name = document.createElement("strong"); name.textContent = item.name || "Tamu";
      const msg = document.createElement("p"); msg.textContent = item.message;
      card.append(name, msg); wishes.append(card);
    });
  };
  async function loadWishes() {
    if (!c.appsScriptUrl) return;
    try {
      const res = await fetch(`${c.appsScriptUrl}?action=wishes`, { cache: "no-store" });
      const data = await res.json(); if (data.ok) renderWishes(data.wishes || []);
    } catch {}
  }
  loadWishes(); if (c.appsScriptUrl) setInterval(loadWishes, 20000);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!c.appsScriptUrl) { status.textContent = "Konfirmasi belum dapat dikirim saat ini."; return; }
    const data = Object.fromEntries(new FormData(form).entries());
    status.textContent = "Mengirim konfirmasi...";
    submitButton.disabled = true;
    rsvpLoading.showModal();
    try {
      const response = await fetch(c.appsScriptUrl, { method: "POST", body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }) });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "Gagal mengirim");
      status.textContent = "Terima kasih! Konfirmasi dan ucapan Anda berhasil dikirim.";
      form.reset(); await loadWishes();
    } catch {
      status.textContent = "Belum berhasil mengirim. Periksa koneksi atau konfigurasi Apps Script.";
    } finally {
      rsvpLoading.close();
      submitButton.disabled = false;
    }
  });

  window.addEventListener("load", () => setTimeout(() => $("loadingScreen").classList.add("hidden"), 650));
})();