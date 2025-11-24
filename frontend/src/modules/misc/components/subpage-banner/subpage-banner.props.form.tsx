// import React, { useContext, useState } from "react";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "../../../../components/ui/form/form/form";
// import { ConfigurableSubpageBannerPropsSchema } from "./subpage-banner"
// import { usePropsForm } from "../../../../hooks/use-props-form";
// import { PictureUpload } from "../../../../components/ui/form/base-fields/picture-upload/picture-upload";
// import RichTextEditor from "../../../../components/ui/form/base-fields/rich-text-editor/rich-text-editor";
// import { PnPContext } from "../../../../contexts/pnp.context";
// import Service from "../../../../models/misc/service/service.model";
// import { createLibraryServerRelativePath } from "../../../../../../utils/document-library.utils";
// import { toast } from "sonner";
// import { extractErrorMessage } from "../../../../../../utils/error.utils";
// import { Loader } from "lucide-react";
// import { cn } from "../../../../lib/utils";
// import { extractSchemaKeys } from "../../../../../../utils/zod.utils";
// import styles from '../../../../components/ui/form/form/form.module.scss';
// import { Badge } from "../../../../components/ui/badge/badge";


// const SubpageBannerPropsForm = (): React.ReactElement => {

//     const { sp } = useContext(PnPContext);
//     const [isLoading, setIsLoading] = useState(false);
//     const keys = extractSchemaKeys(ConfigurableSubpageBannerPropsSchema);
//     const form = usePropsForm({
//         schema: ConfigurableSubpageBannerPropsSchema,
//         processValues: async ({
//             previousProcessedValues,
//             previousValues,
//             values,
//         }) => {

//             const processedValues = {
//                 ...values,

//                 ...( 'imageUrl' in values ? {
//                     imageUrl: await getImageUrl().then( url => {
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
//                     ? previousValues.imageUrl
//                     : previousProcessedValues?.imageUrl;

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
//                                 The visual of the banner.
//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 {/* Contenu */}
//                 <FormField
//                     control={form.control}
//                     name={keys.text}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Text</FormLabel>
//                             <FormControl>
//                                 <RichTextEditor {...field as any} />
//                             </FormControl>
//                             <FormDescription>
//                                 Text of the banner.
//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
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
// };


// export {
//     SubpageBannerPropsForm,
// };