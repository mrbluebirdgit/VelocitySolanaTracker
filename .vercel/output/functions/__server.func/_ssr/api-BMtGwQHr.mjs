import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BMtGwQHr.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var emptyMarket = () => ({
	tokens: [],
	solPrice: null,
	fetchedAt: Date.now(),
	tape: [],
	stats: {
		fresh: 0,
		hot: 0,
		vol5m: 0
	}
});
var getMarket_createServerFn_handler = createServerRpc({
	id: "64d98202a702cce30f6d03486d946fefe11820f2ca69c409a8b8a86c700e5a4d",
	name: "getMarket",
	filename: "src/lib/solana/api.ts"
}, (opts) => getMarket.__executeServer(opts));
var getMarket = createServerFn({ method: "GET" }).validator(object({ feed: _enum([
	"pulse",
	"new",
	"boosted"
]) })).handler(getMarket_createServerFn_handler, async ({ data }) => {
	try {
		const { loadFeed } = await import("./load.server-nF0Py-AL.mjs");
		return await loadFeed(data.feed);
	} catch (err) {
		console.error("[velocity] loadFeed", err);
		return emptyMarket();
	}
});
var searchMarket_createServerFn_handler = createServerRpc({
	id: "96f002fc3edb04984e28ab98cf61995a09579acc6f4dd0ab26e970b95e308948",
	name: "searchMarket",
	filename: "src/lib/solana/api.ts"
}, (opts) => searchMarket.__executeServer(opts));
var searchMarket = createServerFn({ method: "GET" }).validator(object({ q: string().max(80) })).handler(searchMarket_createServerFn_handler, async ({ data }) => {
	try {
		const { searchFeed } = await import("./load.server-nF0Py-AL.mjs");
		return await searchFeed(data.q);
	} catch (err) {
		console.error("[velocity] search", err);
		return [];
	}
});
var getWatchTokens_createServerFn_handler = createServerRpc({
	id: "c84c6c79a413830b98b696289dc6ca666309755bd05b8bf8bab60007c64b2ac2",
	name: "getWatchTokens",
	filename: "src/lib/solana/api.ts"
}, (opts) => getWatchTokens.__executeServer(opts));
var getWatchTokens = createServerFn({ method: "POST" }).validator(object({ mints: array(string().max(64)).max(20) })).handler(getWatchTokens_createServerFn_handler, async ({ data }) => {
	try {
		const { loadMints } = await import("./load.server-nF0Py-AL.mjs");
		return await loadMints(data.mints);
	} catch (err) {
		console.error("[velocity] watch", err);
		return [];
	}
});
var getPoolChart_createServerFn_handler = createServerRpc({
	id: "8dcd1a5675eea7408a76b97cd040614c9f3b4e5091aebc868bd83dd018ca5292",
	name: "getPoolChart",
	filename: "src/lib/solana/api.ts"
}, (opts) => getPoolChart.__executeServer(opts));
var getPoolChart = createServerFn({ method: "GET" }).validator(object({ pool: string().max(88) })).handler(getPoolChart_createServerFn_handler, async ({ data }) => {
	try {
		const { loadChart } = await import("./load.server-nF0Py-AL.mjs");
		return await loadChart(data.pool);
	} catch {
		return [];
	}
});
//#endregion
export { getMarket_createServerFn_handler, getPoolChart_createServerFn_handler, getWatchTokens_createServerFn_handler, searchMarket_createServerFn_handler };
