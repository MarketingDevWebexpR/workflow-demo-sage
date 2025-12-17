import React, { useEffect, useRef } from "react";
import { cn } from "../../../../lib/utils";
import EditableComponent from "./editable-component";
import { type TPageComponent } from "../../models/page.model";
import { throttle } from "lodash";
import { usePageStore } from "../../store/page.store";
import styles from "./page-renderer.module.scss";
import { useWorkflowAutomationStore } from "../../../workflow/store/workflow-automation.store";
import { config } from "../../../misc/module.config";
import { Sandpack } from '@codesandbox/sandpack-react';
import { SANDPACK_COMPONENTS, getSandpackDependencies, getCombinedStyles } from "./components-code";
import { useVanillaCSSInjection } from "../../../../hooks/use-vanilla-css-injection";


type TPageRendererProps = {
    layerId: 'page' | string,
    layerTitle: string,
}

const PageRenderer = React.forwardRef<
    HTMLDivElement, TPageRendererProps & React.HTMLAttributes<HTMLDivElement>
>(
    ({
        layerId,
        layerTitle,
        className,
        ...props
    }, ref) => {

        const isEditMode = usePageStore(state => state.isEditMode);
        const builder = isEditMode; // Mode édition activé via le toggle
        const moduleConfigs = [config];
        const sandpackCode = usePageStore(state => state.sandpackCode);
        
        const selectedWorkflow = useWorkflowAutomationStore(state => state.workflowItem.selected.item);
        const selectedView = usePageStore(state => state.selected.item);

        // Sélection ciblée des données du store pour éviter les re-renders inutiles
        const editedComponentId = usePageStore(state => state.editedComponentId);
        const dispatch = usePageStore(state => state.dispatch);
        
        console.log('page store', {selectedView, selectedWorkflow});

        // Récupérer les composants depuis selected.item
        let renderedPageComponents: TPageComponent[] = [];
        if (selectedView?.Components) {
            try {
                renderedPageComponents = JSON.parse(selectedView.Components) as TPageComponent[];
            } catch (error) {
                console.error('❌ [PageRenderer] Erreur parsing components:', error);
            }
        }
        const components = renderedPageComponents.filter(component => {
            return component.context?.toString() === layerId?.toString();
        });

        console.log('renderedPageComponents', renderedPageComponents);

        const allModuleComponents = moduleConfigs
            .map(moduleConfig => moduleConfig.components)
            .flat()
            .map(component => component.Component);

        const isMouseOutsideRef = useRef(false);

        useEffect(() => {

            const abortController = new AbortController();

            const onMouseMove = (e: MouseEvent) => {

                const target = e.target as HTMLElement;

                if (!target.closest('[data-page-editor]')) {
                    if (!isMouseOutsideRef.current) {
                        isMouseOutsideRef.current = true;
                        dispatch({ type: 'SET_HOVERED_COMPONENT_ID', payload: null });
                    }
                    return;
                }

                isMouseOutsideRef.current = false;
                const closestComponent = target.closest('[data-page-component-id]')
                    || target.closest('span:has(>[data-page-component-id])')?.querySelector('[data-page-component-id]');

                dispatch({
                    type: 'SET_HOVERED_COMPONENT_ID',
                    payload: closestComponent
                        ? closestComponent.getAttribute('data-page-component-id')
                        : null
                });
            };
            const onScroll = (e: Event) => {

                const target = e.target as HTMLElement;

                if (!target.closest('[data-page-editor]')) {
                    return;
                }

                if (!editedComponentId) {
                    dispatch({ type: 'SET_HOVERED_COMPONENT_ID', payload: null });
                    return;
                }

                dispatch({ 
                    type: 'SET_EDITOR_SCROLL_TOP', 
                    payload: target.closest('[data-page-editor]')?.scrollTop ?? null
                });
            }

            const onScrollThrottled = throttle(onScroll, 0, {
                leading: true,
                trailing: true,
            });
            const onMouseMoveThrottled = throttle(onMouseMove, 100);

            document.addEventListener('mousemove', onMouseMoveThrottled, { signal: abortController.signal });
            document.addEventListener('scroll', onScrollThrottled, {
                signal: abortController.signal,
                capture: true,
            });

            return () => {
                abortController.abort();
            };
        }, [editedComponentId]);

        console.log('components', components);

        useVanillaCSSInjection({
            css: `.sp-preview-actions {
        display: none!important;
        }`,
        id: 'sp-preview-actions-css',
        })
        return <div
            ref={ref}
            className={cn(
                styles.pageRenderer,
                builder && styles.pageRendererBuilder,
                className,
            )}
            {...props}
            data-layer-id={layerId}
            data-layer-title={layerTitle}
        >
            {/* ici */}
            <Sandpack
                template="react-ts"
                theme="light"
                files={{
                    // App.tsx : soit du code généré par l'IA, soit l'exemple par défaut
                    '/App.tsx': sandpackCode || `import React from 'react';
import { Button } from './components/Button';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from './components/Dialog';
import { Input } from './components/Input';
import { Label } from './components/Label';
import { Badge } from './components/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/Card';
import './styles.css';

export default function App() {
  const [name, setName] = React.useState('');
  
  return (
  <div>Discutez avec l'IA dans le panel de gauche pour générer votre IHM.</div>
    
  );
}`,
                    '/components/Button.tsx': SANDPACK_COMPONENTS.button,
                    '/components/Dialog.tsx': SANDPACK_COMPONENTS.dialog,
                    '/components/Input.tsx': SANDPACK_COMPONENTS.input,
                    '/components/Textarea.tsx': SANDPACK_COMPONENTS.textarea,
                    '/components/Label.tsx': SANDPACK_COMPONENTS.label,
                    '/components/Badge.tsx': SANDPACK_COMPONENTS.badge,
                    '/components/Card.tsx': SANDPACK_COMPONENTS.card,
                    '/components/Switch.tsx': SANDPACK_COMPONENTS.switch,
                    '/components/Separator.tsx': SANDPACK_COMPONENTS.separator,
                    '/components/Tabs.tsx': SANDPACK_COMPONENTS.tabs,
                    '/styles.css': getCombinedStyles(),
                }}
                customSetup={{
                    dependencies: getSandpackDependencies([
                        'button', 
                        'dialog', 
                        'input',
                        'textarea',
                        'label', 
                        'badge',
                        'card',
                        'switch',
                        'separator',
                        'tabs'
                    ])
                }}
                options={{
                    showTabs: true,
                    showLineNumbers: true,
                    editorHeight: 778,
                    editorWidthPercentage: 0,
                }}
            />
            {
                builder && components.length === 0
                    ? <></>
                    // <div
                    //     className={styles.emptyBox}
                    //     data-builder-empty-component
                    //     data-keep-pointer-events
                    // >
                    //     <div className={styles.emptyBoxContent}>
                    //         Drag and drop a component here.
                    //     </div>
                    // </div>
                    : components.map(component => {

                        const Component = allModuleComponents.find(moduleComponent => {

                            if (!component) {
                                console.log("%c PageRenderer.tsx : le component à rendre n'est pas conforme.", "background-color: firebrick; padding: 0.5rem; color: white; border-radius: 10px", {
                                    components,
                                    component,
                                })
                            }

                            return moduleComponent.displayName?.toLowerCase() === component.displayName?.toLowerCase();
                        });

                        if (!Component) {

                            return <div
                                key={`page-renderer-not-found-component-${component.id.toString()}`}
                                className="bg-red-100 text-red-800 p-4"
                            >
                                Component {component.displayName?.toString()} not found.
                            </div>;
                        }


                        if (builder) {

                            return <EditableComponent
                                key={`page-renderer-editable-component-${component.id}-${component.updatedAt}`}
                                component={component}
                            >
                                <Component
                                    {...component.props}
                                    data-page-component-id={component.id}
                                    data-page-component-props={JSON.stringify(component.props)}
                                    data-page-component-display-name={component.displayName}
                                />
                            </EditableComponent>;
                        }

                        return <Component
                            key={`page-renderer-component-${component.id}`}
                            {...component.props}
                            data-page-component-id={component.id}
                            data-page-component-props={JSON.stringify(component.props)}
                            data-page-component-display-name={component.displayName}
                        />;
                    })
            }
        </div>;
    });

PageRenderer.displayName = "PageRenderer";


export {
    PageRenderer,
    type TPageRendererProps,
}