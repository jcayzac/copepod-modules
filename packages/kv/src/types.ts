export interface StoreParams {
	[key: string]: any
}

export interface StoreConfig<Params extends StoreParams = StoreParams> {
	/*
	 * The unique identifier for the store.
	 */
	id: string

	/**
	 * The backend module to use for the store.
	 * @default Same as `id`, so that backend modules can be used as store identifiers if desired.
	 */
	use?: string

	/**
	 * Parameters to pass to the store upon construction.
	 */
	with?: Params | null | undefined
}

export interface Store<Key = string> {
	get: (key: Key) => Promise<Uint8Array | undefined>
	set: (key: Key, value: Uint8Array | undefined) => Promise<boolean>
}

export interface Config {
	stores: StoreConfig<StoreParams>[]
}

export function defineConfig(config: Config): Config {
	return config
}
