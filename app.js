const form = document.getElementById("calc-form");
const resetBtn = document.getElementById("reset-btn");
const resultsEl = document.getElementById("results");
const profitEl = document.getElementById("profit");
const marginEl = document.getElementById("margin");
const breakevenEl = document.getElementById("breakeven");
const statusEl = document.getElementById("status");
const resultCards = [...document.querySelectorAll(".result")];

const defaults = {
  price: "",
  rate: "150",
  cost: "",
  fee: "15",
  shipping: "0",
};

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function formatYen(value) {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function formatUsd(value) {
  return `$${Math.round(value).toLocaleString("ja-JP")}`;
}

function setTone(el, value) {
  el.classList.remove("is-positive", "is-negative", "is-neutral");
  if (!Number.isFinite(value)) return;
  if (value > 0) el.classList.add("is-positive");
  else if (value < 0) el.classList.add("is-negative");
  else el.classList.add("is-neutral");
}

function clearResults() {
  profitEl.textContent = "—";
  marginEl.textContent = "—";
  breakevenEl.textContent = "—";
  resultCards.forEach((card) => {
    card.classList.remove("is-positive", "is-negative", "is-neutral");
  });
  statusEl.hidden = true;
  statusEl.textContent = "";
}

function calculate({ price, rate, cost, fee, shipping }) {
  // 元ツール (20170227_benecalc_r3) と同じ計算式
  const profit = Math.round(price * (1 - fee / 100) * rate - cost - shipping);
  const margin = Math.round((profit / (price * rate)) * 100);
  const breakeven = Math.round((cost + shipping) / ((1 - fee / 100) * rate));
  return { profit, margin, breakeven };
}

function readValues() {
  return {
    price: toNumber(form.price.value),
    rate: toNumber(form.rate.value),
    cost: toNumber(form.cost.value),
    fee: toNumber(form.fee.value),
    shipping: toNumber(form.shipping.value || 0),
  };
}

function validate(values) {
  if ([values.price, values.rate, values.cost, values.fee, values.shipping].some((v) => Number.isNaN(v))) {
    return "すべての項目に数値を入力してください。";
  }
  if (values.price <= 0 || values.rate <= 0) {
    return "出品価格とレートは 0 より大きい値にしてください。";
  }
  if (values.fee < 0 || values.fee >= 100) {
    return "手数料は 0% 以上 100% 未満で入力してください。";
  }
  if (values.cost < 0 || values.shipping < 0) {
    return "仕入れ価格と送料は 0 以上で入力してください。";
  }
  return null;
}

function flashResults() {
  resultsEl.classList.remove("is-updated");
  // restart CSS highlight
  void resultsEl.offsetWidth;
  resultsEl.classList.add("is-updated");
  window.setTimeout(() => resultsEl.classList.remove("is-updated"), 1200);
}

function revealResults() {
  if (window.matchMedia("(max-width: 860px)").matches) {
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  flashResults();
}

function render(values, { reveal = false } = {}) {
  const error = validate(values);
  if (error) {
    clearResults();
    statusEl.hidden = false;
    statusEl.textContent = error;
    if (reveal) revealResults();
    return;
  }

  const { profit, margin, breakeven } = calculate(values);

  profitEl.textContent = formatYen(profit);
  marginEl.textContent = formatPercent(margin);
  breakevenEl.textContent = formatUsd(breakeven);

  setTone(resultCards[0], profit);
  setTone(resultCards[1], margin);
  resultCards[2].classList.remove("is-positive", "is-negative", "is-neutral");

  statusEl.hidden = true;
  statusEl.textContent = "";

  if (reveal) revealResults();
}

function syncFromInputs() {
  const values = readValues();
  const filled = [form.price.value, form.cost.value].every((v) => v !== "");
  if (!filled) {
    clearResults();
    return;
  }
  render(values);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  // スマホのキーボードを閉じて結果を見やすくする
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  render(readValues(), { reveal: true });
});

form.addEventListener("input", () => {
  syncFromInputs();
});

resetBtn.addEventListener("click", () => {
  Object.entries(defaults).forEach(([key, value]) => {
    form[key].value = value;
  });
  clearResults();
  form.price.focus();
});

clearResults();
