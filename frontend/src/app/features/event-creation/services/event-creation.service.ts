import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  EventCreationDialogComponent
} from "@features/event-creation/components/event-creation-dialog/event-creation-dialog.component";
import {BehaviorSubject, map, Observable, of, Subject, switchMap, take} from "rxjs";
import {Actions, ofType} from "@ngrx/effects";
import {EventActions} from "@state/event/eventActions";
import {Coordinates, Event} from "@core/models/event";
import {select, Store} from "@ngrx/store";
import {selectUserId} from "@state/user/userReducer";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class EventCreationService {
  private locationListenerSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private eventDraft?:Event;
  private userId?: string;
  private isEditing: boolean = false;


  constructor(
    private dialog: MatDialog,
    private readonly actions$: Actions,
    private store: Store,
    private http: HttpClient,
    private snackbar: MatSnackBar,
  ) {
    this.store.pipe(
      select(selectUserId),
    ).subscribe((user?: string) => {
      this.userId = user;
    });
  }

  private get currentUserId(){
    return this.userId;
  }

  private get currentEventDraft(){
    return this.eventDraft ?? this.getDefaultEventData();
  }

  private get isListeningForLocation() {
    return this.locationListenerSubject.value;
  }

  private set isListeningForLocation(value: boolean) {
    this.locationListenerSubject.next(value);
  }

  public get locationListener(): Observable<boolean> {
    return this.locationListenerSubject.asObservable();
  }

  private getDefaultEventData():Event{
    return {
      name: "Untitled Event",
      owner: this.currentUserId,
      description: "Lorem Ipsum",
      startTime: new Date(Date.now()),
      endTime: new Date(Date.now() + 3600000),
    }
  }

  private openEventCreatorDialog(event: Event){
    this.dialog.open(EventCreationDialogComponent, {
      data: {event, isEditing: this.isEditing},
    });
  }

  public openEventCreator(){
    this.isEditing = false;
    this.openEventCreatorDialog(this.getDefaultEventData());
  }

  public openEventEditor(event: Event){
    this.isEditing = true;
    this.openEventCreatorDialog(event);
  }

  public beginListeningForLocation(event: Event){
    this.eventDraft = event;
    this.isListeningForLocation = true;
  }

  public stopListeningForLocation(){
    this.chooseLocation(undefined);
  }

  public chooseLocation(location?:Coordinates)  {
    if(!this.isListeningForLocation) return;
    this.isListeningForLocation = false;
    this.snackbar.dismiss();

    if(location){
      this.openEventCreatorDialog({
        ...this.currentEventDraft,
        coordinates: location
      })
    }
    else this.openEventCreatorDialog(this.currentEventDraft);
  }

  public createEvent(event: Event): void {
    this.store.dispatch(EventActions.createEventWithProps({event}));
  }

  public updateEvent(event: Event): void {
    this.store.dispatch(EventActions.updateEventWithProps({event}));
  }

  public closeDialog(){
    this.dialog.closeAll();
  }
}
