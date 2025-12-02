# 🧠 Logic Engine - Documentation

Système de règles logiques type-safe et JSON-serializable pour le Form Engine.

---

## 📚 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Utilisation de base](#utilisation-de-base)
3. [Opérateurs disponibles](#opérateurs-disponibles)
4. [Exemples avancés](#exemples-avancés)
5. [Format JSON](#format-json)
6. [Type-safety](#type-safety)
7. [Ajout d'un nouvel opérateur](#ajout-dun-nouvel-opérateur)

---

## 🎯 Vue d'ensemble

Le Logic Engine permet de créer des **règles de visibilité conditionnelle** qui sont :
- ✅ **100% type-safe** (TypeScript natif)
- ✅ **Sérialisables en JSON** (stockage en DB SharePoint)
- ✅ **Extensibles** (ajout d'opérateurs en 2 lignes)
- ✅ **Testables** (pure functions)

---

## 🚀 Utilisation de base

### Import

```typescript
import { Logic, evaluate } from '../logic';
```

### Créer une règle simple

```typescript
// Vérifie si expertiseDomains contient "autre"
const rule = Logic.includes<TQuestionnaireFormValues>('expertiseDomains', 'autre');

// Évaluer la règle
const result = evaluate(rule, formValues);
// → true ou false
```

### Créer une règle complexe

```typescript
// (role === "manager" ET experience > 5) OU override === true
const rule = Logic.or<TFormValues>(
  Logic.and<TFormValues>(
    Logic.equals('role', 'manager'),
    Logic.greaterThan('experience', 5)
  ),
  Logic.equals('override', true)
);

const result = evaluate(rule, formValues);
```

---

## 📖 Opérateurs disponibles

### Comparaisons

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `equals` | Égalité stricte (`===`) | `Logic.equals('status', 'active')` |
| `notEquals` | Inégalité stricte (`!==`) | `Logic.notEquals('role', 'admin')` |
| `greaterThan` | Supérieur (`>`) | `Logic.greaterThan('age', 18)` |
| `lessThan` | Inférieur (`<`) | `Logic.lessThan('count', 100)` |
| `greaterThanOrEqual` | Supérieur ou égal (`>=`) | `Logic.greaterThanOrEqual('score', 50)` |
| `lessThanOrEqual` | Inférieur ou égal (`<=`) | `Logic.lessThanOrEqual('price', 1000)` |

### Chaînes et tableaux

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `includes` | Contient (array ou string) | `Logic.includes('tags', 'urgent')` |
| `startsWith` | Commence par | `Logic.startsWith('email', 'admin')` |
| `endsWith` | Se termine par | `Logic.endsWith('filename', '.pdf')` |
| `arrayLength` | Longueur d'un tableau | `Logic.arrayLength('items')` |
| `arrayIsEmpty` | Tableau vide | `Logic.arrayIsEmpty('selections')` |

### Logique

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `and` | ET logique | `Logic.and(rule1, rule2, rule3)` |
| `or` | OU logique | `Logic.or(rule1, rule2)` |
| `not` | NON logique | `Logic.not(rule1)` |

### Utilitaires

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `var` | Récupère une valeur | `Logic.var('username')` |

---

## 🎨 Exemples avancés

### Exemple 1 : Validation d'âge

```typescript
// Afficher le champ si l'utilisateur a entre 18 et 65 ans
const ageRule = Logic.and<TFormValues>(
  Logic.greaterThanOrEqual('age', 18),
  Logic.lessThanOrEqual('age', 65)
);
```

### Exemple 2 : Validation de sélection multiple

```typescript
// Afficher si l'utilisateur a sélectionné entre 1 et 3 domaines
const selectionRule = Logic.and<TFormValues>(
  Logic.not(Logic.arrayIsEmpty('expertiseDomains')),
  Logic.lessThanOrEqual(
    Logic.arrayLength('expertiseDomains') as any, // Note: limitation TypeScript
    3
  )
);
```

### Exemple 3 : Conditions métier complexes

```typescript
// Afficher si :
// - L'utilisateur est manager avec +5 ans d'exp
// - OU directeur avec budget > 100k
// - OU override activé
const businessRule = Logic.or<TFormValues>(
  Logic.and(
    Logic.equals('role', 'manager'),
    Logic.greaterThan('experience', 5)
  ),
  Logic.and(
    Logic.equals('role', 'director'),
    Logic.greaterThan('budget', 100000)
  ),
  Logic.equals('override', true)
);
```

---

## 📄 Format JSON

Toutes les règles créées avec `Logic.xxx()` sont **automatiquement sérialisables en JSON** :

### TypeScript → JSON

```typescript
// TypeScript
const rule = Logic.includes<TFormValues>('expertiseDomains', 'autre');

// Sérialisé en JSON
JSON.stringify(rule);
// → {"operator":"includes","args":["expertiseDomains","autre"]}
```

### Exemple complet

```json
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
```

**Stockage SharePoint** : Ce JSON peut être stocké dans une colonne `Multiple lines of text` !

---

## 🔒 Type-safety

Le système est **entièrement type-safe** grâce aux types discriminés :

```typescript
// ✅ TypeScript accepte
Logic.equals<TFormValues>('role', 'manager');

// ❌ TypeScript refuse (champ inexistant)
Logic.equals<TFormValues>('invalidField', 'value');

// ❌ TypeScript refuse (opérateur invalide dans JSON)
{ operator: 'INVALID', args: [] }
```

Les `args` sont typés en fonction de l'opérateur :

```typescript
type EqualsRule<T> = {
  operator: 'equals';
  args: [Path<T>, T[Path<T>]]; // ← Type exact du champ !
};

type GreaterThanRule<T> = {
  operator: 'greaterThan';
  args: [Path<T>, number]; // ← Doit être un nombre
};
```

---

## 🛠️ Ajout d'un nouvel opérateur

Exemple : Ajouter un opérateur `isEmail`

### 1. Ajouter le type dans `types.ts`

```typescript
type IsEmailRule<T extends FieldValues> = {
    operator: 'isEmail';
    args: [Path<T>];
};

// L'ajouter à l'union
type LogicRule<T extends FieldValues> =
    | IsEmailRule<T>
    | // ... autres types
```

### 2. Créer l'opérateur dans `operators.ts`

```typescript
const isEmailOperator = <T extends FieldValues>(
    args: [keyof T],
    data: T
): boolean => {
    const value = data[args[0]];
    if (typeof value !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export { isEmailOperator };
```

### 3. L'enregistrer dans `evaluator.ts`

```typescript
case 'isEmail':
    result = isEmailOperator(rule.args, data);
    break;
```

### 4. Ajouter au builder `builder.ts`

```typescript
isEmail: <T extends FieldValues>(
    field: Path<T>
): IsEmailRule<T> => ({
    operator: 'isEmail',
    args: [field],
}),
```

### 5. Utiliser !

```typescript
const rule = Logic.isEmail<TFormValues>('email');
```

**C'est tout ! ✅**

---

## 🧪 Tests (TODO)

```typescript
// form-engine/logic/__tests__/evaluator.test.ts
import { Logic, evaluate } from '../index';

describe('Logic Engine', () => {
  it('evaluates includes correctly', () => {
    const rule = Logic.includes('tags', 'urgent');
    expect(evaluate(rule, { tags: ['urgent', 'high'] })).toBe(true);
  });

  it('handles undefined gracefully', () => {
    const rule = Logic.includes('tags', 'test');
    expect(evaluate(rule, {})).toBe(false); // Pas de crash
  });
});
```

---

## 📝 Notes

- Les règles sont **immutables** (pas d'effet de bord)
- L'évaluation est **pure** (même input → même output)
- Le système est **extensible** (nouveaux opérateurs en 5 min)
- Compatible avec **SharePoint** (JSON pur)

