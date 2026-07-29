import type { NextApiRequest, NextApiResponse } from 'next';

interface TraceResponse {
  status: boolean;
  ip: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  as: string;
  message?: string;
}

interface ErrorResponse {
  status: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TraceResponse | ErrorResponse>
) {
  const { ip, apikey } = req.query;

  if (!apikey || apikey !== 'Fyxzpedia') {
    return res.status(401).json({ status: false, message: 'Invalid API Key' });
  }

  if (!ip || typeof ip !== 'string') {
    return res.status(400).json({ status: false, message: 'Parameter "ip" wajib diisi.' });
  }

  try {
    const apiUrl = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'fail') {
      return res.status(404).json({
        status: false,
        message: data.message || 'Gagal melacak IP. Pastikan IP valid.',
      });
    }

    const result: TraceResponse = {
      status: true,
      ip: data.query,
      city: data.city || 'N/A',
      region: data.regionName || 'N/A',
      country: data.country || 'N/A',
      lat: data.lat || 0,
      lon: data.lon || 0,
      timezone: data.timezone || 'N/A',
      isp: data.isp || 'N/A',
      as: data.as || 'N/A',
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ status: false, message: 'Terjadi kesalahan pada server saat mengambil data.' });
  }
}
