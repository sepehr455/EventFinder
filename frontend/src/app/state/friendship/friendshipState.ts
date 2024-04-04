import { Friendship } from "@app/core/models/friendship";


export interface FriendshipState {
  myFriendships: Friendship[]; // User's friendships
  pendingFriendships: Friendship[]; // Current list of user's pending friendships
  mutualFriendships: Friendship[]; // List of mutual friendships
  queriedFriendships: Friendship[]; // list of queried friendships
  friendships: Friendship[]; // generic list of all friendships - might not need
}

export const initialFriendshipState : FriendshipState = {
    myFriendships: [],
    pendingFriendships: [],
    mutualFriendships: [],
    queriedFriendships: [],
    friendships: []
}