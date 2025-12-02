/**
 * 🎯 DÉMONSTRATION du Logic Engine
 *
 * Ce fichier montre comment utiliser le Logic Engine de manière concrète
 */

import { Logic, evaluate } from './index';


/**
 * Type exemple pour la démo
 */
type TDemoFormValues = {
    expertiseDomains: string[];
    continueBNPParibas: string;
    prioritySearch: string;
    role: string;
    experience: number;
    override: boolean;
};


/**
 * ✅ EXEMPLE 1 : Règle simple
 */
const simpleRule = Logic.includes<TDemoFormValues>('expertiseDomains', 'autre');

// Test
const testData1: TDemoFormValues = {
    expertiseDomains: ['finance', 'audit', 'autre'],
    continueBNPParibas: '',
    prioritySearch: '',
    role: '',
    experience: 0,
    override: false,
};

const result1 = evaluate(simpleRule, testData1);
console.log('✅ Exemple 1 - Result:', result1); // → true

// Sérialisation JSON
const json1 = JSON.stringify(simpleRule, null, 2);
console.log('✅ Exemple 1 - JSON:', json1);
/*
{
  "operator": "includes",
  "args": ["expertiseDomains", "autre"]
}
*/


/**
 * ✅ EXEMPLE 2 : Règle avec ET
 */
const andRule = Logic.and<TDemoFormValues>(
    Logic.notEquals('prioritySearch', 'vie'),
    Logic.notEquals('prioritySearch', 'stage')
);

// Test
const testData2: TDemoFormValues = {
    expertiseDomains: [],
    continueBNPParibas: '',
    prioritySearch: 'cdi',
    role: '',
    experience: 0,
    override: false,
};

const result2 = evaluate(andRule, testData2);
console.log('✅ Exemple 2 - Result:', result2); // → true

// Sérialisation JSON
const json2 = JSON.stringify(andRule, null, 2);
console.log('✅ Exemple 2 - JSON:', json2);
/*
{
  "operator": "and",
  "args": [
    { "operator": "notEquals", "args": ["prioritySearch", "vie"] },
    { "operator": "notEquals", "args": ["prioritySearch", "stage"] }
  ]
}
*/


/**
 * ✅ EXEMPLE 3 : Règle complexe avec OU imbriqué
 */
const complexRule = Logic.or<TDemoFormValues>(
    // Branche 1 : Manager expérimenté
    Logic.and(
        Logic.equals('role', 'manager'),
        Logic.greaterThan('experience', 5)
    ),
    // Branche 2 : Override activé
    Logic.equals('override', true)
);

// Test - Manager avec 6 ans d'exp
const testData3a: TDemoFormValues = {
    expertiseDomains: [],
    continueBNPParibas: '',
    prioritySearch: '',
    role: 'manager',
    experience: 6,
    override: false,
};

const result3a = evaluate(complexRule, testData3a);
console.log('✅ Exemple 3a - Result:', result3a); // → true

// Test - Override activé
const testData3b: TDemoFormValues = {
    expertiseDomains: [],
    continueBNPParibas: '',
    prioritySearch: '',
    role: 'junior',
    experience: 1,
    override: true,
};

const result3b = evaluate(complexRule, testData3b);
console.log('✅ Exemple 3b - Result:', result3b); // → true

// Sérialisation JSON
const json3 = JSON.stringify(complexRule, null, 2);
console.log('✅ Exemple 3 - JSON:', json3);
/*
{
  "operator": "or",
  "args": [
    {
      "operator": "and",
      "args": [
        { "operator": "equals", "args": ["role", "manager"] },
        { "operator": "greaterThan", "args": ["experience", 5] }
      ]
    },
    { "operator": "equals", "args": ["override", true] }
  ]
}
*/


/**
 * ✅ EXEMPLE 4 : Reconstruction depuis JSON
 */
const jsonString = `{
  "operator": "includes",
  "args": ["expertiseDomains", "autre"]
}`;

const reconstructedRule = JSON.parse(jsonString);
const result4 = evaluate(reconstructedRule, testData1);
console.log('✅ Exemple 4 - Reconstructed from JSON:', result4); // → true


/**
 * ✅ EXEMPLE 5 : Mode debug
 */
const debugResult = evaluate(simpleRule, testData1, true);
console.log('✅ Exemple 5 - Debug mode:', debugResult);
// Affiche des logs détaillés dans la console


/**
 * 📊 RÉSUMÉ
 *
 * Le Logic Engine permet de :
 * 1. ✅ Créer des règles type-safe avec Logic.xxx()
 * 2. ✅ Les évaluer avec evaluate(rule, data)
 * 3. ✅ Les sérialiser en JSON avec JSON.stringify()
 * 4. ✅ Les reconstruire depuis JSON avec JSON.parse()
 * 5. ✅ Les stocker en DB SharePoint
 * 6. ✅ Les débugger avec le mode debug
 */


export {
    simpleRule,
    andRule,
    complexRule,
};

