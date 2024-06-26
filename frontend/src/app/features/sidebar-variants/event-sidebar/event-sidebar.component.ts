import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractSidebarComponent } from '@features/sidebar-variants/abstract-sidebar/abstract-sidebar.component';
import { Event } from '@core/models/event';
import { EventInfoComponent } from '@features/sidebar-variants/event-info/event-info.component';
import { CommonModule } from '@angular/common';
import {
  selectEvents,
  selectMyEvents,
  selectQueriedEvents,
  selectSavedEvents,
} from '@state/event/eventReducer';
import { EventActions } from '@state/event/eventActions';

export enum EventDisplayType {
  MY_EVENTS = 'My Events',
  SAVED_EVENTS = 'Saved Events',
  SEARCHED_EVENTS = 'Searched Events',
}

@Component({
  selector: 'app-event-sidebar',
  standalone: true,
  imports: [EventInfoComponent, CommonModule],
  templateUrl: './event-sidebar.component.html',
  styleUrl: './event-sidebar.component.css',
})
export class EventSidebarComponent
  extends AbstractSidebarComponent
  implements OnInit
{
  private savedEvents: Event[] = [];
  private myEvents: Event[] = [];
  private queriedEvents: Event[] = [];
  private query: string = '';

  ngOnInit() {
    this.unsubscribeOnDestroy<Event[]>(
      this.store.select(selectMyEvents),
    ).subscribe((events) => {
      this.myEvents = events;
      this.queryBackend();
    });
    this.unsubscribeOnDestroy<Event[]>(
      this.store.select(selectSavedEvents),
    ).subscribe((events) => (this.savedEvents = events));
    this.unsubscribeOnDestroy<Event[]>(
      this.store.select(selectQueriedEvents),
    ).subscribe((events) => {
      this.queriedEvents = events;
      this.setRecommendations(
        this.queriedEvents.length > 0
          ? this.queriedEvents.map((event) => event.name).slice(0, 5)
          : ['No results found, please modify query.'],
      );
    });
    this.unsubscribeOnDestroy<string>(
      this.searchbarService.getQuery(),
    ).subscribe((query) => {
      this.query = query;
      this.queryBackend();
    });
  }

  private queryBackend(){
    this.store.dispatch(EventActions.queryEvents({ query:this.query }));
  }

  get savedEventsList(): Event[] {
    return this.savedEvents;
  }

  get myEventsList(): Event[] {
    return this.myEvents;
  }

  get queriedEventsList(): Event[] {
    return this.queriedEvents;
  }
}
