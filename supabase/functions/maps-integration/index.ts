import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    const googleMapsKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!googleMapsKey) {
      throw new Error('GOOGLE_MAPS_API_KEY not configured');
    }

    let result;
    
    switch (action) {
      case 'geocode':
        result = await geocodeAddress(googleMapsKey, params.address);
        break;
      case 'reverse-geocode':
        result = await reverseGeocode(googleMapsKey, params.lat, params.lng);
        break;
      case 'places-search':
        result = await searchPlaces(googleMapsKey, params);
        break;
      case 'distance-matrix':
        result = await getDistanceMatrix(googleMapsKey, params);
        break;
      case 'health':
        result = await checkHealth(googleMapsKey);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Maps integration error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function geocodeAddress(apiKey: string, address: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Maps API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'OK') {
    throw new Error(`Geocoding failed: ${data.status}`);
  }

  return data;
}

async function reverseGeocode(apiKey: string, lat: number, lng: number) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Maps API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'OK') {
    throw new Error(`Reverse geocoding failed: ${data.status}`);
  }

  return data;
}

async function searchPlaces(apiKey: string, params: any) {
  const { query, location, radius = 5000 } = params;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}&key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Maps API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'OK') {
    throw new Error(`Places search failed: ${data.status}`);
  }

  return data;
}

async function getDistanceMatrix(apiKey: string, params: any) {
  const { origins, destinations, mode = 'driving' } = params;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&mode=${mode}&key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Maps API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'OK') {
    throw new Error(`Distance matrix failed: ${data.status}`);
  }

  return data;
}

async function checkHealth(apiKey: string) {
  try {
    // Test with a simple geocode request
    const testResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=Melbourne&key=${apiKey}`);
    
    return {
      status: testResponse.ok ? 'healthy' : 'unhealthy',
      google_maps_connected: testResponse.ok,
      api_key_configured: !!apiKey,
      response_status: testResponse.status
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      google_maps_connected: false,
      api_key_configured: !!apiKey,
      error: error.message
    };
  }
}