export interface GeocodeResult {
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  place_id: string;
  types: string[];
}

export interface PlaceResult {
  business_status: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  place_id: string;
  rating?: number;
  types: string[];
}

export interface DistanceMatrixResult {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
}

class GoogleMapsAPI {
  private baseURL = 'https://mpbwpixpuonkczxgkjks.supabase.co/functions/v1';

  private async request<T>(action: string, params: any): Promise<T> {
    const url = `${this.baseURL}/maps-integration`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          params
        }),
      });

      if (!response.ok) {
        throw new Error(`Maps API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Maps API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('Google Maps API Error:', error);
      throw error;
    }
  }

  // Geocode an address to get coordinates
  async geocodeAddress(address: string): Promise<GeocodeResult[]> {
    const response = await this.request<{ results: GeocodeResult[] }>('geocode', { address });
    return response.results;
  }

  // Reverse geocode coordinates to get address
  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult[]> {
    const response = await this.request<{ results: GeocodeResult[] }>('reverse-geocode', { lat, lng });
    return response.results;
  }

  // Search for places
  async searchPlaces(params: {
    query: string;
    location?: string;
    radius?: number;
  }): Promise<PlaceResult[]> {
    const response = await this.request<{ results: PlaceResult[] }>('places-search', params);
    return response.results;
  }

  // Get distance matrix between origins and destinations
  async getDistanceMatrix(params: {
    origins: string;
    destinations: string;
    mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
  }): Promise<DistanceMatrixResult> {
    return this.request<DistanceMatrixResult>('distance-matrix', params);
  }

  // Health check
  async checkHealth(): Promise<{ status: string; google_maps_connected: boolean }> {
    return this.request('health', {});
  }

  // Enhanced property location analysis
  async analyzePropertyLocation(address: string): Promise<{
    geocode: GeocodeResult[];
    nearby_amenities: PlaceResult[];
    risk_factors: {
      flood_zones: PlaceResult[];
      fire_stations: PlaceResult[];
      schools: PlaceResult[];
      transport: PlaceResult[];
    };
  }> {
    try {
      // First geocode the address
      const geocode = await this.geocodeAddress(address);
      
      if (geocode.length === 0) {
        throw new Error('Address not found');
      }

      const location = geocode[0].geometry.location;
      const locationString = `${location.lat},${location.lng}`;

      // Search for various amenities and risk factors
      const [floodZones, fireStations, schools, transport] = await Promise.all([
        this.searchPlaces({ query: 'flood zone water', location: locationString, radius: 2000 }),
        this.searchPlaces({ query: 'fire station', location: locationString, radius: 5000 }),
        this.searchPlaces({ query: 'school', location: locationString, radius: 1000 }),
        this.searchPlaces({ query: 'train station bus stop', location: locationString, radius: 1000 })
      ]);

      const nearby_amenities = await this.searchPlaces({ 
        query: 'restaurant shopping mall hospital', 
        location: locationString, 
        radius: 1000 
      });

      return {
        geocode,
        nearby_amenities,
        risk_factors: {
          flood_zones: floodZones,
          fire_stations: fireStations,
          schools,
          transport
        }
      };
    } catch (error) {
      console.error('Location analysis error:', error);
      throw error;
    }
  }
}

export const googleMapsAPI = new GoogleMapsAPI();