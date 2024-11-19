'use client'
import { redirect } from 'next/navigation';
import { VisibleSpinner } from '@/components';
import { useUserOptions } from '@/hooks';

export default function MainPage() {

	const {mainScreen} = useUserOptions();

	if(mainScreen) { 
		switch(mainScreen) {
			case "portfolio": 
				redirect('/portfolio');
				break;
			case "user-assets": 
				redirect('/user-assets');
				break;
			default: 
				redirect('/assets/' + mainScreen);
				break;
		}
	}
	return (<VisibleSpinner isVisible={true} containerType="center" />)
}

