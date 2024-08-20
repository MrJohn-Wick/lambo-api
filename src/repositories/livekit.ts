import { randomUUID } from 'crypto';
import { RoomServiceClient, Room, AccessToken, VideoGrant } from 'livekit-server-sdk';

export function createRoom(): string | null {
  let roomName: string | null = 'stream-' + randomUUID();

  // if (!process.env.LIVEKIT_URL)
  //   return null;

  // console.log(
  //   process.env.LIVEKIT_URL,
  //   process.env.LIVEKIT_API_KEY,
  //   process.env.LIVEKIT_API_SECRET
  // );

  // const roomService = new RoomServiceClient(
  //   process.env.LIVEKIT_URL,
  //   process.env.LIVEKIT_API_KEY,
  //   process.env.LIVEKIT_API_SECRET
  // );

  // roomService.createRoom({
  //   name: roomName,
  //   emptyTimeout: 100 * 60,
  //   maxParticipants: 20,
  // }).then((room: Room) => {
  //   console.log("Created room",room);
  // }).catch((e) => {
  //   console.log("Room creation error", e);
  //   roomName = null;
  // });
  
  return roomName;
}


export async function createToken(identity: string, grands: VideoGrant) {

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity,
  });
  at.addGrant(grands);

  return await at.toJwt();
}