import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface VehicleLookupRequest {
  plateOrVin: string;
  officerId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { plateOrVin, officerId }: VehicleLookupRequest = await req.json();

      if (!plateOrVin) {
        return new Response(
          JSON.stringify({ error: 'Plate number or VIN is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Look up vehicle in database
      const { data: vehicle, error: vehicleError } = await supabaseClient
        .from('vehicles')
        .select('*')
        .or(`plate_number.eq.${plateOrVin.toUpperCase()},vin.eq.${plateOrVin.toUpperCase()}`)
        .single();

      if (vehicleError && vehicleError.code !== 'PGRST116') {
        console.error('Database error:', vehicleError);
        return new Response(
          JSON.stringify({ error: 'Database lookup failed' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // If vehicle found, get violation count
      let outstandingViolations = 0;
      if (vehicle) {
        const { data: violations } = await supabaseClient
          .from('violations')
          .select('id')
          .eq('plate_number', vehicle.plate_number)
          .eq('status', 'Pending');
        
        outstandingViolations = violations?.length || 0;
      }

      // Record the scan
      if (officerId && vehicle) {
        await supabaseClient
          .from('scans')
          .insert({
            officer_id: officerId,
            plate_number: plateOrVin.toUpperCase(),
            scan_type: 'Manual',
            scan_result: { found: !!vehicle },
            location: 'Dashboard Lookup'
          });
      }

      // Return vehicle data or not found message
      const response = vehicle ? {
        found: true,
        vehicle: {
          ...vehicle,
          outstandingViolations
        }
      } : {
        found: false,
        message: 'Vehicle not found in database'
      };

      return new Response(
        JSON.stringify(response),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});