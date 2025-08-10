import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    const rapidApiKey = Deno.env.get('REALTY_BASE_AU_API_KEY');
    
    if (!rapidApiKey) {
      throw new Error('REALTY_BASE_AU_API_KEY not configured');
    }

    let result;
    
    switch (action) {
      case 'search':
        result = await searchProperties(rapidApiKey, params);
        break;
      case 'property-details':
        result = await getPropertyDetails(rapidApiKey, params.listingId);
        break;
      case 'market-analysis':
        result = await getMarketAnalysis(rapidApiKey, params);
        break;
      case 'health':
        result = await checkHealth(rapidApiKey);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Enhance with PropGuard AI analysis
    const enhancedResult = await enhanceWithPropGuard(result, action, params);

    return new Response(JSON.stringify({ success: true, data: enhancedResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Realty integration error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchProperties(apiKey: string, params: any) {
  const searchParams = new URLSearchParams({
    location: params.location || '',
    property_type: params.property_type || 'for-sale',
    min_price: params.min_price?.toString() || '',
    max_price: params.max_price?.toString() || '',
    bedrooms: params.bedrooms?.toString() || '',
    bathrooms: params.bathrooms?.toString() || '',
    limit: params.limit?.toString() || '20'
  });

  const response = await fetch(`https://realty-base-au.p.rapidapi.com/search?${searchParams}`, {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'realty-base-au.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function getPropertyDetails(apiKey: string, listingId: string) {
  const response = await fetch(`https://realty-base-au.p.rapidapi.com/property/${listingId}`, {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'realty-base-au.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function getMarketAnalysis(apiKey: string, params: any) {
  const response = await fetch('https://realty-base-au.p.rapidapi.com/market-analysis', {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'realty-base-au.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function checkHealth(apiKey: string) {
  try {
    const response = await fetch('https://realty-base-au.p.rapidapi.com/health', {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'realty-base-au.p.rapidapi.com'
      }
    });

    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      rapidapi_connected: response.ok,
      api_key_configured: !!apiKey,
      response_status: response.status
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      rapidapi_connected: false,
      api_key_configured: !!apiKey,
      error: error.message
    };
  }
}

async function enhanceWithPropGuard(data: any, action: string, params: any) {
  try {
    // Call PropGuard AI backend for enhancement
    const propGuardResponse = await fetch('https://9yhyi3c8nkjv.manus.space/api/propguard/process-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: `Enhance ${action} data with AI analysis`,
        data: data,
        params: params
      })
    });

    if (propGuardResponse.ok) {
      const enhancement = await propGuardResponse.json();
      return {
        ...data,
        propguard_enhancement: enhancement
      };
    }
  } catch (error) {
    console.log('PropGuard enhancement failed:', error);
  }

  return data;
}