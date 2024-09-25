import { AccessToken, RoomServiceClient, VideoGrant } from 'livekit-server-sdk';

export const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL || '',
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export async function createLivekitToken(identity: string, grands: VideoGrant) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY, 
    process.env.LIVEKIT_API_SECRET, 
    {
      identity,
    }
  );
  at.addGrant(grands);

  return await at.toJwt();
}