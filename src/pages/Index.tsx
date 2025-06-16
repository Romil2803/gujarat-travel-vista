
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, Heart, Share2, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import gujaratData from '@/data/gujarat-attractions.json';

const Index = () => {
  const [destinations, setDestinations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    // Simulate loading data from JSON
    setDestinations(gujaratData.destinations);
    setExperiences(gujaratData.experiences);
    setFilteredDestinations(gujaratData.destinations);
  }, []);

  useEffect(() => {
    let filtered = destinations;

    if (searchTerm) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, selectedCategory, destinations]);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'historical', label: 'Historical Sites' },
    { value: 'religious', label: 'Religious Places' },
    { value: 'natural', label: 'Natural Wonders' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'cultural', label: 'Cultural Sites' },
    { value: 'beach', label: 'Beaches' },
    { value: 'monument', label: 'Monuments' },
    { value: 'hillstation', label: 'Hill Stations' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Explore Gujarat
              </h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#destinations" className="text-gray-700 hover:text-orange-600 transition-colors">Destinations</a>
              <a href="#experiences" className="text-gray-700 hover:text-orange-600 transition-colors">Experiences</a>
              <a href="#culture" className="text-gray-700 hover:text-orange-600 transition-colors">Culture</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative text-center z-10 px-4">
          <h2 className="text-5xl font-bold mb-4">Discover the Vibrant State of Gujarat</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            From ancient stepwells to wild lions, from pristine beaches to cultural festivals - 
            Gujarat offers an incredible tapestry of experiences waiting to be explored.
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">12+</div>
              <div className="text-gray-600">Top Destinations</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-gray-600">UNESCO Sites</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">365</div>
              <div className="text-gray-600">Days of Culture</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">1</div>
              <div className="text-gray-600">Asiatic Lion Home</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="destinations" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Top Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most incredible places Gujarat has to offer, from ancient heritage sites to natural wonders
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={() => toggleFavorite(destination.id)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(destination.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-orange-600 hover:bg-orange-700">
                    {destination.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{destination.name}</span>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {destination.rating}
                    </div>
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {destination.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {destination.reviews} reviews
                    </span>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Experiences */}
      <section id="experiences" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cultural Experiences</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immerse yourself in Gujarat's rich cultural heritage through festivals, crafts, and culinary delights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((experience) => (
              <Card key={experience.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{experience.name}</span>
                    <Badge variant="secondary">{experience.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{experience.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Duration: {experience.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Best Time: {experience.bestTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {experience.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section id="culture" className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Essential Travel Tips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make the most of your Gujarat adventure with these insider tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Time to Visit</h3>
              <p className="text-gray-600">
                October to March offers pleasant weather. Winter is ideal for desert areas and wildlife viewing.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Customs</h3>
              <p className="text-gray-600">
                Gujarat is a dry state with no alcohol. Dress modestly when visiting religious sites.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Getting Around</h3>
              <p className="text-gray-600">
                State buses, private taxis, and rental cars are available. Book safaris and festivals in advance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Plan Your Gujarat Adventure</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to explore Gujarat? Get in touch with us for personalized travel recommendations
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-white">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="Your Email" type="email" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heritage">Heritage Tours</SelectItem>
                    <SelectItem value="wildlife">Wildlife Safari</SelectItem>
                    <SelectItem value="cultural">Cultural Experiences</SelectItem>
                    <SelectItem value="adventure">Adventure Activities</SelectItem>
                  </SelectContent>
                </Select>
                <textarea
                  placeholder="Tell us about your travel plans..."
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
                />
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Explore Gujarat
              </h3>
              <p className="text-gray-400">Discover the jewel of western India</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:text-orange-600">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-orange-600">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-orange-600">
                Terms of Service
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 Explore Gujarat. All rights reserved. Made with ❤️ for travelers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
