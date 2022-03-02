export interface VacationModel {
  id: number;
  description: string;
  destination: string;
  imageUrl: string;
  fromDate: Date;
  toDate: Date;
  price: number;
}
