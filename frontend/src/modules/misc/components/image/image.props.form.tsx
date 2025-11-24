// import React, { useContext, useState } from "react";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "../../../../components/ui/form/form/form";
// import { ConfigurableImagePropsSchema } from "./image"
// import { usePropsForm } from "../../../../hooks/use-props-form";
// import { PictureUpload } from "../../../../components/ui/form/base-fields/picture-upload/picture-upload";
// import { PnPContext } from "../../../builder/contexts/pnp.context";
// import Service from "../../../../models/misc/service/service.model";
// import { createLibraryServerRelativePath } from "../../../../utils/document-library.utils";
// import { toast } from "sonner";
// import { extractErrorMessage } from "../../../../utils/error.utils";
// import { ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, ArrowUpFromLine, Loader, MoveVertical, SquareRoundCorner } from "lucide-react";
// import { cn } from "../../../../lib/utils";
// import { radii } from "../../data/radii";
// import { extractSchemaKeys } from "../../../../utils/zod.utils";
// import styles from '../../../../components/ui/form/form/form.module.scss';
// import { Badge } from "../../../../components/ui/badge/badge";
// import { MultipleSliders } from "../section-2-columns/multiple-sliders";


// export function ImagePropsForm(): React.ReactElement {

//     const [isLoading, setIsLoading] = useState(false);
//     const keys = extractSchemaKeys(ConfigurableImagePropsSchema);
//     const form = usePropsForm({
//         schema: ConfigurableImagePropsSchema,
//         processValues: async ({
//             previousProcessedValues,
//             previousValues,
//             values,
//         }) => {

//             const processedValues = {
//                 ...values,

//                 ...('imageUrl' in values ? {
//                     imageUrl: await getImageUrl().then(url => {
//                         setIsLoading(false);
//                         return url;
//                     }),
//                 } : {}),
//             };

//             async function getImageUrl(): Promise<string> {

//                 setIsLoading(true);
//                 const libraryServices = Service.generateDocumentLibraryCrudServices({
//                     libraryTitle: 'Misc',
//                 });
//                 const serverRelativePath = createLibraryServerRelativePath('Misc');

//                 // Si la valeur fournie est un lien, c'est qu'il n'y a rien à faire. C'est
//                 // la valeur par défaut qui est restée inchangée.
//                 if (typeof values.imageUrl === 'string' && values.imageUrl.length > 0) {
//                     return values.imageUrl;
//                 }

//                 // Si la valeur fournie est un objet File, et qu'il s'agit du même
//                 // objet que la valeur précédente, c'est qu'il a déjà été traité.
//                 if (values.imageUrl instanceof File && values.imageUrl === previousValues?.imageUrl) {
//                     return previousProcessedValues?.imageUrl as string;
//                 }

//                 // Si la valeur fournie est un objet File, et qu'il s'agit d'un nouveau
//                 // fichier, il faut l'uploader, et possiblement supprimer l'ancienne image.
//                 if (values.imageUrl instanceof File && values.imageUrl !== previousValues?.imageUrl) {

//                     const imageUrlToDelete = typeof previousValues?.imageUrl === 'string'
//                         ? previousValues.imageUrl
//                         : previousProcessedValues?.imageUrl;

//                     if (imageUrlToDelete) {
//                         const file = await libraryServices.fetchFile.execute({
//                             sp,
//                             serverRelativePath: imageUrlToDelete as string,
//                         });

//                         if (!(file instanceof Error)) {

//                             await libraryServices.deleteItem.execute({
//                                 sp,
//                                 itemId: file.ListItemAllFields.Id,
//                             });
//                         }
//                     }

//                     const result = await libraryServices.createFile.execute({
//                         sp,
//                         serverRelativePath,
//                         file: values.imageUrl, // file à uploader
//                     });

//                     if (!(result instanceof Error)) {

//                         return result.ServerRelativeUrl;

//                     } else {

//                         const message = extractErrorMessage(result);

