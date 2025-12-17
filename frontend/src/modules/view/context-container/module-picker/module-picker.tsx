import {
    useEffect,
    useState,
    useMemo,
} from "react";
import DraggableModuleComponent from "./draggable-module-component";
import { modulePickerCSS } from './module-picker.css';
import { useVanillaCSSInjection } from '../../../../hooks/use-vanilla-css-injection';
import { componentCategories, type IModuleComponent } from "../../../config";
import styles from "./module-picker.module.scss";
import { SearchInputAuto } from "../../../../components/ui/form/base-fields/search-input-auto/search-input-auto";
// import { ThemeField } from "../theme-field/theme-field";
// import { useLookAndFeelForm } from "../hooks/use-look-and-feel-form";
import { MODULE_CATEGORIES, MODULES_MAP } from "../../../modules-map";
// import { useNavigate } from "react-router-dom";
import { config } from "../../../misc/module.config";


const ModulePicker = () => {

    useVanillaCSSInjection({
        css: modulePickerCSS,
        id: 'module-picker-css'
    });

    // const navigate = useNavigate();

    // 🔧 FIX: Mémoriser les tableaux pour éviter la re-création à chaque render
    const moduleConfigs = useMemo(() => [
        config,
    ], []);

    // Récupération des données du store des modules installés
    // const installedModuleStoreData = useInstalledModuleStore(state => state.installedModule.data);
    // const installedModuleFetchError = useInstalledModuleStore(state => state.installedModule.fetchError);

    // 🔧 FIX: Mémoriser allModuleComponents pour éviter le re-render infini
    const allModuleComponents = useMemo(() => moduleConfigs.map(({ components }) => components).flat(), [moduleConfigs]);
    // Logique de filtrage des composants selon les modules installés
    // const allModuleComponents = useMemo(() => {
    //     // Si on n'est PAS en environnement WebexpR ET qu'il y a une erreur ou 0 modules, on ne filtre pas
    //     if (  (installedModuleFetchError || installedModuleStoreData.length === 0)) {
    //         return moduleConfigs.map(({ components }) => components).flat();
    //     }

    //     // En environnement WebexpR, on filtre TOUJOURS selon les modules installés
    //     // En environnement non-WebexpR avec des données valides, on filtre aussi
    //     const installedModules = getInstalledModuleInfos(moduleConfigs, installedModuleStoreData);
    //     const installedModuleIds = new Set(installedModules.map(module => module.id));

    //     return moduleConfigs
    //         .filter(moduleConfig => {
    //             // En environnement WebexpR, les modules système (isSystemModule: true) sont toujours affichés
    //             if (moduleConfig.isSystemModule) {
    //                 return true;
    //             }
    //             // Sinon, on filtre selon les modules installés
    //             return installedModuleIds.has(moduleConfig.id);
    //         })
    //         .map(({ components }) => components)
    //         .flat();
    // }, [moduleConfigs, installedModuleStoreData, installedModuleFetchError,]);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredModuleComponents, setFilteredModuleComponents] = useState<IModuleComponent[]>(allModuleComponents);

    useEffect(() => {

        if (!searchQuery?.length) {
            setFilteredModuleComponents(allModuleComponents);
            return;
        }

        const filteredModuleComponents = allModuleComponents.filter(moduleComponent => moduleComponent.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())));

        setFilteredModuleComponents(filteredModuleComponents);
    }, [searchQuery, allModuleComponents]);

    const [activeTab, _setActiveTab] = useState<"components" | "look-and-feel">("components");

    // const dispatch = useSettingStore(state => state.dispatch);
    // const currentSettings = useSettingStore(state => state.setting.data);
    // const isFetchingCurrentSettings = useSettingStore(state => state.setting.isFetching);

    // Gestion du formulaire Look and Feel avec sauvegarde automatique
    // const handleLookAndFeelChange = async (values: TGlobalSettingsFormData) => {

    //     console.log({ values });

    //     dispatch({
    //         type: 'SAVE_SETTINGS',
    //         payload: values,
    //     });


    //     console.log('Look and Feel - Appel de save.execute', { values, });
    //     const result = await settingServices.save.execute({
    //         sp,
    //         props: values,
    //     });

    //     if( result instanceof Error ) {
    //                     toast.error(t('general.messages.errorOccurred'), {
    //             description: extractErrorMessage(result),
    //         })
    //     } else {
    //         dispatch({
    //             type: 'SAVE_SETTINGS_FULFILLED',
    //             payload: result,
    //         });
    //     }

    // };

    // console.log('là currentsettings', { currentSettings, stringifiedCurrentSettings: JSON.stringify(currentSettings) });
    // const currentSettingsReduced =  currentSettings.reduce( (acc, setting) => {
    //     acc[ setting.Key ] = setting.Value;
    //     return acc;
    // }, {} as Record<string, string> );
    // const stringifiedCurrentSettingsReduced = JSON.stringify(currentSettingsReduced);
    // console.log('ici', { stringifiedCurrentSettingsReduced });
    // // On stringify pour forcer le useEffect à se déclencher uniquement quand les valeurs changent réellement

    // console.log({ currentSettingsReduced });

    // const {form: lookAndFeelForm,

    //     // pendingDebounceUpdates
    // } = useLookAndFeelForm({
    //     defaultValues: currentSettingsReduced,
    //     onValuesChange: handleLookAndFeelChange,
    // });

    // const [formKey, ] = useState(0);

    // const isFirstRender = useRef(true);


    // useEffect(() => {

    //     // A chaque fois que les currentSettingsReduced changent, on reset le formulaire, sauf si on est en train de charger les settings
    //     if( isFetchingCurrentSettings ) {
    //         console.log('Look and Feel - on fetch les settings, pas de reset', { isFetchingCurrentSettings });
    //         return;
    //     }

    //     if( isFirstRender.current ) {
    //         isFirstRender.current = false;
    //         return;
    //     }


    //     // setFormKey(prevKey => prevKey + 1);
    //     // if( pendingDebounceUpdates.current.length > 0 ) {
    //     //     console.log('Look and Feel - on a des pending debounce updates, pas de reset', { pendingDebounceUpdates: pendingDebounceUpdates.current });
    //     //     pendingDebounceUpdates.current.pop();
    //     //     return;
    //     // }

    //     console.log('%c Look and Feel - Reset du formulaire suite à une modification des settings.', 'background-color: orange; color: white;', { currentSettingsReduced, stringifiedCurrentSettingsReduced });

    //     lookAndFeelForm.reset(currentSettingsReduced);
    //     // pendingDebounceUpdates.current.length = 0;
    // }, [stringifiedCurrentSettingsReduced]);


    // const keys = extractSchemaKeys(globalSettingsSchema);

    // type TFontItem = {

    //     label: string,
    //     value: keyof typeof fonts,
    //     className: typeof fonts[keyof typeof fonts][keyof typeof fonts[keyof typeof fonts]],
    // }

    // const fontItems: TFontItem[] = [
    //     { label: 'Inter', value: 'inter', className: fonts.inter.standard },
    //     { label: 'Open Sans', value: 'openSans', className: fonts.openSans.standard },
    //     { label: 'Roboto', value: 'roboto', className: fonts.roboto.standard },
    //     { label: 'Moderustic', value: 'moderustic', className: fonts.moderustic.standard },
    //     { label: 'Merriweather Sans', value: 'merriweatherSans', className: fonts.merriweatherSans.standard },
    //     { label: 'Ubuntu', value: 'ubuntu', className: fonts.ubuntu.standard },
    //     { label: 'BNPP Type', value: 'bnppType', className: fonts.bnppType.standard },
    // ];

    return <div
        className={styles.modulePicker}
    >

        <div className={styles.modulePickerTabsContent}>

            {/* Module picker components */}
            <div className={styles.modulePickerTabContent} data-module-picker-group aria-hidden={activeTab !== "components"}>

                <SearchInputAuto
                    placeholder="Search for a component"
                    className={styles.modulePickerSearchInput}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                {
                    // D'abord les catégories standards (layout, basic, specific)
                    componentCategories
                        .filter(cat => cat.id !== 'advanced')
                        .map(componentCategory => {

                            const categoryComponents = filteredModuleComponents
                                .filter(moduleComponent => moduleComponent.categoryId === componentCategory.id);

                            if (!categoryComponents?.length) {
                                return null;
                            }

                            return <div key={componentCategory.id} className={styles.modulePickerCategory}>
                                <h4 className={styles.modulePickerCategoryTitle}>{componentCategory.title}</h4>
                                <div data-module-picker-items>
                                    {
                                        categoryComponents
                                            .map(moduleComponent => {
                                                return <DraggableModuleComponent
                                                    key={`module-${moduleComponent.titleKey}`}
                                                    moduleComponent={moduleComponent}
                                                />;
                                            })
                                    }
                                </div>
                            </div>
                        })
                }
                {
                    // Ensuite les catégories de modules (pour 'advanced')
                    Object.values(MODULE_CATEGORIES)
                        .filter(cat => cat.id !== 'system') // On exclut les modules système
                        .map(moduleCategory => {
                            // Trouver les composants 'advanced' qui appartiennent à des modules de cette catégorie
                            const categoryComponents = filteredModuleComponents
                                .filter(moduleComponent => {
                                    if (moduleComponent.categoryId !== 'advanced') return false;

                                    // Trouver le module config associé à ce composant
                                    const moduleConfig = moduleConfigs.find(config =>
                                        config.components.some(comp => comp.titleKey === moduleComponent.titleKey)
                                    );

                                    if (!moduleConfig) return false;

                                    // Trouver la catégorie du module dans MODULES_MAP
                                    const moduleMapEntry = Object.values(MODULES_MAP).find(m => m.id === moduleConfig.id);

                                    return moduleMapEntry?.category === moduleCategory.id;
                                });

                            if (!categoryComponents?.length) {
                                return null;
                            }

                            return <div key={moduleCategory.id} className={styles.modulePickerCategory}>
                                <h4 className={styles.modulePickerCategoryTitle}>{moduleCategory.titleKey}</h4>
                                <div data-module-picker-items>
                                    {
                                        categoryComponents
                                            .map(moduleComponent => {
                                                return <DraggableModuleComponent
                                                    key={`module-${moduleComponent.titleKey}`}
                                                    moduleComponent={moduleComponent}
                                                />;
                                            })
                                    }
                                </div>
                            </div>
                        })
                }
            </div>

            {/* Look and feel */}
            {/* <div className={styles.modulePickerTabContent} aria-hidden={activeTab !== "look-and-feel"}>

                <Form {...lookAndFeelForm} key={`formKey-${formKey}`} >
                    <ThemeField
                        name={keys.theme}
                        control={lookAndFeelForm.control}
                        label={t('builder.lookAndFeel.color')}
                    />

                    <div data-form-row>
                        <RadioGroupField
                            name={keys.brandFont}
                            control={lookAndFeelForm.control}
                            label={t('builder.lookAndFeel.brandFont')}
                            description={t('builder.lookAndFeel.brandFontDescription')}
                            items={fontItems}
                        />

                        <RadioGroupField
                            name={keys.standardFont}
                            control={lookAndFeelForm.control}
                            label={t('builder.lookAndFeel.standardFont')}
                            description={t('builder.lookAndFeel.standardFontDescription')}
                            items={fontItems}
                        />
                    </div>
                </Form>
            </div> */}
        </div>

    </div>;
};


export {
    ModulePicker,
};
