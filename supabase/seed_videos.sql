-- Seed impact_videos with geo-tagged field footage
-- Storage bucket: "videos" (Supabase Storage root)
-- Run this in the Supabase SQL Editor after uploading all video files.

INSERT INTO impact_videos (title, description, latitude, longitude, altitude_m, video_url, recorded_at)
VALUES
  (
    'Santa Elena Hike',
    'Hike near Santa Elena Canyon along the Rio Grande',
    29.1646, -103.6157, 667,
    '/storage/v1/object/public/videos/Santa Elena Hike iPhone no NATS.mp4',
    NULL
  ),
  (
    'North of Terlingua (Wide)',
    'Terrain north of Terlingua, TX',
    29.33, -103.61, NULL,
    '/storage/v1/object/public/videos/North of Terlingua Wide.mp4',
    NULL
  ),
  (
    'North of Terlingua (Vertical)',
    'Terrain north of Terlingua, TX',
    29.33, -103.61, NULL,
    '/storage/v1/object/public/videos/North of Terlingua Vertical.mp4',
    NULL
  ),
  (
    'Rio Grande: Lajitas to Canyon (Wide)',
    'The Rio Grande from Lajitas toward the canyon',
    29.22, -103.68, NULL,
    '/storage/v1/object/public/videos/Rio Grande Lajitas to Canyon Wide.mp4',
    NULL
  ),
  (
    'Rio Grande: Lajitas to Canyon (Vertical)',
    'The Rio Grande from Lajitas toward the canyon',
    29.22, -103.68, NULL,
    '/storage/v1/object/public/videos/Rio Grande Lajitas to Canyon Vertical.mp4',
    NULL
  ),
  (
    'Santa Elena Canyon (Wide)',
    'Santa Elena Canyon on the Rio Grande',
    29.17, -103.60, NULL,
    '/storage/v1/object/public/videos/Santa Elena Canyon Wide.MP4',
    NULL
  ),
  (
    'Santa Elena Canyon (Vertical)',
    'Santa Elena Canyon on the Rio Grande',
    29.17, -103.60, NULL,
    '/storage/v1/object/public/videos/Santa Elena Canyon Vertical.MP4',
    NULL
  ),
  (
    'Looking Down From Chisos (Vertical)',
    'View looking down from the Chisos Mountains',
    29.21484, -103.37737, NULL,
    '/storage/v1/object/public/videos/Looking Down From Chisos Vertical.mp4',
    '2026-02-24T19:19:30Z'
  ),
  (
    'Santa Elena Canyon Area',
    'Santa Elena Canyon area along the Rio Grande',
    29.15721, -103.59902, NULL,
    '/storage/v1/object/public/videos/Santa Elena Canyon Area.mp4',
    '2026-02-24T19:51:54Z'
  );
