import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { differenceInDays } from 'date-fns';
import {
  Star,
  Wifi,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  ParkingSquare,
  Coffee,
  Bath,
  BedDouble,
  ShieldCheck,
  Leaf,
  Flame,
  Bus,
  Map,
  Ship,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePicker } from './ui/date-picker';

interface Hotel {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  description?: string;
}

interface ItineraryItem {
  time: string;
  activity: string;
  duration: string;
  description: string;
}

interface TransportationOption {
  type: string;
  pricePerDay?: number;
  pricePerKm?: number;
  description: string;
  includes?: string[];
}

interface Destination {
  id: number;
  name: string;
  transportation?: {
    taxiOptions: TransportationOption[];
    otherOptions?: TransportationOption[];
  };
  suggestedItinerary?: {
    [key: string]: ItineraryItem[];
  };
  hotels?: Hotel[];
}

interface PlanVisitDialogProps {
  destinationName: string;
  destination: Destination;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return <Wifi className="w-4 h-4" />;
    case 'swimming pool':
      return <Waves className="w-4 h-4" />;
    case 'restaurant':
      return <UtensilsCrossed className="w-4 h-4" />;
    case 'gym':
      return <Dumbbell className="w-4 h-4" />;
    case 'parking':
      return <ParkingSquare className="w-4 h-4" />;
    case 'basic breakfast':
      return <Coffee className="w-4 h-4" />;
    case 'spa':
      return <Bath className="w-4 h-4" />;
    case 'room service':
      return <BedDouble className="w-4 h-4" />;
    case 'security':
      return <ShieldCheck className="w-4 h-4" />;
    case 'safari booking desk':
      return <Map className="w-4 h-4" />;
    case 'garden':
      return <Leaf className="w-4 h-4" />;
    case 'campfire':
      return <Flame className="w-4 h-4" />;
    case 'desert safari':
      return <Map className="w-4 h-4" />;
    case 'temple shuttle':
      return <Bus className="w-4 h-4" />;
    case 'sea view':
      return <Waves className="w-4 h-4" />;
    case 'temple view':
      return <ShieldCheck className="w-4 h-4" />;
    case 'shuttle service':
      return <Bus className="w-4 h-4" />;
    case 'ac tents':
      return <ShieldCheck className="w-4 h-4" />;
    case 'cultural shows':
      return <ShieldCheck className="w-4 h-4" />;
    case 'guided tours':
      return <Map className="w-4 h-4" />;
    case 'local guide':
      return <Map className="w-4 h-4" />;
    default:
      return <ShieldCheck className="w-4 h-4" />;
  }
};

