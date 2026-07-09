/* DietaPlan — lógica principal */
(() => {
"use strict";

const STORE_KEY = "dietaplan.v1";
const MEALS = [
  { id: "breakfast", name: "Desayuno", emoji: "🍳" },
  { id: "lunch", name: "Almuerzo", emoji: "🍲" },
  { id: "dinner", name: "Cena", emoji: "🥗" },
  { id: "snack", name: "Snacks", emoji: "🍎" },
];
const GLASS_ML = 250;

// ---------- Estado ----------
let state = load();
let currentDate = todayKey();
let currentTab = "today";
let sheetCtx = { meal: "breakfast", food: null };
let deferredInstall = null;

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* datos corruptos: empezar de cero */ }
  return { profile: null, goals: null, days: {}, weights: [], customFoods: [], recent: [] };
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

function todayKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
function shiftDate(key, days) {
  const d = new Date(key + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function getDay(key) {
  if (!state.days[key]) {
    state.days[key] = { meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, water: 0 };
  }
  return state.days[key];
}

// ---------- Cálculo de plan ----------
function computePlan(p) {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "male" ? 5 : -161);
  const tdee = bmr * p.activity;
  let kcal = tdee;
  if (p.goal === "lose") kcal = Math.max(tdee - 500, p.sex === "male" ? 1500 : 1200);
  if (p.goal === "gain") kcal = tdee + 300;
  kcal = Math.round(kcal / 10) * 10;

  const proteinG = Math.round(p.weight * (p.goal === "lose" ? 1.8 : 1.6));
  const fatG = Math.round((kcal * 0.28) / 9);
  const carbsG = Math.max(0, Math.round((kcal - proteinG * 4 - fatG * 9) / 4));
  const waterMl = Math.round((p.weight * 35) / GLASS_ML) * GLASS_ML;
  return { kcal, protein: proteinG, carbs: carbsG, fat: fatG, water: waterMl };
}

// ---------- Utilidades DOM ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add("hidden"), 2200);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

// ---------- Onboarding ----------
const ob = { step: 0, data: {} };
function showOnboarding() {
  $("#onboarding").classList.remove("hidden");
  $("#app").classList.add("hidden");
  renderObStep();
}
function renderObStep() {
  $$(".ob-step").forEach((s) => s.classList.toggle("hidden", +s.dataset.step !== ob.step));
  $("#obProgressBar").style.width = `${((ob.step + 1) / 5) * 100}%`;
  if (ob.step === 4) {
    const plan = computePlan(ob.data);
    ob.data.plan = plan;
    $("#obResultRing").innerHTML = `${plan.kcal}<small>kcal / día</small>`;
    $("#obMacros").innerHTML =
      `<span>🥩 ${plan.protein} g proteína</span><span>🍞 ${plan.carbs} g carbos</span><span>🥑 ${plan.fat} g grasas</span>`;
  }
}
function obNext() { ob.step = Math.min(4, ob.step + 1); renderObStep(); }

function bindOnboarding() {
  $$("[data-ob-next]").forEach((b) => b.addEventListener("click", () => {
    if (ob.step === 2) {
      const age = +$("#obAge").value, height = +$("#obHeight").value, weight = +$("#obWeight").value;
      if (!ob.data.sex) return toast("Elige tu sexo");
      if (!(age >= 14 && age <= 99)) return toast("Introduce una edad válida");
      if (!(height >= 120 && height <= 230)) return toast("Introduce una altura válida");
      if (!(weight >= 30 && weight <= 300)) return toast("Introduce un peso válido");
      Object.assign(ob.data, { age, height, weight });
    }
    obNext();
  }));
  const bindChoices = (containerId, key, autoNext) => {
    $(`#${containerId}`).addEventListener("click", (e) => {
      const btn = e.target.closest(".choice");
      if (!btn) return;
      $$(`#${containerId} .choice`).forEach((c) => c.classList.toggle("selected", c === btn));
      ob.data[key] = key === "activity" ? +btn.dataset.value : btn.dataset.value;
      if (autoNext) setTimeout(obNext, 180);
    });
  };
  bindChoices("obGoal", "goal", true);
  bindChoices("obSex", "sex", false);
  bindChoices("obActivity", "activity", true);

  $("#obFinish").addEventListener("click", () => {
    const { plan, ...profile } = ob.data;
    state.profile = profile;
    state.goals = plan;
    state.weights.push({ date: todayKey(), kg: profile.weight });
    save();
    startApp();
  });
}

// ---------- App: pestaña Hoy ----------
function dayTotals(key) {
  const day = getDay(key);
  const t = { kcal: 0, p: 0, c: 0, f: 0 };
  for (const m of MEALS) for (const it of day.meals[m.id]) {
    t.kcal += it.kcal; t.p += it.p; t.c += it.c; t.f += it.f;
  }
  return t;
}

function renderDateNav() {
  const isToday = currentDate === todayKey();
  const d = new Date(currentDate + "T12:00:00");
  const label = isToday ? "Hoy" : d.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
  $("#dateLabel").textContent = label;
  $("#dateNext").disabled = isToday;
  $("#dateNext").style.opacity = isToday ? ".35" : "1";
}

function renderRing() {
  const goals = state.goals;
  const t = dayTotals(currentDate);
  const eaten = Math.round(t.kcal);
  const remaining = Math.round(goals.kcal - eaten);
  const frac = Math.min(1, eaten / goals.kcal);
  const over = eaten > goals.kcal;

  const R = 82, C = 2 * Math.PI * R;
  const stroke = over ? "var(--danger)" : "var(--brand)";
  $("#kcalRing").innerHTML = `
    <circle cx="100" cy="100" r="${R}" fill="none" stroke="var(--line)" stroke-width="14"/>
    <circle cx="100" cy="100" r="${R}" fill="none" stroke="${stroke}" stroke-width="14"
      stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - frac)}"
      transform="rotate(-90 100 100)" style="transition: stroke-dashoffset .4s"/>`;
  $("#kcalRemaining").textContent = Math.abs(remaining);
  $("#kcalRemainingLabel").textContent = over ? "kcal de más" : "kcal restantes";
  $("#kcalGoal").textContent = goals.kcal;
  $("#kcalEaten").textContent = eaten;
}

function renderMacros() {
  const g = state.goals;
  const t = dayTotals(currentDate);
  const defs = [
    { name: "Proteínas", val: t.p, goal: g.protein, color: "var(--protein)" },
    { name: "Carbohidratos", val: t.c, goal: g.carbs, color: "var(--carbs)" },
    { name: "Grasas", val: t.f, goal: g.fat, color: "var(--fat)" },
  ];
  $("#macroBars").innerHTML = defs.map((m) => `
    <div class="macro">
      <span class="macro-name">${m.name}</span>
      <div class="macro-track"><div class="macro-fill" style="width:${Math.min(100, (m.val / m.goal) * 100)}%;background:${m.color}"></div></div>
      <span class="macro-val">${Math.round(m.val)} / ${m.goal} g</span>
    </div>`).join("");
}

function renderWater() {
  const day = getDay(currentDate);
  const goalGlasses = Math.max(1, Math.round(state.goals.water / GLASS_ML));
  $("#waterLabel").textContent = `${day.water * GLASS_ML} / ${state.goals.water} ml`;
  $("#waterGlasses").innerHTML = Array.from({ length: Math.max(goalGlasses, day.water) },
    (_, i) => `<span class="water-glass ${i < day.water ? "full" : ""}">💧</span>`).join("");
}

function renderMeals() {
  const day = getDay(currentDate);
  $("#mealList").innerHTML = MEALS.map((m) => {
    const items = day.meals[m.id];
    const kcal = Math.round(items.reduce((s, it) => s + it.kcal, 0));
    const rows = items.length
      ? items.map((it, i) => `
          <div class="meal-item">
            <div class="meal-item-name">${esc(it.name)}<small>${esc(it.qtyLabel)}</small></div>
            <span class="meal-item-kcal">${Math.round(it.kcal)} kcal</span>
            <button class="del" data-meal="${m.id}" data-idx="${i}" aria-label="Eliminar ${esc(it.name)}">✕</button>
          </div>`).join("")
      : `<div class="meal-empty">Sin alimentos aún</div>`;
    return `
      <div class="card meal-card">
        <div class="meal-head">
          <div><strong>${m.emoji} ${m.name}</strong> <small>· ${kcal} kcal</small></div>
          <button class="btn btn-small" data-add-meal="${m.id}">+ Añadir</button>
        </div>
        <div class="meal-items">${rows}</div>
      </div>`;
  }).join("");
}

function renderToday() {
  renderDateNav();
  renderRing();
  renderMacros();
  renderWater();
  renderMeals();
}

// ---------- Hoja: añadir alimento ----------
function allFoods() { return [...state.customFoods, ...FOODS_DB]; }

function openFoodSheet(mealId) {
  sheetCtx.meal = mealId || "breakfast";
  sheetCtx.food = null;
  showSheetView("foodSearchView");
  $("#foodSearch").value = "";
  renderMealPicker();
  renderFoodResults("");
  $("#sheetBackdrop").classList.remove("hidden");
  $("#foodSheet").classList.remove("hidden");
  setTimeout(() => $("#foodSearch").focus(), 250);
}
function closeSheets() {
  $("#sheetBackdrop").classList.add("hidden");
  $("#foodSheet").classList.add("hidden");
  $("#weightSheet").classList.add("hidden");
}
function showSheetView(id) {
  $$("#foodSheet .sheet-view").forEach((v) => v.classList.toggle("hidden", v.id !== id));
}
function renderMealPicker() {
  $("#mealPicker").innerHTML = MEALS.map((m) =>
    `<button class="meal-chip ${m.id === sheetCtx.meal ? "selected" : ""}" data-meal="${m.id}">${m.emoji} ${m.name}</button>`).join("");
}
function renderFoodResults(query) {
  const q = query.trim().toLowerCase();
  let list;
  if (q) {
    list = allFoods().filter((f) => f.name.toLowerCase().includes(q));
  } else {
    const recent = state.recent.map((id) => allFoods().find((f) => f.id === id)).filter(Boolean);
    const rest = allFoods().filter((f) => !state.recent.includes(f.id));
    list = [...recent, ...rest];
  }
  list = list.slice(0, 60);
  $("#foodResults").innerHTML = list.length
    ? list.map((f) => `
        <button class="food-row" data-food="${f.id}">
          <div class="food-row-name">${esc(f.name)}<small>${f.unit ? `1 ${esc(f.unit)} ≈ ${f.unitG} g · ` : ""}${f.kcal} kcal / 100 g</small></div>
          <span class="food-row-kcal">${f.unit ? Math.round((f.kcal * f.unitG) / 100) + " kcal/" + esc(f.unit) : ""}</span>
        </button>`).join("")
    : `<div class="food-none">Sin resultados. Puedes crear el alimento abajo.</div>`;
}

function openFoodDetail(food) {
  sheetCtx.food = food;
  showSheetView("foodDetailView");
  $("#detailName").textContent = food.name;
  const qty = food.unitG || 100;
  $("#detailQty").value = qty;
  const chips = [
    food.unitG ? { label: `1 ${food.unit}`, g: food.unitG } : null,
    food.unitG ? { label: `2 ${food.unit}`, g: food.unitG * 2 } : null,
    { label: "50 g", g: 50 }, { label: "100 g", g: 100 }, { label: "200 g", g: 200 },
  ].filter(Boolean);
  $("#qtyChips").innerHTML = chips.map((c) => `<button class="meal-chip" data-g="${c.g}">${c.label}</button>`).join("");
  renderDetailMacros();
}
function renderDetailMacros() {
  const f = sheetCtx.food;
  const g = Math.max(0, +$("#detailQty").value || 0);
  const k = g / 100;
  $("#detailMacros").innerHTML = `
    <div><strong>${Math.round(f.kcal * k)}</strong><small>kcal</small></div>
    <div><strong>${(f.p * k).toFixed(1)}</strong><small>prot. g</small></div>
    <div><strong>${(f.c * k).toFixed(1)}</strong><small>carb. g</small></div>
    <div><strong>${(f.f * k).toFixed(1)}</strong><small>gras. g</small></div>`;
}
function confirmAddFood() {
  const f = sheetCtx.food;
  const g = +$("#detailQty").value;
  if (!(g > 0 && g <= 5000)) return toast("Cantidad no válida");
  const k = g / 100;
  let qtyLabel = `${g} g`;
  if (f.unitG && Math.abs(g / f.unitG - Math.round(g / f.unitG)) < 0.01) {
    const units = Math.round(g / f.unitG);
    qtyLabel = `${units} ${f.unit}${units > 1 ? "s" : ""} (${g} g)`;
  }
  getDay(currentDate).meals[sheetCtx.meal].push({
    foodId: f.id, name: f.name, g, qtyLabel,
    kcal: f.kcal * k, p: f.p * k, c: f.c * k, f: f.f * k,
  });
  state.recent = [f.id, ...state.recent.filter((id) => id !== f.id)].slice(0, 8);
  save();
  closeSheets();
  renderToday();
  toast(`${f.name} añadido ✓`);
}

function bindFoodSheet() {
  $("#fabAdd").addEventListener("click", () => { switchTab("today"); openFoodSheet(suggestMeal()); });
  $("#mealList").addEventListener("click", (e) => {
    const add = e.target.closest("[data-add-meal]");
    if (add) return openFoodSheet(add.dataset.addMeal);
    const del = e.target.closest(".del");
    if (del) {
      getDay(currentDate).meals[del.dataset.meal].splice(+del.dataset.idx, 1);
      save(); renderToday();
    }
  });
  $("#closeSheet").addEventListener("click", closeSheets);
  $("#sheetBackdrop").addEventListener("click", closeSheets);
  $("#foodSearch").addEventListener("input", (e) => renderFoodResults(e.target.value));
  $("#mealPicker").addEventListener("click", (e) => {
    const chip = e.target.closest(".meal-chip");
    if (!chip) return;
    sheetCtx.meal = chip.dataset.meal;
    renderMealPicker();
  });
  $("#foodResults").addEventListener("click", (e) => {
    const row = e.target.closest(".food-row");
    if (!row) return;
    openFoodDetail(allFoods().find((f) => f.id === row.dataset.food));
  });
  $("#backToSearch").addEventListener("click", () => showSheetView("foodSearchView"));
  $("#detailQty").addEventListener("input", renderDetailMacros);
  $("#qtyChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-g]");
    if (!chip) return;
    $("#detailQty").value = chip.dataset.g;
    renderDetailMacros();
  });
  $("#confirmAdd").addEventListener("click", confirmAddFood);

  // Alimento propio
  $("#newFoodBtn").addEventListener("click", () => showSheetView("customFoodView"));
  $("#backFromCustom").addEventListener("click", () => showSheetView("foodSearchView"));
  $("#customFoodForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const food = {
      id: "custom-" + Date.now(),
      name: $("#cfName").value.trim(),
      kcal: +$("#cfKcal").value, p: +$("#cfProtein").value || 0,
      c: +$("#cfCarbs").value || 0, f: +$("#cfFat").value || 0,
    };
    state.customFoods.unshift(food);
    save();
    e.target.reset();
    openFoodDetail(food);
    toast("Alimento guardado ✓");
  });
}
function suggestMeal() {
  const h = new Date().getHours();
  if (h < 11) return "breakfast";
  if (h < 16) return "lunch";
  if (h < 21) return "dinner";
  return "snack";
}

