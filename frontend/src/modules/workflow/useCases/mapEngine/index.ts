// @@ map engine parts
// import calcIdFrequencies from './mapEngineParts/calcIdFrequencies';
// import calcUniqueSwitchSequences from './mapEngineParts/calcUniqueSwitchSequences';
// import calcBaseMapPoints from './mapEngineParts/calcBaseMapPoints';
// import calcMapPoints from './mapEngineParts/calcMapPoints';
// import connectMapPoints from './mapEngineParts/connectMapPoints';

import calcIdFrequencies from './mapEngineParts_02_01_2024_test/calcIdFrequencies';
import calcUniqueSwitchSequences from './mapEngineParts_02_01_2024_test/calcUniqueSwitchSequences';
import calcBaseMapPoints from './mapEngineParts_02_01_2024_test/calcBaseMapPoints';
import calcMapPoints from './mapEngineParts_02_01_2024_test/calcMapPoints';
import connectMapPoints from './mapEngineParts_02_01_2024_test/connectMapPoints';


// @@ workflow
import { createWorkflowFromText } from '../../engine/create-workflow-from-text';


export default function mapEngine( workflowInfos: ReturnType<typeof createWorkflowFromText> ) {

    const calcWorkflowMapPoints = () => {

        console.time('calcUniqueSwitchSequences');
        const uniqueSwitchSequences = calcUniqueSwitchSequences(workflowInfos);
        console.timeEnd('calcUniqueSwitchSequences');

        console.time('calcIdFrequencies');
        const { idFrequencies, uniqueWorkflowPaths, flatPaths, } = calcIdFrequencies(uniqueSwitchSequences, workflowInfos.generatorFn);
        console.timeEnd('calcIdFrequencies');

        console.time('calcBaseMapPoints');
        const baseMapPoints = calcBaseMapPoints(idFrequencies, uniqueWorkflowPaths, workflowInfos.switches);
        console.timeEnd('calcBaseMapPoints');

        console.time('calcMapPoints');
        const mapPoints = calcMapPoints(baseMapPoints, uniqueSwitchSequences, uniqueWorkflowPaths, flatPaths);
        console.timeEnd('calcMapPoints');

        console.time('connectMapPoints');
        const connectedMapPoints = connectMapPoints(mapPoints);
        console.timeEnd('connectMapPoints');

        return {
            mapPoints,
            connectedMapPoints,
        };
    };

    return calcWorkflowMapPoints;
}
