// import React from "react";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form/form/form";
// import { type Control } from "react-hook-form";
// import { RadioGroup, RadioGroupItem } from "../../../../components/ui/form/base-fields/radio-group/radio-group";
// import styles from './theme-field.module.scss';
// import formStyles from '../../../../components/ui/form/form/form.module.scss';
// import { cn } from "../../../../lib/utils";
// import { Flame, Flower, Heart, Leaf, Sun, Hexagon, Waves, MoonStar, type LucideProps } from "lucide-react";
// import leafGreenTheme from "../../../../style/themes/leaf-green.module.scss";
// import azureBlueTheme from "../../../../style/themes/azure-blue.module.scss";
// import silverGrayTheme from "../../../../style/themes/silver-gray.module.scss";
// import carmineRedTheme from "../../../../style/themes/carmine-red.module.scss";
// import lavenderPurpleTheme from "../../../../style/themes/lavender-purple.module.scss";
// // import celadonGreenTheme from "../../../../style/themes/celadon-green.module.scss";
// import saffronYellowTheme from "../../../../style/themes/saffron-yellow.module.scss";
// import parmaPinkTheme from "../../../../style/themes/parma-pink.module.scss";
// // import crimsonRedTheme from "../../../../style/themes/crimson-red.module.scss";
// import sparklingIndigoTheme from "../../../../style/themes/void-indigo.module.scss";


// type TThemeFieldProps = {
//     name: string;
//     control: Control<any>;
//     label?: string | React.ReactNode;
// }

// type TThemeOption = {
//     title: string,
//     value: string,//TThemeKey,
//     Icon: React.ComponentType<LucideProps>,
//     className: string,
// };

// const themeOptions: TThemeOption[] = [
//     {
//         title: 'Leaf Green',
//         value: 'leafGreen',
//         Icon: Leaf,
//         className: leafGreenTheme.leafGreen,
//     },
//     {
//         title: 'Azure Blue',
//         value: 'azureBlue',
//         Icon: Waves,
//         className: azureBlueTheme.azureBlue,
//     },
//     {
//         title: 'Silver Gray',
//         value: 'silverGray',
//         Icon: MoonStar,
//         className: silverGrayTheme.silverGray,
//     },
//     {
//         title: 'Carmine Red',
//         value: 'carmineRed',
//         Icon: Flame,
//         className: carmineRedTheme.carmineRed,
//     },
//     {
//         title: 'Lavender Purple',
//         value: 'lavenderPurple',
//         Icon: Flower,
//         className: lavenderPurpleTheme.lavenderPurple,
//     },
//     // {
//     //     title: 'Celadon Green',
//     //     value: 'celadon-green',
//     //     Icon: Waves,
//     //     className: celadonGreenTheme.celadonGreen,
//     // },
//     {
//         title: 'Saffron Yellow',
//         value: 'saffronYellow',
//         Icon: Sun,
//         className: saffronYellowTheme.saffronYellow,
//     },
//     {
//         title: 'Parma Pink',
//         value: 'parmaPink',
//         Icon: Heart,
//         className: parmaPinkTheme.parmaPink,
//     },
//     // {
//     //     title: 'Crimson Red',
//     //     value: 'crimson-red',
//     //     Icon: Zap,
//     //     className: crimsonRedTheme.crimsonRed,
//     // },
//     {
//         title: 'Void Indigo',
//         value: 'voidIndigo',
//         Icon: Hexagon,
//         className: sparklingIndigoTheme.voidIndigo,
//     },
// ];

// const ThemeField = ({
//     name,
//     control,
//     label,
// }: TThemeFieldProps) => {

//     return <FormField
//         name={name}
//         control={control}
//         render={({ field }) => (
//             <FormItem>
//                 {label ? <FormLabel>{label}</FormLabel> : null}
//                 <FormControl>
//                     <RadioGroup
//                         onValueChange={field.onChange}
//                         defaultValue={field.value as string | undefined}
//                         className={styles.themeOptions}
//                     >
//                         {themeOptions.map((theme) => (
//                             <FormItem key={`form-item-theme-${theme.value}`} className={cn(
//                                 styles.themeOptionItem,
//                                 theme.className,
//                             )}>
//                                 <FormControl>
//                                     <RadioGroupItem
//                                         value={theme.value}
//                                         className={formStyles.radioWithLargeHitArea}
//                                     />
//                                 </FormControl>
//                                 <FormLabel className={cn(
//                                     styles.themeOption,
//                                     theme.className,
//                                 )}>
//                                     <div className={styles.themeOptionIcon}>
//                                         <theme.Icon size={18} />
//                                     </div>
//                                     {theme.title}
//                                 </FormLabel>
//                             </FormItem>
//                         ))}
//                     </RadioGroup>
//                 </FormControl>
//                 <FormMessage />
//             </FormItem>
//         )}
//     />;
// };

// export {
//     ThemeField,
// };