//                         toast.error(`An error occurred.`, {
//                             description: message,
//                             duration: Number.POSITIVE_INFINITY,
//                         });

//                         return '';
//                     }
//                 }

//                 return '';
//             }

//             return processedValues;
//         },
//     });

//     return <Form {...form}>
//         <form
//             className={styles.propsForm}
//         >
//             {/* Formulaire */}
//             <div className={cn(
//                 styles.propsFormContent,
//                 isLoading && styles.propsFormContentLoading,
//             )}>

//                 {/* Miniature */}
//                 <FormField
//                     control={form.control}
//                     name={keys.imageUrl}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Image</FormLabel>
//                             <FormControl>
//                                 <PictureUpload
//                                     value={field.value as any}
//                                     onChange={field.onChange}
//                                     variant="rectangular"
//                                 />
//                             </FormControl>
//                             <FormDescription>
//                                 The image to display.
//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 {/* Spacings */}
//                 <MultipleSliders
//                     sliders={[
//                         {
//                             type: "synchronized-sliders",
//                             synchronizedSliderTitle: "Margin X",
//                             synchronizedSliderIcon: <><ArrowLeftFromLine size={14} /> <ArrowRightFromLine size={14} /></>,
//                             sliders: [
//                                 {
//                                     title: "Margin left",
//                                     key: keys.marginLeft,
//                                     icon: <ArrowLeftFromLine size={14} />,
//                                 },
//                                 {
//                                     title: "Margin right",
//                                     key: keys.marginRight,
//                                     icon: <ArrowRightFromLine size={14} />,
//                                 },
//                             ]
//                         },
//                         {
//                             type: "synchronized-sliders",
//                             synchronizedSliderTitle: "Margin Y",
//                             synchronizedSliderIcon: <><ArrowUpFromLine size={14} /> <ArrowDownFromLine size={14} /></>,
//                             sliders: [
//                                 {
//                                     title: "Margin top",
//                                     key: keys.marginTop,
//                                     icon: <ArrowUpFromLine size={14} />,
//                                 },
//                                 {
//                                     title: "Margin bottom",
//                                     key: keys.marginBottom,
//                                     icon: <ArrowDownFromLine size={14} />,
//                                 },
//                             ]
//                         },
//                         {
//                             type: 'single-slider',
//                             title: 'Border radius',
//                             icon: <SquareRoundCorner size={14} />,
//                             name: keys.radius,
//                             values: Array.from(radii.entries()).map(([id, { label }]) => ({
//                                 value: id,
//                                 label: label
//                             })),
//                         },
//                         {
//                             type: 'single-slider',
//                             title: 'Height',
//                             icon: <MoveVertical size={14} />,
//                             name: keys.height,
//                             values: Array(1001 - 1).fill(0).map((_, index) => {
//                                 return {
//                                     value: (index + 1).toString(),
//                                     label: `${index + 1}px`,
//                                 }
//                             }),
//                         },
//                         // {
//                         //     type: "synchronized-sliders",
//                         //     synchronizedSliderTitle: "Gap",
//                         //     synchronizedSliderIcon: <><BetweenHorizonalEnd size={14} /><BetweenVerticalEnd size={14} /></>,
//                         //     sliders: [
//                         //         {
//                         //             title: "Row gap",
//                         //             key: keys.rowGap,
//                         //             icon: <BetweenHorizonalEnd size={14} />,
//                         //         },
//                         //         {
//                         //             title: "Column gap",
//                         //             key: keys.columnGap,
//                         //             icon: <BetweenVerticalEnd size={14} />,
//                         //         },
//                         //     ]
//                         // },
//                     ]}
//                     form={form}
//                 />

//             </div>

//             {/* Loader */}
//             <div className={cn(
//                 styles.propsFormLoader,
//                 isLoading && styles.propsFormLoaderLoading,
//             )}>
//                 <Badge
//                     icon={<Loader size={20} className={styles.propsFormLoaderIcon} />}
//                     text="Loading..."
//                 />
//             </div>
//         </form>
//     </Form>;
// }