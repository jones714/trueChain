/**
 * TypeScript types for Metrc API v2
 * Minnesota Cannabis Tracking System
 */

// ==========================================
// PACKAGES
// ==========================================

export interface MetrcPackage {
  Id: number;
  Label: string;
  PackageType: string;
  ProductId: number | null;
  ProductName: string | null;
  ProductCategoryName: string | null;
  Quantity: number;
  UnitOfMeasureId: number;
  UnitOfMeasureName: string;
  UnitOfMeasureAbbreviation: string;
  PatientLicenseNumber: string | null;
  ItemId: number | null;
  Item: MetrcItem | null;
  IsProductionBatch: boolean;
  ProductionBatchNumber: string | null;
  SourceProductionBatchNumbers: string | null;
  IsTradeSample: boolean;
  IsTesting: boolean;
  ProductRequiresRemediation: boolean;
  ContainsRemediatedProduct: boolean;
  RemediationDate: string | null;
  ReceivedDateTime: string | null;
  ReceivedFromManifestNumber: string | null;
  ReceivedFromFacilityLicenseNumber: string | null;
  ReceivedFromFacilityName: string | null;
  IsOnHold: boolean;
  ArchivedDate: string | null;
  FinishedDate: string | null;
  LastModified: string;
  PackagedDate: string;
  InitialLabTestingState: string | null;
  LabTestingState: string | null;
  LabTestingStateDate: string | null;
}

export interface MetrcItem {
  Id: number;
  Name: string;
  ProductCategoryName: string;
  ProductCategoryType: string;
  QuantityType: string;
  DefaultLabTestingState: string;
  UnitOfMeasureId: number;
  ApprovalStatus: string;
  StrainId: number | null;
  StrainName: string | null;
  ItemBrandId: number | null;
  ItemBrand: MetrcItemBrand | null;
  AdministrationMethod: string | null;
  UnitCbdPercent: number | null;
  UnitCbdContent: number | null;
  UnitCbdContentUnitOfMeasureAbbreviation: string | null;
  UnitThcPercent: number | null;
  UnitThcContent: number | null;
  UnitThcContentUnitOfMeasureAbbreviation: string | null;
  UnitVolume: number | null;
  UnitVolumeUnitOfMeasureAbbreviation: string | null;
  UnitWeight: number | null;
  UnitWeightUnitOfMeasureAbbreviation: string | null;
  ServingSize: string | null;
  SupplyDurationDays: number | null;
  Ingredients: string | null;
  Description: string | null;
  IsUsed: boolean;
}

export interface MetrcItemBrand {
  Id: number;
  Name: string;
}

// ==========================================
// PLANTS
// ==========================================

export interface MetrcPlant {
  Id: number;
  Label: string;
  State: 'Vegetative' | 'Flowering' | 'Inactive' | 'Tracked' | 'Harvested';
  GrowthPhase: string;
  PlantBatchId: number | null;
  PlantBatchName: string | null;
  PlantBatchTypeName: string | null;
  StrainId: number;
  StrainName: string;
  LocationId: number | null;
  LocationName: string | null;
  LocationTypeName: string | null;
  PatientLicenseNumber: string | null;
  HarvestId: number | null;
  HarvestedDate: string | null;
  DestroyedDate: string | null;
  DestroyedNote: string | null;
  DestroyedByUserName: string | null;
  PlantedDate: string;
  VegetativeDate: string | null;
  FloweringDate: string | null;
  LastModified: string;
}

export interface MetrcPlantBatch {
  Id: number;
  Name: string;
  Type: string;
  LocationId: number | null;
  LocationName: string | null;
  StrainId: number;
  StrainName: string;
  PatientLicenseNumber: string | null;
  UntrackedCount: number;
  TrackedCount: number;
  PackagedCount: number;
  HarvestedCount: number;
  DestroyedCount: number;
  SourcePackageId: number | null;
  SourcePackageLabel: string | null;
  SourcePlantId: number | null;
  SourcePlantLabel: string | null;
  SourcePlantBatchId: number | null;
  SourcePlantBatchName: string | null;
  PlantedDate: string;
  LastModified: string;
}

