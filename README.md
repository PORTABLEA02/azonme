# School Management System - Règles de Gestion des Paiements

## Système d'Échelonnement des Paiements

### Vue d'ensemble
Le système implémente une gestion complète des paiements avec échelonnement, permettant aux élèves de payer leurs frais scolaires de manière flexible tout en maintenant un suivi précis des soldes.

### Règles de Gestion Implémentées

#### RG-PAY-ECH-1 : Calcul automatique des soldes
- **Principe** : À chaque encaissement, le système recalcule automatiquement :
  - Le montant total payé
  - Le solde restant
  - Le statut du paiement
- **Formule** : `Solde restant = Montant total dû - Montant déjà payé`
- **Implémentation** : Fonction `calculatePaymentBalance()` dans `src/utils/paymentCalculations.ts`

#### RG-PAY-ECH-2 : Gestion des échéances
- **Principe** : Chaque paiement peut être affecté à une échéance spécifique
- **Fonctionnement** :
  - Mise à jour automatique de l'échéance concernée
  - Recalcul du statut de l'échéance (pending → partial → paid)
  - Conservation de l'historique des paiements par échéance
- **Implémentation** : Fonction `calculateInstallmentBalance()`

#### RG-PAY-ECH-3 : Validation des montants
- **Principe** : Validation stricte des montants de paiement
- **Règles** :
  - Montant > 0
  - Montant ≤ Solde restant
  - Pas de sur-paiement autorisé
- **Implémentation** : Fonction `validatePaymentAmount()`

#### RG-PAY-ECH-4 : Gestion des statuts
- **Statuts des paiements** :
  - `in_progress` : Paiement commencé mais non terminé
  - `partial` : Paiement partiel effectué
  - `completed` : Paiement entièrement terminé
- **Statuts des échéances** :
  - `pending` : Aucun paiement
  - `partial` : Paiement partiel
  - `paid` : Échéance entièrement payée

#### RG-PAY-ECH-5 : Génération des reçus
- **Principe** : Génération automatique d'un numéro de reçu unique
- **Format** : `REC-{timestamp}{random}`
- **Implémentation** : Fonction `generateReceiptNumber()`

### Structure des Données

#### PaymentSchedule (Échéancier)
```typescript
{
  id: string;
  studentId: string;
  paymentTypeId: string;
  totalAmount: number;      // Montant total dû
  paidAmount: number;       // Montant déjà payé
  remainingAmount: number;  // Solde restant
  status: 'in_progress' | 'completed' | 'cancelled';
  installments: PaymentInstallment[];
}
```

#### PaymentInstallment (Échéance)
```typescript
{
  id: string;
  amount: number;           // Montant de l'échéance
  paidAmount: number;       // Montant payé sur cette échéance
  remainingAmount: number;  // Solde restant sur cette échéance
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  payments: Payment[];      // Historique des paiements
}
```

### Fonctionnalités Utilisateur

#### Interface d'Encaissement
- **Localisation** : `src/components/payments/PaymentCollectionInterface.tsx`
- **Fonctionnalités** :
  - Vue d'ensemble des élèves et leurs soldes
  - Indicateurs visuels pour les retards
  - Accès rapide aux paiements

#### Formulaire de Paiement
- **Localisation** : `src/components/payments/PaymentForm.tsx`
- **Fonctionnalités** :
  - Choix entre paiement global ou par échéance
  - Aperçu en temps réel des calculs
  - Validation automatique des montants
  - Génération automatique des reçus

#### Gestion des Échéanciers
- **Localisation** : `src/components/payments/InstallmentPlanModal.tsx`
- **Fonctionnalités** :
  - Vue détaillée de chaque échéance
  - Suivi de la progression des paiements
  - Historique complet des transactions

### Calculs Automatiques

#### Exemple de Fonctionnement
1. **Situation initiale** :
   - Frais de scolarité : 450 000 FCFA
   - Payé : 0 FCFA
   - Restant : 450 000 FCFA
   - Statut : `in_progress`

2. **Premier paiement de 150 000 FCFA** :
   - Payé : 150 000 FCFA
   - Restant : 300 000 FCFA
   - Statut : `partial`

3. **Deuxième paiement de 300 000 FCFA** :
   - Payé : 450 000 FCFA
   - Restant : 0 FCFA
   - Statut : `completed`

### Sécurité et Traçabilité

- **Historique complet** : Tous les paiements sont conservés
- **Numéros de reçu uniques** : Traçabilité garantie
- **Validation des montants** : Prévention des erreurs
- **Calculs automatiques** : Réduction des erreurs humaines

### Technologies Utilisées

- **TypeScript** : Typage strict pour la sécurité
- **React** : Interface utilisateur réactive
- **Utilitaires de calcul** : Fonctions pures et testables
- **Formatage des devises** : Support du Franc CFA (XOF)

### Tests et Validation

Les fonctions de calcul sont conçues pour être facilement testables :
- Fonctions pures sans effets de bord
- Validation des entrées
- Gestion des cas d'erreur
- Documentation complète des règles métier