import { configureStore, createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit'
import {
		persistStore,
		persistReducer,
		FLUSH,
		REHYDRATE,
		PAUSE,
		PERSIST,
		PURGE,
		REGISTER,
		} from 'redux-persist'

import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { WebStorage } from 'redux-persist/lib/types';
import { IStorage } from '@/lib/Types';
import { EnhancedStore } from '@reduxjs/toolkit';

export function createPersistStorage(): WebStorage {
	const isServer = typeof window === 'undefined';

	if(isServer) {
		return {
			getItem() {
				return Promise.resolve(null);
			},
			setItem() {
				return Promise.resolve();
			},
			removeItem() {
				return Promise.resolve();
			},
		};
	}

	return createWebStorage('local');
}

const storage = createPersistStorage();

const initialState: IStorage = {
	assetSearch: '',
	refreshUserAssets: false
}

const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		setAssetSearch: (state, action: PayloadAction<string>) => {
			state.assetSearch = action.payload;
			return state;
		},
		resetAssetSearch: state => {
			state.assetSearch = '';
			return state;
		},
/*     setRefreshUserAssets: (state, action: PayloadAction<boolean>) => {
			state.refreshUserAssets = action.payload;
			return state;
		}, */
	}
});

export const { setAssetSearch, resetAssetSearch } = sessionSlice.actions;
export default sessionSlice.reducer;

const persistConfig = {
		key: 'root',
		version: 1,
		storage,
}

const rootReducer = combineReducers({
	session: sessionSlice.reducer
});

 
const makeConfiguredStore = () =>
		configureStore({
				reducer: rootReducer,
				middleware: getDefaultMiddleware =>
						getDefaultMiddleware({
								serializableCheck: {
										ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
							},
						}),
})
	
export const makeStore: any = () => {
		const isServer = typeof window === 'undefined'
		
		if (isServer) {
			return makeConfiguredStore()
		} else {
			const persistedReducer = persistReducer(persistConfig, rootReducer)
			let store: EnhancedStore = configureStore({
				reducer: persistedReducer,
				middleware: getDefaultMiddleware =>
					getDefaultMiddleware({
							serializableCheck: {
									ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
						},
					}),
			})

			return store;
		}
}
export const persistor = persistStore(makeStore());

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch'] 