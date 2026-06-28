export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
let redis: Redis | null = null;
if (redisUrl) {
  redis = new Redis(redisUrl);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 1. Try to save locally (will fail safely on Vercel without crashing)
    try {
      const filePath = path.join(process.cwd(), 'data.json');
      const backupsDir = path.join(process.cwd(), 'backups');

      if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupsDir, `data-${timestamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (localError) {
      console.warn("Local file write skipped (Expected if running in Cloud)");
    }
    
    // 2. Save to Cloud Database
    if (redis) {
      await redis.set('tournament_data', JSON.stringify(data));
    }

    return NextResponse.json({ success: true, message: 'Data successfully updated to Cloud & Local Backup!' });
  } catch (error) {
    console.error('Error writing data:', error);
    return NextResponse.json({ success: false, message: 'Failed to update data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. Try to read from Cloud Database first
    if (redis) {
      const cloudData = await redis.get('tournament_data');
      if (cloudData) {
        return new NextResponse(cloudData, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 2. Fallback to local file if cloud is empty (e.g. first run)
    const filePath = path.join(process.cwd(), 'data.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // If we have local data but cloud was empty, seed the cloud automatically!
    if (redis && fileContents) {
      await redis.set('tournament_data', fileContents);
    }
    
    return new NextResponse(fileContents, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ success: false, message: 'Failed to read data' }, { status: 500 });
  }
}
