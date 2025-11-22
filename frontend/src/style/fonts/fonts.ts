import interTheme from './inter.class-name.module.scss';
import openSansTheme from './open-sans.class-name.module.scss';
import robotoTheme from './roboto.class-name.module.scss';
import moderusticTheme from './moderustic.class-name.module.scss';
import merriweatherSansTheme from './merriweather-sans.class-name.module.scss';
import ubuntuTheme from './ubuntu.class-name.module.scss';
import bnppSansTheme from './bnpp-sans.class-name.module.scss';
import bnppTypeTheme from './bnpp-type.class-name.module.scss';


export type TFontKey = keyof typeof fonts;

export const fonts = {
    inter: {
        standard: interTheme.interStandard,
        brand: interTheme.interBrand,
    },
    openSans: {
        standard: openSansTheme.openSansStandard,
        brand: openSansTheme.openSansBrand,
    },
    roboto: {
        standard: robotoTheme.robotoStandard,
        brand: robotoTheme.robotoBrand,
    },
    moderustic: {
        standard: moderusticTheme.moderusticStandard,
        brand: moderusticTheme.moderusticBrand,
    },
    merriweatherSans: {
        standard: merriweatherSansTheme.merriweatherSansStandard,
        brand: merriweatherSansTheme.merriweatherSansBrand,
    },
    ubuntu: {
        standard: ubuntuTheme.ubuntuStandard,
        brand: ubuntuTheme.ubuntuBrand,
    },
    bnppSans: {
        standard: bnppSansTheme.bnppSansStandard,
        brand: bnppSansTheme.bnppSansBrand,
    },
    bnppType: {
        standard: bnppTypeTheme.bnppTypeStandard,
        brand: bnppTypeTheme.bnppTypeBrand,
    },
};