// ==========================================
// TRANSFERS
// ==========================================

export interface MetrcTransfer {
  Id: number;
  ManifestNumber: string;
  ShipmentLicenseType: string;
  ShipperFacilityLicenseNumber: string;
  ShipperFacilityName: string;
  TransporterFacilityLicenseNumber: string | null;
  TransporterFacilityName: string | null;
  DriverName: string;
  DriverLicenseNumber: string;
  DriverVehicleLicenseNumber: string;
  VehicleMake: string;
  VehicleModel: string;
  VehicleLicensePlateNumber: string;
  DeliveryCount: number;
  ReceivedDeliveryCount: number;
  PackageCount: number;
  ReceivedPackageCount: number;
  CreatedDateTime: string;
  CreatedByUserName: string;
  LastModified: string;
  DeliveryId: number;
  RecipientFacilityLicenseNumber: string;
  RecipientFacilityName: string;
  ShipmentTypeName: string;
  ShipmentTransactionType: string;
  EstimatedDepartureDateTime: string;
  ActualDepartureDateTime: string | null;
  EstimatedArrivalDateTime: string;
  ActualArrivalDateTime: string | null;
  DeliveryPackageCount: number;
  DeliveryReceivedPackageCount: number;
  ReceivedDateTime: string | null;
}

export interface MetrcTransferPackage {
  PackageId: number;
  PackageLabel: string;
  ProductName: string;
  ProductCategoryName: string;
  ItemUnitWeight: number | null;
  ItemUnitWeightUnitOfMeasureAbbreviation: string | null;
  PackagedDate: string;
  GrossWeight: number | null;
  GrossWeightUnitOfMeasureAbbreviation: string | null;
  ShippedQuantity: number;
  ShippedUnitOfMeasureAbbreviation: string;
  ReceivedQuantity: number | null;
  ReceivedUnitOfMeasureAbbreviation: string | null;
}

// ==========================================
// SALES
// ==========================================

export interface MetrcSalesReceipt {
  Id: number;
  ReceiptNumber: string | null;
  SalesDateTime: string;
  SalesCustomerType: string;
  PatientLicenseNumber: string | null;
  CaregiverLicenseNumber: string | null;
  IdentificationMethod: string | null;
  TotalPackages: number;
  TotalPrice: number | null;
  Transactions: MetrcSalesTransaction[];
  IsFinal: boolean;
  ArchivedDate: string | null;
  RecordedDateTime: string;
  RecordedByUserName: string;
  LastModified: string;
}

export interface MetrcSalesTransaction {
  PackageId: number;
  PackageLabel: string;
  ProductName: string;
  ProductCategoryName: string;
  ItemUnitWeight: number | null;
  ItemUnitWeightUnitOfMeasureAbbreviation: string | null;
  QuantitySold: number;
  UnitOfMeasureAbbreviation: string;
  TotalPrice: number | null;
}

export interface MetrcSalesDelivery {
  Id: number;
  DeliveryNumber: string;
  RecipientName: string;
  RecipientAddressStreet1: string;
  RecipientAddressStreet2: string | null;
  RecipientAddressCity: string;
  RecipientAddressCounty: string | null;
  RecipientAddressState: string;
  RecipientAddressPostalCode: string;
  PlannedRoute: string | null;
  EstimatedDepartureDateTime: string;
  ActualDepartureDateTime: string | null;
  EstimatedArrivalDateTime: string;
  ActualArrivalDateTime: string | null;
  DeliveryPackageCount: number;
  DeliveryReceivedPackageCount: number;
  ReceivedDateTime: string | null;
  Transactions: MetrcSalesTransaction[];
  DriverName: string;
  DriverLicenseNumber: string;
  DriverVehicleLicenseNumber: string;
  VehicleMake: string;
  VehicleModel: string;
  VehicleLicensePlateNumber: string;
}

// ==========================================
// LAB TESTING
// ==========================================

