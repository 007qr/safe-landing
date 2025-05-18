export interface DisputeEvidenceInfoInput {
  disputeId: string;
  connectionId: string;
  provider: string;
}

export interface TextEvidences {
  accessActivityLog: string | null;
  cancellationPolicyDisclosure: string | null;
  cancellationRebuttal: string | null;
  customerEmailAddress: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  refundPolicyDisclosure: string | null;
  refundRefusalExplanation: string | null;
  uncategorizedText: string | null;
  customerPurchaseIp: string | null;
  customerSignature: string | null;
  shippingDocumentation: string | null;
  shippingDate: string | null;
  shippingCarrier: string | null;
  shippingTrackingNumber: string | null;
  productDescription: string | null;
  serviceDate: string | null;
  serviceDocumentation: string | null;
  duplicateChargeId: string | null;
  duplicateChargeExplanation: string | null;
  duplicateChargeDocumentation: string | null;
}

export interface DisputeEvidenceInfo {
  disputeId: string;
  connectionId: string;
  disputeEvidenceId: string | null;
  textEvidences: TextEvidences | null;
  businessType?: string | null;
  workspaceId?: string | null;
  status?: string | null;
  submitEvidence?: boolean | null;
  requiredFields?: string[] | null;
  address?: Address | null;
  fileEvidences?: FileEvidences | null;
}

export interface FileEvidences {
  cancellationPolicy: string | null;
  customerCommunication: string | null;
  refundPolicy: string | null;
  serviceDocumentation: string | null;
  shippingDocumentation: string | null;
  uncategorizedFile: string | null;
}

export interface Address {
  zip: string | null;
  city: string | null;
  country: string | null;
  address1: string | null;
  address2: string | null;
  name: string | null;
  phone: string | null;
  company: string | null;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
  lastName: string | null;
  firstName: string | null;
  countryCode: string | null;
  provinceCode: string | null;
}

export interface GetDisputeEvidenceInfoResponse {
  getDisputeEvidenceInfo: DisputeEvidenceInfo;
}

// Dispute States and Status
export enum DisputeStateEnum {
  WARNING = 'warning',
  NEEDS_RESPONSE = 'needs_response',
  SUBMITTED = 'submitted',
  WON = 'won',
  LOST = 'lost',
  PENDING_RESPONSE_FROM_BANK = 'pending_response_from_bank',
  NOT_RESPONDED = 'not_responded'
}

export interface DisputeState {
  state: DisputeStateEnum;
  label: string;
}

export type DisputeStates = DisputeState;

// Card and Customer Information
export interface CustomerInfo {
  name: string;
  cardNumber: number;
  disputeReason: string;
  amount: string;
}

// AI-related types
export const aiText = "I'll help you respond to this dispute by automatically retrieving relevant information from your account.";

export interface AIStep {
  text: string;
  completed: boolean;
}