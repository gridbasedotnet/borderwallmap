# Adding Geo-Tagged Videos to the Map

This documents the end-to-end workflow for adding new field videos to the border wall impact map.

## What You Need

For each video, gather the following:

| Field | Required | Example | Notes |
|-------|----------|---------|-------|
| **Video file** (.mp4) | Yes | `Santa Elena Hike iPhone no NATS.mp4` | H.264 MP4 recommended |
| **Latitude** | Yes | `29.1646` | Decimal degrees, positive = North |
| **Longitude** | Yes | `-103.6157` | Decimal degrees, negative = West |
| **Altitude** (meters) | No | `667` | From GPS telemetry if available |
| **Title** | Yes | `Santa Elena Hike` | Short, descriptive name |
| **Description** | No | `Hike near Santa Elena Canyon along the Rio Grande` | One-line summary |
| **Recorded at** | No | `2026-02-24T19:19:30Z` | ISO 8601 timestamp |

### Extracting geo data

GPS coordinates typically come from the device that recorded the video. If the video has embedded GPS metadata, you can extract it with:

```bash
# Using exiftool
exiftool -GPSLatitude -GPSLongitude -GPSAltitude video.mp4

# Using ffprobe
ffprobe -v quiet -show_entries format_tags=location video.mp4
```

For hike/path videos with a start point (A) and end point (B), use the **center point** as the marker location.

### Wide + Vertical pairs

If you have both landscape and portrait versions of the same shot, give them the **exact same coordinates**. The map automatically groups co-located videos into a single marker with multiple play buttons.

Append `(Wide)` or `(Vertical)` to the title to distinguish them:
- `North of Terlingua (Wide)`
- `North of Terlingua (Vertical)`

## Step 1: Upload to Supabase Storage

1. Open the Supabase dashboard
2. Go to **Storage** > **videos** bucket
3. Upload the `.mp4` file(s) directly to the bucket root (no subfolders)
4. Verify the file is publicly accessible at:
   ```
   https://<project-id>.supabase.co/storage/v1/object/public/videos/<filename>.mp4
   ```

## Step 2: Insert the database record

Run this SQL in the **Supabase SQL Editor**, replacing the values:

```sql
INSERT INTO impact_videos (title, description, latitude, longitude, altitude_m, video_url, recorded_at)
VALUES (
  'Your Video Title',
  'Short description of the footage',
  29.1646,       -- latitude
  -103.6157,     -- longitude
  667,           -- altitude_m (use NULL if unknown)
  '/storage/v1/object/public/videos/Your Video Filename.mp4',
  NULL           -- recorded_at (use ISO 8601 string or NULL)
);
```

The `video_url` path must match the exact filename in storage, including case (`.MP4` vs `.mp4`).

### Bulk insert

For multiple videos at once, see `supabase/seed_videos.sql` for the pattern. Comma-separate the value groups:

```sql
INSERT INTO impact_videos (title, description, latitude, longitude, altitude_m, video_url, recorded_at)
VALUES
  ('Video 1', 'desc', 29.0, -103.0, NULL, '/storage/v1/object/public/videos/file1.mp4', NULL),
  ('Video 2', 'desc', 29.1, -103.1, NULL, '/storage/v1/object/public/videos/file2.mp4', NULL);
```

## Step 3: Verify

The map fetches videos from the `impact_videos` table on every page load. After inserting the record:

1. Open the site (or refresh)
2. The new marker should appear at the specified coordinates
3. Click the marker and press **Play Video** to confirm playback

## Database schema reference

```sql
CREATE TABLE impact_videos (
  id          UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT             NOT NULL,
  description TEXT,
  latitude    DOUBLE PRECISION NOT NULL,
  longitude   DOUBLE PRECISION NOT NULL,
  altitude_m  DOUBLE PRECISION,
  video_url   TEXT             NOT NULL,
  recorded_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ      DEFAULT now()
);
```

## How it works on the frontend

- `ImpactMapClient` fetches all rows from `impact_videos` on mount
- Videos at the same location (within 0.001 degrees) are grouped into a single marker
- Single-video markers show title + description + "Play Video" button
- Grouped markers show a button per video with individual titles
- Clicking play opens `VideoModal` which streams the video from Supabase Storage
- `FitBounds` auto-zooms the map to fit all video markers
