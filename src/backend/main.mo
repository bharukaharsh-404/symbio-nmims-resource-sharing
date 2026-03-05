import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type BorrowItem = {
    id : Nat;
    name : Text;
    category : Text;
    status : Text; // "Available" or "Borrowed"
    ownerName : Text;
  };

  module BorrowItem {
    public func compare(a : BorrowItem, b : BorrowItem) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type FoodAlert = {
    id : Nat;
    source : Text;
    quantity : Nat;
    timeLeft : Text;
    claimed : Bool;
  };

  module FoodAlert {
    public func compare(a : FoodAlert, b : FoodAlert) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type StudyRoom = {
    id : Nat;
    roomNo : Text;
    location : Text;
    capacity : Nat;
    status : Text; // "Available" or "Busy"
  };

  module StudyRoom {
    public func compare(a : StudyRoom, b : StudyRoom) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type UserProfile = {
    id : Principal;
    name : Text;
    department : Text;
    greenPoints : Nat;
    avatarInitials : Text;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Nat.compare(b.greenPoints, a.greenPoints);
    };
  };

  let borrowItems = Map.empty<Nat, BorrowItem>();
  let foodAlerts = Map.empty<Nat, FoodAlert>();
  let studyRooms = Map.empty<Nat, StudyRoom>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var initialized = false;

  func initializeData() {
    if (initialized) { return };
    initialized := true;

    // Seed Borrow Items
    let initialBorrowItems = [
      {
        id = 1;
        name = "Scientific Calculator";
        category = "Electronics";
        status = "Available";
        ownerName = "Campus Resources";
      },
      {
        id = 2;
        name = "Umbrella";
        category = "Personal";
        status = "Available";
        ownerName = "Campus Resources";
      },
      {
        id = 3;
        name = "Laptop Charger";
        category = "Electronics";
        status = "Available";
        ownerName = "Campus Resources";
      },
      { id = 4; name = "Lab Coat"; category = "Apparel"; status = "Available"; ownerName = "Campus Resources" },
      { id = 5; name = "Geometry Set"; category = "Stationery"; status = "Available"; ownerName = "Campus Resources" },
      {
        id = 6;
        name = "Portable Fan";
        category = "Electronics";
        status = "Available";
        ownerName = "Campus Resources";
      },
      {
        id = 7;
        name = "Thermos Flask";
        category = "Personal";
        status = "Available";
        ownerName = "Campus Resources";
      },
      {
        id = 8;
        name = "Bluetooth Speaker";
        category = "Electronics";
        status = "Available";
        ownerName = "Campus Resources";
      },
      { id = 9; name = "Backpack"; category = "Apparel"; status = "Available"; ownerName = "Campus Resources" },
      {
        id = 10;
        name = "Lab Manual";
        category = "Books";
        status = "Available";
        ownerName = "Campus Resources";
      },
    ];
    for (item in initialBorrowItems.values()) {
      borrowItems.add(item.id, item);
    };

    // Seed Food Alerts
    let initialFoodAlerts = [
      {
        id = 1;
        source = "Cafeteria Block A";
        quantity = 5;
        timeLeft = "30 mins";
        claimed = false;
      },
      {
        id = 2;
        source = "Faculty Lounge";
        quantity = 3;
        timeLeft = "45 mins";
        claimed = false;
      },
      {
        id = 3;
        source = "Hostel Kitchen";
        quantity = 10;
        timeLeft = "20 mins";
        claimed = false;
      },
      {
        id = 4;
        source = "Student Union Office";
        quantity = 8;
        timeLeft = "15 mins";
        claimed = false;
      },
      {
        id = 5;
        source = "Library Cafe";
        quantity = 6;
        timeLeft = "40 mins";
        claimed = false;
      },
    ];
    for (alert in initialFoodAlerts.values()) {
      foodAlerts.add(alert.id, alert);
    };

    // Seed Study Rooms
    let initialStudyRooms = [
      {
        id = 1;
        roomNo = "Library Room 3";
        location = "West Wing";
        capacity = 6;
        status = "Available";
      },
      {
        id = 2;
        roomNo = "Innovation Lab";
        location = "Block B";
        capacity = 8;
        status = "Available";
      },
      {
        id = 3;
        roomNo = "Seminar Hall B";
        location = "Main Building";
        capacity = 20;
        status = "Available";
      },
      {
        id = 4;
        roomNo = "Group Study Room";
        location = "Library";
        capacity = 4;
        status = "Available";
      },
      {
        id = 5;
        roomNo = "Conference Room";
        location = "Admin Block";
        capacity = 15;
        status = "Available";
      },
    ];
    for (room in initialStudyRooms.values()) {
      studyRooms.add(room.id, room);
    };

    // Seed Leaderboard Students
    let initialLeaderboard = [
      {
        id = Principal.fromText("rwouq-bva6l-2ypjk-3igdl-jzvzr-57tpt-clba2-7i6tc-wc4kz-3cbag-qa4");
        name = "Alice";
        department = "Computer Engineering";
        greenPoints = 500;
        avatarInitials = "AL";
      },
      {
        id = Principal.fromText("hp6nt-vlml4-3it3v-ru3on-wmx4g-wra2w-5zidb-w5lil-2qosw-hj7px-jae");
        name = "Bob";
        department = "Mechanical Engineering";
        greenPoints = 300;
        avatarInitials = "BO";
      },
      {
        id = Principal.fromText("62alk-v53sz-k3z5f-fn4n4-sv4s2-mvnon-og2jz-6kaa6-tuwek-g4faz-vae");
        name = "Charlie";
        department = "Electrical Engineering";
        greenPoints = 200;
        avatarInitials = "CH";
      },
    ];
    for (user in initialLeaderboard.values()) {
      userProfiles.add(user.id, user);
    };
  };

  func ensureInitialized() {
    if (not initialized) {
      initializeData();
    };
  };

  public query ({ caller }) func getAllBorrowItems() : async [BorrowItem] {
    ensureInitialized();
    borrowItems.values().toArray();
  };

  public query ({ caller }) func getAllFoodAlerts() : async [FoodAlert] {
    ensureInitialized();
    foodAlerts.values().toArray();
  };

  public query ({ caller }) func getAllStudyRooms() : async [StudyRoom] {
    ensureInitialized();
    studyRooms.values().toArray();
  };

  public shared ({ caller }) func claimBorrowItem(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim borrow items");
    };
    ensureInitialized();
    switch (borrowItems.get(itemId)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) {
        if (Text.equal(item.status, "Borrowed")) {
          Runtime.trap("Item already borrowed");
        };
        let updatedItem : BorrowItem = {
          id = item.id;
          name = item.name;
          category = item.category;
          status = "Borrowed";
          ownerName = item.ownerName;
        };
        borrowItems.add(itemId, updatedItem);
      };
    };
  };

  public shared ({ caller }) func claimFoodAlert(alertId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim food alerts");
    };
    ensureInitialized();
    switch (foodAlerts.get(alertId)) {
      case (null) { Runtime.trap("Food alert not found") };
      case (?alert) {
        if (alert.claimed) {
          Runtime.trap("Food already claimed");
        };
        let updatedAlert : FoodAlert = {
          id = alert.id;
          source = alert.source;
          quantity = alert.quantity;
          timeLeft = alert.timeLeft;
          claimed = true;
        };
        foodAlerts.add(alertId, updatedAlert);
      };
    };
  };

  public shared ({ caller }) func bookStudyRoom(roomId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book study rooms");
    };
    ensureInitialized();
    switch (studyRooms.get(roomId)) {
      case (null) { Runtime.trap("Study room not found") };
      case (?room) {
        if (Text.equal(room.status, "Busy")) {
          Runtime.trap("Study room already booked");
        };
        let updatedRoom : StudyRoom = {
          id = room.id;
          roomNo = room.roomNo;
          location = room.location;
          capacity = room.capacity;
          status = "Busy";
        };
        studyRooms.add(roomId, updatedRoom);
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    ensureInitialized();
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        let defaultProfile : UserProfile = {
          id = caller;
          name = "New User";
          department = "Unknown";
          greenPoints = 0;
          avatarInitials = "NU";
        };
        userProfiles.add(caller, defaultProfile);
        defaultProfile;
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    ensureInitialized();
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    ensureInitialized();
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateCallerUserProfile(name : Text, department : Text, avatarInitials : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    ensureInitialized();
    let profile : UserProfile = {
      id = caller;
      name;
      department;
      greenPoints = switch (userProfiles.get(caller)) {
        case (null) { 0 };
        case (?existingProfile) { existingProfile.greenPoints };
      };
      avatarInitials;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getLeaderboard() : async [UserProfile] {
    ensureInitialized();
    userProfiles.values().toArray().sort();
  };

  public shared ({ caller }) func awardGreenPoints(userId : Principal, points : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can award green points");
    };
    ensureInitialized();
    let callerRole = AccessControl.getUserRole(accessControlState, caller);
    let userRole = AccessControl.getUserRole(accessControlState, userId);

    if (caller != userId and callerRole != #admin) {
      if (userRole == #admin) {
        Runtime.trap("Cannot modify admin user points");
      } else {
        Runtime.trap("Cannot modify other profiles. Strictly one user one profile.");
      };
    };

    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          id = profile.id;
          name = profile.name;
          department = profile.department;
          greenPoints = profile.greenPoints + points;
          avatarInitials = profile.avatarInitials;
        };
        userProfiles.add(userId, updatedProfile);
      };
    };
  };
};