// ---------- Progreso: gráficas SVG ----------
const fmtDay = (key) => new Date(key + "T12:00:00").toLocaleDateString("es", { day: "numeric", month: "short" });

function chartTooltip(show, x, y, html) {
  const tip = $("#chartTooltip");
  if (!show) return tip.classList.add("hidden");
  tip.innerHTML = html;
  tip.style.left = x + "px";
  tip.style.top = y + "px";
  tip.classList.remove("hidden");
}
function bindChartHover(container) {
  container.addEventListener("pointerover", (e) => {
    const m = e.target.closest("[data-tip]");
    if (!m) return;
    const r = m.getBoundingClientRect();
    chartTooltip(true, r.left + r.width / 2, r.top, m.dataset.tip);
  });
  container.addEventListener("pointerout", () => chartTooltip(false));
}

function renderWeightChart() {
  const wrap = $("#weightChart");
  const data = [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  if (data.length < 2) {
    wrap.innerHTML = `<div class="chart-empty">Registra tu peso al menos dos días para ver la tendencia.</div>`;
    return;
  }
  const W = 480, H = 200, pad = { l: 40, r: 14, t: 14, b: 26 };
  const xs = (i) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const vals = data.map((d) => d.kg);
  const min = Math.floor(Math.min(...vals) - 1), max = Math.ceil(Math.max(...vals) + 1);
  const ys = (v) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);

  const gridLines = [min, (min + max) / 2, max].map((v) =>
    `<line x1="${pad.l}" x2="${W - pad.r}" y1="${ys(v)}" y2="${ys(v)}" stroke="var(--line)" stroke-width="1"/>
     <text x="${pad.l - 6}" y="${ys(v) + 4}" text-anchor="end" font-size="10" fill="var(--ink-3)">${v % 1 ? v.toFixed(1) : v}</text>`).join("");
  const path = data.map((d, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)},${ys(d.kg).toFixed(1)}`).join(" ");
  const dots = data.map((d, i) => `
    <circle cx="${xs(i)}" cy="${ys(d.kg)}" r="4" fill="var(--chart-series)" stroke="var(--surface)" stroke-width="2"
      data-tip="<strong>${d.kg} kg</strong> · ${fmtDay(d.date)}"/>
    <circle cx="${xs(i)}" cy="${ys(d.kg)}" r="12" fill="transparent" data-tip="<strong>${d.kg} kg</strong> · ${fmtDay(d.date)}"/>`).join("");
  const xLabels = [0, data.length - 1].map((i) =>
    `<text x="${xs(i)}" y="${H - 8}" text-anchor="${i ? "end" : "start"}" font-size="10" fill="var(--ink-3)">${fmtDay(data[i].date)}</text>`).join("");

  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del peso corporal">
    ${gridLines}
    <path d="${path}" fill="none" stroke="var(--chart-series)" stroke-width="2" stroke-linejoin="round"/>
    ${dots}${xLabels}
  </svg>`;
}

