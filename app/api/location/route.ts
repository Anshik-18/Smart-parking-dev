// pages/api/location.ts or app/api/location/route.ts (depending on your Next.js version)

// For Pages Router (pages/api/location.ts)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded 
      ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) 
      : req.socket.remoteAddress || 'unknown';
    
    // Use a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,timezone,query`);
    const data = await response.json();
    
    if (data.status === 'success') {
      res.status(200).json({
        country: data.country,
        region: data.regionName,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        ip: data.query
      });
    } else {
      res.status(400).json({ error: data.message || 'Unable to determine location' });
    }
  } catch (error) {
    console.error('Location API error:', error);
    res.status(500).json({ error: 'Server error while fetching location' });
  }
}

// For App Router (app/api/location/route.ts)
/*
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
    
    // Use a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,timezone,query`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return NextResponse.json({
        country: data.country,
        region: data.regionName,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        ip: data.query
      });
    } else {
      return NextResponse.json(
        { error: data.message || 'Unable to determine location' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Server error while fetching location' },
      { status: 500 }
    );
  }
}
*/