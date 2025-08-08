/**
 * Utilitaires pour les calculs de paiements et échelonnements
 * Implémente les règles de gestion RG-PAY-ECH-*
 */

export interface PaymentCalculationResult {
  newPaidAmount: number;
  newRemainingAmount: number;
  isFullyPaid: boolean;
  isPartialPayment: boolean;
  newStatus: 'in_progress' | 'completed' | 'partial';
}

export interface InstallmentCalculationResult {
  newPaidAmount: number;
  newRemainingAmount: number;
  isFullyPaid: boolean;
  isPartialPayment: boolean;
  newStatus: 'pending' | 'partial' | 'paid';
}

/**
 * RG-PAY-ECH-1 : Calcul du solde après un nouveau paiement
 * @param currentPaidAmount Montant déjà payé
 * @param totalAmount Montant total dû
 * @param newPaymentAmount Nouveau montant versé
 */
export const calculatePaymentBalance = (
  currentPaidAmount: number,
  totalAmount: number,
  newPaymentAmount: number
): PaymentCalculationResult => {
  const newPaidAmount = currentPaidAmount + newPaymentAmount;
  const newRemainingAmount = Math.max(0, totalAmount - newPaidAmount);
  const isFullyPaid = newRemainingAmount === 0;
  const isPartialPayment = newPaidAmount > 0 && newRemainingAmount > 0;

  let newStatus: 'in_progress' | 'completed' | 'partial';
  if (isFullyPaid) {
    newStatus = 'completed';
  } else if (isPartialPayment) {
    newStatus = 'partial';
  } else {
    newStatus = 'in_progress';
  }

  return {
    newPaidAmount,
    newRemainingAmount,
    isFullyPaid,
    isPartialPayment,
    newStatus,
  };
};

/**
 * RG-PAY-ECH-2 : Calcul du solde d'une échéance après un paiement
 * @param currentPaidAmount Montant déjà payé sur l'échéance
 * @param installmentAmount Montant total de l'échéance
 * @param newPaymentAmount Nouveau montant versé
 */
export const calculateInstallmentBalance = (
  currentPaidAmount: number,
  installmentAmount: number,
  newPaymentAmount: number
): InstallmentCalculationResult => {
  const newPaidAmount = currentPaidAmount + newPaymentAmount;
  const newRemainingAmount = Math.max(0, installmentAmount - newPaidAmount);
  const isFullyPaid = newRemainingAmount === 0;
  const isPartialPayment = newPaidAmount > 0 && newRemainingAmount > 0;

  let newStatus: 'pending' | 'partial' | 'paid';
  if (isFullyPaid) {
    newStatus = 'paid';
  } else if (isPartialPayment) {
    newStatus = 'partial';
  } else {
    newStatus = 'pending';
  }

  return {
    newPaidAmount,
    newRemainingAmount,
    isFullyPaid,
    isPartialPayment,
    newStatus,
  };
};

/**
 * RG-PAY-ECH-3 : Validation d'un montant de paiement
 * @param paymentAmount Montant à payer
 * @param remainingAmount Montant restant dû
 */
export const validatePaymentAmount = (
  paymentAmount: number,
  remainingAmount: number
): { isValid: boolean; error?: string } => {
  if (paymentAmount <= 0) {
    return { isValid: false, error: 'Le montant doit être supérieur à 0' };
  }

  if (paymentAmount > remainingAmount) {
    return { 
      isValid: false, 
      error: `Le montant ne peut pas dépasser le solde restant (${remainingAmount} FCFA)` 
    };
  }

  return { isValid: true };
};

/**
 * RG-PAY-ECH-4 : Calcul du statut global d'un échéancier
 * @param installments Liste des échéances
 */
export const calculateScheduleStatus = (installments: any[]): 'in_progress' | 'completed' | 'partial' => {
  const totalInstallments = installments.length;
  const paidInstallments = installments.filter(inst => inst.status === 'paid').length;
  const partialInstallments = installments.filter(inst => inst.status === 'partial').length;

  if (paidInstallments === totalInstallments) {
    return 'completed';
  } else if (paidInstallments > 0 || partialInstallments > 0) {
    return 'partial';
  } else {
    return 'in_progress';
  }
};

/**
 * RG-PAY-ECH-5 : Génération automatique d'un numéro de reçu
 */
export const generateReceiptNumber = (): string => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `REC-${timestamp.toString().slice(-6)}${randomNum}`;
};

/**
 * RG-PAY-ECH-6 : Formatage des montants en FCFA
 * @param amount Montant à formater
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * RG-PAY-ECH-7 : Calcul des totaux d'un échéancier
 * @param installments Liste des échéances
 */
export const calculateScheduleTotals = (installments: any[]) => {
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const paidAmount = installments.reduce((sum, inst) => sum + inst.paidAmount, 0);
  const remainingAmount = totalAmount - paidAmount;

  return {
    totalAmount,
    paidAmount,
    remainingAmount,
    completionPercentage: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0,
  };
};