function renderKcalChart() {
  const wrap = $("#kcalChart");
  const days = Array.from({ length: 7 }, (_, i) => shiftDate(todayKey(), i - 6));
  const data = days.map((k) => ({ key: k, kcal: Math.round(dayTotals(k).kcal) }));
  if (data.every((d) => d.kcal === 0)) {
    wrap.innerHTML = `<div class="chart-empty">Aún no hay comidas registradas esta semana.</div>`;
    return;
  }
  const goal = state.goals.kcal;
  const W = 480, H = 200, pad = { l: 40, r: 14, t: 18, b: 26 };
  const max = Math.max(goal, ...data.map((d) => d.kcal)) * 1.1;
  const ys = (v) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const band = (W - pad.l - pad.r) / 7;
  const barW = Math.min(34, band - 8);

  const bars = data.map((d, i) => {
    const x = pad.l + i * band + (band - barW) / 2;
    const y = ys(d.kcal), h = Math.max(0, H - pad.b - y);
    const dow = new Date(d.key + "T12:00:00").toLocaleDateString("es", { weekday: "narrow" });
    const tip = `data-tip="<strong>${d.kcal} kcal</strong> · ${fmtDay(d.key)}"`;
    let bar = "";
    if (h > 4) {
      bar = `<path d="M${x},${H - pad.b} v${-(h - 4)} q0,-4 4,-4 h${barW - 8} q4,0 4,4 v${h - 4} z" fill="var(--chart-series)" ${tip}/>`;
    } else if (h > 0) {
      bar = `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="var(--chart-series)" ${tip}/>`;
    }
    return `${bar}
      <rect x="${pad.l + i * band}" y="${pad.t}" width="${band}" height="${H - pad.t - pad.b}" fill="transparent" ${tip}/>
      <text x="${x + barW / 2}" y="${H - 8}" text-anchor="middle" font-size="10" fill="var(--ink-3)">${dow}</text>`;
  }).join("");

  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Calorías consumidas en los últimos 7 días">
    <line x1="${pad.l}" x2="${W - pad.r}" y1="${H - pad.b}" y2="${H - pad.b}" stroke="var(--line)"/>
    ${bars}
    <line x1="${pad.l}" x2="${W - pad.r}" y1="${ys(goal)}" y2="${ys(goal)}" stroke="var(--chart-ref)" stroke-width="1.5" stroke-dasharray="5 4"/>
    <text x="${W - pad.r}" y="${ys(goal) - 5}" text-anchor="end" font-size="10" fill="var(--ink-2)">Objetivo ${goal}</text>
  </svg>`;
}

function renderStats() {
  const weights = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const first = weights[0], last = weights[weights.length - 1];
  const delta = first && last ? (last.kg - first.kg) : 0;
  const days7 = Array.from({ length: 7 }, (_, i) => shiftDate(todayKey(), i - 6));
  const logged = days7.filter((k) => dayTotals(k).kcal > 0);
  const avg = logged.length ? Math.round(logged.reduce((s, k) => s + dayTotals(k).kcal, 0) / logged.length) : 0;
  let streak = 0;
  for (let i = 0; ; i++) {
    if (dayTotals(todayKey(-i)).kcal > 0) streak++;
    else if (i === 0) continue; // hoy puede estar vacío aún sin romper la racha
    else break;
    if (i > 365) break;
  }
  $("#statRow").innerHTML = `
    <div class="stat-tile"><strong>${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg</strong><small>cambio de peso</small></div>
    <div class="stat-tile"><strong>${avg}</strong><small>kcal media (7 días)</small></div>
    <div class="stat-tile"><strong>${streak} 🔥</strong><small>días de racha</small></div>`;
}

function renderProgress() { renderWeightChart(); renderKcalChart(); renderStats(); }

// ---------- Perfil ----------
function renderProfile() {
  const p = state.profile;
  $("#pfSex").value = p.sex;
  $("#pfAge").value = p.age;
  $("#pfHeight").value = p.height;
  $("#pfWeight").value = p.weight;
  $("#pfActivity").value = String(p.activity);
  $("#pfGoal").value = p.goal;
  $("#pfKcal").value = state.goals.kcal;
}
function bindProfile() {
  $("#profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.profile = {
      sex: $("#pfSex").value, age: +$("#pfAge").value, height: +$("#pfHeight").value,
      weight: +$("#pfWeight").value, activity: +$("#pfActivity").value, goal: $("#pfGoal").value,
    };
    state.goals = computePlan(state.profile);
    save();
    renderProfile();
    renderToday();
    toast(`Nuevo plan: ${state.goals.kcal} kcal/día`);
  });
  $("#saveKcalBtn").addEventListener("click", () => {
    const kcal = +$("#pfKcal").value;
    if (!(kcal >= 800 && kcal <= 6000)) return toast("Valor fuera de rango");
    state.goals.kcal = kcal;
    save(); renderToday();
    toast("Calorías actualizadas ✓");
  });
  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = el("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dietaplan-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("¿Borrar todos tus datos? Esta acción no se puede deshacer.")) return;
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(API_KEY_STORE);
    location.reload();
  });
}

// ---------- Foto IA (API de Claude) ----------
const API_KEY_STORE = "dietaplan.apikey";
let photoImage = null;   // { data (base64 sin prefijo), mediaType }
let photoFoods = [];

function getApiKey() { return localStorage.getItem(API_KEY_STORE) || ""; }

const PHOTO_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    foods: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", description: "Nombre del alimento en español" },
          grams: { type: "number", description: "Peso estimado de la porción en gramos" },
          kcal: { type: "number", description: "Calorías totales de esa porción" },
          protein: { type: "number", description: "Proteínas totales en gramos" },
          carbs: { type: "number", description: "Carbohidratos totales en gramos" },
          fat: { type: "number", description: "Grasas totales en gramos" },
        },
        required: ["name", "grams", "kcal", "protein", "carbs", "fat"],
      },
    },
    comment: { type: "string", description: "Comentario breve sobre el plato o aviso si no se ve comida" },
  },
  required: ["foods", "comment"],
};

function openPhotoView() {
  showSheetView("photoView");
  photoImage = null;
  photoFoods = [];
  $("#photoPreview").classList.add("hidden");
  $("#analyzeBtn").classList.add("hidden");
  $("#photoStatus").classList.add("hidden");
  $("#photoResults").classList.add("hidden");
  const hasKey = !!getApiKey();
  $("#photoKeySetup").classList.toggle("hidden", hasKey);
  $("#photoCapture").classList.toggle("hidden", !hasKey);
}

// Reduce la imagen (máx. 1024 px) y devuelve base64 JPEG para abaratar el análisis
function preparePhoto(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      const k = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * k);
      canvas.height = Math.round(img.height * k);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      resolve({ data: dataUrl.split(",")[1], mediaType: "image/jpeg", dataUrl });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("No se pudo leer la imagen")); };
    img.src = url;
  });
}

async function analyzePhoto() {
  if (!photoImage) return;
  const status = $("#photoStatus");
  status.classList.remove("hidden");
  status.innerHTML = `<span class="spinner"></span><br>Analizando tu plato…`;
  $("#analyzeBtn").disabled = true;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": getApiKey(),
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 2000,
        output_config: { format: { type: "json_schema", schema: PHOTO_SCHEMA } },
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: photoImage.mediaType, data: photoImage.data } },
            { type: "text", text: "Analiza esta foto de un plato de comida. Identifica cada alimento visible, estima el peso de su porción en gramos y calcula sus valores nutricionales TOTALES para esa porción (kcal, proteínas, carbohidratos y grasas en gramos). Usa nombres en español. Si la imagen no muestra comida, devuelve foods vacío y explícalo en comment." },
          ],
        }],
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const msg = err?.error?.message || `Error ${res.status}`;
      if (res.status === 401) throw new Error("Clave de API no válida. Revísala en Perfil.");
      throw new Error(msg);
    }
    const data = await res.json();
    if (data.stop_reason === "refusal") throw new Error("La IA no pudo procesar esta imagen.");
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const parsed = JSON.parse(text);
    photoFoods = (parsed.foods || []).filter((f) => f.name && f.kcal >= 0);
    renderPhotoResults(parsed.comment || "");
  } catch (e) {
    status.innerHTML = `⚠️ ${esc(e.message || "No se pudo analizar la foto")}`;
  } finally {
    $("#analyzeBtn").disabled = false;
  }
}

function renderPhotoResults(comment) {
  $("#photoStatus").classList.add("hidden");
  $("#photoCapture").classList.add("hidden");
  $("#photoResults").classList.remove("hidden");
  $("#photoComment").textContent = comment;
  if (!photoFoods.length) {
    $("#photoFoodList").innerHTML = `<div class="food-none">No se detectaron alimentos en la foto.</div>`;
    $("#addPhotoFoods").classList.add("hidden");
    return;
  }
  const total = Math.round(photoFoods.reduce((s, f) => s + f.kcal, 0));
  $("#addPhotoFoods").classList.remove("hidden");
  $("#addPhotoFoods").textContent = `Añadir todo (${total} kcal)`;
  $("#photoFoodList").innerHTML = photoFoods.map((f, i) => `
    <div class="food-row">
      <div class="food-row-name">${esc(f.name)}<small>≈ ${Math.round(f.grams)} g · P ${f.protein.toFixed(0)} · C ${f.carbs.toFixed(0)} · G ${f.fat.toFixed(0)}</small></div>
      <span class="food-row-kcal">${Math.round(f.kcal)} kcal</span>
      <button class="del" data-photo-idx="${i}" aria-label="Quitar ${esc(f.name)}">✕</button>
    </div>`).join("");
}

function bindPhoto() {
  $("#photoBtn").addEventListener("click", openPhotoView);
  $("#backFromPhoto").addEventListener("click", () => showSheetView("foodSearchView"));
  $("#saveApiKeyBtn").addEventListener("click", () => {
    const key = $("#apiKeyInput").value.trim();
    if (!key.startsWith("sk-ant-")) return toast("La clave debe empezar por sk-ant-");
    localStorage.setItem(API_KEY_STORE, key);
    $("#apiKeyInput").value = "";
    openPhotoView();
    toast("Clave guardada ✓");
  });
  $("#takePhotoBtn").addEventListener("click", () => $("#photoInput").click());
  $("#photoInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      photoImage = await preparePhoto(file);
      $("#photoPreview").src = photoImage.dataUrl;
      $("#photoPreview").classList.remove("hidden");
      $("#analyzeBtn").classList.remove("hidden");
      $("#photoStatus").classList.add("hidden");
    } catch (err) {
      toast(err.message);
    }
    e.target.value = "";
  });
  $("#analyzeBtn").addEventListener("click", analyzePhoto);
  $("#photoFoodList").addEventListener("click", (e) => {
    const del = e.target.closest("[data-photo-idx]");
    if (!del) return;
    photoFoods.splice(+del.dataset.photoIdx, 1);
    renderPhotoResults($("#photoComment").textContent);
  });
  $("#addPhotoFoods").addEventListener("click", () => {
    const day = getDay(currentDate);
    for (const f of photoFoods) {
      day.meals[sheetCtx.meal].push({
        foodId: null, name: f.name, g: Math.round(f.grams),
        qtyLabel: `≈ ${Math.round(f.grams)} g · foto IA`,
        kcal: f.kcal, p: f.protein, c: f.carbs, f: f.fat,
      });
    }
    save();
    closeSheets();
    renderToday();
    toast(`${photoFoods.length} alimento${photoFoods.length > 1 ? "s" : ""} añadido${photoFoods.length > 1 ? "s" : ""} ✓`);
  });
  $("#retryPhoto").addEventListener("click", () => {
    $("#photoResults").classList.add("hidden");
    openPhotoView();
  });
  $("#clearApiKeyBtn").addEventListener("click", () => {
    localStorage.removeItem(API_KEY_STORE);
    renderApiKeyStatus();
    toast("Clave eliminada");
  });
}
function renderApiKeyStatus() {
  const hasKey = !!getApiKey();
  $("#aiKeyStatus").textContent = hasKey
    ? "Clave de API configurada ✓ — el análisis de fotos está activo."
    : "Sin clave de API configurada. Añádela al analizar tu primera foto.";
  $("#clearApiKeyBtn").classList.toggle("hidden", !hasKey);
}

// ---------- Peso ----------
function bindWeight() {
  $("#addWeightBtn").addEventListener("click", () => {
    $("#weightInput").value = state.profile.weight;
    $("#sheetBackdrop").classList.remove("hidden");
    $("#weightSheet").classList.remove("hidden");
  });
  $("#closeWeightSheet").addEventListener("click", closeSheets);
  $("#saveWeightBtn").addEventListener("click", () => {
    const kg = +$("#weightInput").value;
    if (!(kg >= 30 && kg <= 300)) return toast("Peso no válido");
    state.weights = state.weights.filter((w) => w.date !== todayKey());
    state.weights.push({ date: todayKey(), kg });
    state.profile.weight = kg;
    save();
    closeSheets();
    renderProgress();
    toast("Peso registrado ✓");
  });
}

// ---------- Navegación ----------
function switchTab(tab) {
  currentTab = tab;
  $$(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  $$(".tab").forEach((t) => t.classList.toggle("hidden", t.id !== `tab-${tab}`));
  $("#dateNav").style.visibility = tab === "today" ? "visible" : "hidden";
  if (tab === "progress") renderProgress();
  if (tab === "profile") { renderProfile(); renderApiKeyStatus(); }
  window.scrollTo({ top: 0 });
}
function bindNav() {
  $$(".nav-btn").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
  $("#datePrev").addEventListener("click", () => { currentDate = shiftDate(currentDate, -1); renderToday(); });
  $("#dateNext").addEventListener("click", () => {
    if (currentDate === todayKey()) return;
    currentDate = shiftDate(currentDate, 1); renderToday();
  });
  $("#dateLabel").addEventListener("click", () => { currentDate = todayKey(); renderToday(); });
  $("#waterPlus").addEventListener("click", () => { getDay(currentDate).water++; save(); renderWater(); });
  $("#waterMinus").addEventListener("click", () => {
    const day = getDay(currentDate);
    day.water = Math.max(0, day.water - 1);
    save(); renderWater();
  });
}

// ---------- PWA ----------
function bindPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstall = e;
    $("#installBtn").classList.remove("hidden");
  });
  $("#installBtn").addEventListener("click", async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
    $("#installBtn").classList.add("hidden");
  });
  window.addEventListener("appinstalled", () => toast("¡App instalada! 🎉"));
}

// ---------- Arranque ----------
function startApp() {
  $("#onboarding").classList.add("hidden");
  $("#app").classList.remove("hidden");
  renderToday();
}
function init() {
  bindOnboarding();
  bindNav();
  bindFoodSheet();
  bindPhoto();
  bindWeight();
  bindProfile();
  bindPWA();
  bindChartHover($("#weightChart"));
  bindChartHover($("#kcalChart"));
  if (state.profile && state.goals) startApp();
  else showOnboarding();
}
init();
})();
