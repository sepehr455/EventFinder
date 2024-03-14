import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '@core/models/user';

export const UserActions = createActionGroup({
  source: 'UserActions',
  events: {
    'Authenticate User': emptyProps(),
    'Login User': props<{ username: string; password: string }>(),
    'Login User Success': props<{ user: User }>(),
    'Login User Failure': emptyProps(),
    'Register User': props<{ username: string; password: string }>(),
    'Register User Success': props<{ user: User }>(),
    'Register User Failure': emptyProps(),
    'Logout User': emptyProps(),
    'Logout User Success': emptyProps(),
    'Logout User Failure': emptyProps(),
  },
});
