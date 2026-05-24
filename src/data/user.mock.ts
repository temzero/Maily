import { User, UserRole } from '~/types/user/user.type';
import avatarExample from '~/assets/images/avatar-example.jpg';

// Different mock users for testing scenarios
export const mockUsers = {
    standard: {
        id: 'usr_1a2b3c4d5e',
        firstName: 'Nguyen',
        lastName: 'Nhan',
        email: 'nguyentran.nhan@example.com',
        avatarUrl: avatarExample,
        role: UserRole.USER,
        displayName: 'Nguyen Nhan',
        bio: 'Product Manager & Tech Enthusiast from Vietnam. Building great products that people love.',
        company: 'TechCorp Inc.',
        jobTitle: 'Senior Product Manager',
        alternativeEmails: ['nhan.nguyen@work.com', 'tran.nhan@personal.com'],
        emailVerified: true,
        signature: 'Nguyen Tran Nhan\nProduct Manager\nTechCorp Inc.\n📱 +84 (123) 456-789',
        phone: '+84 (123) 456-789',
        timezone: 'Asia/Ho_Chi_Minh',
        isActive: true,
        lastLoginAt: '2024-01-16T09:30:00Z',
        createdAt: '2023-01-10T00:00:00Z',
        updatedAt: '2024-01-16T09:30:00Z',
    } as User,

    admin: {
        id: 'usr_admin_123',
        firstName: 'Tran',
        lastName: 'T',
        email: 'tran.t@example.com',
        avatarUrl: avatarExample,
        role: UserRole.ADMIN,
        displayName: 'Tran A.',
        bio: 'System Administrator & Developer Advocate from Vietnam',
        company: 'TechCorp Inc.',
        jobTitle: 'Lead System Admin',
        alternativeEmails: ['t.tran@techcorp.com'],
        emailVerified: true,
        signature: 'Tran T\nLead System Admin\nTechCorp Inc.',
        phone: '+84 (987) 654-321',
        timezone: 'Asia/Ho_Chi_Minh',
        isActive: true,
        lastLoginAt: '2024-01-16T10:00:00Z',
        createdAt: '2023-01-10T00:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
    } as User,
};

// Export current user (can be changed based on env or query param)
export const currentUser = mockUsers.standard;

// Helper to switch mock user (for testing)
export function setMockUser(role: 'standard' | 'admin') {
    if (role === 'admin') {
        Object.assign(currentUser, mockUsers.admin);
    } else {
        Object.assign(currentUser, mockUsers.standard);
    }
}
