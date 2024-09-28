import type { Config, Store, StoreConfig, StoreParams } from './types'
import { loadConfig } from 'c12'
import { digest } from './utils'

let configPromise: ReturnType<typeof loadConfig<Config>> | undefined
const stores = new Map<string, Store<any>>()

export async function getConfig(reload = false): ReturnType<typeof loadConfig<Config>> {
	if (reload) {
		configPromise = undefined
	}

	if (!configPromise) {
		configPromise = loadConfig<Config>({
			name: 'kv',
			dotenv: true,
			packageJson: true,
			globalRc: false,
			defaultConfig: {
				stores: [],
			},
		})
	}

	return await configPromise
}

export async function store<Key = string, Params extends StoreParams = StoreParams>(id: string) {
	// Find the store with the given ID
	const store = (await getConfig()).config.stores.find(({ id: x }) => x === id) as StoreConfig<Params> | undefined
	if (!store) {
		return undefined
	}

	// Check if the store is already loaded
	const { use: backend = id, with: _params } = store
	const params = structuredClone({ ..._params })
	const storeKey = await digest(new TextEncoder().encode(JSON.stringify([backend, params])))
	let result = stores.get(storeKey) as Store<Key> | undefined

	// Load the store if it hasn't been loaded yet
	if (!result) {
		const { default: StoreImpl } = await import(backend)
		result = new StoreImpl(params)
		stores.set(storeKey, result as Store<Key>)
	}

	return result
}