const HotelImageCarousel: React.FC<{ images: string[]; hotelName: string }> = ({ images, hotelName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
    );
  }

  return (
      <div className="relative w-full h-32 rounded-lg overflow-hidden">
        <img
            src={images[currentIndex]}
            alt={`${hotelName} image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
        />
        {images.length > 1 && (
            <>
              <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                  aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                  aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            'w-2 h-2 rounded-full',
                            index === currentIndex ? 'bg-orange-600' : 'bg-gray-400'
                        )}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
              </div>
            </>
        )}
      </div>
  );
};

const PlanVisitDialog: React.FC<PlanVisitDialogProps> = ({
                                                           destinationName,
                                                           destination,
                                                           open,
                                                           onOpenChange,
                                                         }) => {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedTransport, setSelectedTransport] = useState<string>('');
  const [pricingMode, setPricingMode] = useState<'fullDay' | 'perKm'>('fullDay');
  const [kmPerDay, setKmPerDay] = useState('50');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [plan, setPlan] = useState<any | null>(null);

  const hotels: Hotel[] = destination.hotels || [];
  const transportOptions: TransportationOption[] = [
    ...(destination.transportation?.taxiOptions || []),
    ...(destination.transportation?.otherOptions || []),
  ];

  const calculateTransportCost = () => {
    if (!selectedTransport || !fromDate || !toDate) return 0;

    const transport = transportOptions.find((t) => t.type === selectedTransport);
    if (!transport) return 0;

    const days = numberOfDays;

    if (pricingMode === 'fullDay' && transport.pricePerDay) {
      if (days >= 7) {
        return transport.pricePerDay * days * 0.9; // 10% discount for week+ rentals
      } else if (days >= 3) {
        return transport.pricePerDay * days * 0.95; // 5% discount for 3+ day rentals
      }
      return transport.pricePerDay * days;
    } else if (pricingMode === 'perKm' && transport.pricePerKm) {
      const km = parseInt(kmPerDay) || 50;
      const dailyCost = transport.pricePerKm * km;
      const minDailyCharge = transport.pricePerKm * 30; // Minimum charge for 30km
      return Math.max(dailyCost, minDailyCharge) * days;
    }
    return 0;
  };

  useEffect(() => {
    if (fromDate && toDate) {
      const days = differenceInDays(toDate, fromDate) + 1;
      setNumberOfDays(days);

      if (selectedHotel && days > 0) {
        const hotel = hotels.find((h) => h.id === selectedHotel);
        const hotelCost = (hotel?.pricePerNight || 0) * days;

        const guestCount = parseInt(numberOfPeople) || 1;
        let peopleCost = 0;
        if (guestCount > 4) {
          peopleCost = (4 * 1000 + (guestCount - 4) * 800) * days;
        } else {
          peopleCost = guestCount * 1000 * days;
        }

        const transportCost = calculateTransportCost();

        setTotalPrice(hotelCost + peopleCost + transportCost);
      } else {
        const hotel = hotels.find((h) => h.id === selectedHotel);
        const hotelCost = (hotel?.pricePerNight || 0) * days;
        const guestCount = parseInt(numberOfPeople) || 1;
        const peopleCost = guestCount > 4
            ? (4 * 1000 + (guestCount - 4) * 800) * days
            : guestCount * 1000 * days;
        setTotalPrice(hotelCost + peopleCost);
      }
    } else {
      setTotalPrice(0);
      setNumberOfDays(0);
    }
  }, [fromDate, toDate, selectedHotel, selectedTransport, pricingMode, kmPerDay, numberOfPeople, hotels]);

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    if (toDate && date && toDate < date) setToDate(date);
  };

  const generateTimetable = () => {
    const timetable: { [key: string]: ItineraryItem[] } = {};
    const itinerary = destination.suggestedItinerary || {};
    const itineraryKeys = Object.keys(itinerary);

    for (let day = 1; day <= numberOfDays; day++) {
      const dayKey = day.toString();
      const itineraryKey = itineraryKeys[(day - 1) % itineraryKeys.length] || '1';
      timetable[dayKey] = itinerary[itineraryKey] || [
        {
          time: 'all day',
          activity: 'Explore nearby attractions or relax',
          duration: 'Flexible',
          description: 'Visit local markets, nearby sites, or enjoy hotel amenities.',
        },
      ];
    }

    return timetable;
  };

  const handleConfirmBooking = () => {
    if (!fromDate || !toDate || !selectedHotel) return;

    const selectedHotelData = hotels.find((h) => h.id === selectedHotel);
    const selectedTransportData = selectedTransport
        ? transportOptions.find((t) => t.type === selectedTransport)
        : null;
    const timetable = generateTimetable();

    const newPlan = {
      destinationName,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      numberOfDays,
      numberOfGuests: parseInt(numberOfPeople),
      hotel: selectedHotelData,
      transport: selectedTransportData
          ? {
            type: selectedTransportData.type,
            pricingMode,
            cost: pricingMode === 'fullDay' ? selectedTransportData.pricePerDay : selectedTransportData.pricePerKm,
            kmPerDay: pricingMode === 'perKm' ? parseInt(kmPerDay) : undefined,
          }
          : null,
      totalPrice,
      timetable,
    };

    setPlan(newPlan);
    console.log('Plan Created:', newPlan);
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Plan Your Visit to {destinationName}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Check-in Date</Label>
                  <DatePicker
                      date={fromDate}
                      onDateChange={handleFromDateChange}
                      minDate={new Date()}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Check-out Date</Label>
                  <DatePicker
                      date={toDate}
                      onDateChange={setToDate}
                      minDate={fromDate || new Date()}
                  />
                </div>

                {numberOfDays > 0 && (
                    <div className="text-sm font-medium text-orange-600">
                      Duration: {numberOfDays} night{numberOfDays > 1 ? 's' : ''}
                    </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="numberOfPeople">Number of Guests</Label>
                  <Input
                      id="numberOfPeople"
                      type="number"
                      min="1"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transportation</Label>
                  <Select onValueChange={setSelectedTransport} value={selectedTransport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {transportOptions.map((option) => (
                          <SelectItem key={option.type} value={option.type}>
                            <div className="flex flex-col">
                              <span>{option.type}</span>
                              <span className="text-xs text-gray-500">{option.description}</span>
                            </div>
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTransport && transportOptions.find((t) => t.type === selectedTransport) && (
                    <div className="space-y-2">
                      <Label>Pricing Mode</Label>
                      <RadioGroup
                          value={pricingMode}
                          onValueChange={(value) => setPricingMode(value as 'fullDay' | 'perKm')}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                              value="fullDay"
                              id="fullDay"
                              disabled={!transportOptions.find((t) => t.type === selectedTransport)?.pricePerDay}
                          />
                          <Label htmlFor="fullDay">Full Day</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                              value="perKm"
                              id="perKm"
                              disabled={!transportOptions.find((t) => t.type === selectedTransport)?.pricePerKm}
                          />
                          <Label htmlFor="perKm">Per Kilometer</Label>
                        </div>
                      </RadioGroup>
                    </div>
                )}

                {pricingMode === 'perKm' && selectedTransport && transportOptions.find((t) => t.type === selectedTransport)?.pricePerKm && (
                    <div className="space-y-2">
                      <Label htmlFor="kmPerDay">Estimated Kilometers per Day</Label>
                      <Input
                          id="kmPerDay"
                          type="number"
                          min="1"
                          value={kmPerDay}
                          onChange={(e) => setKmPerDay(e.target.value)}
                      />
                    </div>
                )}
              </div>

              {totalPrice > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h4 className="font-semibold text-lg mb-2">Price Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Hotel ({numberOfDays} nights)</span>
                        <span>₹{(hotels.find((h) => h.id === selectedHotel)?.pricePerNight || 0) * numberOfDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Additional Costs ({numberOfPeople} guests)</span>
                        <span>₹{parseInt(numberOfPeople) * 1000 * numberOfDays}</span>
                      </div>
                      {selectedTransport && (
                          <div className="flex justify-between">
                            <span>Transport ({selectedTransport})</span>
                            <span>
                        ₹{calculateTransportCost()}
                      </span>
                          </div>
                      )}
                      <div className="border-t border-orange-200 pt-2 mt-2 flex justify-between font-bold">
                        <span>Total Amount</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Label className="text-lg">Select Your Hotel</Label>
              {hotels.length === 0 ? (
                  <p className="text-gray-600">No hotels available for this destination.</p>
              ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {hotels.map((hotel) => (
                        <div
                            key={hotel.id}
                            className={cn(
                                'border rounded-lg p-4 cursor-pointer transition-all',
                                selectedHotel === hotel.id ? 'border-orange-600 bg-orange-50 shadow-md' : 'hover:border-orange-200 hover:shadow-sm'
                            )}
                            onClick={() => setSelectedHotel(hotel.id)}
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                              <HotelImageCarousel images={hotel.images} hotelName={hotel.name} />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg">{hotel.name}</h3>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{hotel.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                {hotel.description || `A comfortable stay with excellent amenities near ${destinationName}.`}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {hotel.amenities.map((amenity, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 bg-white px-2 py-1 rounded-md text-sm border">
                              {getAmenityIcon(amenity)}
                                      {amenity}
                            </span>
                                ))}
                              </div>
                              <div className="text-lg font-semibold text-orange-600">
                                ₹{hotel.pricePerNight.toLocaleString()}
                                <span className="text-sm font-normal text-gray-600">/night</span>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
              )}

              {numberOfDays > 0 && (
                  <div className="mt-6">
                    <Label className="text-lg">Trip Timetable</Label>
                    {Object.entries(generateTimetable()).map(([day, activities]) => (
                        <div key={day} className="mt-4">
                          <h4 className="font-semibold text-md mb-2">Day {day}</h4>
                          <table className="w-full text-sm border border-gray-200">
                            <thead>
                            <tr className="bg-gray-100">
                              <th className="p-2 text-left">Time</th>
                              <th className="p-2 text-left">Activity</th>
                              <th className="p-2 text-left">Duration</th>
                              <th className="p-2 text-left">Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(activities as ItineraryItem[]).map((item, index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-2 capitalize">{item.time}</td>
                                  <td className="p-2">{item.activity}</td>
                                  <td className="p-2">{item.duration}</td>
                                  <td className="p-2">{item.description}</td>
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
                onClick={handleConfirmBooking}
                disabled={!fromDate || !toDate || !selectedHotel}
                className="bg-orange-600 hover:bg-orange-700"
            >
              Confirm Booking
            </Button>
          </div>

          {plan && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Your Plan</h4>
                <p><strong>Destination:</strong> {plan.destinationName}</p>
                <p><strong>Check-in:</strong> {new Date(plan.fromDate).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(plan.toDate).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {plan.numberOfGuests}</p>
                <p><strong>Hotel:</strong> {plan.hotel.name}</p>
                {plan.transport && (
                    <p><strong>Transport:</strong> {plan.transport.type} ({plan.transport.pricingMode})</p>
                )}
                <p><strong>Total Price:</strong> ₹{plan.totalPrice.toLocaleString()}</p>
                <div className="mt-2">
                  <h5 className="font-semibold">Timetable:</h5>
                  {Object.entries(plan.timetable).map(([day, activities]: [string, ItineraryItem[]]) => (
                      <div key={day}>
                        <p><strong>Day {day}:</strong></p>
                        <ul className="list-disc pl-5">
                          {activities.map((item, index) => (
                              <li key={index}>
                                {item.time}: {item.activity} ({item.duration})
                              </li>
                          ))}
                        </ul>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </DialogContent>
      </Dialog>
  );
};

export default PlanVisitDialog;