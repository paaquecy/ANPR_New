import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ViolationSubmissionRequest {
  plateNumber: string;
  violationType: string;
  violationDetails: string;
  location?: string;
  officerId: string;
  evidenceUrls?: string[];
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
      const {
        plateNumber,
        violationType,
        violationDetails,
        location,
        officerId,
        evidenceUrls = []
      }: ViolationSubmissionRequest = await req.json();

      // Validate required fields
      if (!plateNumber || !violationType || !violationDetails || !officerId) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields: plateNumber, violationType, violationDetails, officerId' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Look up vehicle to get vehicle_id
      const { data: vehicle } = await supabaseClient
        .from('vehicles')
        .select('id')
        .eq('plate_number', plateNumber.toUpperCase())
        .single();

      // Calculate fine amount based on violation type
      const fineAmounts: Record<string, number> = {
        'Illegal Parking': 75,
        'Speeding': 150,
        'Running Red Light': 200,
        'Expired License': 100,
        'No Insurance': 300,
        'Reckless Driving': 400,
        'DUI/DWI': 1000,
        'Improper Lane Change': 125,
        'Failure to Stop': 175,
        'Other': 50
      };

      const fineAmount = fineAmounts[violationType] || 50;

      // Insert violation record
      const { data: violation, error: violationError } = await supabaseClient
        .from('violations')
        .insert({
          plate_number: plateNumber.toUpperCase(),
          vehicle_id: vehicle?.id,
          officer_id: officerId,
          violation_type: violationType,
          violation_details: violationDetails,
          location: location || 'Not specified',
          status: 'Pending',
          evidence_urls: evidenceUrls,
          fine_amount: fineAmount
        })
        .select()
        .single();

      if (violationError) {
        console.error('Error creating violation:', violationError);
        return new Response(
          JSON.stringify({ error: 'Failed to create violation record' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Record the scan/action
      await supabaseClient
        .from('scans')
        .insert({
          officer_id: officerId,
          plate_number: plateNumber.toUpperCase(),
          scan_type: 'Violation',
          scan_result: { 
            violation_id: violation.id,
            violation_type: violationType 
          },
          location: location || 'Dashboard Submission'
        });

      return new Response(
        JSON.stringify({
          success: true,
          violation: {
            id: violation.id,
            plateNumber: violation.plate_number,
            violationType: violation.violation_type,
            status: violation.status,
            fineAmount: violation.fine_amount,
            createdAt: violation.created_at
          }
        }),
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