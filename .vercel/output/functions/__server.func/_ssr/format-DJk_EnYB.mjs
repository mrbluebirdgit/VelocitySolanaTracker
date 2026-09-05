//#region node_modules/.nitro/vite/services/ssr/assets/format-DJk_EnYB.js
function trimFixed(n, digits) {
	return n.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function compact(n) {
	const abs = Math.abs(n);
	const sign = n < 0 ? "-" : "";
	if (abs >= 1e9) return `${sign}${trimFixed(abs / 1e9, 1)}B`;
	if (abs >= 1e6) return `${sign}${trimFixed(abs / 1e6, 1)}M`;
	if (abs >= 1e3) return `${sign}${trimFixed(abs / 1e3, 1)}K`;
	return `${sign}${trimFixed(abs, abs >= 100 ? 0 : 1)}`;
}
function stripEmoji(value) {
	return value.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s+/g, " ").trim();
}
function shortMint(mint, head = 4, tail = 4) {
	if (mint.length <= head + tail + 1) return mint;
	return `${mint.slice(0, head)}…${mint.slice(-tail)}`;
}
function fmtUsd(n, digits = 2) {
	if (n == null || !Number.isFinite(n)) return "—";
	const abs = Math.abs(n);
	const sign = n < 0 ? "-" : "";
	if (abs === 0) return "$0";
	if (abs >= 1e3) return `${sign}$${compact(abs)}`;
	if (abs >= 1) return `${sign}$${abs.toFixed(digits)}`;
	if (abs >= .01) return `${sign}$${abs.toFixed(4)}`;
	return `${sign}$${abs.toPrecision(3)}`;
}
function fmtCompact(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	if (Math.abs(n) < 1e3) return Math.round(n).toString();
	return compact(n);
}
function fmtPct(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	const sign = n > 0 ? "+" : "";
	const abs = Math.abs(n);
	const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
	return `${sign}${n.toFixed(digits)}%`;
}
function fmtAge(ms) {
	if (!Number.isFinite(ms) || ms < 0) return "—";
	const s = Math.floor(ms / 1e3);
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 48) return `${h}h`;
	return `${Math.floor(h / 24)}d`;
}
function dexLabel(id) {
	return {
		"pump-fun": "Pump",
		pumpswap: "PumpSwap",
		pumpfun: "Pump",
		raydium: "Raydium",
		"raydium-clmm": "Raydium",
		"raydium-cpmm": "Raydium",
		orca: "Orca",
		"meteora-dbc": "Meteora",
		"meteora-damm-v2": "Meteora",
		meteora: "Meteora",
		moonshot: "Moonshot",
		jupiter: "Jupiter",
		phoenix: "Phoenix"
	}[id] ?? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function sparkFromChanges(price, changes) {
	if (!Number.isFinite(price) || price <= 0) return [];
	const back = (pct) => price / (1 + pct / 100);
	return [
		back(changes.h24),
		back(changes.h6),
		back(changes.h1),
		back(changes.m30),
		back(changes.m15),
		back(changes.m5),
		price
	].map((v) => Number.isFinite(v) && v > 0 ? v : price);
}
//#endregion
export { fmtUsd as a, stripEmoji as c, fmtPct as i, fmtAge as n, shortMint as o, fmtCompact as r, sparkFromChanges as s, dexLabel as t };
