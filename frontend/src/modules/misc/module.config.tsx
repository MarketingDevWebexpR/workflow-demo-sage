import { Anchor, Binary, Columns2, ListCollapse, MousePointerClick, PanelTopClose, RectangleHorizontal, Rows3, Text,  } from "lucide-react";
import { type IModuleConfig } from "../config";
import { CustomTabs, getLayerIds as getCustomTabsLayerIds, getDefaultProps as getCustomTabsDefaultProps } from "./components/custom-tabs/custom-tabs";
import { Section2Columns, getLayerIds as getSection2ColumnsLayerIds, getDefaultProps as getSection2ColumnsDefaultProps } from "./components/section-2-columns/section-2-columns";
import { getLayerIds as getSection1ColumnLayerIds, Section, getDefaultProps as getSectionDefaultProps } from "./components/section-1-column/section-1-column";
import { CustomTabsPropsForm } from "./components/custom-tabs/custom-tabs.props.form";
import { Column, getDefaultProps as getColumnDefaultProps, getLayerIds as getColumnLayerIds } from "./components/column/column";
import { RichTextPropsForm } from "./components/rich-text/rich-text.props.form";
import { RichText, getDefaultProps as getRichTextDefaultProps } from "./components/rich-text/rich-text";
import { ColumnPropsForm } from "./components/column/column.props.form";
// import { SubpageBanner, getDefaultProps as getSubpageBannerDefaultProps } from "./components/subpage-banner/subpage-banner";
// import { SubpageBannerPropsForm } from "./components/subpage-banner/subpage-banner.props.form";
import { Accordion, getLayerIds as getAccordionLayerIds, getDefaultProps as getAccordionDefaultProps } from "./components/accordion/accordion";
import { KeyNumbers, getDefaultProps as getKeyNumbersDefaultProps } from "./components/key-numbers/key-numbers";
import { SectionPropsForm } from "./components/section-1-column/section.props.form";
import { ContainersWithAnchors, getDefaultProps as getContainersWithAnchorsDefaultProps, getLayerIds as getContainersWithAnchorsLayerIds } from "./components/containers-with-anchors/containers-with-anchors";
import { ContainersWithAnchorsPropsForm } from "./components/containers-with-anchors/containers-with-anchors.props.form";
// import { ImagePropsForm } from "./components/image/image.props.form";
// import { Image, getDefaultProps as getImageDefaultProps } from "./components/image/image";
import { Section2ColumnsPropsForm } from "./components/section-2-columns/section-2-columns.props.form";
import { AccordionPropsForm } from "./components/accordion/accordion.props.form";
import { ButtonPropsForm } from "./components/button/button.props.form";
import { Button, getDefaultProps as getButtonDefaultProps } from "./components/button/button";
import { KeyNumbersPropsForm } from "./components/key-numbers/key-numbers.props.form";
import { FancyTitle } from "./components/fancy-title/fancy-title";
import { getDefaultProps as getFancyTitleDefaultProps } from "./components/fancy-title/fancy-title";
import { FancyTitlePropsForm } from "./components/fancy-title/fancy-title.props.form";


import { MODULES_MAP } from "../modules-map";

const moduleMeta = MODULES_MAP["./misc/module.config"];

export const MISCELLANEOUS_MODULE_ID = moduleMeta.id;

export const MISCELLANEOUS_FRAGMENT_IDS = {
    MISC_LIBRARY: moduleMeta.fragments.miscLibrary.id,
};

