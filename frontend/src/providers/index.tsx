import * as React from 'react';
import { PrefersColorSchemeSetup } from './prefers-color-theme/setup';
import { Provider as WorkflowAutomationProvider } from '../modules/workflow/store/workflow-automation.store';


type TProviders = {
    children: React.ReactElement;
}

const Providers = ({
    children,
}: TProviders): React.ReactElement => {

    // Get the default locale from localStorage or window.polygonSettings
    // const getDefaultLocale = (): string => {
    //     const storedLanguage = localStorage.getItem('locale');

    //     if (storedLanguage) {
    //         return storedLanguage;
    //     }

    //     return 'en';
    // };

    // const defaultLocale = getDefaultLocale();

    return <PrefersColorSchemeSetup>
        <WorkflowAutomationProvider>
            {/* <TranslationProvider
                defaultLocale={defaultLocale}
                fallbackLocale={["en"]}
                translations={translations}
            > */}
                {children}
            {/* </TranslationProvider> */}
        </WorkflowAutomationProvider>
    </PrefersColorSchemeSetup>;
};


export {
    Providers,
};
