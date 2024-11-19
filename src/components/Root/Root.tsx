'use client';
import { type PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react';
import {
	SDKProvider,
	useLaunchParams,
	useMiniApp,
	useThemeParams,
	useViewport,
	bindMiniAppCSSVars,
	bindThemeParamsCSSVars,
	bindViewportCSSVars,
	postEvent,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useDidMount, useTelegramAuth } from '@/hooks';
import { VisibleSpinner } from '@/components';
import { GlobalContext } from '@/lib/Context';
import { ISession } from '@/lib/Types';
import './styles.css';

function App(props: PropsWithChildren) {
	postEvent('web_app_expand');
	postEvent('web_app_set_header_color', {color:'#b6c7c3'});

	const lp = useLaunchParams();
	const miniApp = useMiniApp();
	const themeParams = useThemeParams();
	const viewport = useViewport();

	const session: ISession = useTelegramAuth();
	const [language, setLanguage] = useState<string>();
	const [dataType, setDataType] = useState<string>();

	useEffect(() => {
		return bindMiniAppCSSVars(miniApp, themeParams);
	}, [miniApp, themeParams]);

	useEffect(() => {
		return bindThemeParamsCSSVars(themeParams);
	}, [themeParams]);

	useEffect(() => {
		return viewport && bindViewportCSSVars(viewport);
	}, [viewport]);

	useEffect(() => {
		if(session && session.language) { setLanguage(session.language) }
		if(session && session.dataType) { setDataType(session.dataType) }
	}, [session]);

/* 	useEffect(() => {
		setMainScreen(session.mainScreen)
	}, [session.mainScreen]); */

	if(!session || !language || !dataType) {
		return (
			<AppRoot
				appearance={ miniApp.isDark ? 'dark' : 'light' }
				platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
			>
				<VisibleSpinner isVisible={true} containerType="center" />
			</AppRoot>
		);
	}

	return (
		<AppRoot
			appearance={ miniApp.isDark ? 'dark' : 'light' }
			platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
		>
			<GlobalContext.Provider value={{...session, language, dataType, setLanguage, setDataType}}>
				{props.children}
			</GlobalContext.Provider>
		</AppRoot>
	);
}

function RootInner({ children }: PropsWithChildren) {

	const debug = false;
/*   const manifestUrl = useMemo(() => {
		return new URL('tonconnect-manifest.json', window.location.href).toString();
	}, []); */

	// Enable debug mode to see all the methods sent and events received.
/*   useEffect(() => {
		if (debug) {
			import('eruda').then((lib) => lib.default.init());
		}
	}, [debug]); */

	return (
			<SDKProvider acceptCustomStyles debug={debug}>
				<App>
					{children}
				</App>
			</SDKProvider>
	);
}

export function Root(props: PropsWithChildren) {
	const didMount = useDidMount();

	return didMount ?
		<ErrorBoundary fallback={ErrorPage}>
			<RootInner {...props}/>
		</ErrorBoundary>
	:
		<AppRoot>
			<VisibleSpinner isVisible={true} containerType="center" />
		</AppRoot>
}