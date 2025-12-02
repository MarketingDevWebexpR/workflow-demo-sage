import * as React from 'react';
import { PrefersColorSchemeSetup } from './prefers-color-theme/setup';
import { Provider as WorkflowAutomationProvider } from '../modules/workflow/store/workflow-automation.store';
import { DragProvider } from './drag.context';


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
            <DragProvider>
                {/* <TranslationProvider
                    defaultLocale={defaultLocale}
                    fallbackLocale={["en"]}
                    translations={translations}
                > */}
                    {children}
                {/* </TranslationProvider> */}
            </DragProvider>
        </WorkflowAutomationProvider>
    </PrefersColorSchemeSetup>;
};


export {
    Providers,
};
