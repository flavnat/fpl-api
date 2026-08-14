import {
  Agent,
  RetryAgent,
  cacheStores,
  interceptors,
  setGlobalDispatcher,
} from "undici";

const cachedAgent = new Agent().compose(
  interceptors.cache({
    store: new cacheStores.MemoryCacheStore({
      maxSize: 100 * 1024 * 1024, // 100 MB
      maxCount: 1000,
      maxEntrySize: 5 * 1024 * 1024, // 5 MB
    }),

    methods: ["GET", "HEAD"],
  }),
);

const agent = new RetryAgent(cachedAgent, {
  maxRetries: 3,
  minTimeout: 1000,
  timeoutFactor: 2,
});

setGlobalDispatcher(agent);

export async function httpFetch(
  input: string | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, init)

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    )
  }

  return response
}