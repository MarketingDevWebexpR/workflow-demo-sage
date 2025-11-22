// @@ components
import { BaseTemplate } from './base-template/base-template';

// @@ constants
import { paths } from './router.constants';

// @@ pages
import { AutomationPage } from '../modules/workflow-automation/automation.page';

// @@ react router
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Loading } from '../modules/loading/loading';
import { NotFound } from '../modules/not-found/not-found';

type TRoute = {
    path: (typeof paths)[keyof typeof paths] | (string & {}),
    Page: React.ReactElement,
}


const Router = () => {

    const isLoading = false;

    const routes: TRoute[] = [
        // ...pages.map(({ Path, }) => {

        //     return {
        //         path: Path,
        //         Page: <PageRenderer
        //             layerId="page"
        //             layerTitle="Page"
        //         />,
        //     };
        // }),

        {
            path: '/',
            Page: <AutomationPage />,
        },

        {
            path: paths.workflowDesigner,
            Page: <AutomationPage />,
        },

        {
            path: paths['*'],
            Page: isLoading ? <Loading /> : <NotFound />,
        },
    ];

    return <HashRouter>
        <BaseTemplate>
            <Routes>
                {
                    routes.map(({ path, Page }) => {

                        return <Route
                            key={path}
                            caseSensitive={true}
                            path={path}
                            element={Page}
                        />;
                    })
                }
            </Routes>
        </BaseTemplate>
    </HashRouter>;
}


export {
    Router,
};
