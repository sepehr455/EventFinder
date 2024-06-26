import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Friendship } from "@core/models/friendship";

export const FriendshipActions = createActionGroup({
  source: 'FriendshipActions',
  events: {
    'Get Friendships': emptyProps(),
    'Get Friendships Success': props<{ friendships: Friendship[] }>(),
    'Get Friendships Failure': emptyProps(),

    'Get User Friendships': props<{ userId?: string }>(),
    'Get User Friendships Success': props<{ friendships: Friendship[] }>(),
    'Get User Friendships Failure': emptyProps(),

    'Get Pending Friendships': props<{ userId?: string }>(),
    'Get Pending Friendships Success': props<{ friendships: Friendship[] }>(),
    'Get Pending Friendships Failure': emptyProps(),

    'Create Friendship': emptyProps(),
    'Create Friendship With Props': props<{ friendship: Friendship }>(),
    'Create Friendship Success': props<{ friendship: Friendship }>(),
    'Create Friendship Failure': emptyProps(),

    'Delete Friendship': emptyProps(),
    'Delete Friendship With Props': props<{ friendshipId: string }>(),
    'Delete Friendship Success': props<{ friendship: Friendship }>(),
    'Delete Friendship Failure': emptyProps(),

    'Clear Friendships': emptyProps(),
    'Null Action': emptyProps(),
  },
});
