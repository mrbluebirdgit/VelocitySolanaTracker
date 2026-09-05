import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as fmtUsd, i as fmtPct, n as fmtAge, o as shortMint, r as fmtCompact, s as sparkFromChanges } from "./format-DJk_EnYB.mjs";
import { a as Search, c as ExternalLink, d as Activity, i as Star, l as Copy, n as X, o as Radio, s as Funnel, t as Zap, u as Bell } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as getWatchTokens, i as getPoolChart, n as Route, o as searchMarket, r as getMarket } from "./router-D3FTNr8I.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhReqhm9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { tone: {
		mute: "bg-elevated text-muted",
		accent: "bg-accent/15 text-accent",
		up: "bg-up/15 text-up",
		down: "bg-down/15 text-down",
		warn: "bg-warn/15 text-warn",
		hot: "bg-accent text-accent-fg"
	} },
	defaultVariants: { tone: "mute" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			ghost: "bg-transparent text-fg hover:bg-elevated",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			subtle: "bg-elevated text-fg hover:bg-surface",
			danger: "bg-down/15 text-down hover:bg-down/25"
		},
		size: {
			default: "h-10 rounded-[var(--radius-sm)] px-3.5 text-sm",
			sm: "h-8 rounded-[var(--radius-xs)] px-2.5 text-xs",
			lg: "h-11 rounded-[var(--radius-md)] px-4 text-sm",
			icon: "size-10 rounded-[var(--radius-sm)]",
			"icon-sm": "size-8 rounded-[var(--radius-xs)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Input = (0, import_react.forwardRef)(function Input({ className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref,
		className: cn("h-10 w-full rounded-[var(--radius-sm)] bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)]", "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--color-accent)]", className),
		...props
	});
});
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-[var(--radius-sm)] bg-elevated", className) });
}
var useWatchlist = create()(persist((set, get) => ({
	items: [],
	alerts: [],
	toggle: (item) => {
		set({ items: get().items.some((i) => i.mint === item.mint) ? get().items.filter((i) => i.mint !== item.mint) : [{
			...item,
			addedAt: Date.now()
		}, ...get().items].slice(0, 24) });
	},
	has: (mint) => get().items.some((i) => i.mint === mint),
	pushAlert: (alert) => {
		const id = `${alert.mint}-${alert.kind}-${Math.floor(Date.now() / 3e4)}`;
		if (get().alerts.some((a) => a.id === id)) return;
		set({ alerts: [{
			...alert,
			id,
			at: Date.now()
		}, ...get().alerts].slice(0, 40) });
	},
	clearAlerts: () => set({ alerts: [] })
}), { name: "velocity-watch" }));
function hue(mint) {
	let h = 0;
	for (let i = 0; i < mint.length; i++) h = (h * 31 + mint.charCodeAt(i)) % 360;
	return h;
}
function TokenAvatar({ mint, symbol, image, size = "md" }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const dim = size === "lg" ? "size-12" : size === "sm" ? "size-7" : "size-9";
	const letters = (symbol.replace(/[^A-Za-z0-9]/g, "") || "?").slice(0, 2).toUpperCase();
	const showImg = image && !failed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative shrink-0 overflow-hidden rounded-full bg-elevated", dim),
		style: showImg ? void 0 : { background: `hsl(${hue(mint)} 18% 18%)` },
		children: showImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: image,
			alt: "",
			className: "size-full object-cover",
			crossOrigin: "anonymous",
			onError: () => setFailed(true)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-full items-center justify-center font-mono text-[10px] font-medium text-fg/80",
			children: letters
		})
	});
}
function PressureBar({ value, className }) {
	const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-w-16 items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-1.5 flex-1 overflow-hidden rounded-full bg-down/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-y-0 left-0 rounded-full bg-up",
				style: { width: `${pct}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "num w-8 text-right font-mono text-[10px] text-muted",
			children: [pct, "%"]
		})]
	});
}
function Sparkline({ price, changes, className = "h-8 w-24" }) {
	const pts = sparkFromChanges(price, changes);
	if (pts.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className });
	const min = Math.min(...pts);
	const span = Math.max(...pts) - min || 1;
	const w = 96;
	const h = 32;
	const d = pts.map((p, i) => {
		const x = i / (pts.length - 1) * w;
		const y = h - (p - min) / span * 28 - 2;
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	const up = pts[pts.length - 1] >= pts[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: up ? "var(--color-up)" : "var(--color-down)",
			strokeWidth: "1.6",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function VolumeBars({ volumes }) {
	const vals = [
		volumes.m5,
		volumes.m15,
		volumes.m30,
		volumes.h1,
		volumes.h6,
		volumes.h24
	];
	const max = Math.max(...vals, 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-6 items-end gap-0.5",
		"aria-hidden": "true",
		children: vals.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-1 rounded-sm bg-accent/70",
			style: {
				height: `${Math.max(12, v / max * 100)}%`,
				opacity: .35 + i / 6 * .65
			}
		}, i))
	});
}
function copy(text, label) {
	navigator.clipboard.writeText(text);
	toast.success(`Copied ${label}`);
}
var LINKS = (mint) => [
	{
		label: "DexScreener",
		href: `https://dexscreener.com/solana/${mint}`
	},
	{
		label: "Jupiter",
		href: `https://jup.ag/swap/SOL-${mint}`
	},
	{
		label: "Photon",
		href: `https://photon-sol.tinyastro.io/en/lp/${mint}`
	},
	{
		label: "GMGN",
		href: `https://gmgn.ai/sol/token/${mint}`
	}
];
function TokenPanel({ token, onClose }) {
	const watched = useWatchlist((s) => s.has(token.mint));
	const toggle = useWatchlist((s) => s.toggle);
	const chart = useQuery({
		queryKey: ["chart", token.pool],
		queryFn: () => getPoolChart({ data: { pool: token.pool } }),
		staleTime: 2e4
	});
	const fallback = sparkFromChanges(token.priceUsd, token.changes).map((p, i) => ({
		t: i,
		p,
		v: 0
	}));
	const data = (chart.data && chart.data.length > 2 ? chart.data : fallback).map((d) => ({
		...d,
		label: "t" in d && d.t > 1e4 ? new Date(d.t).toLocaleTimeString() : ""
	}));
	const up = token.changes.m5 >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full flex-col bg-surface shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start gap-3 p-4 pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenAvatar, {
						mint: token.mint,
						symbol: token.symbol,
						image: token.image,
						size: "lg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-lg font-medium tracking-tight",
									children: token.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: token.heat === "hot" ? "hot" : token.heat === "warm" ? "accent" : "mute",
									children: token.heat
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-muted",
								children: token.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => copy(token.mint, "mint"),
								className: "mt-1 flex items-center gap-1 font-mono text-[11px] text-subtle hover:text-fg",
								children: [shortMint(token.mint, 6, 6), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: watched ? "default" : "outline",
							size: "icon-sm",
							"aria-label": watched ? "Remove from watchlist" : "Watch",
							onClick: () => toggle({
								mint: token.mint,
								symbol: token.symbol,
								name: token.name
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: watched ? "fill-current" : "" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Close",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Price",
						value: fmtUsd(token.priceUsd),
						tone: up ? "up" : "down"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "5m",
						value: fmtPct(token.changes.m5),
						tone: up ? "up" : "down"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Score",
						value: String(token.score)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Liq",
						value: fmtUsd(token.liquidity)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "FDV",
						value: fmtUsd(token.fdv)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Age",
						value: fmtAge(token.ageMs)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-36 px-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data,
						margin: {
							top: 8,
							right: 12,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "px",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--color-accent)",
									stopOpacity: .28
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--color-accent)",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								hide: true,
								domain: ["auto", "auto"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-elevated)",
									border: "1px solid var(--color-border)",
									borderRadius: 8,
									fontSize: 12
								},
								formatter: (v) => [fmtUsd(v), "Price"],
								labelFormatter: () => ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "p",
								stroke: "var(--color-accent)",
								fill: "url(#px)",
								strokeWidth: 1.6,
								isAnimationActive: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 space-y-3 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-[11px] uppercase tracking-wider text-subtle",
							children: "Buy pressure 5m"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PressureBar, { value: token.pressure }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-[11px] text-muted",
							children: [
								token.w5m.buys,
								" buys / ",
								token.w5m.sells,
								" sells · ",
								token.w5m.buyers,
								" buyers"
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								k: "Vol 5m",
								v: fmtUsd(token.w5m.volume)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								k: "Vol 1h",
								v: fmtUsd(token.w1h.volume)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								k: "Vol 24h",
								v: fmtUsd(token.w24h.volume)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								k: "Tx 5m",
								v: String(token.w5m.buys + token.w5m.sells)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								k: "1h",
								v: fmtPct(token.changes.h1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								k: "24h",
								v: fmtPct(token.changes.h24)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] uppercase tracking-wider text-subtle",
							children: token.dex
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
							price: token.priceUsd,
							changes: token.changes
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-2 px-4",
				children: LINKS(token.mint).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: l.href,
					target: "_blank",
					rel: "noreferrer",
					className: "flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-elevated text-xs font-medium text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
					children: [l.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3 text-muted" })]
				}, l.label))
			}),
			(token.socials.length > 0 || token.websites.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2 px-4",
				children: [token.websites.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: u,
					target: "_blank",
					rel: "noreferrer",
					className: "text-xs text-accent hover:underline",
					children: "Site"
				}, u)), token.socials.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: s.url,
					target: "_blank",
					rel: "noreferrer",
					className: "text-xs text-accent hover:underline",
					children: s.platform
				}, s.url))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-auto p-4 text-[11px] leading-relaxed text-subtle",
				children: "Traffic score weights 5-minute volume acceleration, unique takers, buy pressure, and liquidity. Not financial advice — Solana prints faster than this screen."
			})
		]
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-sm)] bg-elevated px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-wider text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `num mt-0.5 font-mono text-sm font-medium ${tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg"}`,
			children: value
		})]
	});
}
function Mini({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-xs)] bg-bg px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-wider text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-0.5 font-mono text-xs",
			children: v
		})]
	});
}
var TABS = [
	{
		id: "pulse",
		label: "Pulse"
	},
	{
		id: "new",
		label: "New"
	},
	{
		id: "boosted",
		label: "Boosted"
	},
	{
		id: "watch",
		label: "Watch"
	}
];
var FILTERS = [
	{
		id: "raw",
		label: "Raw",
		value: {
			minLiq: 0,
			minVol: 0,
			maxAgeH: 0
		}
	},
	{
		id: "flow",
		label: "Flow",
		value: {
			minLiq: 1e3,
			minVol: 500,
			maxAgeH: 0
		}
	},
	{
		id: "desk",
		label: "Desk",
		value: {
			minLiq: 8e3,
			minVol: 2e3,
			maxAgeH: 24
		}
	}
];
function Terminal({ initial }) {
	const [tab, setTab] = (0, import_react.useState)("pulse");
	const [query, setQuery] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [filterId, setFilterId] = (0, import_react.useState)("raw");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [clock, setClock] = (0, import_react.useState)("");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const searchRef = (0, import_react.useRef)(null);
	const seenAlerts = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const watchItems = useWatchlist((s) => s.items);
	const pushAlert = useWatchlist((s) => s.pushAlert);
	const alerts = useWatchlist((s) => s.alerts);
	const watched = useWatchlist((s) => s.has);
	const toggle = useWatchlist((s) => s.toggle);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setDebounced(query.trim()), 280);
		return () => clearTimeout(t);
	}, [query]);
	(0, import_react.useEffect)(() => {
		setHydrated(true);
		const tick = () => setClock((/* @__PURE__ */ new Date()).toLocaleTimeString());
		tick();
		const id = setInterval(tick, 1e3);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
				e.preventDefault();
				searchRef.current?.focus();
			}
			if (e.key === "Escape") {
				setSelected(null);
				searchRef.current?.blur();
			}
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key === "1") setTab("pulse");
			if (e.key === "2") setTab("new");
			if (e.key === "3") setTab("boosted");
			if (e.key === "4") setTab("watch");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const market = useQuery({
		queryKey: ["market", tab === "watch" ? "pulse" : tab],
		queryFn: () => getMarket({ data: { feed: tab === "watch" ? "pulse" : tab } }),
		refetchInterval: 1e4,
		enabled: tab !== "watch" && debounced.length < 2,
		initialData: tab === "pulse" && debounced.length < 2 ? initial ?? void 0 : void 0,
		placeholderData: (prev) => prev
	});
	const watchQuery = useQuery({
		queryKey: ["watch", watchItems.map((i) => i.mint).join(",")],
		queryFn: () => getWatchTokens({ data: { mints: watchItems.map((i) => i.mint) } }),
		refetchInterval: 8e3,
		enabled: tab === "watch" && watchItems.length > 0 && debounced.length < 2
	});
	const searchQuery = useQuery({
		queryKey: ["search", debounced],
		queryFn: () => searchMarket({ data: { q: debounced } }),
		enabled: debounced.length >= 2
	});
	const payload = market.data;
	const filters = FILTERS.find((f) => f.id === filterId)?.value ?? FILTERS[1].value;
	const rows = (0, import_react.useMemo)(() => {
		if (debounced.length >= 2) return searchQuery.data ?? [];
		return (tab === "watch" ? watchQuery.data ?? [] : payload?.tokens ?? []).filter((t) => {
			if (filters.minLiq && (t.liquidity ?? 0) < filters.minLiq) return false;
			if (filters.minVol && t.w5m.volume < filters.minVol) return false;
			if (filters.maxAgeH && t.ageMs > filters.maxAgeH * 36e5) return false;
			return true;
		});
	}, [
		debounced,
		searchQuery.data,
		tab,
		watchQuery.data,
		payload,
		filters
	]);
	(0, import_react.useEffect)(() => {
		if (!payload) return;
		for (const t of payload.tokens) {
			if (!watched(t.mint)) continue;
			if (t.changes.m5 >= 18 && t.w5m.volume >= 800) {
				const key = `spike-${t.mint}-${Math.floor(Date.now() / 45e3)}`;
				if (seenAlerts.current.has(key)) continue;
				seenAlerts.current.add(key);
				pushAlert({
					mint: t.mint,
					symbol: t.symbol,
					kind: "spike",
					message: `${t.symbol} +${t.changes.m5.toFixed(1)}% / 5m · ${fmtUsd(t.w5m.volume)} flow`
				});
				toast(`${t.symbol} traffic spike`, { description: `${fmtPct(t.changes.m5)} on 5-minute volume` });
			} else if (t.changes.m5 <= -35 && t.w5m.volume >= 800) {
				const key = `dump-${t.mint}-${Math.floor(Date.now() / 45e3)}`;
				if (seenAlerts.current.has(key)) continue;
				seenAlerts.current.add(key);
				pushAlert({
					mint: t.mint,
					symbol: t.symbol,
					kind: "dump",
					message: `${t.symbol} ${t.changes.m5.toFixed(1)}% / 5m`
				});
			}
		}
	}, [
		payload,
		pushAlert,
		watched
	]);
	const loading = debounced.length >= 2 ? searchQuery.isLoading : tab === "watch" ? watchQuery.isLoading : market.isLoading && !payload;
	const error = debounced.length >= 2 ? searchQuery.error : tab === "watch" ? watchQuery.error : market.error;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "shrink-0 border-b border-border px-3 py-3 sm:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-accent-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-[0.18em] text-subtle",
									children: "Solana radar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-base font-semibold tracking-tight",
									children: "VELOCITY"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-3 font-mono text-[11px] text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden items-center gap-1.5 sm:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pulse-dot size-1.5 rounded-full bg-up" }), "Live"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "num hidden md:inline",
									children: ["SOL ", payload?.solPrice ? fmtUsd(payload.solPrice, 2) : "—"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num hidden lg:inline",
									children: payload ? `${payload.stats.fresh} fresh` : ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num min-w-16 text-right",
									suppressHydrationWarning: true,
									children: clock || "—"
								})
							]
						})]
					}),
					payload?.tape && payload.tape.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-hidden rounded-[var(--radius-sm)] bg-surface py-1.5 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tape-track flex w-max gap-6 px-4 font-mono text-[11px] text-muted",
							children: [...payload.tape, ...payload.tape].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "shrink-0 hover:text-fg",
								onClick: () => {
									setQuery(t.mint);
									setTab("pulse");
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-accent",
										children: t.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-1.5 text-subtle",
										children: "·"
									}),
									fmtAge(t.ageMs)
								]
							}, `${t.mint}-${i}`))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-2 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								ref: searchRef,
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search mint, ticker — /",
								className: "pl-9 font-mono",
								"aria-label": "Search tokens"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1 overflow-x-auto",
							children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: filterId === f.id ? "default" : "outline",
								size: "sm",
								onClick: () => setFilterId(f.id),
								children: [f.id === "desk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3.5" }) : null, f.label]
							}, f.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 overflow-x-auto border-b border-border px-2 sm:px-4",
						children: [TABS.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab(t.id),
							className: `relative h-11 shrink-0 px-3 text-sm transition-colors duration-150 ${tab === t.id ? "text-fg" : "text-muted hover:text-fg"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										t.id === "pulse" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }),
										t.id === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3.5" }),
										t.id === "boosted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }),
										t.id === "watch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5" }),
										t.label,
										t.id === "watch" && watchItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "num rounded-full bg-elevated px-1.5 text-[10px]",
											children: watchItems.length
										})
									]
								}),
								tab === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-3 bottom-0 h-px bg-accent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sr-only",
									children: ["Shortcut ", i + 1]
								})
							]
						}, t.id)), alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto inline-flex items-center gap-1 pr-2 font-mono text-[11px] text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-3" }), alerts.length]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-auto",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 p-4",
							children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" }, i))
						}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							title: "Feed stalled",
							body: "The indexer didn't answer. Retrying on the next tick."
						}) : tab === "watch" && watchItems.length === 0 && debounced.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							title: "Watchlist is empty",
							body: "Star a mint from Pulse. When 5-minute volume spikes, Velocity flags it here."
						}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							title: "No prints in this filter",
							body: "Drop to Raw, or wait a few seconds — Solana is still minting."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:grid md:grid-cols-[minmax(0,1.6fr)_64px_88px_72px_88px_88px_72px_88px_56px] md:gap-2 md:px-4 md:py-2 md:text-[10px] md:uppercase md:tracking-wider md:text-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Token" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Age" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right",
									children: "5m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right",
									children: "Vol 5m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pressure" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Liq" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Path" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right",
									children: "Score"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenRow, {
							token: t,
							active: selected?.mint === t.mint,
							watched: hydrated && watched(t.mint),
							onOpen: () => setSelected(t),
							onWatch: () => toggle({
								mint: t.mint,
								symbol: t.symbol,
								name: t.name
							})
						}) }, t.mint)) })] })
					})]
				}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden w-[380px] shrink-0 border-l border-border lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenPanel, {
						token: selected,
						onClose: () => setSelected(null)
					})
				})]
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-40 bg-bg/70",
					onClick: () => setSelected(null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-x-0 bottom-0 z-50 max-h-[86dvh] overflow-auto rounded-t-[var(--radius-xl)] shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenPanel, {
						token: selected,
						onClose: () => setSelected(null)
					})
				})]
			})
		]
	});
}
function TokenRow({ token, active, watched, onOpen, onWatch }) {
	const up = token.changes.m5 >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `grid cursor-pointer items-center gap-2 border-b border-border px-3 py-3 transition-colors duration-150 sm:px-4 md:grid-cols-[minmax(0,1.6fr)_64px_88px_72px_88px_88px_72px_88px_56px] ${active ? "bg-elevated" : "hover:bg-surface"}`,
		onClick: onOpen,
		onKeyDown: (e) => {
			if (e.key === "Enter") onOpen();
		},
		role: "button",
		tabIndex: 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenAvatar, {
						mint: token.mint,
						symbol: token.symbol,
						image: token.image
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-medium",
									children: token.symbol
								}),
								token.heat === "hot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "hot",
									children: "Hot"
								}),
								token.boost > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "warn",
									children: "Boost"
								}),
								token.source === "new" && token.ageMs < 18e4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "accent",
									children: "New"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted",
							children: [
								token.name,
								" · ",
								token.dex
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-auto flex size-10 items-center justify-center text-muted hover:text-accent md:hidden",
						"aria-label": watched ? "Unwatch" : "Watch",
						onClick: (e) => {
							e.stopPropagation();
							onWatch();
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${watched ? "fill-accent text-accent" : ""}` })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-3 gap-2 md:mt-0 md:contents",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						label: "Age",
						value: fmtAge(token.ageMs)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						label: "Price",
						value: fmtUsd(token.priceUsd)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						label: "5m",
						value: fmtPct(token.changes.m5),
						tone: up ? "up" : "down"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num text-right font-mono text-xs",
							children: fmtUsd(token.w5m.volume || token.w24h.volume)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-3 md:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-[10px] uppercase tracking-wider text-subtle md:hidden",
							children: "Pressure"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PressureBar, { value: token.pressure })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num font-mono text-xs text-muted",
							children: fmtUsd(token.liquidity)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden md:flex md:items-center md:gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
							price: token.priceUsd,
							changes: token.changes,
							className: "h-7 w-16"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeBars, { volumes: token.volumes })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden text-right md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num font-mono text-sm font-medium text-accent",
							children: token.score
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center justify-between md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted",
					children: [
						fmtUsd(token.w5m.volume || token.w24h.volume),
						" vol · ",
						fmtCompact(token.w5m.buys + token.w5m.sells),
						" tx"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num font-mono text-sm text-accent",
					children: token.score
				})]
			})
		]
	});
}
function Cell({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] uppercase tracking-wider text-subtle md:hidden",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: `num font-mono text-xs md:text-right ${tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg"}`,
		children: value
	})] });
}
function Empty({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center px-8 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-base font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-sm text-sm leading-relaxed text-muted",
			children: body
		})]
	});
}
function Home() {
	const initial = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { initial });
}
//#endregion
export { Home as component };
