/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  Breadcrumb,
  Button,
  Checkbox,
  Dialog,
  DropdownMenu,
  Input,
  Label,
  Radio,
  Select,
  Tabs,
  Tooltip,
} from '@turkish-technology/spar';

import type {
  FlightOption,
  SearchResultRow,
} from '../../../components/accessibility/aviation/ticketing.types';
import {
  airportOptions,
  airportCodeByValue,
  flights,
} from '../../../components/accessibility/aviation/ticketing.data';

import './aviation.scss';

export default function TicketingPage() {
  const [mode, setMode] = React.useState('flight-search');
  const [tripType, setTripType] = React.useState('round-trip');
  const [fromAirport, setFromAirport] = React.useState('');
  const [toAirport, setToAirport] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState('10.4.2026');
  const [returnDate, setReturnDate] = React.useState('17.4.2026');
  const [passengerCount, setPassengerCount] = React.useState('1');
  const [hasSearched, setHasSearched] = React.useState(false);
  const [bookingStep, setBookingStep] = React.useState<
    'idle' | 'passenger' | 'payment' | 'completed'
  >('idle');
  const [passengerFirstName, setPassengerFirstName] = React.useState('');
  const [passengerLastName, setPassengerLastName] = React.useState('');
  const [passengerIdNumber, setPassengerIdNumber] = React.useState('');
  const [paymentCardNumber, setPaymentCardNumber] = React.useState('');
  const [paymentAgreement, setPaymentAgreement] = React.useState(false);
  const [completedBooking, setCompletedBooking] = React.useState<{
    pnr: string;
    surname: string;
    flightId: string;
  } | null>(null);
  const [checkInPnr, setCheckInPnr] = React.useState('');
  const [checkInSurname, setCheckInSurname] = React.useState('');
  const [checkInStatusMessage, setCheckInStatusMessage] = React.useState('');
  const [isCheckInCompleted, setIsCheckInCompleted] = React.useState(false);
  const [searchedFromAirport, setSearchedFromAirport] = React.useState('');
  const [searchedToAirport, setSearchedToAirport] = React.useState('');
  const [selectedFlightId, setSelectedFlightId] = React.useState<string | null>(null);
  const [pendingFlightId, setPendingFlightId] = React.useState<string | null>(null);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = React.useState(false);

  const passengerFormRef = React.useRef<HTMLFormElement>(null);
  const paymentFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (bookingStep === 'passenger') {
      passengerFormRef.current?.querySelector<HTMLElement>('input')?.focus();
    } else if (bookingStep === 'payment') {
      paymentFormRef.current?.querySelector<HTMLElement>('input')?.focus();
    }
  }, [bookingStep]);

  const availableFlights = React.useMemo(
    () =>
      flights.filter(
        (flight) => flight.from === searchedFromAirport && flight.to === searchedToAirport,
      ),
    [searchedFromAirport, searchedToAirport],
  );

  const searchResultRows = React.useMemo<SearchResultRow[]>(() => {
    if (availableFlights.length === 0) {
      return [];
    }

    const baseRows = availableFlights.slice(0, 2).map((flight: FlightOption, index: number) => ({
      id: flight.id,
      departTime: flight.departTime,
      arriveTime: flight.arriveTime,
      transferCode: 'ESB',
      totalDuration: index === 0 ? 'Total, 3h 35m' : 'Total, 7h 40m',
      waitingDuration: index === 0 ? '1h 15m Layover' : '5h 20m Layover',
      isPast: true,
    }));

    return [
      ...baseRows,
      {
        id: 'aj-881',
        departTime: '23:00',
        arriveTime: '09:10',
        transferCode: 'ESB',
        totalDuration: 'Total, 10h 10m',
        waitingDuration: '7h 50m Layover',
        isPast: false,
        isNextDay: true,
        price: '5.752,12₺',
        seatsLeft: 4,
      },
    ];
  }, [availableFlights]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSelectedFlightId(null);
    setPendingFlightId(null);
    setSearchedFromAirport(fromAirport);
    setSearchedToAirport(toAirport);
    setBookingStep('idle');
    setPassengerFirstName('');
    setPassengerLastName('');
    setPassengerIdNumber('');
    setPaymentCardNumber('');
    setPaymentAgreement(false);
    setCompletedBooking(null);
    setCheckInPnr('');
    setCheckInSurname('');
    setCheckInStatusMessage('');
    setIsCheckInCompleted(false);
    setHasSearched(true);
  };

  const pendingFlight = React.useMemo(
    () => searchResultRows.find((flight: SearchResultRow) => flight.id === pendingFlightId) ?? null,
    [searchResultRows, pendingFlightId],
  );

  const handleConfirmSelection = () => {
    if (pendingFlightId) {
      setSelectedFlightId(pendingFlightId);
      setBookingStep('passenger');
    }
    setPendingFlightId(null);
    setIsSelectDialogOpen(false);
  };

  const handlePassengerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingStep('payment');
  };

  const handlePaymentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFlightId) {
      return;
    }

    const generatedPnr = `TK${Math.floor(100000 + Math.random() * 900000)}`;
    const normalizedSurname = passengerLastName.trim().toUpperCase();

    setCompletedBooking({
      pnr: generatedPnr,
      surname: normalizedSurname,
      flightId: selectedFlightId,
    });
    setCheckInPnr(generatedPnr);
    setCheckInSurname(normalizedSurname);
    setBookingStep('completed');
    setMode('check-in');
  };

  const handleCheckInSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!completedBooking) {
      setIsCheckInCompleted(false);
      setCheckInStatusMessage('No completed ticket was found. Please finish ticketing first.');
      return;
    }

    const isValidBooking =
      checkInPnr.trim().toUpperCase() === completedBooking.pnr &&
      checkInSurname.trim().toUpperCase() === completedBooking.surname;

    if (!isValidBooking) {
      setIsCheckInCompleted(false);
      setCheckInStatusMessage('PNR or surname does not match the completed ticket.');
      return;
    }

    setIsCheckInCompleted(true);
    setCheckInStatusMessage('Check-in completed successfully. Have a pleasant flight.');
  };

  return (
    <Layout title='Ticketing'>
      <div className='ticketing-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <section className='ticketing-shell' aria-label='Ticketing screen'>
          <header className='ticketing-header'>
            <Breadcrumb.Root className='ticketing-breadcrumb'>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href='#services'>Services</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link href='#cities'>City Guide</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link href='#faq'>FAQ</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link href='#campaigns'>Campaigns</Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
            <div className='ticketing-actions'>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  className='ticketing-lang-btn'
                  aria-label='Language selection'
                >
                  EN
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className='ticketing-dropdown-content'>
                  <DropdownMenu.Item className='ticketing-dropdown-item'>Turkish</DropdownMenu.Item>
                  <DropdownMenu.Item className='ticketing-dropdown-item'>English</DropdownMenu.Item>
                  <DropdownMenu.Item className='ticketing-dropdown-item'>German</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className='ticketing-profile-btn' aria-label='Profile menu'>
                  JOHN D.
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className='ticketing-dropdown-content'>
                  <DropdownMenu.Item className='ticketing-dropdown-item'>
                    Membership Details
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className='ticketing-dropdown-item'>
                    My Flights
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className='ticketing-dropdown-item'>
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </header>

          <section className='ticketing-hero' aria-label='Flight search area'>
            <div className='ticketing-hero-copy'>
              <h1>
                Hello,
                <br />
                Are you ready to plan your trip?
              </h1>
            </div>

            <div className='ticketing-search-panel'>
              <Tabs.Root
                value={mode}
                onValueChange={(value) => {
                  setMode(value);
                }}
              >
                <Tabs.List className='ticketing-mode-tabs' aria-label='Ticketing options'>
                  <Tabs.Trigger value='flight-search'>Search Flights</Tabs.Trigger>
                  <Tabs.Trigger value='check-in'>Check-in</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value='flight-search'>
                  <form
                    className='ticketing-form'
                    aria-label='Flight search form'
                    onSubmit={handleSearch}
                  >
                    <div className='ticketing-trip-type'>
                      <Radio.Root
                        aria-label='Trip type'
                        value={tripType}
                        onValueChange={(value) => {
                          setTripType(value);
                        }}
                        className='ticketing-trip-type-options'
                      >
                        <label htmlFor='trip-round'>
                          <Radio.Item id='trip-round' value='round-trip' />
                          Round Trip
                        </label>
                        <label htmlFor='trip-one-way'>
                          <Radio.Item id='trip-one-way' value='one-way' />
                          One Way
                        </label>
                      </Radio.Root>
                    </div>

                    <div className='ticketing-fields'>
                      <Select.Root
                        value={fromAirport}
                        onValueChange={(value) => {
                          setFromAirport(value);
                        }}
                      >
                        <Select.Trigger className='ticketing-field ticketing-field-wide ticketing-select-trigger'>
                          <span className='ticketing-field-label'>From</span>
                          <span className='ticketing-field-value'>
                            <Select.Value placeholder='Select' />
                          </span>
                        </Select.Trigger>
                        <Select.Content className='ticketing-select-content'>
                          {airportOptions.map((airport) => (
                            <Select.Item
                              key={airport.value}
                              value={airport.value}
                              className='ticketing-select-item'
                            >
                              <Select.ItemText>{airport.label}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                      <Button
                        type='button'
                        className='ticketing-swap-btn'
                        aria-label='Swap From and To airports'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const temp = fromAirport;
                          setFromAirport(toAirport);
                          setToAirport(temp);
                        }}
                      >
                        ⇅
                      </Button>
                      <Select.Root
                        value={toAirport}
                        onValueChange={(value) => {
                          setToAirport(value);
                        }}
                      >
                        <Select.Trigger className='ticketing-field ticketing-field-wide ticketing-select-trigger'>
                          <span className='ticketing-field-label'>To</span>
                          <span className='ticketing-field-value'>
                            <Select.Value placeholder='Select' />
                          </span>
                        </Select.Trigger>
                        <Select.Content className='ticketing-select-content'>
                          {airportOptions
                            .filter((airport) => airport.value !== fromAirport)
                            .map((airport) => (
                              <Select.Item
                                key={airport.value}
                                value={airport.value}
                                className='ticketing-select-item'
                              >
                                <Select.ItemText>{airport.label}</Select.ItemText>
                              </Select.Item>
                            ))}
                        </Select.Content>
                      </Select.Root>

                      <Input className='ticketing-input-wrap'>
                        <Input.Label className='ticketing-field-label'>Departure</Input.Label>
                        <Input.Field
                          className='ticketing-date-input'
                          value={departureDate}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setDepartureDate(event.target.value);
                          }}
                          placeholder='DD.MM.YYYY'
                        />
                      </Input>
                      <Input className='ticketing-input-wrap'>
                        <Input.Label className='ticketing-field-label'>Return</Input.Label>
                        <Input.Field
                          className='ticketing-date-input'
                          value={returnDate}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setReturnDate(event.target.value);
                          }}
                          placeholder='DD.MM.YYYY'
                          disabled={tripType === 'one-way'}
                        />
                      </Input>
                      <Select.Root
                        value={passengerCount}
                        onValueChange={(value) => {
                          setPassengerCount(value);
                        }}
                      >
                        <Select.Trigger className='ticketing-field ticketing-select-trigger'>
                          <span className='ticketing-field-label'>Passengers</span>
                          <span className='ticketing-field-value'>
                            <Select.Value placeholder='1 Passenger' />
                          </span>
                        </Select.Trigger>
                        <Select.Content className='ticketing-select-content'>
                          <Select.Item value='1' className='ticketing-select-item'>
                            <Select.ItemText>1 Passenger</Select.ItemText>
                          </Select.Item>
                          <Select.Item value='2' className='ticketing-select-item'>
                            <Select.ItemText>2 Passengers</Select.ItemText>
                          </Select.Item>
                          <Select.Item value='3' className='ticketing-select-item'>
                            <Select.ItemText>3 Passengers</Select.ItemText>
                          </Select.Item>
                        </Select.Content>
                      </Select.Root>
                      <Button type='submit' className='ticketing-search-btn'>
                        Search Flights
                      </Button>
                    </div>
                  </form>

                  {hasSearched && mode === 'flight-search' && (
                    <section className='ticketing-post-search' aria-label='Flight results screen'>
                      <div className='ticketing-mode-tabs'>
                        <div className='ticketing-tab-content'>
                          <div className='ticketing-results-head'>
                            <h3>Outbound Flight</h3>
                          </div>

                          {searchResultRows.length === 0 ? (
                            <p className='ticketing-no-results'>
                              No flights were found for the selected route.
                            </p>
                          ) : (
                            <>
                              <span className='ticketing-transfer-chip'>Connecting Flights</span>
                              <div className='ticketing-list-rows'>
                                {searchResultRows.map((flight: SearchResultRow) => {
                                  const isSelected = selectedFlightId === flight.id;

                                  return (
                                    <article
                                      key={flight.id}
                                      className={`ticketing-list-row ${flight.isPast ? 'is-past' : ''} ${isSelected ? 'is-selected' : ''}`}
                                    >
                                      <div className='ticketing-time-block'>
                                        <strong>{flight.departTime}</strong>
                                        <span>
                                          {
                                            airportCodeByValue[
                                              searchedFromAirport as keyof typeof airportCodeByValue
                                            ]
                                          }
                                        </span>
                                      </div>

                                      <div className='ticketing-line-block'>
                                        <p>{flight.transferCode}</p>
                                        <span className='ticketing-line' aria-hidden='true'>
                                          <i />
                                        </span>
                                        <small>{flight.totalDuration}</small>
                                        <small>{flight.waitingDuration}</small>
                                      </div>

                                      <div className='ticketing-time-block'>
                                        <strong>
                                          {flight.isNextDay && <em>+1 Day</em>}
                                          {flight.arriveTime}
                                        </strong>
                                        <span>
                                          {
                                            airportCodeByValue[
                                              searchedToAirport as keyof typeof airportCodeByValue
                                            ]
                                          }
                                        </span>
                                      </div>

                                      <Tooltip.Provider>
                                        <Tooltip.Root>
                                          <Tooltip.Trigger
                                            className='ticketing-info-btn'
                                            aria-label='Flight details'
                                          >
                                            i
                                          </Tooltip.Trigger>
                                          <Tooltip.Content className='demo-tooltip-content'>
                                            Be ready before your flight!
                                          </Tooltip.Content>
                                        </Tooltip.Root>
                                      </Tooltip.Provider>

                                      {flight.isPast ? (
                                        <p className='ticketing-past-text'>PAST FLIGHT</p>
                                      ) : (
                                        <div className='ticketing-price-area'>
                                          <p>
                                            Last <strong>{flight.seatsLeft} seats</strong> at this
                                            price
                                          </p>
                                          <div>
                                            <strong>{flight.price}</strong>
                                            <Button
                                              type='button'
                                              className='ticketing-outline-btn'
                                              aria-pressed={isSelected}
                                              onClick={() => {
                                                setPendingFlightId(flight.id);
                                                setIsSelectDialogOpen(true);
                                              }}
                                            >
                                              {isSelected ? 'Selected' : 'Select'}
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </article>
                                  );
                                })}
                              </div>

                              <Dialog.Root
                                open={isSelectDialogOpen}
                                onOpenChange={(open) => {
                                  setIsSelectDialogOpen(open);
                                  if (!open) {
                                    setPendingFlightId(null);
                                  }
                                }}
                              >
                                <Dialog.Overlay className='ticketing-dialog-overlay' />
                                <Dialog.Content className='ticketing-dialog-content'>
                                  <div className='ticketing-dialog-head'>
                                    <Dialog.Title className='ticketing-dialog-title'>
                                      Confirm Flight Selection
                                    </Dialog.Title>
                                    <Dialog.Close
                                      type='button'
                                      className='ticketing-dialog-close'
                                      aria-label='Close dialog'
                                    >
                                      ×
                                    </Dialog.Close>
                                  </div>

                                  {pendingFlight && (
                                    <div className='ticketing-dialog-summary'>
                                      <p className='ticketing-dialog-summary-route'>
                                        {searchedFromAirport.toUpperCase()} -{' '}
                                        {searchedToAirport.toUpperCase()}
                                      </p>
                                      <div className='ticketing-dialog-summary-meta'>
                                        <span>
                                          {pendingFlight.departTime} - {pendingFlight.arriveTime}
                                        </span>
                                        <span>{pendingFlight.totalDuration}</span>
                                        {pendingFlight.price && (
                                          <strong>{pendingFlight.price}</strong>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  <Dialog.Description className='ticketing-dialog-description'>
                                    {pendingFlight
                                      ? `Should the ${pendingFlight.departTime} - ${pendingFlight.arriveTime} flight be selected?`
                                      : 'Should this flight be selected?'}
                                  </Dialog.Description>
                                  <div className='ticketing-dialog-actions'>
                                    <Dialog.Close
                                      type='button'
                                      className='ticketing-outline-btn'
                                      onClick={() => {
                                        setPendingFlightId(null);
                                      }}
                                    >
                                      Cancel
                                    </Dialog.Close>
                                    <Button
                                      type='button'
                                      className='ticketing-search-btn'
                                      onClick={handleConfirmSelection}
                                    >
                                      Confirm
                                    </Button>
                                  </div>
                                </Dialog.Content>
                              </Dialog.Root>

                              {bookingStep === 'passenger' && (
                                <form
                                  ref={passengerFormRef}
                                  className='ticketing-booking-panel'
                                  aria-label='Passenger information form'
                                  onSubmit={handlePassengerSubmit}
                                >
                                  <h4>Passenger Information</h4>
                                  <p>Enter passenger details to continue with ticketing.</p>
                                  <div className='ticketing-booking-fields'>
                                    <Input className='ticketing-input-wrap'>
                                      <Input.Label className='ticketing-field-label'>
                                        Name
                                      </Input.Label>
                                      <Input.Field
                                        className='ticketing-date-input'
                                        value={passengerFirstName}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                          setPassengerFirstName(event.target.value);
                                        }}
                                        placeholder='Passenger name'
                                      />
                                    </Input>
                                    <Input className='ticketing-input-wrap'>
                                      <Input.Label className='ticketing-field-label'>
                                        Surname
                                      </Input.Label>
                                      <Input.Field
                                        className='ticketing-date-input'
                                        value={passengerLastName}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                          setPassengerLastName(event.target.value);
                                        }}
                                        placeholder='Passenger surname'
                                      />
                                    </Input>
                                    <Input className='ticketing-input-wrap'>
                                      <Input.Label className='ticketing-field-label'>
                                        Identity Number
                                      </Input.Label>
                                      <Input.Field
                                        className='ticketing-date-input'
                                        value={passengerIdNumber}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                          setPassengerIdNumber(event.target.value);
                                        }}
                                        placeholder='11 digit number'
                                      />
                                    </Input>
                                  </div>
                                  <Button
                                    type='submit'
                                    className='ticketing-search-btn ticketing-booking-btn'
                                  >
                                    Continue To Payment
                                  </Button>
                                </form>
                              )}

                              {bookingStep === 'payment' && (
                                <form
                                  ref={paymentFormRef}
                                  className='ticketing-booking-panel'
                                  aria-label='Payment form'
                                  onSubmit={handlePaymentSubmit}
                                >
                                  <h4>Payment</h4>
                                  <p>Enter your card information to complete ticketing.</p>
                                  <div className='ticketing-booking-fields'>
                                    <Input className='ticketing-input-wrap'>
                                      <div className='ticketing-label-with-tip'>
                                        <Input.Label className='ticketing-field-label'>
                                          Card Number
                                        </Input.Label>
                                        <Tooltip.Provider delayDuration={200}>
                                          <Tooltip.Root>
                                            <Tooltip.Trigger
                                              className='ticketing-help-tip'
                                              aria-label='Card number help'
                                            >
                                              ?
                                            </Tooltip.Trigger>
                                            <Tooltip.Content className='demo-tooltip-content'>
                                              Enter at least 12 digits.
                                            </Tooltip.Content>
                                          </Tooltip.Root>
                                        </Tooltip.Provider>
                                      </div>
                                      <Input.Field
                                        className='ticketing-date-input'
                                        value={paymentCardNumber}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                          setPaymentCardNumber(event.target.value);
                                        }}
                                        placeholder='0000 0000 0000 0000'
                                      />
                                    </Input>
                                  </div>
                                  <div className='ticketing-payment-check'>
                                    <Checkbox
                                      id='payment-agreement'
                                      className='ticketing-payment-checkbox'
                                      checked={paymentAgreement}
                                      onChange={(checked) => {
                                        setPaymentAgreement(checked === true);
                                      }}
                                    >
                                      {({ checked }) => (checked === true ? '✓' : '')}
                                    </Checkbox>
                                    <Label htmlFor='payment-agreement'>
                                      I confirm the payment information.
                                    </Label>
                                  </div>
                                  <Button
                                    type='submit'
                                    className='ticketing-search-btn ticketing-booking-btn'
                                  >
                                    Complete Ticketing
                                  </Button>
                                </form>
                              )}

                              {bookingStep === 'completed' && completedBooking && (
                                <section className='ticketing-booking-complete' aria-live='polite'>
                                  <h4>Ticketing Completed</h4>
                                  <p>
                                    PNR: <strong>{completedBooking.pnr}</strong> | Surname:{' '}
                                    <strong>{completedBooking.surname}</strong>
                                  </p>
                                  <p>
                                    Check-in tab was prefilled with your booking details. You can
                                    now complete check-in.
                                  </p>
                                  <Button
                                    type='button'
                                    className='ticketing-search-btn ticketing-booking-btn'
                                    onClick={() => {
                                      setMode('check-in');
                                    }}
                                  >
                                    Go To Check-in
                                  </Button>
                                </section>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </section>
                  )}
                </Tabs.Content>

                <Tabs.Content value='check-in'>
                  <form
                    className='ticketing-form ticketing-checkin-form'
                    aria-label='Check-in form'
                    onSubmit={handleCheckInSubmit}
                  >
                    <div className='ticketing-checkin-info'>
                      <span className='ticketing-checkin-icon' aria-hidden='true'>
                        ✓
                      </span>
                      <h2>Online Check-in</h2>
                      <p>
                        You can start your journey without waiting in line at the airport by
                        completing online check-in. You can view airport Online Check-in
                        availability <Link to='#checkin-info'>from here</Link>.
                      </p>
                    </div>
                    <div className='ticketing-fields'>
                      <Input className='ticketing-input-wrap'>
                        <Input.Label className='ticketing-field-label'>
                          Ticket or Reservation Code (PNR)
                        </Input.Label>
                        <Input.Field
                          className='ticketing-date-input'
                          value={checkInPnr}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCheckInPnr(event.target.value);
                          }}
                          placeholder='Enter as written on your ID'
                        />
                      </Input>
                      <Input className='ticketing-input-wrap'>
                        <Input.Label className='ticketing-field-label'>
                          Passenger Surname
                        </Input.Label>
                        <Input.Field
                          className='ticketing-date-input'
                          value={checkInSurname}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setCheckInSurname(event.target.value);
                          }}
                          placeholder='Enter as written on your ID'
                        />
                      </Input>
                      <Button type='submit' className='ticketing-search-btn'>
                        Complete Check-in
                      </Button>
                    </div>
                    {checkInStatusMessage && (
                      <p
                        className={`ticketing-checkin-status ${isCheckInCompleted ? 'is-success' : 'is-error'}`}
                        role='status'
                      >
                        {checkInStatusMessage}
                      </p>
                    )}
                  </form>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </section>
        </section>
      </div>
    </Layout>
  );
}
