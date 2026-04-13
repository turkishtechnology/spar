export type FlightOption = {
  id: string;
  from: string;
  to: string;
  code: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: string;
};

export type SearchResultRow = {
  id: string;
  departTime: string;
  arriveTime: string;
  transferCode: string;
  totalDuration: string;
  waitingDuration: string;
  price?: string;
  isPast: boolean;
  isNextDay?: boolean;
  seatsLeft?: number;
};

export type AirportOption = {
  value: string;
  label: string;
};
