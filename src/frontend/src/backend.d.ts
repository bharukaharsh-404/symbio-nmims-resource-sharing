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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardGreenPoints(userId: Principal, points: bigint): Promise<void>;
    bookStudyRoom(roomId: bigint): Promise<void>;
    claimBorrowItem(itemId: bigint): Promise<void>;
    claimFoodAlert(alertId: bigint): Promise<void>;
    getAllBorrowItems(): Promise<Array<BorrowItem>>;
    getAllFoodAlerts(): Promise<Array<FoodAlert>>;
    getAllStudyRooms(): Promise<Array<StudyRoom>>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<UserProfile>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCallerUserProfile(name: string, department: string, avatarInitials: string): Promise<void>;
}