export const config: IModuleConfig = {
    id: MISCELLANEOUS_MODULE_ID,
    titleKey: moduleMeta.titleKey,
    Icon: moduleMeta.Icon,
    fragments: [
        {
            id: MISCELLANEOUS_FRAGMENT_IDS.MISC_LIBRARY,
            Icon: moduleMeta.fragments.miscLibrary.Icon,
            titleKey: moduleMeta.fragments.miscLibrary.titleKey,
            DataTable: () => null,
            structure: {
                type: 'library',
                title: 'Misc',
            },
            hidden: true,
        },
    ],
    contextProvider: null,
    components: [
        {
            titleKey: 'Colonne',
            descriptionKey: 'Organise vos éléments verticalement avec un espacement personnalisable',
            Icon: Rows3,
            Component: Column,
            PropsForm: ColumnPropsForm,
            categoryId: 'layout',
            getDefaultProps: getColumnDefaultProps,
            getLayerIds: getColumnLayerIds,
            keywords: ['column', 'colonne', 'layout', 'vertical', 'spacing', 'elements'],
        },
        {
            titleKey: 'Texte enrichi',
            descriptionKey: 'Ajoutez du contenu textuel avec mise en forme (titres, paragraphes, listes, gras, italique)',
            Icon: Text,
            Component: RichText,
            PropsForm: RichTextPropsForm,
            categoryId: 'basic',
            getDefaultProps: getRichTextDefaultProps,
            keywords: ['text', 'texte', 'rich text', 'editor', 'content', 'contenu', 'formatting', 'heading', 'paragraph', 'titre', 'title', 'gras', 'italique', 'souligné', 'underline', 'bold', 'italic', 'list', 'listes'],
        },
        {
            titleKey: 'Onglets',
            descriptionKey: 'Organisez votre contenu en onglets cliquables pour une navigation fluide',
            Icon: PanelTopClose,
            Component: CustomTabs,
            PropsForm: CustomTabsPropsForm,
            categoryId: 'layout',
            getLayerIds: getCustomTabsLayerIds,
            getDefaultProps: getCustomTabsDefaultProps,
            keywords: ['tabs', 'onglets', 'navigation', 'custom', 'panels', 'sections'],
        },
        {
            titleKey: 'Section simple',
            descriptionKey: 'Conteneur de base pour regrouper vos éléments dans une zone dédiée',
            Icon: RectangleHorizontal,
            Component: Section,
            categoryId: 'layout',
            getLayerIds: getSection1ColumnLayerIds,
            PropsForm: SectionPropsForm,
            getDefaultProps: getSectionDefaultProps,
            keywords: ['section', 'container', 'conteneur', 'layout', 'block', 'area'],
        },
        {
            titleKey: 'Section 2 colonnes',
            descriptionKey: 'Divisez votre contenu en deux colonnes côte à côte pour une mise en page équilibrée',
            Icon: Columns2,
            Component: Section2Columns,
            PropsForm: Section2ColumnsPropsForm,
            getLayerIds: getSection2ColumnsLayerIds,
            getDefaultProps: getSection2ColumnsDefaultProps,
            categoryId: 'layout',
            keywords: ['section', 'two columns', 'deux colonnes', 'layout', 'double', 'split'],
        },
        // {
        //     titleKey: `modules.${MODULE_IDS.MISC}.components.subpageBanner.title`,
        //     descriptionKey: `modules.${MODULE_IDS.MISC}.components.subpageBanner.description`,
        //     Icon: PanelTopDashed,
        //     Component: SubpageBanner,
        //     PropsForm: SubpageBannerPropsForm,
        //     getDefaultProps: getSubpageBannerDefaultProps,
        //     categoryId: 'advanced',
        //     keywords: ['banner', 'bannière', 'subpage', 'sous-page', 'header', 'hero'],
        // },
        {
            titleKey: 'Accordéon',
            descriptionKey: 'Affichez du contenu extensible qui se replie et se déplie au clic (idéal pour les FAQ)',
            Icon: ListCollapse,
            Component: Accordion,
            PropsForm: AccordionPropsForm,
            getLayerIds: getAccordionLayerIds,
            getDefaultProps: getAccordionDefaultProps,
            categoryId: 'layout',
            keywords: ['accordion', 'accordéon', 'collapse', 'expand', 'faq', 'toggle'],
        },
        {
            titleKey: 'Chiffres clés',
            descriptionKey: 'Mettez en valeur vos statistiques et métriques importantes avec des chiffres visuels',
            Icon: Binary,
            Component: KeyNumbers,
            PropsForm: KeyNumbersPropsForm,
            getDefaultProps: getKeyNumbersDefaultProps,
            categoryId: 'advanced',
            keywords: ['numbers', 'chiffres', 'key figures', 'chiffres clés', 'statistics', 'statistiques', 'metrics'],
        },
        {
            titleKey: 'Conteneurs avec ancres',
            descriptionKey: 'Créez une table des matières avec navigation par ancres pour accéder rapidement aux sections',
            Icon: Anchor,
            Component: ContainersWithAnchors,
            PropsForm: ContainersWithAnchorsPropsForm,
            categoryId: 'layout',
            getLayerIds: getContainersWithAnchorsLayerIds,
            getDefaultProps: getContainersWithAnchorsDefaultProps,
            keywords: ['containers', 'conteneurs', 'anchors', 'ancres', 'navigation', 'links', 'scroll', 'index', 'table of contents', 'sommaire', 'table des matières'],
        },
        // {
        //     titleKey: `modules.${MODULE_IDS.MISC}.components.image.title`,
        //     descriptionKey: `modules.${MODULE_IDS.MISC}.components.image.description`,
        //     Icon: ImageIcon,
        //     Component: Image,
        //     PropsForm: ImagePropsForm,
        //     categoryId: 'basic',
        //     getDefaultProps: getImageDefaultProps,
        //     keywords: ['image', 'picture', 'photo', 'graphic', 'visual', 'visuel'],
        // },
        {
            titleKey: 'Bouton',
            descriptionKey: 'Ajoutez un bouton cliquable pour déclencher des actions ou rediriger vers une page',
            Icon: MousePointerClick,
            Component: Button,
            PropsForm: ButtonPropsForm,
            categoryId: 'basic',
            getDefaultProps: getButtonDefaultProps,
            keywords: ['button', 'bouton', 'click', 'action', 'link', 'lien'],
        },
        {
            titleKey: 'Titre stylisé',
            descriptionKey: 'Créez des titres visuellement attrayants avec des effets de couleur et de style avancés',
            Icon: Text,
            Component: FancyTitle,
            categoryId: 'basic',
            getDefaultProps: getFancyTitleDefaultProps,
            PropsForm: FancyTitlePropsForm,
            keywords: ['title', 'titre', 'fancy', 'stylish', 'heading', 'text', 'gradient', 'color', 'style'],
        }
    ],
    translations: {
        fr: {},
        en: {},
    },
    isSystemModule: true,
    installPriority: 0,
    marker: 'end',
};
