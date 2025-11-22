const ADMIN = 'admin';
const PAGES = 'pages';
const CONTENTS = 'contents';
const USERS = 'users';
const AUTOMATION = 'automation';
const THEME = 'theme';
const SETTINGS = 'settings';
const DEPLOYMENT_CENTER = 'deployment-center';
const SETUP_CENTER = 'setup-center';
const INSTALLED_MODULES = 'installed-modules';
const NOT_ALLOWED = '403';
const INVALID_LICENSE = 'access-denied';
const WILDCARD = '*';

const paths = {
    dashboard: `/${ADMIN}`,
    pages: `/${ADMIN}/${PAGES}/${WILDCARD}`,
    contents: `/${ADMIN}/${CONTENTS}/*`,
    users: `/${ADMIN}/${USERS}/*`,
    automation: `/${ADMIN}/${AUTOMATION}`,
    workflowDesigner: `/${ADMIN}/${AUTOMATION}/workflow/:workflowId`,
    theme: `/${ADMIN}/${THEME}`,
    settings: `/${ADMIN}/${SETTINGS}/*`,
    deploymentCenter: `/${ADMIN}/${DEPLOYMENT_CENTER}`,
    setupCenter: `/${ADMIN}/${SETUP_CENTER}`,
    setupCenterInstalledPlugins: `/${ADMIN}/${SETUP_CENTER}/installed-plugins`,
    setupCenterPluginsCatalog: `/${ADMIN}/${SETUP_CENTER}/plugins-catalog`,
    firstTimeDeploymentSteps: `/${ADMIN}/${DEPLOYMENT_CENTER}/first-time-deployment`,
    upgradeExistingSiteSteps: `/${ADMIN}/${DEPLOYMENT_CENTER}/upgrade-an-existing-site`,
    notAllowed: `/${NOT_ALLOWED}`,
    invalidLicense: `/${INVALID_LICENSE}`,
    '*': '*',
} as const;


export {
    paths,

    ADMIN,
    PAGES,
    CONTENTS,
    USERS,
    AUTOMATION,
    THEME,
    SETTINGS,
    DEPLOYMENT_CENTER,
    SETUP_CENTER,
    INSTALLED_MODULES,
    NOT_ALLOWED,
    INVALID_LICENSE,
    WILDCARD,
};