export interface MetrcLabTest {
  ResultReleased: string;
  LabTestResultId: number;
  LabFacilityLicenseNumber: string;
  LabFacilityName: string;
  SourcePackageLabel: string;
  ProductName: string;
  ProductCategoryName: string;
  TestPerformedDate: string;
  OverallPassed: boolean;
  TestTypeName: string;
  TestPassed: boolean;
  TestComment: string | null;
  ThcTotalPercent: number | null;
  ThcTotalValue: number | null;
  CbdPercent: number | null;
  CbdValue: number | null;
  TerpenePercent: number | null;
  TerpeneValue: number | null;
  ThcAPercent: number | null;
  ThcAValue: number | null;
  Delta9ThcPercent: number | null;
  Delta9ThcValue: number | null;
  CbdAPercent: number | null;
  CbdAValue: number | null;
  CbgAPercent: number | null;
  CbgAValue: number | null;
  CbcPercent: number | null;
  CbcValue: number | null;
}

// ==========================================
// STRAINS
// ==========================================

export interface MetrcStrain {
  Id: number;
  Name: string;
  TestingStatus: string;
  ThcLevel: number | null;
  CbdLevel: number | null;
  IndicaPercentage: number | null;
  SativaPercentage: number | null;
}

// ==========================================
// LOCATIONS
// ==========================================

export interface MetrcLocation {
  Id: number;
  Name: string;
  LocationTypeName: string;
  ForPlantBatches: boolean;
  ForPlants: boolean;
  ForHarvests: boolean;
  ForPackages: boolean;
}

// ==========================================
// FACILITIES
// ==========================================

export interface MetrcFacility {
  HireDate: string | null;
  IsOwner: boolean;
  IsManager: boolean;
  Occupations: string[];
  Name: string;
  Alias: string | null;
  DisplayName: string;
  CredentialedDate: string;
  SupportActivationDate: string | null;
  SupportExpirationDate: string | null;
  SupportLastPaidDate: string | null;
  FacilityType: MetrcFacilityType | null;
  License: MetrcLicense;
}

export interface MetrcFacilityType {
  Id: number;
  Name: string;
}

export interface MetrcLicense {
  Number: string;
  StartDate: string;
  EndDate: string;
  LicenseType: string;
}

// ==========================================
// CREATE/UPDATE REQUEST TYPES
// ==========================================

export interface CreatePackageRequest {
  Tag: string;
  Location: string | null;
  Item: string;
  Quantity: number;
  UnitOfMeasure: string;
  PatientLicenseNumber: string | null;
  Note: string | null;
  IsProductionBatch: boolean;
  ProductionBatchNumber: string | null;
  IsDonation: boolean;
  ProductRequiresRemediation: boolean;
  UseSameItem: boolean;
  ActualDate: string;
}

export interface CreatePlantBatchRequest {
  Name: string;
  Type: string;
  Count: number;
  Strain: string;
  Location: string | null;
  PatientLicenseNumber: string | null;
  ActualDate: string;
}

export interface CreateSalesReceiptRequest {
  SalesDateTime: string;
  SalesCustomerType: string;
  PatientLicenseNumber: string | null;
  CaregiverLicenseNumber: string | null;
  IdentificationMethod: string | null;
  Transactions: {
    PackageLabel: string;
    Quantity: number;
    UnitOfMeasure: string;
    TotalAmount: number;
  }[];
}

export interface CreateTransferRequest {
  ShipperFacilityLicenseNumber: string;
  ShipmentLicenseType: string;
  ShipmentTransactionType: string;
  ShipperFacilityName: string;
  DriverName: string;
  DriverLicenseNumber: string;
  VehicleMake: string;
  VehicleModel: string;
  VehicleLicensePlateNumber: string;
  Destination: {
    RecipientFacilityLicenseNumber: string;
    TransferTypeName: string;
    EstimatedArrivalDateTime: string;
    PlannedRoute: string | null;
    Transporters: any[];
    Packages: {
      PackageLabel: string;
      WholesalePrice: number | null;
    }[];
  }[];
}
