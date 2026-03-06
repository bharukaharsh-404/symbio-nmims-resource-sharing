import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BorrowItem {
    id: bigint;
    status: string;
    ownerName: string;
    name: string;
    category: string;
}
export interface StudyRoom {
    id: bigint;
    status: string;
    capacity: bigint;
    roomNo: string;
    location: string;
}
export interface FoodAlert {
    id: bigint;
    source: string;
    claimed: boolean;
    quantity: bigint;
    timeLeft: string;
}
export interface UserProfile {
    id: Principal;
    avatarInitials: string;
    name: string;
    greenPoints: bigint;
    department: string;
}
export interface RequestItem {
    id: bigint;
    title: string;
    postedBy: string;
    fulfilled: boolean;
    deadline: string;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRequest(title: string, category: string, deadline: string, postedBy: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardGreenPoints(points: bigint): Promise<void>;
    bookStudyRoom(roomId: bigint): Promise<void>;
    claimBorrowItem(itemId: bigint): Promise<void>;
    claimFoodAlert(alertId: bigint): Promise<void>;
    fulfillRequest(requestId: bigint): Promise<void>;
    getAllBorrowItems(): Promise<Array<BorrowItem>>;
    getAllFoodAlerts(): Promise<Array<FoodAlert>>;
    getAllRequests(): Promise<Array<RequestItem>>;
    getAllStudyRooms(): Promise<Array<StudyRoom>>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<UserProfile>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    releaseStudyRoom(roomId: bigint): Promise<void>;
    returnBorrowItem(itemId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCallerUserProfile(name: string, department: string, avatarInitials: string): Promise<void>;
}
