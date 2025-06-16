import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Calendar, Navigation, Lightbulb, Star } from 'lucide-react';
import PlanVisitDialog from './PlanVisitDialog';

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviews: number;
  highlights: string[];
  detailedDescription?: string;
  timings?: string;
  entryFee?: string;
  bestTimeToVisit?: string;
  nearbyAttractions?: string[];
  howToReach?: string;
  tips?: string[];
  transportation?: {
    taxiOptions: Array<{
      type: string;
      pricePerDay: number;
      description: string;
      includes: string[];
    }>;
  };
  suggestedItinerary?: {
    [key: string]: Array<{
      time: string;
      activity: string;
      duration: string;
      description: string;
    }>;
  };
  hotels?: Array<{
    id: string;
    name: string;
    rating: number;
    pricePerNight: number;
    amenities: string[];
    images: string[];
  }>;
}

interface DestinationModalProps {
  destination: Destination | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DestinationModal: React.FC<DestinationModalProps> = ({ destination, open, onOpenChange }) => {
  const [showPlanningForm, setShowPlanningForm] = useState(false);

  if (!destination) return null;

  const renderMainContent = () => (
      <>
        {/* Image and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img
                src={destination.imageUrl}
                alt={destination.name}
                className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-orange-600 hover:bg-orange-700">
                {destination.category}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {destination.rating} ({destination.reviews} reviews)
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {destination.location}
            </div>
            <div className="flex flex-wrap gap-2">
              {destination.highlights.map((highlight, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {highlight}
                  </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-gray-600 leading-relaxed">
            {destination.detailedDescription || destination.description}
          </p>
        </div>

        {/* Essential Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destination.timings && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Timings</h4>
                  <p className="text-gray-600 text-sm">{destination.timings}</p>
                </div>
              </div>
          )}
          {destination.entryFee && (
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Entry Fee</h4>
                  <p className="text-gray-600 text-sm">{destination.entryFee}</p>
                </div>
              </div>
          )}
          {destination.bestTimeToVisit && (
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Best Time to Visit</h4>
                  <p className="text-gray-600 text-sm">{destination.bestTimeToVisit}</p>
                </div>
              </div>
          )}
          {destination.howToReach && (
              <div className="flex items-start space-x-3">
                <Navigation className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold">How to Reach</h4>
                  <p className="text-gray-600 text-sm">{destination.howToReach}</p>
                </div>
              </div>
          )}
        </div>

        {/* Nearby Attractions */}
        {destination.nearbyAttractions && destination.nearbyAttractions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Nearby Attractions</h3>
              <div className="flex flex-wrap gap-2">
                {destination.nearbyAttractions.map((attraction, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {attraction}
                    </Badge>
                ))}
              </div>
            </div>
        )}

        {/* Tips */}
        {destination.tips && destination.tips.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <Lightbulb className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold">Travel Tips</h3>
              </div>
              <ul className="space-y-1">
                {destination.tips.map((tip, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      {tip}
                    </li>
                ))}
              </ul>
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button
              className="bg-orange-600 hover:bg-orange-700 flex-1"
              onClick={() => setShowPlanningForm(true)}
          >
            Plan Your Visit
          </Button>
          <Button variant="outline" className="flex-1">
            Add to Favorites
          </Button>
        </div>

        {/* Plan Visit Dialog */}
        <PlanVisitDialog
            destinationName={destination.name} // Pass destinationName explicitly
            destination={destination} // Pass the full destination object
            open={showPlanningForm}
            onOpenChange={setShowPlanningForm}
        />
      </>
  );

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-600">
              {destination.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">{renderMainContent()}</div>
        </DialogContent>
      </Dialog>
  );
};

export default DestinationModal;