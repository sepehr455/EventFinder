import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
// import { GroupService } from '@app/services/GroupService';
import { GroupService } from '@app/core/services/GroupService';
import { GroupMemberService } from '@app/core/services/GroupMemberService';
import { GroupCreationService } from '@app/features/group-creation/services/group-creation.service';
import { Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { selectUserId } from '@app/state/user/userReducer';
import { User } from '@app/core/models/user';
import {Group, GroupMembership, Role} from "@core/models/group";
import {NgIf} from "@angular/common";
import { GroupActions } from '@app/state/group/groupActions';
import { SearchBarService } from '@app/features/search-bar/search-bar.service';
import { SubscriberComponent } from '@app/shared/subscriber/subscriber.component';
import { selectFollowedGroups, selectMyGroups, selectQueriedGroups } from '@app/state/group/groupReducer';

@Component({
  selector: 'app-group-info',
  standalone: true,
  imports: [NgIf],
  templateUrl: './group-info.component.html',
  styleUrl: './group-info.component.css',
})
export class GroupInfoComponent extends SubscriberComponent implements OnInit, OnChanges{
  @Input() group!: Group;
  @Input() groupMembership!: GroupMembership;

  userID: string = '';
  groupMemberships: GroupMembership[] = [];
  isInGroup: Boolean = false;
  isGroupOwner: Boolean = false;

  private user?: string;

  constructor(
    private groupService: GroupService,
    private groupMembershipService: GroupMemberService,
    private router: Router,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private groupCreationService: GroupCreationService ,
    private sbs: SearchBarService,

  ) {
    super();
    this.store.pipe(select(selectUserId)).subscribe((user?: string) => {
      this.user = user;
    });
  }

  get groupName() {
    return this.group?.groupName??"";
  }

  get groupDescription() {
    return this.group?.description??"";
  }

  private get currentUserId() {
    return this.user;
  }

  fetchMembershipsAndCheck() {
    if (!this.user) {
      return;
    }
    console.log(this.group.groupName, this.user, this.groupMemberships);
    this.isInGroup = !!(this.groupMemberships.find((membership) =>membership.group == this.group._id && membership.role == 'member'));
  }

  fetchOwnershipsAndCheck() {
    if (!this.user) {
      return;
    }

    this.isGroupOwner = !!(this.groupMemberships.find((membership) =>membership.group == this.group._id && membership.role === 'owner'));
  }

  joinGroup() {
    if (!this.user) {
      return;
    }

    let role: Role = 'member';
    let user = this.user;
    let group = this.group._id??'';
    let newMembership: GroupMembership = { group, user, role };

    this.groupMembershipService.createGroupMembership(newMembership).subscribe((res) => {
      console.log(res);

      // Update the UI after joining the group
      this.isInGroup = true;
      this.store.dispatch(GroupActions.getUserGroups({ userId: this.user??"" }));
      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    });
  }

  leaveGroup() {
    let groupID = this.group._id??'';
    let userID = this.user??'';
    this.groupMembershipService.deleteGroupMemberByUserAndGroup(userID, groupID).subscribe(res => {
      // console.log(res);
      this.isInGroup = false;
      this.store.dispatch(GroupActions.getGroups());
      this.store.dispatch(GroupActions.getUserGroups({ userId: this.user??"" }));
      this.store.dispatch(GroupActions.getUserOwnedGroups({ userId: this.user??"" }));
      this.fetchMembershipsAndCheck();
      this.fetchOwnershipsAndCheck();
      this.sbs.setQuery("");
      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    })
  }

  editGroup() {

    if (this.group) {
      this.groupCreationService.openGroupEditor(this.group);
    }

  }

  deleteGroup() {
    let groupID = this.group._id??'';

    // TODO - on cascade, delete all relations from the groupMembership table that contain the groupID
    this.groupService.deleteGroup(groupID).subscribe(res => {
      this.store.dispatch(GroupActions.getGroups());
      this.store.dispatch(GroupActions.getUserGroups({ userId: this.user??"" }));
      this.store.dispatch(GroupActions.getUserNonMemberGroups({ userId: this.user??"" }));
      this.store.dispatch(GroupActions.getUserOwnedGroups({ userId: this.user??"" }));
      this.isGroupOwner = false;
      this.fetchMembershipsAndCheck();
      this.fetchOwnershipsAndCheck();
      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    })

  }


  ngOnChanges() {
    this.fetchMembershipsAndCheck();
    this.fetchOwnershipsAndCheck();
    this.cdr.detectChanges();
  }

  // TODO: COLWYN - change this joined to be permanent or display
  ngOnInit() {
    this.groupMembershipService.getGroupMemberships().subscribe((memberships) => {
      this.groupMemberships = memberships.filter((membership)=>membership.user === this.user)
      this.fetchMembershipsAndCheck();
      this.fetchOwnershipsAndCheck();
      this.cdr.detectChanges();
    });
  }

}
