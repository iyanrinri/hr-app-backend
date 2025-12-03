export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}
export declare class UserProfileDto {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
